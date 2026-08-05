import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NAV_ITEMS = [
  { id: "background", label: "Background" },
  { id: "location", label: "Location" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "objectives", label: "Objectives" },
  { id: "aims", label: "Aims" },
  { id: "activities", label: "Activities" },
  { id: "values", label: "Values" },
  { id: "stories", label: "Success Stories" },
  { id: "gallery", label: "Gallery" },
];

function Section({ id, eyebrow, title, children, dark = false }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`font-body scroll-mt-20 px-6 py-20 md:px-16 ${
        dark ? "bg-[#240C02] text-[#FFDDAC]" : "bg-[#2F0F03] text-[#FFDDAC]"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display mb-8 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <div className="space-y-4 leading-relaxed opacity-90">{children}</div>
      </div>
    </section>
  );
}

function SuccessStories({ id = "stories", eyebrow = "Impact", title = "Graduate Stories", stories = [] }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const cards = sectionRef.current.querySelectorAll(".story-card");

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: sectionRef, dependencies: [stories.length] }
  );

  return (
    <section id={id} ref={sectionRef} className="bg-[#2F0F03] font-body scroll-mt-20 px-6 py-20 text-[#FFDDAC] md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
        <h2 className="font-display mb-12 text-3xl font-semibold md:text-4xl">{title}</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, i) => (
            <div
              key={i}
              className="story-card flex flex-col overflow-hidden rounded-2xl bg-[#240c02] shadow-xl ring-1 ring-[#FAAA48]/20 transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FAAA48]">{story.degree}</p>
                <h3 className="font-display my-1 text-xl font-bold">{story.name}</h3>
                <p className="mb-4 text-xs opacity-60">Graduated {story.year}</p>
                <p className="text-sm leading-relaxed opacity-80">{story.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ id = "gallery", images = [] }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const cards = sectionRef.current.querySelectorAll(".gallery-card");

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: sectionRef, dependencies: [images.length] }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="bg-[#240C02] font-body scroll-mt-20 px-6 py-20 text-[#FFDDAC] md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">
          Life at St. Benedict's
        </p>
        <h2 className="font-display mb-12 text-3xl font-semibold md:text-4xl">
          Gallery
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery-card group relative h-72 overflow-hidden rounded-2xl bg-[#2F0F03] shadow-lg ring-1 ring-[#FAAA48]/10"
            >
              <img
                src={img.src}
                alt={img.caption || `Gallery photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#240C02]/90 via-[#240C02]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {img.caption && (
                <p className="font-display absolute bottom-0 left-0 right-0 p-5 text-sm font-medium text-[#FFDDAC] opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CompanySite() {
  const [activeSection, setActiveSection] = useState("background");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#240C02] text-[#FFDDAC]">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#FAAA48]/10 bg-[#240C02]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-bold tracking-wide text-[#FAAA48]">
            St. Benedict's
          </span>
          <nav className="hidden space-x-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-[#FAAA48] text-[#240C02]"
                    : "text-[#FFDDAC]/70 hover:text-[#FFDDAC]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative flex min-h-[60vh] items-center justify-center bg-[#2F0F03] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FAAA48]">
            Empowering Youth • Transforming Lives
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#FFDDAC] md:text-6xl">
            St. Benedict's Children's Rehabilitation Centre
          </h1>
          <p className="text-lg leading-relaxed text-[#FFDDAC]/80">
            Providing care, education, and hope to street-connected children in Mathare, Nairobi.
          </p>
        </div>
      </div>

      {/* Sections */}
      <Section id="background" eyebrow="Our Beginnings" title="Background">
        <p>
          St. Benedict's Children's Rehabilitation Centre was established to address the critical needs of street children in Mathare, Nairobi.
        </p>
      </Section>

      <Section id="location" eyebrow="Where We Work" title="Location" dark>
        <p>
          Located in the heart of Mathare, Nairobi, Kenya, our center serves as a safe haven and resource center for vulnerable youth.
        </p>
      </Section>

      <Section id="vision" eyebrow="Looking Ahead" title="Vision">
        <p>
          A society where every child enjoys their rights, accesses quality education, and thrives in a safe, loving environment.
        </p>
      </Section>

      <Section id="mission" eyebrow="Our Purpose" title="Mission" dark>
        <p>
          To rehabilitate, educate, and empower street-connected children through holistic care, skill development, and community reintegration.
        </p>
      </Section>

      <Section id="objectives" eyebrow="Our Goals" title="Objectives">
        <p>
          Provide shelter, nutritional support, medical care, and psycho-social therapy to rehabilitation program beneficiaries.
        </p>
      </Section>

      <Section id="aims" eyebrow="Core Intentions" title="Aims" dark>
        <p>
          Facilitate family reunification, access to formal education, and vocational training opportunities for former street youth.
        </p>
      </Section>

      <Section id="activities" eyebrow="What We Do" title="Activities">
        <p>
          Outreach programs, counseling, formal school sponsorship, life skills workshops, and community sensitization campaigns.
        </p>
      </Section>

      <Section id="values" eyebrow="Guided By" title="Values" dark>
        <p>
          Compassion, Integrity, Respect, Empowerment, and Community Collaboration.
        </p>
      </Section>

      {/* Success Stories Section */}
      <SuccessStories
        id="stories"
        eyebrow="Transforming Lives"
        title="Our University Graduates"
        stories={[
          {
            name: "John Mwangi",
            degree: "BSc in Computer Science",
            year: "2024",
            image: "/graduate_1.jpeg",
            quote:
              "Through the support and mentorship at St. Benedict's, I was able to transition from the streets of Mathare to graduating with a degree in tech.",
          },
          {
            name: "Peter Otieno",
            degree: "Bachelor of Commerce",
            year: "2023",
            image: "/graduate_2.jpeg",
            quote:
              "The foundation and guidance provided by the programme gave me the confidence and resources to pursue higher education and build a career.",
          },
          {
            name: "Joseph Kamau",
            degree: "Diploma in Education",
            year: "2025",
            image: "/graduate_3.jpeg",
            quote:
              "St. Benedict's didn't just give me shelter and food—it gave me a future. Now I am empowered to give back to my community as a teacher.",
          },
        ]}
      />

      {/* Gallery Section */}
      <Gallery
        id="gallery"
        images={[
          { src: "/photo1.jpeg", caption: "Community outreach program" },
          { src: "/photo2.jpeg", caption: "Classroom learning session" },
          { src: "/photo3.jpeg", caption: "Recreational activities" },
        ]}
      />

      {/* Footer */}
      <footer className="border-t border-[#FAAA48]/10 bg-[#240C02] px-6 py-12 text-center text-xs text-[#FFDDAC]/60">
        <p>© {new Date().getFullYear()} St. Benedict's Rehabilitation Centre. All rights reserved.</p>
      </footer>
    </div>
  );
}
