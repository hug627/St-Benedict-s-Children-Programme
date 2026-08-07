import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useAuth } from "./AuthContextValue.js";
import "./App.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const NAV_ITEMS = [
  { id: "background", label: "Background" },
  { id: "location", label: "Location" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "objectives", label: "Objectives" },
  { id: "aims", label: "Aims" },
  { id: "activities", label: "Activities" },
  { id: "values", label: "Values" },
  { id: "stories", label: "Stories" },
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
  image,
  images,
  imagePosition = "right",
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const imgRef = useRef(null);
  const bg = tone === "dark" ? "bg-[#2F0F03] text-[#FFDDAC]" : "bg-[#FFDDAC] text-[#2F0F03]";
  const customStyle = bgColor ? { backgroundColor: bgColor, color: textColor || "#FFDDAC" } : undefined;

  const activePosition = image?.position || imagePosition;
  const imageList = images || (image ? [image] : []);

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
        gsap.set(sectionRef.current.querySelectorAll(".animate-in, .animate-in li, .section-img-item"), {
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

      const imgTargets = sectionRef.current.querySelectorAll(".section-img-item");
      if (imgTargets.length > 0) {
        tl.from(
          imgTargets,
          {
            opacity: 0,
            scale: 0.85,
            x: activePosition === "right" ? 30 : -30,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        );
      }

      return () => {
        if (split) split.revert();
      };
    },
    { scope: sectionRef, dependencies: [direction, listStagger, activePosition, imageList.length] }
  );

  const hasImages = imageList.length > 0;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${customStyle ? "" : bg} font-body scroll-mt-20 px-6 py-20 md:px-16`}
      style={customStyle}
    >
      <div className={`mx-auto max-w-6xl ${hasImages ? "grid items-start gap-8 md:grid-cols-2 md:gap-12" : "max-w-3xl"}`}>
        <div className={hasImages && activePosition === "left" ? "md:order-2" : "md:order-1"}>
          <p className="eyebrow-el mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">
            {eyebrow}
          </p>
          <h2 ref={titleRef} className="font-display mb-6 text-3xl font-semibold md:text-4xl">
            {title}
          </h2>
          <div className="animate-in space-y-4 text-base leading-relaxed opacity-90 md:text-lg">{children}</div>
        </div>

        {hasImages && (
          <div
            className={`w-full max-w-md justify-self-center ${activePosition === "left" ? "md:order-1" : "md:order-2"}`}
            ref={imgRef}
          >
            {imageList.length === 1 ? (
              <div className="section-img-item overflow-hidden rounded-xl shadow-lg ring-1 ring-[#FAAA48]/20">
                <img
                  src={imageList[0].src}
                  alt={imageList[0].alt || ""}
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-60 md:h-72"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    className={`section-img-item overflow-hidden rounded-xl shadow-md ring-1 ring-[#FAAA48]/20 ${
                      imageList.length % 2 !== 0 && idx === imageList.length - 1 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || ""}
                      className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-36"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Stories — a grid of individual success-story cards, each with a photo,
 * name, achievement line, and a short paragraph. Pass an array of
 * { photo, name, achievement, story }.
 */
function Stories({ id = "stories", eyebrow = "Real impact", title = "Success Stories", tone = "dark", people = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bg = tone === "dark" ? "bg-[#2F0F03] text-[#FFDDAC]" : "bg-[#FFDDAC] text-[#2F0F03]";

  useGSAP(
    () => {
      const cards = sectionRef.current.querySelectorAll(".story-card");

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      let split;
      if (titleRef.current) {
        split = SplitText.create(titleRef.current, { type: "words", mask: "words" });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse",
        },
      });

      if (split) {
        tl.from(split.words, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
        });
      }

      tl.from(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.2"
      );

      return () => {
        if (split) split.revert();
      };
    },
    { scope: sectionRef, dependencies: [people.length] }
  );

  return (
    <section id={id} ref={sectionRef} className={`${bg} font-body scroll-mt-20 px-6 py-20 md:px-16`}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
        <h2 ref={titleRef} className="font-display mb-4 max-w-2xl text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <p className="mb-12 max-w-2xl text-base opacity-80 md:text-lg">
          Three young people who grew up in our programme and went on to graduate from university.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person, i) => (
            <div
              key={i}
              className="story-card overflow-hidden rounded-2xl bg-black/10 shadow-lg ring-1 ring-[#FAAA48]/20"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{person.name}</h3>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#FAAA48]">
                  {person.achievement}
                </p>
                <p className="text-sm leading-relaxed opacity-90">{person.story}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ id = "gallery", eyebrow = "A glimpse", title = "Gallery", tone = "light", images = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bg = tone === "dark" ? "bg-[#2F0F03] text-[#FFDDAC]" : "bg-[#FFDDAC] text-[#2F0F03]";

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
    { scope: sectionRef, dependencies: [images.length] }
  );

  return (
    <section id={id} ref={sectionRef} className={`${bg} font-body scroll-mt-20 px-6 py-20 md:px-16`}>
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
        <h2 ref={titleRef} className="font-display mb-10 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {images.map((img, i) => (
            <div key={i} className="gallery-img aspect-square overflow-hidden rounded-xl shadow-md">
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
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    <div className="font-body overflow-x-hidden">
      <style>{FONT_IMPORT}</style>

      {/* Top Banner for Quick Contact Info */}
      <div className="bg-[#240c02] px-4 py-1.5 text-xs text-[#FFDDAC] sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-[#FAAA48]">Get in touch </span>
            <span>
              📧 <a href="mailto:st.benedict.c.p@gmail.com" className="hover:text-[#FAAA48]">st.benedict.c.p@gmail.com</a>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              <a href="mailto:vincentonsongo72@gmail.com" className="hover:text-[#FAAA48]">vincentonsongo72@gmail.com</a>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? "bg-[#2F0F03]/95 backdrop-blur shadow-md" : "bg-[#2F0F03]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
          <button
            onClick={() => scrollTo("home")}
            className="font-display shrink-0 truncate text-sm font-semibold text-[#FFDDAC] sm:text-base md:text-lg"
          >
            St Benedict's Children Programme
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDonateModalOpen(true)}
              className="rounded-full bg-[#FAAA48] px-4 py-1.5 text-xs font-bold text-[#2F0F03] transition-transform hover:scale-105 sm:text-sm"
            >
              Donate Now
            </button>

            <div ref={desktopMenuRef} className="relative hidden shrink-0 md:block">
              <button
                onClick={() => setDesktopMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={desktopMenuOpen}
                className="flex items-center gap-1.5 text-sm font-medium text-[#FFDDAC] transition-colors hover:text-[#FAAA48]"
              >
                Menu
                <span className={`inline-block transition-transform duration-200 ${desktopMenuOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {desktopMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl bg-[#2F0F03] shadow-xl ring-1 ring-[#FAAA48]/20">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollTo(item.id);
                        setDesktopMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#FFDDAC] transition-colors hover:bg-[#FAAA48]/10 hover:text-[#FAAA48]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAAA48] text-sm font-semibold text-[#2F0F03] transition-transform hover:scale-105"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl bg-[#2F0F03] shadow-xl ring-1 ring-[#FAAA48]/20">
                    <div className="border-b border-[#FAAA48]/20 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[#FFDDAC]">{user.name}</p>
                      <p className="truncate text-xs text-[#FFDDAC]/60">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#FFDDAC] transition-colors hover:bg-[#FAAA48]/10 hover:text-[#FAAA48]"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="hidden shrink-0 rounded-full border border-[#FAAA48] px-5 py-1.5 text-sm font-semibold text-[#FAAA48] transition-all hover:bg-[#FAAA48] hover:text-[#2F0F03] md:block"
              >
                Log In
              </button>
            )}

            <button
              className="flex shrink-0 items-center justify-center text-[#FFDDAC] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          className={`grid overflow-hidden bg-[#2F0F03] transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto overflow-x-hidden px-6 pb-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="py-2 text-left text-sm font-medium text-[#FFDDAC] hover:text-[#FAAA48]"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 border-t border-[#FAAA48]/20 pt-2">
              {user ? (
                <>
                  <p className="truncate py-1 text-xs text-[#FFDDAC]/60">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-sm font-medium text-[#FFDDAC] hover:text-[#FAAA48]"
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
                  className="mt-1 w-fit rounded-full border border-[#FAAA48] px-5 py-1.5 text-sm font-semibold text-[#FAAA48]"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Donation Details Modal */}
      {donateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#2F0F03] p-6 text-[#FFDDAC] shadow-2xl ring-1 ring-[#FAAA48]/30">
            <button
              onClick={() => setDonateModalOpen(false)}
              className="absolute right-4 top-4 text-[#FFDDAC] hover:text-[#FAAA48]"
            >
              <CloseIcon />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">Make a Difference</p>
            <h3 className="font-display my-2 text-2xl font-bold">Support Our Programme</h3>
            <p className="mb-6 text-sm opacity-80">
              Your contribution helps provide basic needs, education, and shelter to street children in Mathare.
            </p>

            <div className="space-y-4 rounded-xl bg-[#240c02] p-4 text-left">
              <div>
                <p className="text-xs font-medium uppercase text-[#FAAA48]">Mpesa Paybill</p>
                <p className="text-lg font-bold">303030</p>
              </div>
              <div className="border-t border-[#FAAA48]/20 pt-3">
                <p className="text-xs font-medium uppercase text-[#FAAA48]">ABSA Bank Account</p>
                <p className="text-lg font-bold">0671410505</p>
              </div>
            </div>

            <button
              onClick={() => setDonateModalOpen(false)}
              className="mt-6 w-full rounded-full bg-[#FAAA48] py-2.5 text-sm font-bold text-[#2F0F03]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        id="home"
        className="hero-bg relative flex min-h-screen flex-col justify-center px-4 pt-24 text-[#FFDDAC] sm:px-6 md:px-16"
      >
        <div className="relative" ref={heroRef}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#FAAA48]">Welcome</p>
          <h1 ref={heroTitleRef} className="font-display max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
            St Benedict's Children Programme
          </h1>
          <p className="mt-6 max-w-xl font-body text-base opacity-80 sm:text-lg">
            It's a boy street children rehabilitation center
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("background")}
              className="rounded-full bg-[#FAAA48] px-6 py-3 text-sm font-semibold text-[#2F0F03] transition-transform hover:scale-105"
            >
              Learn more
            </button>
            <button
              onClick={() => setDonateModalOpen(true)}
              className="rounded-full border-2 border-[#FAAA48] px-6 py-3 text-sm font-semibold text-[#FAAA48] transition-transform hover:scale-105"
            >
              Support Us
            </button>
          </div>
        </div>
      </section>

      {/* Historical Background */}
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

      {/* Location */}
      <Section id="location" eyebrow="Where we are" title="Location" tone="dark" direction="left">
        <p>
          St Benedict's children center is located at Mathare North Area 2, Near the Mathare North Primary School/Mathare North Market
        </p>
      </Section>

      {/* Vision Statement */}
      <Section
        id="vision"
        eyebrow="Looking ahead"
        title="Vision Statement"
        tone="light"
        direction="scale"
        image={{ src: "/img__2261.jpeg", alt: "Vision image", position: "left" }}
      >
        <p>A stable, responsible and morally upright child in the society.</p>
      </Section>

      {/* Mission Statement */}
      <Section
        id="mission"
        eyebrow="Why we exist"
        title="Mission Statement"
        tone="dark"
        direction="right"
        image={{ src: "/img.jpeg", alt: "Mission image", position: "right" }}
      >
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

      {/* Programme Objectives */}
      <Section
        id="objectives"
        eyebrow="What we're working toward"
        title="Programme Objectives"
        tone="light"
        direction="left"
        image={{ src: "/img_2379.jpeg", alt: "Objectives image", position: "left" }}
      >
        <p>
          To provide a basis for new life for street children and other under privileged children, a healthy home,
          parental care, schooling, food and primary health care (etc).
        </p>
      </Section>

      {/* Aims and Objectives */}
      <Section
        id="aims"
        eyebrow="What we're reaching for"
        title="Aims And Objectives of the St.Benedict's Children Centre (SBCC)"
        tone="dark"
        direction="right"
        image={{ src: "/img_2381.jpeg", alt: "Aims image", position: "right" }}
      >
        <p>
          St.Benedict's children programme is a church based initiative that provides a strong foundation for children
          within context of the family and the community to become responsible and self reliant.
        </p>
      </Section>

      {/* Activities */}
      <Section
        id="activities"
        eyebrow="What we do"
        title="Activities"
        tone="light"
        direction="up"
        listStagger
        imagePosition="left"
        images={[
          { src: "/img_1.jpeg", alt: "Activity photo 1" },
          { src: "/img_2.jpeg", alt: "Activity photo 2" },
          { src: "/img_3.jpeg", alt: "Activity photo 3" },
          { src: "/img_4.jpeg", alt: "Activity photo 4" },
          { src: "/img_5.jpeg", alt: "Activity photo 5" },
          { src: "/img_12.jpeg", alt: "Activity photo 6" },
          { src: "/img_11.jpeg", alt: "Activity photo 7" },
          
        ]}
      >
        <ul className="list-disc space-y-2 pl-5">
          <li>Making contact with children families, referral process and recruiting children</li>
          <li>Day care center and non formal primary education</li>
          <li>Recreational (Art, Music, Sports, Story telling and Poems)</li>
          <li>Counselling and guidance </li>
          <li>Christian Morals and values integration of the children with their family and the community</li>
          <li>Aiding the family in placing their children into educational institution or vocational outreach</li>
          <li>Home visits, school visit and follow-ups</li>
          <li>Medical Care</li>
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

      {/* Core Values - Pill Style */}
      <Section id="values" eyebrow="What we believe in" title="Core Values" tone="dark" direction="left">
        <div className="flex flex-wrap gap-2.5 pt-2">
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
            <span
              key={value}
              className="rounded-full bg-[#FAAA48]/10 px-4 py-2 text-sm font-medium text-[#FFDDAC] ring-1 ring-[#FAAA48]/30 transition-colors hover:bg-[#FAAA48] hover:text-[#2F0F03]"
            >
              {value}
            </span>
          ))}
        </div>
      </Section>

      {/* Success Stories */}
      <Stories
        id="stories"
        eyebrow="Real impact"
        title="Success Stories"
        tone="light"
        people={[
          {
            photo: "/img_7.jpeg",
            name: "Replace with name",
            achievement: "University Graduate — Replace with degree/course",
            story:
              "Replace with a short paragraph about their journey through the programme and what they achieved.",
          },
          {
            photo: "/img_8.jpeg",
            name: "Replace with name",
            achievement: "University Graduate — Replace with degree/course",
            story:
              "Replace with a short paragraph about their journey through the programme and what they achieved.",
          },
          {
            photo: "/story-3.jpeg",
            name: "Replace with name",
            achievement: "University Graduate — Replace with degree/course",
            story:
              "Replace with a short paragraph about their journey through the programme and what they achieved.",
          },
        ]}
      />

      {/* Gallery */}
      <Gallery
        id="gallery"
        eyebrow="A glimpse"
        title="Gallery"
        tone="dark"
        images={[
          { src: "/img_2256.jpeg", alt: "Programme photo 1" },
          { src: "/img__2261.jpeg", alt: "Programme photo 2" },
          { src: "/img.jpeg", alt: "Programme photo 3" },
          { src: "/img_2379.jpeg", alt: "Programme photo 4" },
          { src: "/img_2381.jpeg", alt: "Programme photo 5" },
          { src: "/img_4452.jpeg", alt: "Programme photo 6" },
          { src:  "/img_14.jpeg", alt: "Programme photo 7"},
          { src:  "/img_13.jpeg", alt: "Programme photo 8"},
        ]}
      />

      <footer className="bg-[#FFDDAC] px-4 py-10 text-[#2F0F03] sm:px-6 md:px-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">Get in touch</p>
            <p className="break-words text-sm">
              <a href="mailto:st.benedict.c.p@gmail.com" className="hover:text-[#FAAA48]">
                st.benedict.c.p@gmail.com
              </a>
            </p>
            <p className="break-words text-sm">
              <a href="mailto:vincentonsongo72@gmail.com" className="hover:text-[#FAAA48]">
                vincentonsongo72@gmail.com
              </a>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">Support the programme</p>
            <p className="text-sm"> Mpesa Paybill: 303030</p>
            <p className="text-sm">ABSA Bank Account: 0671410505</p>
          </div>

          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} St Benedict's Children Programme. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
