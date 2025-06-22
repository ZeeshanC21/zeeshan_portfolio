"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
const educationData = [
  {
    label: "School",
    type: "School",
    name: "HANSRAJ MORARJI PUBLIC SCHOOL",
    duration: "2010-2020",
    marks: "85%",
    degree: "Secondary School Certificate",
    imgSrc: "/hansraj.jpeg",
    highlights: [
      "School Cricket Team Captain for 6 years",
      "House Captain",
      "Head Boy",
      "Representative in InterSchool Debates",
      "Representative in Military Seminars",
      "Youngest to play for Mumbai State Cricket Team",
    ],
  },
  {
    label: "College",
    type: "College",
    name: "MITHIBAI COLLEGE OF SCIENCE",
    duration: "2020-2022",
    marks: "66%",
    degree: "Higher Secondary Certificate",
    imgSrc: "/mithibai.jpg",
    highlights: ["Completely Online"],
  },
  {
    label: "University",
    type: "University",
    name: "MUKESH PATEL SCHOOL OF TECHNOLOGY AND MANAGEMENT, NMIMS",
    duration: "2022-2026",
    marks: "3.73",
    degree: "B.Tech in Computer Engineering",
    imgSrc: "/nmimsmumbai.jpeg",
    highlights: [
      "Executive - Workshops, Taqneeq 15.0",
      "Sub-Head - Workshops, Taqneeq 16.0",
      "Head - Outreach, Taqneeq 17.0",
      "Executive - ISA MPSTME Digital Creatives",
      "Captain - College Cricket Team",
    ],
  },
];

// const srcOfImages=({imgSrc}:{imgSrc:string})=>(
//     <
// );

export default function EducationSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      {isMobile ? <MobileSection /> : <DesktopSection />}
      <span className="flex items-center mt-16 mb-2">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
      </span>
    </section>
  );
}

function DesktopSection() {
  return (
    <section className="font-[Book_Antiqua] text-center text-white min-h-screen py-8 relative overflow-hidden">
      {/* Background Effects */}
      {/* Note: The group-hover effect on this div makes sense if the entire section is a "group" for some reason, but typically this would be handled within individual cards. Leaving as is based on original code outside the card structure. */}
      <div className="absolute inset-0 bg-blue-300/10 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-md -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-blue-300 bg-clip-text text-transparent">Education</h2>

        <div className="flex flex-row flex-wrap gap-8 px-4 justify-center">
          {educationData.map((item, index) => (
            <div
              key={index}
              className="group w-full max-w-[360px] bg-black/10 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 shadow-2xl hover:bg-black/90 transition-all duration-500 hover:scale-105" // Removed hover shadow classes
            >
              {/* Removed Gradient Border Effect on hover from here */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 via-black to-blue-300/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div> */}
              
              {/* Circular Image */}
              <div className="flex justify-center mb-6 relative overflow-hidden rounded-full">
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  width={220}
                  height={220}
                  className="w-[220px] h-[220px] rounded-full object-[center_35%] shadow-lg transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Type + Title + Degree */}
              <div className="mb-6">
                <span className="inline-block bg-blue-300 text-black text-lg px-4 py-2 rounded-full mb-4 border border-blue-300/50">
                  {item.type}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-blue-300 font-medium mt-2">{item.degree}</p>
              </div>

              {/* Duration + Marks */}
              {/* Adjusted classes for equal width and filling space */}
              <div className="flex justify-between gap-4 mb-6"> {/* Changed flex-row to flex and added justify-between */}
                <div className="flex items-center gap-3 bg-black/60 rounded-lg p-3 border border-gray-700 w-1/2 flex-grow"> {/* Added w-1/2 and flex-grow */}
                  <svg
                    className="w-5 h-5 text-blue-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="text-white font-medium">{item.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/60 rounded-lg p-3 border border-gray-700 w-1/2 flex-grow"> {/* Added w-1/2 and flex-grow */}
                  <svg
                    className="w-5 h-5 text-blue-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs">Score</p>
                    <p className="text-white font-medium">{item.marks}</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Highlights
                </h4>
                <div className="space-y-2">
                  {item.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function MobileSection() {
  return (
    <section className="font-[Book_Antiqua] text-center bg-black text-white min-h-screen py-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Education</h2>
      
      <div className="flex flex-col gap-8 px-4">
        {educationData.map((education, index) => (
          <div key={index} className="bg-black rounded-lg p-6 shadow-lg border border-gray-700">
            
            {/* Image at top of each card */}
            <div className="flex justify-center mb-6">
              <div className="w-80 h-80 rounded-full overflow-hidden shadow-xl border-4 border-gray-600 hover:scale-105 transition-transform duration-300">
                <Image
                  src={education.imgSrc}
                  alt={education.label}
                  width={220}
                  height={220}
                  className="w-full h-full object-cover hover:blur-[2px] transition-all duration-300"
                />
              </div>
            </div>

            {/* Header */}
            <div className="mb-4">
              <span className="inline-block bg-blue-300 text-black text-xs px-3 py-1 rounded-full mb-2">
                {education.type}
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {education.name}
              </h3>
              <p className="text-blue-300 font-medium mt-1">{education.degree}</p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="text-white font-medium">{education.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <div>
                  <p className="text-gray-400 text-xs">Score</p>
                  <p className="text-white font-medium">{education.marks}</p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Highlights
              </h4>
              <div className="space-y-2">
                {education.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
