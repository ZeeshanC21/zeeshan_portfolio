"use client"
import NavbarSection from "./NavbarSection";
import { useState, useEffect } from "react";
export default function HeroSection() {

  const [timeOfDay,setTimeOfDay]=useState("");

  useEffect(()=>{
    const hour=new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay("afternoon");
    } else if (hour >= 17 && hour < 22) {
      setTimeOfDay("evening");
    } else {
      setTimeOfDay("night");
    }
  }, []);

  return (
    <section className="relative h-screen" id="Home">
      {/* <NavbarSection /> */}
      <img
        src="/zeeee.jpg"
        alt="Zeeshan Charolia"
        className="absolute inset-0 object-cover object-[center_35%] w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Block - Responsive positioning */}
      <div className="absolute inset-0 flex items-end justify-center md:justify-start px-8 md:px-20 pb-40 md:pb-40">
        <div className="bg-black/50 text-white p-6 rounded-xl shadow-lg max-w-md md:ml-8 md:mb-8 mb-0">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight font-[Book_Antiqua] text-center">
            Good {timeOfDay} !<br></br>
            Hope you are doing good :)
          </h1>
        </div>
      </div>
    </section>
  );
}