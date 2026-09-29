"""
Machine Learning Job Matching Engine
Uses Scikit-Learn TF-IDF, Cosine Similarity, and Bi-directional Fuzzy Skill Matching.
Combines Profile Skills + Resume Text for 100% comprehensive candidate representation.
"""
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from skills_db import extract_skills_from_text, normalize_skill, are_skills_compatible

def clean_text(text: str) -> str:
    """Clean and standardize input text for vectorization."""
    if not text:
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    text = re.sub(r'[^\w\s\+\#\.\-]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

class JobMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
            max_features=6000
        )

    def compute_match(self, candidate_profile: dict, job: dict) -> dict:
        """
        Computes match score and breakdown between candidate and job.
        Candidate profile combines explicit profile skills AND parsed resume text.
        """
        # 1. Gather all profile skills from user profile
        raw_candidate_skills = candidate_profile.get("skills", [])
        if isinstance(raw_candidate_skills, str):
            raw_candidate_skills = [s.strip() for s in raw_candidate_skills.split(",") if s.strip()]

        candidate_skills = set(
            normalize_skill(s) for s in raw_candidate_skills if s and s.strip()
        )

        # 2. Extract additional skills from candidate bio and resume text
        candidate_text = candidate_profile.get("text", "") or ""
        candidate_bio = candidate_profile.get("bio", "") or ""

        if candidate_text:
            resume_skills = extract_skills_from_text(candidate_text)
            candidate_skills.update(resume_skills)

        if candidate_bio:
            bio_skills = extract_skills_from_text(candidate_bio)
            candidate_skills.update(bio_skills)

        # Combined candidate representation for semantic TF-IDF
        combined_candidate_text = f"{candidate_bio} {candidate_text} {' '.join(candidate_skills)}"

        # 3. Parse Job Requirements
        raw_reqs = job.get("requirements", [])
        if isinstance(raw_reqs, str):
            raw_reqs = [r.strip() for r in raw_reqs.split(",") if r.strip()]

        job_req_skills = set()
        for r in raw_reqs:
            extracted = extract_skills_from_text(r)
            if extracted:
                job_req_skills.update(extracted)
            else:
                norm_r = normalize_skill(r)
                if norm_r:
                    job_req_skills.add(norm_r)

        job_title = job.get("title", "")
        job_desc = job.get("description", "")

        # Also extract skills mentioned in title/description
        extra_job_skills = extract_skills_from_text(f"{job_title} {job_desc}")
        job_req_skills.update(extra_job_skills)

        # 4. Bi-directional Fuzzy Skill Matching
        matched_skills = set()
        missing_skills = set()

        # For every job requirement, check if candidate possesses it
        for req in job_req_skills:
            matched = False
            for cand_skill in candidate_skills:
                if are_skills_compatible(cand_skill, req):
                    matched = True
                    matched_skills.add(req)
                    break
            if not matched:
                missing_skills.add(req)

        # Also check if any candidate skill matches job title or description directly
        for cand_skill in candidate_skills:
            if cand_skill.lower() in f"{job_title} {job_desc}".lower():
                matched_skills.add(cand_skill)

        matched_list = sorted(list(matched_skills))
        missing_list = sorted(list(missing_skills))

        total_req_count = max(len(job_req_skills), 1)
        skill_coverage_ratio = len(matched_list) / total_req_count

        # 5. Semantic TF-IDF Cosine Similarity
        combined_job_text = f"{job_title} {job_desc} {' '.join(raw_reqs)}"
        cand_clean = clean_text(combined_candidate_text)
        job_clean = clean_text(combined_job_text)

        cosine_score = 0.0
        if cand_clean and job_clean:
            try:
                tfidf_matrix = self.vectorizer.fit_transform([cand_clean, job_clean])
                sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
                cosine_score = float(sim)
            except Exception:
                cosine_score = 0.0

        # 6. Title and Domain Overlap
        title_tokens = set(re.findall(r'\b[a-zA-Z]{3,}\b', job_title.lower()))
        cand_tokens = set(re.findall(r'\b[a-zA-Z]{3,}\b', cand_clean))
        title_overlap = len(title_tokens.intersection(cand_tokens)) / max(len(title_tokens), 1) if title_tokens else 0.0

        # 7. Calibrated Scoring Formulation
        # If candidate has matched skills, give strong credit
        # Weights: 55% skill coverage, 25% semantic cosine similarity, 20% title overlap
        weighted_score = (0.55 * skill_coverage_ratio) + (0.25 * cosine_score) + (0.20 * title_overlap)

        if len(candidate_skills) == 0:
            percentage = min(int(cosine_score * 60), 40)
        else:
            # Map into realistic distribution:
            # High skill overlap (e.g. 70%+) translates to 75-96% match score
            calibrated = (skill_coverage_ratio * 0.60 + weighted_score * 0.40) * 100
            # Small bonus if multiple key skills are matched
            if len(matched_list) >= 3:
                calibrated += 5
            percentage = int(np.clip(calibrated, 25, 98))

        # Determine Tier & Reason
        if percentage >= 80:
            tier = "Exceptional Match"
            highlight_skills = ', '.join(matched_list[:3]) if matched_list else 'required tech stack'
            reason = f"Excellent compatibility! Your skills strongly align with {highlight_skills}."
        elif percentage >= 65:
            tier = "Strong Match"
            highlight_skills = ', '.join(matched_list[:3]) if matched_list else 'core requirements'
            reason = f"Solid fit for this role with matching proficiency in {highlight_skills}."
        elif percentage >= 45:
            tier = "Moderate Match"
            reason = f"Good baseline qualifications. Covering a few additional requirements will make your application highly competitive."
        else:
            tier = "Growth Opportunity"
            reason = f"This position requires specific upskilling in several key requirements."

        # Actionable Suggestions
        suggestions = []
        if missing_list:
            top_missing = missing_list[:3]
            suggestions.append(f"Consider learning or showcasing experience in: {', '.join(top_missing)}.")
        if percentage < 80:
            suggestions.append("Tailor your resume summary and project bullet points to directly reflect job requirements.")
        if matched_list:
            suggestions.append(f"Emphasize quantifiable achievements with {matched_list[0]} in your application.")

        return {
            "jobId": str(job.get("id") or job.get("_id") or ""),
            "title": job.get("title", ""),
            "company": job.get("company", {}).get("name", "") if isinstance(job.get("company"), dict) else str(job.get("company") or ""),
            "location": job.get("location", ""),
            "salary": job.get("salary", 0),
            "jobType": job.get("jobType", ""),
            "matchScore": percentage,
            "matchTier": tier,
            "matchedSkills": matched_list,
            "missingSkills": missing_list,
            "matchReason": reason,
            "suggestions": suggestions
        }

    def rank_jobs(self, candidate_profile: dict, jobs: list[dict], top_n: int = 12) -> list[dict]:
        """
        Ranks all jobs for a candidate.
        Returns top_n ranked jobs sorted by matchScore descending.
        """
        scored_jobs = []
        for job in jobs:
            result = self.compute_match(candidate_profile, job)
            scored_jobs.append(result)

        scored_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
        return scored_jobs[:top_n]
