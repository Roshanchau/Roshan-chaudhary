"use client";

import React from "react";
import ProjectCard from "../components/ui/project-card";

const Projects = () => {

  return (
<div
  className="w-full max-w-7xl mx-auto mb-4
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-4 sm:gap-6
  
  pr-2 sm:px-4 md:px-6
  py-8
  
  overflow-y-auto overflow-x-hidden
  max-h-[75vh]
  
  no-scrollbar"
>
      <ProjectCard
        title="SpeakPix"
        description="Developed a interactive mobile application for people with autism , dyslexia and learning issues to help them in social interaction and communication through image to text and text to audio.
         Used React Native as a cross-platform application in mobile as well , flask for backend , NLP for next word prediction with respective image for each word, increasing the efficiency of communication."
        url="../../autism.mp4"
        live="https://github.com/Roshanchau/autism-app"
      />

      <ProjectCard
        title="VirtualSathi (A Mental Health & Well-Being Platform for Students)"
        description="Developed the backend for VirtualSathi, a mental health and well-being platform for students.
           Implemented RESTful APIs using Node.js and Express.js, integrated MySQL with Prisma ORM, and utilized Avien services.
            Awarded Best Futuristic Implementation at IICQUEST for this project."
        url="..."
        live="github.com/Roshanchau/momo.coders_iicquest"
      />

      <ProjectCard
        title="Moviflix"
        description="Developed an interactive movie ticket booking application using React, Tailwind CSS, and Redux.
         Integrated the OMDb API to display real-time movie information, including titles, ratings, and synopses.
         Implemented state management with Redux to handle user authentication, booking details, and API calls, ensuring a seamless user experience with a responsive UI."
        url="../../movie.mp4"
        live="moviflix-gules.vercel.app"
      />

      <ProjectCard
        title="Neatflix"
        description="Developed a Netflix clone using Next.js, NEXTAuth for authentication, Prisma Schema for data modeling, MongoDB as the database, and Tailwind CSS for responsive styling. Implemented Google OAuth and GitHub authentication.
       Gained hands-on experience with Next.js routing and API integration, along with database management using Prisma Schema."
        url="../../netflix.mp4"
        live="github.com/Roshanchau/neatflix-app"
      />

      <ProjectCard
        title="AccountBook"
        description="Built an account keeper app to track customer expenses for shops and hotels using the MERN stack (MongoDB, Express.js, React, Node.js).
   Implemented features for efficient expense management and data storage."
        url="../../accountBook.mp4"
        live="github.com/Roshanchau/AccountBook"
      />
    </div>
  );
};

export default Projects;
