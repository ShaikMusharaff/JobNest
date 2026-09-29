"""
JobNest AI Recommendation & Resume Parsing Microservice
Flask + Scikit-Learn TF-IDF Matcher + PyPDF / docx2txt
Supports direct resume URL parsing, Profile Skills integration, and ATS scoring.
"""
import os
import io
import tempfile
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import docx2txt

from skills_db import extract_skills_from_text, normalize_skill
from matcher import JobMatcher

app = Flask(__name__)
CORS(app)

matcher = JobMatcher()

# Simple in-memory cache for resume text by URL to avoid re-downloading on every request
RESUME_CACHE = {}

def extract_text_from_bytes(content: bytes, filename: str = "") -> str:
    """Extracts text from PDF or DOCX binary buffer."""
    text = ""
    lower_name = filename.lower()

    # 1. Try PDF parsing first
    try:
        reader = PdfReader(io.BytesIO(content))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        if text.strip():
            return text
    except Exception as e:
        print(f"pypdf reader notice: {e}")

    # 2. Try docx2txt via temporary file
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        text = docx2txt.process(tmp_path)
        os.unlink(tmp_path)
        if text.strip():
            return text
    except Exception as e:
        print(f"docx2txt notice: {e}")

    # 3. Fallback: try raw utf-8 / latin-1 decoding
    try:
        decoded = content.decode("utf-8", errors="ignore")
        if len(decoded.split()) > 20:
            return decoded
    except Exception:
        pass

    return text

def get_text_from_url(url: str) -> str:
    """Downloads and extracts text from a remote URL with caching."""
    if not url:
        return ""
    if url in RESUME_CACHE:
        return RESUME_CACHE[url]

    try:
        res = requests.get(url, timeout=12, headers={"User-Agent": "Mozilla/5.0"})
        if res.status_code == 200:
            extracted = extract_text_from_bytes(res.content, url)
            RESUME_CACHE[url] = extracted
            return extracted
    except Exception as e:
        print(f"Error fetching resume from URL ({url}): {e}")

    return ""

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "JobNest ML Engine v2.0",
        "port": 5001,
        "cachedResumes": len(RESUME_CACHE)
    })

@app.route("/extract_skills", methods=["POST"])
def extract_skills_endpoint():
    """Extracts skills from text or a local file."""
    data = request.json or {}
    text = data.get("text", "")
    file_path = data.get("file_path", "")

    if file_path and os.path.exists(file_path):
        with open(file_path, "rb") as f:
            text = extract_text_from_bytes(f.read(), file_path)

    skills = extract_skills_from_text(text)
    return jsonify({"skills": skills, "count": len(skills)})

@app.route("/analyze_resume", methods=["POST"])
def analyze_resume_endpoint():
    """
    Accepts:
    - Form file upload 'resume'
    - Or JSON { 'file_url': 'https://cloudinary...' }
    - Or JSON { 'text': '...' }
    Returns extracted text, detected skills, and career analysis.
    """
    text = ""
    file_name = "resume.pdf"

    if "resume" in request.files:
        uploaded_file = request.files["resume"]
        file_name = uploaded_file.filename
        content = uploaded_file.read()
        text = extract_text_from_bytes(content, file_name)
    else:
        data = request.json or {}
        if "file_url" in data and data["file_url"]:
            text = get_text_from_url(data["file_url"])
        elif "text" in data:
            text = data["text"]

    skills = extract_skills_from_text(text)
    word_count = len(text.split())

    # Assess resume strength indicators
    strength_score = 0
    feedback = []

    if len(skills) >= 10:
        strength_score += 45
        feedback.append("Excellent technical keyword coverage detected.")
    elif len(skills) >= 5:
        strength_score += 30
        feedback.append("Good baseline of skills, consider highlighting supporting libraries and tooling.")
    else:
        strength_score += 15
        feedback.append("Few standard tech skills detected. Make sure your technical skills section is prominent.")

    if word_count >= 300:
        strength_score += 30
        feedback.append("Strong level of project and work experience description.")
    elif word_count >= 150:
        strength_score += 20
        feedback.append("Resume length is moderate; expand on quantifiable achievements in your projects.")
    else:
        strength_score += 10
        feedback.append("Resume content is concise. Provide more details on technical responsibilities.")

    text_lower = text.lower()
    has_links = any(k in text_lower for k in ["github", "linkedin", "portfolio", "http", "www."])
    if has_links:
        strength_score += 25
        feedback.append("Portfolio, GitHub, or social proof links detected.")
    else:
        feedback.append("Include active GitHub repository or portfolio links to demonstrate hands-on work.")

    return jsonify({
        "success": True,
        "skills": skills,
        "skillCount": len(skills),
        "wordCount": word_count,
        "strengthScore": min(strength_score, 100),
        "feedback": feedback,
        "extractedTextSnippet": text[:600] if text else ""
    })

@app.route("/match_jobs", methods=["POST"])
def match_jobs_endpoint():
    """
    Ranks multiple jobs against candidate profile.
    Automatically enriches candidate with resume text if resume_url is provided.
    """
    data = request.json or {}
    candidate = data.get("candidate", {})
    jobs = data.get("jobs", [])
    top_n = data.get("top_n", 12)

    if not jobs:
        return jsonify({"success": False, "message": "No jobs provided", "recommendations": []})

    # If resume_url is supplied and text is empty, download and extract
    resume_url = candidate.get("resume_url", "")
    if resume_url and not candidate.get("text"):
        extracted = get_text_from_url(resume_url)
        if extracted:
            candidate["text"] = extracted
            # Also combine any skills found in the resume
            found = extract_skills_from_text(extracted)
            current_skills = set(candidate.get("skills", []))
            current_skills.update(found)
            candidate["skills"] = list(current_skills)

    ranked_jobs = matcher.rank_jobs(candidate, jobs, top_n=top_n)

    avg_score = int(sum(j["matchScore"] for j in ranked_jobs) / len(ranked_jobs)) if ranked_jobs else 0

    return jsonify({
        "success": True,
        "recommendations": ranked_jobs,
        "averageMatchScore": avg_score,
        "totalEvaluated": len(jobs),
        "candidateEnrichedSkills": candidate.get("skills", [])
    })

@app.route("/score_single_job", methods=["POST"])
def score_single_job_endpoint():
    """
    Scores a single job against candidate profile.
    Automatically enriches candidate with resume text if resume_url is provided.
    """
    data = request.json or {}
    candidate = data.get("candidate", {})
    job = data.get("job", {})

    if not job:
        return jsonify({"success": False, "message": "Job object is required"}), 400

    resume_url = candidate.get("resume_url", "")
    if resume_url and not candidate.get("text"):
        extracted = get_text_from_url(resume_url)
        if extracted:
            candidate["text"] = extracted
            found = extract_skills_from_text(extracted)
            current_skills = set(candidate.get("skills", []))
            current_skills.update(found)
            candidate["skills"] = list(current_skills)

    match_result = matcher.compute_match(candidate, job)
    return jsonify({
        "success": True,
        "analysis": match_result,
        "candidateEnrichedSkills": candidate.get("skills", [])
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting JobNest AI ML Recommendation Engine v2.0 on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
