export default function AboutSection() {
  return (
    <section
      id="About"
      className="text-white py-12 px-6 sm:px-12 lg:px-24"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white font-[Book_Antiqua]">
          About Me
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed font-[Book_Antiqua] text-justify">
          I&apos;m{" "}
          <span className="font-semibold text-blue-300">Zeeshan Charolia</span>,
          a Computer Science undergraduate at NMIMS University with a
          deep-rooted passion for building innovative digital experiences. My
          work lies at the intersection of{" "}
          <span className="font-medium text-blue-300">
            web and development,
          </span>{" "}
          and{" "}
          <span className="font-medium text-blue-300">
            software engineering
          </span>
          , where I love transforming complex ideas into real-world solutions
          that make a difference.
        </p>
        <br />
        <p className="text-lg sm:text-xl leading-relaxed font-[Book_Antiqua] text-justify">
          I thrive on challenges and bring a mindset of continuous learning,
          creativity, and precision to everything I build. Whether it&apos;s solving
          bugs or brainstorming product ideas, I approach each step with
          intention and curiosity. My goal is to lead tech-driven projects that
          enhance collaboration, streamline processes, and contribute to a
          smarter, more connected world.
        </p>
        <br />
        <p className="text-lg sm:text-xl leading-relaxed font-[Book_Antiqua] text-justify">
          Outside the world of code, I&apos;m a sports enthusiast and love exploring
          new places. These passions keep me grounded, inspired, and always
          ready to bring fresh energy into whatever I create.
        </p>
      </div>
      <span className="flex items-center mt-16 mb-2">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
      </span>
    </section>
  );
}
