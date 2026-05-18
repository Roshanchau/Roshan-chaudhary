"use client";

import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const projects = [
  {
    title: "SpeakPix",
    points: [
      "Developed an interactive mobile application for people with autism, dyslexia, and learning issues to aid in social interaction and communication.",
      "Utilized React Native for cross-platform mobile development and gpt-2 LLM for next-word prediction.",
    ],
    tech: ["React Native", "Flask", "GPT-2","redis", "NLP"],
    link: "https://github.com/Roshanchau/autism-app",
  },
  {
    title: "Quantum Tic-Tac-Toe",
    points: [
      "Developed a quantum tic-tac-toe to visualize superposition and entanglement using different quantum gates like CNOT gate",
      "Built as a minor project using Qiskit for quantum computing",
    ],
    tech: ["Python", "Qiskit", "Quantum Computing"],
    link: "https://github.com/Twtamaris/quantum_tic_tac_toe",
    demo: "https://www.youtube.com/watch?v=i_VT03LhV9g",
  },
  {
    title: "TutorSansar",
    points: [
      "Developed the MVP for Tutor matching platform for students and a personalised learning system.",
      "features: auth, notification, cronJobs, redis, BullMQ, consensus, vps.",
    ],
    tech: ["Node.js", "Express", "next", "typescript", "Redis", "BullMQ", "VPS"],
    link: "https://www.tutorsansar.com",
  },
  {
    title: "IntelliDocs",
    points: [
      "Contributed to a document querying chatbot enabling users to upload and query documents using natural language prompts.",
      "Users can store legal or health-related documents and query them anytime.",
      "Implemented document processing and storage using MongoDB Atlas and AWS S3.",
    ],
    tech: ["MongoDB Atlas", "AWS S3", "fast api", "NLP"],
    link: "https://github.com/Roshanchau/IntelliDocs",
    demo: "https://drive.google.com/drive/folders/1U2gKv3JM0zZHOZPpkldFyWz9SFlXc8g1",
  },
];

const Projects = () => {
  const { theme } = useThemeStore();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 mb-3 space-y-5 overflow-y-auto max-h-[80vh] no-scrollbar">
      {projects.map((project, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 sm:p-6 
          rounded-2xl border border-white/10 
          bg-[rgba(255,255,255,0.02)] backdrop-blur-md
          hover:border-purple-500/30 transition-all duration-300"
        >
          {/* Content */}
          <div className="flex-1">
            <h2
              className={`text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3 ${
                theme === "light"
                  ? "text-[rgba(53,176,148,0.59)]"
                  : "text-[rgb(95,241,208)]"
              }`}
            >
              {project.title}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 rounded-md border border-red-500/40 
      hover:bg-red-500/10 transition"
                >
                  ▶ Demo
                </a>
              )}
            </h2>

            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-[15px] text-neutral-400">
              {project.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            {project.tech && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md 
        border border-white/10 
        bg-white/5 
        text-neutral-400
        hover:border-purple-400/40 hover:text-purple-300
        transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="flex md:flex-col items-start md:items-end justify-between md:justify-start">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-0 text-sm px-4 py-2 rounded-lg 
              border border-purple-500/40 
              hover:bg-purple-500/10 
              transition whitespace-nowrap"
            >
              View →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
