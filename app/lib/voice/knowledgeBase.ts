export interface KnowledgeChunk {
  topic: string;
  content: string;
}

// Facts drawn directly from the live site (home/hero, About page, Projects
// page) and Roshan's CV. Keep this in sync with those sources; the agent is
// instructed to answer about Roshan strictly from here, so accuracy here is
// what prevents hallucination. Blog posts are injected separately at request
// time from Notion (see app/lib/voice/blogKnowledge.ts).
export const PORTFOLIO_KNOWLEDGE: KnowledgeChunk[] = [
  {
    topic: "home",
    content:
      "The home page introduces Roshan Chaudhary as a Software Engineer. His tagline: he loves building, solving problems, figuring things out, and learning something new every day. He has experience building scalable web applications using best coding and security practices, scalable design patterns, microservices, and deployment. The home page notes he is currently learning system design, distributed systems, and Kubernetes (k8s).",
  },
  {
    topic: "about-intro",
    content:
      "Roshan Chaudhary is a software engineer based in Kathmandu, Nepal. He is focused on improving and learning every day. Outside of work he enjoys football and hiking. He can be reached at roshanchau001@gmail.com.",
  },
  {
    topic: "about-summary",
    content:
      "Roshan focuses on backend development and is comfortable with full-stack work as well. The About page mentions about 1.5 years of experience; his CV states over 2 years of hands-on experience designing and developing scalable, secure distributed systems. He cares about scalability, clean architecture, and security best practices, and works with microservices using scalable patterns like strategy/factory, builder, and proxy patterns.",
  },
  {
    topic: "education",
    content:
      "Roshan earned a Bachelor's in Computer Engineering from IOE Purwanchal Campus in Dharan, Nepal, studying from August 2020 to April 2025.",
  },
  {
    topic: "experience-mitra",
    content:
      "Since 2024, Roshan has been a Backend Developer at MITRA Consultancy in Nepal. He architected and designed a scalable distributed system for a talent-showcasing social media app using both relational databases (PostgreSQL, MySQL) and a non-relational database (MongoDB). He used Kafka for high-throughput event-driven architecture, and implemented complex features including WebRTC calling (with STUN/TURN servers), real-time chat with Socket.IO, payments, CRON jobs for expiring subscriptions and deleting stale records, and AWS S3 document storage. He wrote clean, maintainable code adhering to best practices (including a custom library), collaborated with frontend developers, participated in code reviews, and deployed all services through an API gateway on an AWS EC2 instance.",
  },
  {
    topic: "achievements",
    content:
      "Roshan's achievements: (1) Won 'Best Futuristic Implementation' at IICQUEST 2024 for VirtualSathi, a mental health platform for students. (2) 1st Runner Up at the hackathon organized by ACES Techfest 5.0 in 2023, for a gamified app helping autistic children communicate more easily in social environments. (3) Local-level (Itahari) NASA Space Apps Challenge winner in 2024, for a web portal that predicts wildfires in Nepal using NASA datasets.",
  },
  {
    topic: "project-tutorsansar",
    content:
      "TutorSansar is a tutor-matching platform for students with a personalised learning system; Roshan developed its MVP. Built with Node.js and Next.js; features include authentication, notifications, CRON jobs, Redis, BullMQ, consensus, and VPS deployment. Live at www.tutorsansar.com.",
  },
  {
    topic: "project-speakpix",
    content:
      "SpeakPix is an interactive mobile application for people with autism, dyslexia, and learning issues, to aid social interaction and communication. Built with React Native for cross-platform mobile, Flask, and a GPT-2 LLM for next-word prediction (also uses Redis and NLP). Code: github.com/Roshanchau/autism-app.",
  },
  {
    topic: "project-intellidocs",
    content:
      "IntelliDocs is a document-querying chatbot that lets users upload documents and query them with natural-language prompts — for example, storing legal or health-related documents and asking about them later. Built with Python, FastAPI, MongoDB Atlas, and AWS S3 for document processing and storage. Code: github.com/Roshanchau/IntelliDocs.",
  },
  {
    topic: "project-skilio",
    content:
      "Skilio is a scalable backend service for a skills-showcasing social media app, built at MITRA Consultancy with Node.js, Express.js, PostgreSQL, TypeORM, and microservices. Features include reels, chat, calling, payments, notifications, and content moderation. It uses PostgreSQL for the user/customer service, MySQL for payments, and MongoDB to store posts/reels.",
  },
  {
    topic: "project-virtualsathi",
    content:
      "VirtualSathi is a mental-health and well-being platform for students; Roshan built its backend with Node.js, Express.js, and MySQL using Prisma ORM and Aiven services, implementing RESTful APIs. It won the 'Best Futuristic Implementation' category at IICQUEST 2024.",
  },
  {
    topic: "project-quantum-tictactoe",
    content:
      "Quantum Tic-Tac-Toe is a minor project that visualizes quantum superposition and entanglement using quantum gates such as the CNOT gate, built in Python with the Qiskit library. Code: github.com/Twtamaris/quantum_tic_tac_toe.",
  },
  {
    topic: "project-drf",
    content:
      "DRF is a learning project where Roshan explored Django's REST Framework for basic REST API CRUD operations. Code: github.com/Roshanchau/DRF.",
  },
  {
    topic: "skills-languages",
    content:
      "Programming languages Roshan works with: JavaScript, TypeScript, Python, C++, C, and Go.",
  },
  {
    topic: "skills-frontend",
    content:
      "Frontend technologies: React, Next.js, Tailwind CSS, Redux, Zustand, and React Native.",
  },
  {
    topic: "skills-backend",
    content:
      "Backend technologies: Node.js, Express.js, Flask, and FastAPI.",
  },
  {
    topic: "skills-data",
    content:
      "Databases and ORMs: MongoDB, PostgreSQL, MySQL, Prisma ORM, TypeORM, Firebase, and Redis.",
  },
  {
    topic: "skills-cloud-tools",
    content:
      "Cloud and tooling: AWS and VPS for cloud; Git, Docker, NGINX, and CI/CD for tools. Areas of strength include scalable distributed system design, event-driven architecture with Kafka, real-time systems (WebRTC, Socket.IO), payments integration, and cloud infrastructure.",
  },
  {
    topic: "competencies",
    content:
      "Key competencies: strong problem solving (weighing trade-offs and costs), proven teamwork in collaborative settings, and continuous learning — staying up to date with AI and engineering blogs.",
  },
  {
    topic: "contact",
    content:
      "Contact and links: email roshanchau001@gmail.com, phone 9808846298, LinkedIn linkedin.com/in/roshan-chaudhary-429381211, GitHub github.com/Roshanchau.",
  },
  {
    topic: "blogs-section",
    content:
      "Roshan publishes blog posts in the Blogs section of this portfolio, covering software engineering and technology topics. When available, the current list of published posts (with titles and short descriptions) is provided below.",
  },
  {
    topic: "portfolio-site",
    content:
      "This portfolio website is built with Next.js 15, TypeScript, TailwindCSS, and Zustand for state management. Blog content is pulled from Notion via the Notion API. The voice assistant uses Groq's Whisper (whisper-large-v3-turbo) for speech-to-text, the Llama 3.1 8B Instant model for responses, and the browser's built-in speech synthesis for voice output.",
  },
];

export const buildKnowledgeContext = (chunks: KnowledgeChunk[]): string =>
  chunks
    .map((chunk) => `### ${chunk.topic}\n${chunk.content}`)
    .join("\n\n");
