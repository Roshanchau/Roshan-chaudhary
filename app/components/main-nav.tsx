"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { SunMoon, Download, Menu, X } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

interface MainNavProps {
  label: string[];
}

const MainNav: React.FC<MainNavProps> = ({ label }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  const routes = label.map((route) => ({
    label: route,
  }));

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("white-bg");
    } else {
      document.documentElement.classList.remove("white-bg");
    }
  }, [theme]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <>
      {/* Desktop Nav */}
      <div
        className={cn(
          "mx-8 hidden md:flex items-center justify-between px-6 py-3 ",
        )}
      >
        {/* Left Nav Links */}
        <nav className="flex items-center space-x-12">
          {routes.map((route) => (
            <Link
              key={route.label}
              href={`/${route.label}`}
              className="text-base font-medium transition-colors hover:text-neutral-400"
            >
              {route.label}
            </Link>
          ))}

          <a
            href="../roshan_new_cv.pdf"
            className="text-base font-medium flex items-center gap-1 transition-colors hover:text-neutral-400"
          >
            Download CV <Download size={18} />
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center ml-10">
          <SunMoon
            onClick={handleToggle}
            className="cursor-pointer hover:text-neutral-400"
          />
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Hamburger */}
          {open ? (
            <X className="cursor-pointer" onClick={() => setOpen(false)} />
          ) : (
            <Menu className="cursor-pointer" onClick={() => setOpen(true)} />
          )}

          {/* Theme Toggle with spacing */}
          <SunMoon onClick={handleToggle} className="cursor-pointer ml-4" />
        </div>

        {/* Dropdown just below */}
        {open && (
          <div
            className={cn(
              "absolute right-3 w-3/5 z-50 shadow-md backdrop-blur-md",
              theme === "light"
                ? "bg-[linear-gradient(125.17deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.1)_100%)]"
                : "bg-[linear-gradient(125.17deg,rgba(39,39,39,0.5)_0%,rgba(17,16,29,0.5)_100%)] ",
            )}
          >
            <div className="flex flex-col px-6 py-6 space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.label}
                  href={`/${route.label}`}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium hover:text-neutral-400"
                >
                  {route.label}
                </Link>
              ))}

              <a
                href="../roshan_new_cv.pdf"
                className="flex items-center gap-2 text-base font-medium hover:text-neutral-400"
              >
                Download CV <Download size={18} />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainNav;
