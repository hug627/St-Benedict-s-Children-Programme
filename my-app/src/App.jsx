import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useAuth } from "./AuthContextValue.js";
import { useTheme } from "./ThemeContextValue.js";
import "./App.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

// ============================================================
// Two distinct palettes. Dark mode is NOT the light palette's
// "dark" tone reused — it has its own colors, tuned for a
// near-black background rather than the warm brown/peach look.
// ============================================================
const LIGHT_PALETTE = {
  bgPrimary: "#2F0F03", // "dark" toned sections, header, hero, footer
  bgSecondary: "#FFDDAC", // "light" toned sections
  textOnPrimary: "#FFDDAC",
  textOnSecondary: "#2F0F03",
  accent: "#FAAA48",
};

const DARK_PALETTE = {
  bgPrimary: "#111015", // near-black
  bgSecondary: "#1C1A22", // slightly lighter charcoal, for section rhythm
  textOnPrimary: "#F4EFE8", // warm ivory, used on both bg tones in dark mode
  textOnSecondary: "#F4EFE8",
  accent: "#FFB454", // brighter amber, tuned to pop against near-black
};

const NAV_ITEMS = [
  { id: "background", label: "Background" },
  { id: "location", label: "Location" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "objectives", label: "Objectives" },
  { id: "aims", label: "Aims" },
  { id: "activities", label: "Activities" },
  { id: "values", label: "Values" },
  { id: "gallery", label: "Gallery" },
];

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
  .font-display { font-family: 'Fraunces', serif; }
  .font-body { font-family: 'Inter', sans-serif; }
`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Plain inline SVG icons — used instead of emoji/unicode symbols (☰, ✕, ☀️,
// 🌙) since those can render as blank "tofu" boxes on some mobile browsers
// depending on the device's installed font/emoji set. SVGs render
// identically everywhere.
function MenuIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

function SunIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
      <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
    </svg>
  );
}

function MoonIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </svg>
  );
}

/**
 * Section — each one gets its own entrance "personality" via the `direction`
 * prop ("up" | "left" | "right" | "scale"), plus a per-word title reveal
 * using SplitText and a scroll-synced reveal using ScrollTrigger.
 * `listStagger` (for Activities/Values) staggers each <li> individually
 * instead of revealing the list as one block.
 *
 * Colors come from the active palette (light or dark mode) via inline
 * style, based on `tone` ("dark" → bgPrimary, "light" → bgSecondary).
 * Pass a custom `bgColor` (and optional `textColor`) to override with any
 * one-off hex value instead, regardless of theme.
 */
function Section({
  id,
  eyebrow,
  title,
  children,
  tone = "light",
  direction = "up",
  listStagger = false,
  bgColor,
  textColor,
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const { darkMode } = useTheme();
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;

  const sectionStyle = bgColor
    ? { backgroundColor: bgColor, color: textColor || palette.textOnPrimary }
    : tone === "dark"
    ? { backgroundColor: palette.bgPrimary, color: palette.textOnPrimary }
    : { backgroundColor: palette.bgSecondary, color: palette.textOnSecondary };

  const offsetFor = (dir) => {
    switch (dir) {
      case "left":
        return { x: -60, y: 0 };
      case "right":
        return { x: 60, y: 0 };
      case "scale":
        return { x: 0, y: 20, scale: 0.9 };
      default:
        return { x: 0, y: 40 };
    }
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(sectionRef.current.querySelectorAll(".animate-in, .animate-in li"), {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      const offset = offsetFor(direction);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.from(sectionRef.current.querySelector(".eyebrow-el"), {
        opacity: 0,
        x: offset.x * 0.4,
        duration: 0.5,
        ease: "power2.out",
      });

      let split;
      if (titleRef.current) {
        split = SplitText.create(titleRef.current, { type: "words", mask: "words" });
        tl.from(
          split.words,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      const bodyTargets = listStagger
        ? sectionRef.current.querySelectorAll(".animate-in li")
        : sectionRef.current.querySelectorAll(".animate-in");

      tl.from(
        bodyTargets,
        {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: offset.scale || 1,
          duration: 0.7,
          stagger: listStagger ? 0.08 : 0.12,
          ease: "power2.out",
        },
        "-=0.3"
      );

      return () => {
        if (split) split.revert();
      };
    },
    { scope: sectionRef, dependencies: [direction, listStagger, darkMode] }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="font-body scroll-mt-20 px-6 py-20 transition-colors duration-300 md:px-16"
      style={sectionStyle}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="eyebrow-el mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: palette.accent }}
        >
          {eyebrow}
        </p>
        <h2 ref={titleRef} className="font-display mb-6 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <div className="animate-in space-y-4 text-base leading-relaxed opacity-90 md:text-lg">{children}</div>
      </div>
    </section>
  );
}

/**
 * Gallery — a grid of photos that each spin in as you scroll to them.
 * Pass an array of { src, alt } objects. Put actual image files in your
 * project's public/ folder and reference them here as "/your-file.jpg".
 */
function Gallery({ id = "gallery", eyebrow = "A glimpse", title = "Gallery", tone = "light", images = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const { darkMode } = useTheme();
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;
  const sectionStyle =
    tone === "dark"
      ? { backgroundColor: palette.bgPrimary, color: palette.textOnPrimary }
      : { backgroundColor: palette.bgSecondary, color: palette.textOnSecondary };

  useGSAP(
    () => {
      const imgs = sectionRef.current.querySelectorAll(".gallery-img");

      if (prefersReducedMotion()) {
        gsap.set(imgs, { opacity: 1, rotation: 0, scale: 1 });
        return;
      }

      gsap.from(imgs, {
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -180 : 180),
        scale: 0.5,
        duration: 0.9,
        stagger: 0.15,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: sectionRef, dependencies: [images.length, darkMode] }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="font-body scroll-mt-20 px-6 py-20 transition-colors duration-300 md:px-16"
      style={sectionStyle}
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>
          {eyebrow}
        </p>
        <h2 ref={titleRef} className="font-display mb-10 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {images.map((img, i) => (
            <div key={i} className="gallery-img aspect-square overflow-hidden rounded-2xl shadow-lg">
              <img src={img.src} alt={img.alt || ""} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CompanySite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(heroRef.current.children, { opacity: 1, y: 0 });
        return;
      }

      const split = SplitText.create(heroTitleRef.current, { type: "words,chars", mask: "words" });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(split.chars, {
        opacity: 0,
        y: 40,
        rotateX: -40,
        duration: 0.7,
        stagger: 0.015,
        ease: "power3.out",
        onComplete: () => split.revert(),
      }).from(
        [...heroRef.current.children].filter((el) => el !== heroTitleRef.current),
        {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.3"
      );

      return () => split.revert();
    },
    { scope: heroRef }
  );

  const scrollTo = (id) => {
    setMenuOpen(false);

    if (prefersReducedMotion()) {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
      return;
    }

    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${id}`, offsetY: 70 },
      ease: "power2.inOut",
    });
  };

  return (
    <div className="font-body overflow-x-hidden transition-colors duration-300" style={{ backgroundColor: palette.bgSecondary }}>
      <style>{FONT_IMPORT}</style>

      {/* Nav */}
      <header
        className="fixed top-0 z-50 w-full transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? `${palette.bgPrimary}F2` : "transparent",
          backdropFilter: scrolled ? "blur(6px)" : "none",
          boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <button
            onClick={() => scrollTo("home")}
            className="font-display shrink-0 text-base font-semibold md:text-lg"
            style={{ color: palette.textOnPrimary }}
          >
            St Benedict's Children Programme
          </button>

          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden shrink-0 rounded-full p-2 text-lg transition-transform hover:scale-110 md:block"
          >
            {darkMode ? <SunIcon color={palette.textOnPrimary} /> : <MoonIcon color={palette.textOnPrimary} />}
          </button>

          {/* Desktop nav: single "Menu" dropdown instead of a long row of links */}
          <div ref={desktopMenuRef} className="relative hidden shrink-0 md:block">
            <button
              onClick={() => setDesktopMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={desktopMenuOpen}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: palette.textOnPrimary }}
            >
              Menu
              <span className={`inline-block transition-transform duration-200 ${desktopMenuOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {desktopMenuOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl shadow-xl ring-1"
                style={{ backgroundColor: palette.bgPrimary, "--tw-ring-color": `${palette.accent}33` }}
              >
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollTo(item.id);
                      setDesktopMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: palette.textOnPrimary }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div ref={accountMenuRef} className="relative hidden shrink-0 md:block">
              <button
                onClick={() => setAccountMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
                aria-label={`Account menu for ${user.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-transform hover:scale-105"
                style={{ backgroundColor: palette.accent, color: palette.bgPrimary }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl shadow-xl ring-1"
                  style={{ backgroundColor: palette.bgPrimary, "--tw-ring-color": `${palette.accent}33` }}
                >
                  <div
                    className="border-b px-4 py-3"
                    style={{ borderColor: `${palette.accent}33` }}
                  >
                    <p className="truncate text-sm font-semibold" style={{ color: palette.textOnPrimary }}>
                      {user.name}
                    </p>
                    <p className="truncate text-xs opacity-60" style={{ color: palette.textOnPrimary }}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: palette.textOnPrimary }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="hidden shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:scale-105 md:block"
              style={{ backgroundColor: palette.accent, color: palette.bgPrimary }}
            >
              Log In
            </button>
          )}

          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            style={{ color: palette.textOnPrimary }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          style={{ backgroundColor: palette.bgPrimary }}
        >
          <div className="flex flex-col gap-1 overflow-hidden px-6 pb-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="py-2 text-left text-sm font-medium transition-colors"
                style={{ color: palette.textOnPrimary }}
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 border-t pt-2" style={{ borderColor: `${palette.accent}33` }}>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 py-2 text-left text-sm font-medium"
                style={{ color: palette.textOnPrimary }}
              >
                <span className="flex items-center">
                  {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                </span>
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
              {user ? (
                <>
                  <p className="truncate py-1 text-xs opacity-60" style={{ color: palette.textOnPrimary }}>
                    {user.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-sm font-medium"
                    style={{ color: palette.textOnPrimary }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="mt-1 w-fit rounded-full px-5 py-2 text-sm font-semibold"
                  style={{ backgroundColor: palette.accent, color: palette.bgPrimary }}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="hero-bg relative flex min-h-screen flex-col justify-center px-6 pt-24 md:px-16"
        style={{ color: palette.textOnPrimary }}
      >
        <div className="relative" ref={heroRef}>
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: palette.accent }}
          >
            Welcome
          </p>
          <h1 ref={heroTitleRef} className="font-display max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            St Benedict's Children Programme
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg opacity-80">
            A one-line description of what the company does goes here — replace with your real tagline.
          </p>
          <button
            onClick={() => scrollTo("background")}
            className="mt-10 w-fit rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: palette.accent, color: palette.bgPrimary }}
          >
            Learn more
          </button>
        </div>
      </section>

      <Section id="background" eyebrow="Who we are" title="Historical Background" tone="light" direction="up">
        <p>
          St.Benedict's children programme is brain child of Kolping family and St.Benedict's Catholic Parish Ruaraka.
          The concept of it's formation can be traced back to 1993. During that year a group of foresighted individuals led by
          Fr.Klaus Braunreter OSB who was by then parish priest of St.Benedict's Nairobi, came up with an idea to form an
          initiative to assist under-privileged children and young persons.
        </p>
        <p>
          A survey from the government shows that there are about 100,000 street children in Nairobi where at least 30% live
          in Mathare and its adjacent slums. A big area of these slums is under jurisdiction of St.Benedict's parish.
          Care and protection for the child has been one of the integral parts that raised world concern through various UN
          conventions on the other side ordinary sessional assemblies to discuss how to address children's needs.
          Implementation of all conventions are done through various organizations working for these children — St.Benedict's
          children programme has been a tool of such implementation for years either directly or indirectly.
        </p>
      </Section>

      <Section id="location" eyebrow="Where we are" title="Location" tone="dark" direction="left">
        <p>
          St Benedict's children center is located at Mathare North Area 2, Near the Mathare North, Nairobi City Council
          Social Hall.
        </p>
      </Section>

      <Section id="vision" eyebrow="Looking ahead" title="Vision Statement" tone="light" direction="scale">
        <p>A stable, responsible and morally upright child in the society.</p>
      </Section>

      <Section id="mission" eyebrow="Why we exist" title="Mission Statement" tone="dark" direction="right">
        <p>
          St.Benedict's Children Programme is a church based initiative that provides a strong foundation for the children
          within the context of the family and community to education become self reliant and responsible by involving the
          family and the community in providing basic needs i.e:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Education</li>
          <li>Self-reliance</li>
          <li>Health Care</li>
        </ul>
      </Section>

      <Section id="objectives" eyebrow="What we're working toward" title="Programme Objectives" tone="light" direction="left">
        <p>
          To provide a basis for new life for street children and other under privileged children, a healthy home,
          parental care, schooling, food and primary health care (etc).
        </p>
      </Section>

      <Section id="aims" eyebrow="What we're reaching for" title="Aims And Objectives of the SBCD" tone="dark" direction="right">
        <p>
          St.Benedict's children programme is a church based initiative that provides a strong foundation for children
          within context of the family and the community to become responsible and self reliant.
        </p>
      </Section>

      <Section id="activities" eyebrow="What we do" title="Activities" tone="light" direction="up" listStagger>
        <ul className="list-disc space-y-2 pl-5">
          <li>Making contact with and recruiting children</li>
          <li>Day care center and non formal primary education</li>
          <li>Recreational (Art, Music, Sports, Story telling and Poems)</li>
          <li>Counselling and instilling</li>
          <li>Christian Morals and values integration of the children with their family and the community</li>
          <li>Aiding the family in placing their children into educational institution or vocational outreach</li>
          <li>Home visits, school visit and follow-ups</li>
          <li>Medical Care</li>
          <li>Provision of family life education in both families and schools</li>
          <li>Workshops & children trainings</li>
          <li>Parents meeting & empowerment</li>
          <li>Feeding Programme</li>
          <li>Street work children recruitment</li>
          <li>Library literacy activity serving the entire mathare slum community for free</li>
          <li>
            Street children rehabilitation re-integration & school sponsorship from Primary school, High school,
            Vocational training and University level
          </li>
          <li>Community Services</li>
        </ul>
      </Section>

      <Section id="values" eyebrow="What we believe in" title="Core Values" tone="dark" direction="left" listStagger>
        <ul className="list-disc space-y-3 pl-5">
          {[
            "Moral Values",
            "Mutual Understanding",
            "Humanity",
            "Accountability & Transparency",
            "Teamwork",
            "Sustainability",
            "Love",
            "Integrity",
            "Spiritual Teachings",
            "Communication",
            "Respect",
          ].map((value) => (
            <li key={value} className="text-base font-medium md:text-lg">
              {value}
            </li>
          ))}
        </ul>
      </Section>

      <Gallery
        id="gallery"
        eyebrow="A glimpse"
        title="Gallery"
        tone="light"
        images={[
          { src: "/image1.jpg", alt: "Programme photo 1" },
          { src: "/image2.jpg", alt: "Programme photo 2" },
          { src: "/image3.jpg", alt: "Programme photo 3" },
          { src: "/image4.jpg", alt: "Programme photo 4" },
          { src: "/image5.jpg", alt: "Programme photo 5" },
          { src: "/image6.jpg", alt: "Programme photo 6" },
        ]}
      />

      <footer
        className="px-6 py-10 transition-colors duration-300 md:px-16"
        style={{ backgroundColor: palette.bgPrimary, color: palette.textOnPrimary }}
      >
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>
              Get in touch
            </p>
            <p className="text-sm">
              <a href="mailto:st.benedict.c.p@gmail.com" className="hover:opacity-80">
                st.benedict.c.p@gmail.com
              </a>
            </p>
            <p className="text-sm">
              <a href="mailto:vincentonsongo72@gmail.com" className="hover:opacity-80">
                vincentonsongo72@gmail.com
              </a>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>
              Support the programme
            </p>
            <p className="text-sm"> Mpesa Paybill: 303030</p>
            <p className="text-sm">Bank Account: 0671410505</p>
          </div>

          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} St Benedict's Children Programme. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
