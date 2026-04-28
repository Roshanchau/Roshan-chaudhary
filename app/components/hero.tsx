"use client";

import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { useThemeStore } from "../store/useThemeStore";

const Hero = () => {
  const { theme } = useThemeStore();

  return (
    <div className="flex-col items-center justify-center lg:text-left sm:text-center p-10 ">
      <div className="md:leading-[3.75rem] sm:leading-10 leading-14">
        <h2
          className={`font-normal md:text-xl text-sm text-[rgb(95,241,208)] mb-4 ${theme === "light" ? "text-[rgba(53,176,148,0.59)]" : ""}`}
        >
          Hi, my name is
        </h2>
        <h1
          className={`md:text-[3.75rem] sm:text-[3.125rem] text-[3.75rem] mb-3 text-[rgb(204,214,246)] ${theme === "light" ? "text-neutral-500" : ""}`}
        >
          Roshan Chaudhary
        </h1>
        <h1
          className={`md:text-[3.4375rem] text-[1.875rem] text-[rgb(136,146,176)] ${theme === "light" ? "text-[rgba(53,176,148,0.59)]" : ""}`}
        >
          Software Engineer
        </h1>
      </div>
      {/* description */}
      <p
        className={`mt-6 md:w-[800px] md:text-lg text-[1.125rem] font-medium ${
          theme === "light" ? "text-neutral-400" : "text-[rgb(118,129,158)]"
        }`}
      >
      Hey Hi👋 , Roshan Here. I love building , solving problems , figuring things out and learning something new everyday. I have experience in building scalable web applications incorporating best coding and security practices , scalable design patterns , microservices to deployment, etc.
      </p>
      <div
        className={`text-[rgb(98,189,139)] md:text-lg text-sm mt-7 text-[1.125rem] font-medium`}
      >
        Currently learning system design, distrubuted systems, k8s, etc.
      </div>

      <div
        className={`flex flex-row items-center mt-8  text-[rgb(204,214,246)] gap-3 cursor-pointer ${theme === "light" ? "text-neutral-900" : ""}`}
      >
        <p>See More About Me</p>
        <Link href={`/About`}>
          <span className="animate-move-arrow">
            <FaArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
