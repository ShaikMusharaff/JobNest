"""
Comprehensive Skills Database & Intelligent Normalization for Resume & Job Matching.
Covers 200+ technology stacks, tools, frameworks, and engineering methodologies.
"""
import re

# Comprehensive canonical skills dictionary
CANONICAL_SKILLS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang",
    "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart", "R", "Scala", "Shell", "Bash", "SQL",
    "HTML", "HTML5", "CSS", "CSS3", "Sass", "SCSS",
    
    # Frontend Frameworks & Libraries
    "React", "React.js", "React Native", "Redux", "Redux Toolkit", "Next.js", "Vue", "Vue.js",
    "Nuxt.js", "Angular", "AngularJS", "Svelte", "Tailwind CSS", "Bootstrap", "Material UI",
    "Chakra UI", "Shadcn UI", "Framer Motion", "jQuery", "Webpack", "Vite", "Babel",
    
    # Backend Frameworks & Runtimes
    "Node.js", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask",
    "Spring", "Spring Boot", "ASP.NET", ".NET", "Ruby on Rails", "Laravel", "Koa",
    
    # API & Architecture
    "REST API", "RESTful APIs", "GraphQL", "gRPC", "WebSockets", "Microservices",
    "Serverless", "System Design", "Event-Driven Architecture", "MVC",
    
    # Databases & Caching
    "MongoDB", "Mongoose", "PostgreSQL", "MySQL", "SQLite", "Redis", "Cassandra",
    "DynamoDB", "Elasticsearch", "Firebase", "Supabase", "Oracle", "MariaDB", "Prisma",
    
    # Cloud, DevOps & Infrastructure
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
    "Terraform", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "Linux", "Nginx",
    "Apache", "Vercel", "Netlify", "Heroku", "Cloudinary",
    
    # AI / Machine Learning / Data Science
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP",
    "Natural Language Processing", "Computer Vision", "TensorFlow", "PyTorch", "Keras",
    "Scikit-Learn", "Pandas", "NumPy", "Data Science", "Data Analysis", "LLM",
    "Generative AI", "LangChain", "OpenAI", "Gemini", "Hugging Face", "Matplotlib", "Seaborn",
    
    # Testing & Tooling
    "Git", "GitHub", "GitLab", "Bitbucket", "Postman", "Swagger", "Jest", "Mocha",
    "Chai", "Cypress", "Selenium", "Playwright", "Pytest", "Unit Testing", "TDD",
    
    # Core Engineering & Methodologies
    "Data Structures", "Algorithms", "DSA", "Object-Oriented Programming", "OOP",
    "Agile", "Scrum", "Jira", "Problem Solving", "Full Stack", "MERN Stack", "MEAN Stack"
]

# Aliases and colloquialisms mapped directly to standard canonical forms
NORMALIZATION_MAP = {
    # JavaScript / TypeScript / Node
    "js": "JavaScript",
    "javascript": "JavaScript",
    "ecmascript": "JavaScript",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "node js": "Node.js",
    "express": "Express",
    "expressjs": "Express",
    "express.js": "Express",
    "express js": "Express",
    "nest": "NestJS",
    "nestjs": "NestJS",
    
    # React ecosystem
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "react js": "React",
    "react native": "React Native",
    "react-native": "React Native",
    "redux": "Redux",
    "redux-toolkit": "Redux Toolkit",
    "redux toolkit": "Redux Toolkit",
    "next": "Next.js",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "next js": "Next.js",
    
    # Vue / Angular
    "vue": "Vue",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "angular": "Angular",
    "angularjs": "Angular",
    
    # Python ecosystem
    "py": "Python",
    "python": "Python",
    "python3": "Python",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "scikit-learn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    
    # C/C++/C#
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "golang": "Go",
    "go": "Go",
    
    # Database
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "mongoose": "Mongoose",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "sql": "SQL",
    "mysql": "MySQL",
    "sqlite": "SQLite",
    "redis": "Redis",
    
    # Cloud & DevOps
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",
    "azure": "Azure",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",
    
    # Web & Styling
    "html": "HTML",
    "html5": "HTML5",
    "css": "CSS",
    "css3": "CSS3",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "sass": "Sass",
    "scss": "Sass",
    
    # AI / ML
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "nlp": "NLP",
    "natural language processing": "NLP",
    "llm": "LLM",
    "generative ai": "Generative AI",
    "gen ai": "Generative AI",
    
    # Full Stack
    "mern": "MERN Stack",
    "mern stack": "MERN Stack",
    "mean": "MEAN Stack",
    "mean stack": "MEAN Stack",
    "fullstack": "Full Stack",
    "full-stack": "Full Stack",
    "full stack": "Full Stack",
    "rest": "REST API",
    "rest api": "REST API",
    "restful": "REST API",
    "restful api": "REST API",
    "graphql": "GraphQL",
    "dsa": "Data Structures & Algorithms",
    "oop": "OOP"
}

def normalize_skill(skill: str) -> str:
    """Normalize a skill token to its canonical standard name."""
    if not skill:
        return ""
    clean = skill.strip().lower()
    # Check direct normalization map
    if clean in NORMALIZATION_MAP:
        return NORMALIZATION_MAP[clean]
    # Check title case
    for canonical in CANONICAL_SKILLS:
        if canonical.lower() == clean:
            return canonical
    return skill.strip().title()

def are_skills_compatible(skill_a: str, skill_b: str) -> bool:
    """
    Checks if two skill strings represent the same or closely related skill.
    Handles synonyms, substrings, and alias variations.
    """
    norm_a = normalize_skill(skill_a).lower()
    norm_b = normalize_skill(skill_b).lower()

    if not norm_a or not norm_b:
        return False

    if norm_a == norm_b:
        return True

    # Substring matching (e.g. 'react' in 'react.js' or 'tailwind' in 'tailwind css')
    if len(norm_a) >= 3 and len(norm_b) >= 3:
        if norm_a in norm_b or norm_b in norm_a:
            return True

    # Check words token intersection
    tokens_a = set(re.findall(r'[a-zA-Z0-9\+\#]+', norm_a))
    tokens_b = set(re.findall(r'[a-zA-Z0-9\+\#]+', norm_b))
    common = tokens_a.intersection(tokens_b)
    # Exclude trivial stop tokens
    meaningful = {t for t in common if len(t) > 2 and t not in {"and", "the", "for", "with"}}
    if meaningful:
        return True

    return False

def extract_skills_from_text(text: str) -> list[str]:
    """
    Robust multi-pass skill extractor from unstructured text (resumes or job specs).
    Uses regex boundary matching, token splits, and alias lookups.
    """
    if not text:
        return []

    found_skills = set()
    text_lower = text.lower()

    # Pass 1: Match multi-word canonical phrases & aliases
    for alias, standard in sorted(NORMALIZATION_MAP.items(), key=lambda x: -len(x[0])):
        # Support tech punctuation boundaries like / + # .
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(alias) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(standard)

    # Pass 2: Check all canonical skills
    for canonical in CANONICAL_SKILLS:
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(canonical.lower()) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(normalize_skill(canonical))

    # Pass 3: Check lines that look like bullet points or comma-separated lists
    chunks = re.split(r'[,|•\n\t/]+', text)
    for chunk in chunks:
        cleaned_token = chunk.strip().lower()
        if cleaned_token in NORMALIZATION_MAP:
            found_skills.add(NORMALIZATION_MAP[cleaned_token])

    return sorted(list(found_skills))
