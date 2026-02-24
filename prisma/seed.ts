import { PrismaClient, PublishStatus, Visibility } from "@prisma/client";
import { hash } from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  // ──────────────────────────── Admin User ────────────────────────────
  const passwordHash = await hash(
    process.env.SEED_ADMIN_PASSWORD || "admin123456",
    10
  );

  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@example.com" },
    update: { passwordHash },
    create: {
      email: process.env.SEED_ADMIN_EMAIL || "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // ──────────────────────────── Profile ────────────────────────────
  await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {
      name: "Faishal Uddin Himel",
      headline: "AI Developer & Automation Engineer | AI & Cybersecurity Researcher",
      bio: `I am passionate about contributing to the advancement of computing technologies through multidisciplinary collaboration and innovative problem-solving. With a strong foundation in AI, cybersecurity, and backend development, I aim to apply my diverse technical skills to address complex challenges in emerging technology domains. I am committed to continuous learning, proactive research, and making a meaningful impact by developing intelligent, secure, and future-ready solutions.

Highly motivated and research-driven AI & Cybersecurity Engineering student with a strong foundation in backend systems, intelligent automation, and advanced computing technologies. Experienced in multidisciplinary research across cybersecurity, IoT, AI, and machine learning, including academic publications and system development.`,
      location: "Basundhara R/A, Block-2C, Bangladesh",
      email: "himelfaishal@gmail.com",
    },
    create: {
      id: "default-profile",
      name: "Faishal Uddin Himel",
      headline: "AI Developer & Automation Engineer | AI & Cybersecurity Researcher",
      bio: `I am passionate about contributing to the advancement of computing technologies through multidisciplinary collaboration and innovative problem-solving. With a strong foundation in AI, cybersecurity, and backend development, I aim to apply my diverse technical skills to address complex challenges in emerging technology domains. I am committed to continuous learning, proactive research, and making a meaningful impact by developing intelligent, secure, and future-ready solutions.

Highly motivated and research-driven AI & Cybersecurity Engineering student with a strong foundation in backend systems, intelligent automation, and advanced computing technologies. Experienced in multidisciplinary research across cybersecurity, IoT, AI, and machine learning, including academic publications and system development.`,
      location: "Basundhara R/A, Block-2C, Bangladesh",
      email: "himelfaishal@gmail.com",
    },
  });

  // ──────────────────────────── Social Links ────────────────────────────
  await prisma.socialLinks.upsert({
    where: { id: "default-social" },
    update: {
      linkedin: "https://linkedin.com/in/faishal-uddin-himel-b7b29a236/",
      website: "https://my-portfolio-cyan-nu-69.vercel.app/",
    },
    create: {
      id: "default-social",
      linkedin: "https://linkedin.com/in/faishal-uddin-himel-b7b29a236/",
      website: "https://my-portfolio-cyan-nu-69.vercel.app/",
    },
  });

  // ──────────────────────────── Skills ────────────────────────────
  const skills = [
    // Programming Languages
    { name: "Python", category: "Programming Languages", level: 95 },
    { name: "C++", category: "Programming Languages", level: 85 },
    { name: "C#", category: "Programming Languages", level: 80 },
    { name: "Java", category: "Programming Languages", level: 80 },
    { name: "PHP", category: "Programming Languages", level: 75 },
    { name: "JavaScript", category: "Programming Languages", level: 85 },
    { name: "SQL", category: "Programming Languages", level: 85 },
    { name: "R", category: "Programming Languages", level: 70 },
    { name: "HTML", category: "Programming Languages", level: 90 },
    { name: "CSS", category: "Programming Languages", level: 85 },
    // AI / ML / Data Science
    { name: "Machine Learning", category: "AI / ML / Data Science", level: 90 },
    { name: "Deep Learning", category: "AI / ML / Data Science", level: 88 },
    { name: "NLP", category: "AI / ML / Data Science", level: 85 },
    { name: "TF-IDF", category: "AI / ML / Data Science", level: 80 },
    { name: "Ensemble Learning", category: "AI / ML / Data Science", level: 85 },
    { name: "GAN / WGAN-GP", category: "AI / ML / Data Science", level: 82 },
    { name: "Adversarial Robustness (PGD)", category: "AI / ML / Data Science", level: 80 },
    { name: "Transformer Models", category: "AI / ML / Data Science", level: 85 },
    { name: "Multi-Agent Systems", category: "AI / ML / Data Science", level: 88 },
    { name: "Data Visualization", category: "AI / ML / Data Science", level: 82 },
    // Frameworks / Libraries / Tools
    { name: "FastAPI", category: "Frameworks & Tools", level: 85 },
    { name: "TensorFlow", category: "Frameworks & Tools", level: 88 },
    { name: "PyTorch", category: "Frameworks & Tools", level: 90 },
    { name: "Scikit-learn", category: "Frameworks & Tools", level: 90 },
    { name: "Django", category: "Frameworks & Tools", level: 78 },
    { name: "Git", category: "Frameworks & Tools", level: 85 },
    { name: "Overleaf", category: "Frameworks & Tools", level: 80 },
    { name: "NumPy", category: "Frameworks & Tools", level: 90 },
    { name: "Pandas", category: "Frameworks & Tools", level: 90 },
    { name: "Matplotlib", category: "Frameworks & Tools", level: 85 },
    { name: "ONNX", category: "Frameworks & Tools", level: 75 },
    // Backend / Web
    { name: "RESTful APIs", category: "Backend / Web", level: 88 },
    { name: "Database Design & Management", category: "Backend / Web", level: 85 },
    { name: "API Integration", category: "Backend / Web", level: 88 },
  ];

  for (const skill of skills) {
    const id = slugify(skill.name, { lower: true, strict: true });
    await prisma.skill.upsert({
      where: { id },
      update: skill,
      create: { id, ...skill },
    });
  }

  // ──────────────────────────── Projects ────────────────────────────
  const projects = [
    {
      title: "LLM-Driven Reflective Multi-Agent Economic Simulation System",
      slug: "llm-multi-agent-economic-simulation",
      description:
        "Built a multi-agent economic simulation modeling individuals under real-world constraints. Designed hybrid architecture: rule-based economics + LLM reflective policy layer. Implemented LLM-based reflection memory for adaptive labor decisions. Integrated rate-limited LLM invocation and economic shock simulations. Produced interpretable analytics and visualizations. Developed for Microsoft Imagine Cup at AIUB (2024–2025).",
      techStack: ["Python", "OpenAI GPT-4o", "GPT-4o-mini", "Multi-Agent Systems", "Prompt Engineering", "NumPy", "Pandas", "Matplotlib"],
      featured: true,
      tags: ["multi-agent", "llm", "economics", "simulation", "microsoft-imagine-cup"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "CyberShield: Reflective Multi-Agent Zero-Day Cyber Defense System",
      slug: "cybershield-zero-day-defense",
      description:
        "Built autonomous zero-day cyber defense system using unsupervised GAN-based anomaly detection. Implemented WGAN-GP critic on normal traffic for unseen attack detection. Developed Coordinator Agent for temporal correlation and campaign-level escalation. Built Responder Agent for automated monitoring, host isolation, and IP blocking. Added reflective incident memory and feedback loops to reduce false positives. Produced comprehensive visual analytics. (2025)",
      techStack: ["Python", "TensorFlow", "WGAN-GP", "GAN-Based Anomaly Detection", "Multi-Agent Systems", "Cybersecurity Analytics", "NumPy", "Pandas", "Matplotlib"],
      featured: true,
      tags: ["cybersecurity", "zero-day", "multi-agent", "gan", "anomaly-detection"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "AI-Based Phishing Email Detection System",
      slug: "ai-phishing-detection",
      description:
        "Built AI-driven phishing detection using NLP and ML classifiers. Applied TF-IDF, word embeddings, and models like SVM, Random Forest, Neural Networks. Role: ML Engineer (Model Development and Integration). Developed at AIUB.",
      techStack: ["Python", "NLP", "TF-IDF", "SVM", "Random Forest", "Scikit-learn"],
      featured: false,
      tags: ["phishing", "nlp", "ml", "security"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "AI-Enhanced Endpoint Malware Protection with Adversarial Robustness",
      slug: "ai-endpoint-malware-protection",
      description:
        "Built end-to-end AI malware detection pipeline using static executable features. Developed transformer-based deep learning + classical ML baselines. Added adversarial robustness (GAN augmentation, PGD attacks). Evaluated via ROC-AUC, PR-AUC, precision-recall, calibration, adversarial metrics. Visualized distributions using t-SNE and feature-space analysis. Exported models to ONNX and validated deployment consistency. (2025, Research Internship at AIIL, UK)",
      techStack: ["Python", "PyTorch", "Transformer Models", "GANs", "PGD Attacks", "ONNX", "Scikit-learn", "NumPy", "Pandas", "Matplotlib"],
      featured: true,
      tags: ["malware", "adversarial", "transformer", "cybersecurity", "onnx"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Web Tech – Home Service Web Application",
      slug: "home-service-web-app",
      description:
        "Built platform connecting users with home service providers. Role: Backend and Database Management. Technologies: PHP, JavaScript, JSON, HTML, CSS. Developed at AIUB.",
      techStack: ["PHP", "JavaScript", "JSON", "HTML", "CSS"],
      featured: false,
      tags: ["web", "backend", "php"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Web Tech – Event Management System",
      slug: "event-management-system",
      description:
        "Designed backend logic and data storage for university event management. Role: Backend and Database Management. Developed at AIUB (Dec 2024 – Present).",
      techStack: ["PHP", "JavaScript", "SQL", "HTML", "CSS"],
      featured: false,
      tags: ["web", "backend", "event-management"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Python/Django Personal Website",
      slug: "django-personal-website",
      description:
        "Built a personal portfolio website with dynamic content and contact forms. Role: Full-Stack Development (Backend, Frontend, Database Integration). (Dec 2024 – Present)",
      techStack: ["Python", "Django", "HTML", "CSS", "JavaScript", "SQL"],
      featured: false,
      tags: ["django", "portfolio", "full-stack"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Intelligent DDoS Attack Detection using Machine Learning",
      slug: "ddos-detection-ml",
      description:
        "Built ML-based DDoS detection framework for volumetric and protocol-based attacks. Preprocessed traffic, extracted features, normalized flow datasets. Trained supervised models and evaluated performance. Developed traffic analytics and detection timeline visualizations. (2024, Academic / Research Project at AIUB)",
      techStack: ["Python", "Scikit-learn", "Network Traffic Analysis", "ML", "NumPy", "Pandas", "Matplotlib"],
      featured: false,
      tags: ["ddos", "network-security", "machine-learning", "traffic-analysis"],
      status: PublishStatus.PUBLISHED,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, images: [], githubLink: null, liveLink: null },
    });
  }

  // ──────────────────────────── Research Papers ────────────────────────────
  const papers = [
    {
      title: "AI-Powered Endpoint Detection and Response (EDR) System with API Integration",
      slug: "ai-edr-system",
      authors: ["Faishal Uddin Himel"],
      venue: "AIUB Research",
      year: 2025,
      abstract:
        "Developed an intelligent endpoint protection system using ML for real-time malware and anomaly detection. Designed secure RESTful APIs between endpoints and central detection engine. Integrated automated threat response (process isolation, alert generation). Applied feature extraction and optimization to improve accuracy and reduce false positives. Evaluated performance with malware and benign datasets. Supervisor: Dr. Mohammad Saef Ullah Miah.",
      tags: ["edr", "malware", "api", "cybersecurity", "ml"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Self-Healing Federated AI CyberShield for Adaptive Threat Detection and Recovery in Smart IoT Environments",
      slug: "federated-ai-cybershield-iot",
      authors: ["Faishal Uddin Himel"],
      venue: "AIUB Research",
      year: 2025,
      abstract:
        "Federated AI-based cybersecurity framework for threat detection and autonomous recovery in smart IoT networks. Supervisor: Dr. Mohammad Saef Ullah Miah.",
      tags: ["federated-ai", "iot", "cybersecurity", "self-healing"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "Multi-Agent AI CyberShield with Three Cooperative Detection Agents",
      slug: "multi-agent-cybershield",
      authors: ["Faishal Uddin Himel"],
      venue: "AIUB Research",
      year: 2025,
      abstract:
        "Designed distributed CyberShield architecture with three AI detector agents (network, host, application). Implemented ML models in each agent for malware/intrusion/anomaly detection. Built agent coordination + decision fusion for higher accuracy and fewer false alarms. Integrated central response unit for alerting and mitigation. Validated with mixed benign/attack datasets in simulated enterprise-IoT environment. Supervisor: Dr. Mohammad Saef Ullah Miah.",
      tags: ["multi-agent", "cybersecurity", "anomaly-detection", "distributed"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "PhishDoc-ML: An Explainable Ensemble Learning Framework for Phishing Email Detection",
      slug: "phishdoc-ml",
      authors: ["Faishal Uddin Himel"],
      venue: "AIUB Research",
      year: 2025,
      abstract:
        "Developed an interpretable ensemble ML framework for phishing detection through email analysis. Supervisor: Mir Md. Kawsur.",
      tags: ["phishing", "ensemble-learning", "explainable-ai", "email-detection"],
      status: PublishStatus.PUBLISHED,
    },
    {
      title: "A Comparative Study of IDS Dataset Limitations and Adaptive Learning Solutions",
      slug: "ids-dataset-limitations",
      authors: ["Faishal Uddin Himel"],
      venue: "AIUB Research",
      year: 2025,
      abstract:
        "Analyzed IDS datasets, identified limitations, and proposed adaptive learning improvements. Supervisor: Dr. Rajarshi Roy Chowdhury.",
      tags: ["ids", "datasets", "adaptive-learning", "network-security"],
      status: PublishStatus.PUBLISHED,
    },
  ];

  for (const p of papers) {
    await prisma.paper.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, pdfLink: null, codeLink: null, citations: 0 },
    });
  }

  // ──────────────────────────── Certificates ────────────────────────────
  const certificates = [
    { title: "LLM Pentesting: Mastering Security Testing for AI Models", issuer: "Udemy", year: 2024, tags: ["llm", "pentesting", "ai-security"] },
    { title: "Artificial Intelligence & Machine Learning Fundamentals", issuer: "Certificate of Completion", year: 2024, tags: ["ai", "ml", "fundamentals"] },
    { title: "Generative AI: Prompt Engineering Basics", issuer: "IBM", year: 2024, tags: ["generative-ai", "prompt-engineering"] },
    { title: "Professional Web, Android & iOS Penetration Testing", issuer: "Cyber-Bangla", year: 2024, tags: ["pentesting", "web-security", "mobile-security"] },
    { title: "Python for Data Science and Machine Learning", issuer: "IBM", year: 2024, tags: ["python", "data-science", "ml"] },
    { title: "Python Django Development Course", issuer: "IIT, Jahangirnagar University", year: 2024, tags: ["django", "python", "web-development"] },
    { title: "Advanced Cybersecurity Course", issuer: "Team Matrix – Elite Hackers", year: 2025, tags: ["cybersecurity", "advanced"] },
    { title: "Cisco Certified Network Associate (CCNA)", issuer: "AIUB Institute of Continuing Education / Cisco", year: 2025, tags: ["ccna", "networking", "cisco"] },
  ];

  // Clear old certificates first
  await prisma.certificate.deleteMany();
  for (const c of certificates) {
    await prisma.certificate.create({
      data: { ...c, credentialUrl: null, assetUrl: null },
    });
  }

  // ──────────────────────────── Posts (Activity / Blog) ────────────────────────────
  await prisma.post.upsert({
    where: { slug: "work-experience-journey" },
    update: {},
    create: {
      title: "My Professional Journey — Work Experience",
      slug: "work-experience-journey",
      content: `<h2>AI Developer & Automation Engineer — Betopia Group, Bangladesh</h2>
<p><em>January 2026 – Present</em></p>
<ul>
<li>Developing and deploying AI-powered features for internal products and client projects.</li>
<li>Designing automation workflows to streamline business processes and reduce manual operations.</li>
<li>Building backend services and integrations (APIs, databases, third-party tools) to support AI/automation pipelines.</li>
<li>Implementing data processing, model evaluation, and performance improvements for production readiness.</li>
<li>Collaborating with cross-functional teams to deliver end-to-end solutions and maintain documentation.</li>
</ul>

<h2>Research Intern — Applied Intelligence and Informatics Lab (AIIL), Nottingham, UK (Remote)</h2>
<p><em>October 2025 – December 2025</em></p>
<ul>
<li>Conducted research in applied AI and informatics.</li>
<li>Performed in-depth literature reviews for model development and experiment design.</li>
<li>Designed, implemented, and evaluated ML/AI research models.</li>
<li>Collaborated with international researchers.</li>
<li>Contributed to research documentation and Q1/Q2 journal publication preparation.</li>
</ul>

<h2>Leader — Team Tech Wing, AIUB</h2>
<p><em>October 2023 – Present</em></p>
<ul>
<li>Supervised laboratory activities and technical resource utilization.</li>
<li>Mentored junior members in technical and professional development.</li>
<li>Organized technical workshops and knowledge-sharing sessions.</li>
</ul>

<h2>EDGE Project — AIUB Institute</h2>
<p><em>June 2024 – January 2025</em></p>
<ul>
<li>Worked on Python-based project under the national EDGE initiative (Enhancing Digital Government and Economy).</li>
<li>Supervisor: Dr. Mohammad Saef Ullah Miah</li>
</ul>

<h2>Intern App Developer — RIC-Series</h2>
<p><em>August 2025 – November 2025</em></p>
<ul>
<li>Assisted in gaming application development and codebase enhancement.</li>
<li>Collaborated with development teams to improve performance and user experience.</li>
</ul>`,
      excerpt:
        "A summary of my professional experience at Betopia Group, AIIL (UK), AIUB, and more.",
      tags: ["work-experience", "ai", "cybersecurity", "automation"],
      status: PublishStatus.PUBLISHED,
    },
  });

  await prisma.post.upsert({
    where: { slug: "education-background" },
    update: {},
    create: {
      title: "My Education Background",
      slug: "education-background",
      content: `<h2>Bachelor of Science in Computer Science and Engineering</h2>
<p>American International University-Bangladesh (AIUB), 2022 – 2025 (Completed)</p>

<h2>Higher Secondary Certificate (HSC)</h2>
<p>Pakundia Govt. College, 2018 – 2020, Major: Science</p>`,
      excerpt:
        "BSc in Computer Science & Engineering from AIUB, HSC from Pakundia Govt. College.",
      tags: ["education", "aiub", "cse"],
      status: PublishStatus.PUBLISHED,
    },
  });

  // ──────────────────────────── Documents ────────────────────────────
  await prisma.document.upsert({
    where: { id: "cv-document" },
    update: {},
    create: {
      id: "cv-document",
      title: "Faishal Uddin Himel – CV",
      category: "resume",
      fileUrl: "/uploads/Faishal_Uddin_Himel_CV.pdf",
      visibility: Visibility.PUBLIC,
      description:
        "Latest CV/Resume for Faishal Uddin Himel — AI Developer, Cybersecurity Researcher, Backend Engineer.",
      tags: ["cv", "resume"],
      status: PublishStatus.PUBLISHED,
    },
  });

  console.log("✅ Database seeded with real portfolio content!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
