/* eslint-disable react/no-unescaped-entities */

"use client";
import { useEffect, useState } from "react";
import { getProjects, Project } from "../../../firebase/getProjects";
import ProjectsCard from "./ProjectsCard";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const slidesToShow = isMobile ? 1 : 3;

  // Auto-scroll functionality with smooth looping
  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          // For infinite scroll: if we reach the end, reset to start
          if (nextSlide >= projects.length) {
            // Disable transition temporarily for smooth reset
            setTimeout(() => {
              setIsTransitioning(false);
              setCurrentSlide(0);
              // Re-enable transition after reset
              setTimeout(() => {
                setIsTransitioning(true);
              }, 50);
            }, 500); // Wait for current transition to finish
            return prev; // Don't increment this time
          }
          return nextSlide;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [projects.length, isMobile]); // Keep consistent dependencies

  // Create duplicated projects for smooth infinite scroll (both mobile and desktop)
  const duplicatedProjects = [...projects, ...projects.slice(0, slidesToShow)];
  
  // Calculate max slides for indicators (only show indicators for actual starting positions)
  const maxSlideForIndicators = projects.length > slidesToShow ? projects.length - slidesToShow + 1 : 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 font-[Book_Antiqua] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Projects
          </h2>
          <div className="w-24 h-1 bg-blue-300 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Mobile: Smooth Carousel */}
        {isMobile ? (
          <div className="relative overflow-hidden">
            <div
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {duplicatedProjects.map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
                  className="w-full flex-shrink-0 px-4"
                >
                  <ProjectsCard project={project} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: Flex-based Carousel for 3 cards */
          <div className="relative overflow-hidden">
            <div
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ 
                transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
              }}
            >
              {duplicatedProjects.map((project, index) => (
                <div 
                  key={`${project.id}-${index}`} 
                  className="flex-shrink-0"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <div className="flex justify-center px-4">
                    <ProjectsCard project={project} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide indicators */}
        {projects.length > slidesToShow && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlideForIndicators }, (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-blue-300' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <span className="flex items-center mt-16 mb-2">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
      </span>
    </section>
  );
}