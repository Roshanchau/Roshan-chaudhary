"use client";

import Image from "next/image";
import photo from "../assets/photo.jpg";
import { useThemeStore } from "../store/useThemeStore";

const experiences = [
  {
    date: "Dec 2024 - Present",
    company: "Mitra consultancy",
    title: "Backend Developer",
    description: [
      "Collaborated in the architecture and design of  a scalable distributed system for a talent showcasing social media app using both relational (PostgreSQL, MySQL) and non-relational (MongoDB) databases",
      "Implemented Kafka-based event-driven architecture (pub/sub).",
      "Implemented real-time communication features, including WebRTC-based audio/video calling with STUN/TURN servers and real-time chat using Socket.IO; developed payment workflows, scheduled cron jobs for subscription expiration and stale-record cleanup, and integrated AWS S3 for document storage.",
      "Handled 3 independently deployable microservices for payments, customer management and media services.",
      "Developed and maintained clean, reusable code following established coding standards and best practices, contributing to a custom internal library.",
      "Collaborated with frontend developers, participated in code reviews, and mentored interns to improve code quality and development practices."
    ],
  },
];

const achievements = [
    {
    date: "2023",
    title: "1st Runner Up at Hackathon organized by ACES Techfest 5.0",
    description: [
      "Awarded for a gamified application for autistic childrens helping them to communicate easily in social environment.",
    ],
  },
  {
    date: "2024",
    title: "Best Futuristic Implementation - IICQUEST",
    description: [
      "Awarded for developing VirtualSathi, a mental health platform for students.",
    ],
  },
  {
    date: "2024",
    title: "Local level (Itahari) NASA Space Apps winner",
    description: [
      "Built a web portal for wildfire prediction in nepal using NASA's provided dataset.",
    ],
  },
];

const publications = [
    {
    date: "2026",
    title: "Intelli-Docs: An AI-Powered Personal Document Assistant Using Retrieval-Augmented Generation and Multimodal Retrieval",
    description: [
      "Co-authored and published with Prashant Bhattarai, Saurab Baral, and Kritika Thapa in the Journal of Engineering Issues and Solutions, Vol. 5, No. 2 (2026).",
    ],
  }
];

const technologies = [
  { name: "JavaScript", src: "/tech/js.png" },
  { name: "TypeScript", src: "/tech/ts.png" },
  { name: "React", src: "/tech/React.png" },
  { name: "Next.js", src: "/tech/next.png" },
  { name: "Node.js", src: "/tech/node.png" },
  { name: "Express", src: "/tech/express.png" },
  { name: "MySQL", src: "/tech/mysql.png" },
  { name: "MongoDB", src: "/tech/mongo.png" },
  { name: "PostgresSql", src: "/tech/postgres.png" },
  { name: "AWS", src: "/tech/AWS.png" },
  { name: "Docker", src: "/tech/Docker.png" },
  { name: "kafka", src: "/tech/kafka.png" },
  { name: "NGINX", src: "/tech/NGINX.png" }
];

const About = () => {
  const { theme } = useThemeStore();

  const textColor =
    theme === "light" ? "text-neutral-500" : "text-[rgb(118,129,158)]";

  const accent =
    theme === "light"
      ? "text-[rgba(53,176,148,0.7)]"
      : "text-[rgb(95,241,208)]";

  return (
    <div className="flex flex-col items-center w-full px-6 py-16 space-y-24">
      {/* 🔹 INTRO */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* IMAGE (move to top on mobile) */}
        <div className="flex justify-center order-1 md:order-2">
            <Image
              src={photo}
              alt="profile"
              width={260}
              height={260}
              className="rounded-full"
            />
        </div>

        {/* TEXT */}
        <div className={`space-y-4 ${textColor} order-2 md:order-1`}>
          <p>
            Hey hi👋{" "}
            <span className={`font-semibold ${accent}`}>Roshan Chaudhary</span> here.
            Software engineer based in Kathmandu, Nepal. Just improving and
            learning everyday. love football, hiking, etc.
          </p>

          <p>
            I have <span className="font-medium">1.5 years</span> of experience
            in backend development who can do full-stack development as well.
          </p>

          <p>
            Reach me out through:{" "}
            <span className={accent}>roshanchau001@gmail.com</span>
          </p>
        </div>
      </div>

      {/* 🔹 EXPERIENCE TIMELINE */}
      <div className="max-w-4xl w-full">
        <h2 className={`text-2xl font-semibold mb-10 text-center ${accent}`}>
          Experience
        </h2>

        <div className="relative border-l border-gray-400/30 pl-10 space-y-12">
          {experiences.map((exp, i) => (
            <div key={i} className="relative">
              {/* CONTENT */}
              <div className="ml-14">
                <p className="text-sm text-[rgb(95,241,208)]">{exp.date}</p>

                <h3 className="text-lg font-semibold">
                  {exp.title}
                </h3>
                <h3 className="text-sm font-semibold">
                  {exp.company}
                </h3>

                <ul className="list-disc ml-5 mt-2 text-[rgb(118,129,158)] space-y-1">
                  {exp.description.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 ACHIEVEMENTS TIMELINE */}
      <div className="max-w-4xl w-full">
        <h2 className={`text-2xl font-semibold mb-10 text-center ${accent}`}>
          Achievements
        </h2>

        <div className="relative border-l border-gray-400/30 pl-8 space-y-10">
          {achievements.map((item, i) => (
            <div key={i} className="relative">
              <div className="ml-14">
                <p className={`text-sm ${accent}`}>{item.date}</p>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <ul className={`list-disc ml-5 mt-2 ${textColor} space-y-1`}>
                  {item.description.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div className="max-w-4xl w-full">
        <h2 className={`text-2xl font-semibold mb-10 text-center ${accent}`}>
          Publications
        </h2>

        <div className="relative border-l border-gray-400/30 pl-8 space-y-10">
          {publications.map((item, i) => (
            <div key={i} className="relative">
              <div className="ml-14">
                <p className={`text-sm ${accent}`}>{item.date}</p>
                <a href="https://www.nepjol.info/index.php/joeis/article/view/97808" className="hover:underline"><h3 className="text-lg font-semibold">{item.title}</h3></a>
                <ul className={`list-disc ml-5 mt-2 ${textColor} space-y-1`}>
                  {item.description.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 TECH STACK */}
      <div className="max-w-5xl w-full">
        <h2 className={`text-2xl font-semibold mb-10 text-center ${accent}`}>
          Technologies
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-2 hover:scale-110 transition"
            >
              <Image src={tech.src} alt={tech.name} width={50} height={50} />
              <span className={`text-sm ${textColor}`}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
