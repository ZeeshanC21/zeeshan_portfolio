import { Project } from "../../../firebase/getProjects";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProjectsCard({ project }: { project: Project }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleCardClick = () => {
    if (isMobile && project.githubLink) {
      window.open(project.githubLink, "_blank", "noopener noreferrer");
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.githubLink) {
      window.open(project.githubLink, "_blank", "noopener noreferrer");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative block w-full max-w-[20rem] mx-auto h-[26rem] cursor-pointer transform transition-all duration-300"
    >
      {/* Main card */}
      <div className="relative h-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden transform transition-all duration-300">
        {/* Background image */}
        {project.image && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={`/${project.image}`}
              alt={project.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
            />
          </div>
        )}

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

        {/* Content container */}
        <div className="relative h-full flex flex-col px-4 sm:px-6 py-4">
          {/* External link indicator */}
          <a
            href={project.githubLink || "#"}
            onClick={handleLinkClick}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-gray-900 rounded-full shadow-md cursor-pointer flex items-center justify-center"
            aria-label="View on GitHub"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* Spacer to push content to bottom */}
          <div className="flex-grow"></div>

          {/* Bottom content section */}
          <div className="bg-white bg-opacity-95 rounded-lg p-3 sm:p-4 group-hover:bg-opacity-100 transition-all duration-300">
            {/* Title - now at bottom */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-300 transition-colors duration-300 mb-2">
              {project.title}
            </h3>

            {/* Description - takes full available space when expanded */}
            <div className="overflow-hidden transition-all duration-500 ease-out group-hover:max-h-none">
              <div className="max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Call to action */}
            <a
              href={project.githubLink || "#"}
              onClick={handleLinkClick}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                View Project
              </span>
              <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}