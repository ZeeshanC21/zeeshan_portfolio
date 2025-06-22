/* eslint-disable react/no-unescaped-entities */

import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import EducationSection from "./components/Education";
import HeroSection from "./components/HeroSection";
import MotivationBar from "./components/MotivationBar";
import NavbarSection from "./components/NavbarSection";
import ProjectsSection from "./components/ProjectsSection";
import FriendsFamily from "./components/FriendsFamily";

export default function Home() {
  return (
    <div>
      <NavbarSection />
      <section id="Home">
        <HeroSection />
      </section>
      <section className="bg-gradient-to-br from-black via-gray-900 to-black">
        <section id="About">
          <AboutSection />
        </section>
        <section>
          <EducationSection />
        </section>
        <section id="Projects">
          <ProjectsSection />
        </section>
        <section>
          <FriendsFamily />
        </section>
        <section id="Contacts">
          <ContactSection />
        </section>
      </section>
      <MotivationBar />
    </div>
  );
}
