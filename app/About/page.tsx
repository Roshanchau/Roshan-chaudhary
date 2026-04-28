"use client";

import Image from "next/image";
import photo from "../assets/photo.jpg";
import { useThemeStore } from "../store/useThemeStore";

const experiences = [
  {
    date: "Dec 2024 - Present",
    company: "Mitra consultancy",
    title: "Backend Developer",
    description:
      "Developed REST APIs using Node.js, Express, Prisma ORM. Worked on database design and system architecture.",
  },
];

const achievements = [
  {
    date: "2025",
    title: "Best Futuristic Implementation - IICQUEST",
    description:
      "Awarded for developing VirtualSathi, a mental health platform for students.",
  },
  {
    date: "2024",
    title: "Final Year Project",
    description:
      "Built an AI-powered personal document assistant for intelligent document handling.",
  },
];

const technologies = [
  { name: "JavaScript", src: "/tech/js.png" },
  { name: "TypeScript", src: "/tech/ts.png" },
  { name: "React", src: "/tech/react.png" },
  { name: "Next.js", src: "/tech/next.png" },
  { name: "Node.js", src: "/tech/node.png" },
  { name: "Express", src: "/tech/express.png" },
  { name: "MySQL", src: "/tech/mysql.png" },
  { name: "MongoDB", src: "/tech/mongo.png" },
  { name: "PostgresSql", src: "/tech/postgres.png" },
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
          <div className="p-2 rounded-full bg-[rgb(133,245,218)]">
            <Image
              src={photo}
              alt="profile"
              width={260}
              height={260}
              className="rounded-full"
            />
          </div>
        </div>

        {/* TEXT */}
        <div className={`space-y-4 ${textColor} order-2 md:order-1`}>
          <p>
            Hello! My name is{" "}
            <span className={`font-semibold ${accent}`}>Roshan Chaudhary</span>.
            Software engineer based in Kathmandu, Nepal. Just improving
            and learning everyday. I love playing football, hiking a mountain,
            etc.
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

                <h3 className="text-lg font-semibold text-white">
                  {exp.title}
                </h3>
                <h3 className="text-sm font-semibold text-white">
                  {exp.company}
                </h3>

                <p className="text-[rgb(118,129,158)] mt-2">
                  {exp.description}
                </p>
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
                <p className={`${textColor} mt-2`}>{item.description}</p>
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
