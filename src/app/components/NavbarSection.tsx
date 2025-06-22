/* eslint-disable react/no-unescaped-entities */

"use client";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#Home" },
  { label: "About Me", href: "#About" },
  { label :"Projects", href:"#Projects"},
  { label: "Contact Me", href: "#Contacts" },
  { label: "Get My CV", href: "/Zeeshan_Charolia_CV.pdf" }, // Update with your PDF path
];

const NavTextLink = ({ label,href,onClick }:{label:string,href:string,onClick?:()=>void}) => (
  <a 
    href={href}
    onClick={onClick}
    className="cursor-pointer text-white text-[20px] font-semibold font-[Book_Antiqua] transition-all duration-300 hover:text-blue-300 pl-15">
    {label}
  </a>
);

export default function NavbarSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu=()=>setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-black backdrop-blur-md w-full font-[Book_Antiqua] transition-all duration-300">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-center md:justify-between">
          
          {/* Desktop Navbar */}
          <nav className="hidden md:block md:mx-auto" aria-label="Global">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavTextLink label={item.label} href={item.href} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="bg-black/50 p-2 text-white rounded-md shadow-sm transition-all duration-300 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Now absolutely positioned */}
      <div
        className={`md:hidden absolute top-[60px] left-0 right-0 z-40 transition-all duration-500 ease-in-out bg-black/80 backdrop-blur-md shadow-lg ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="border-t border-neutral-700">
          <nav className="px-4 py-4">
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavTextLink label={item.label} href={item.href} onClick={closeMenu} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}