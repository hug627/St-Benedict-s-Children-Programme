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

// ---------------------------------------------------------------------------
// Theme + shared data
// ---------------------------------------------------------------------------

const THEME = {
  bgDark: "#2F0F03",
  bgLight: "#FFDDAC",
  accent: "#FAAA48",
  bgDarker: "#240c02",
};

const DONATION_INFO = {
  mpesaPaybill: "303030",
  absaAccount: "0671410505",
};

const CONTACT_EMAIL = "parishbenedict@gmail.com";

const NAV_ITEMS = [
  { id: "background", label: "Background" },
  { id: "location", label: "Location" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "objectives", label: "Objectives" },
  { id: "aims", label: "Aims" },
  { id: "activities", label: "Activities" },
  { id: "values", label: "Values" },
  { id: "donors", label: "Donors" },
  { id: "stories", label: "Stories" },
  { id: "gallery", label: "Gallery" },
];

const CORE_VALUES = [
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
];

const SUCCESS_STORIES = [
  {
    photo: "/img_7.jpeg",
    name: "Esther Novins",
    achievement: "University Graduate — Bachelor's Degree in Occupational Therapy",
    story: "Esther studied at the Presbyterian University, where she attained her Degree in Occupational Therapy.",
  },
  {
    photo: "/img_8.jpeg",
    name: "Miriam Bosibori",
    achievement: "University Graduate — Bachelor's Degree in Education",
    story: "Miriam studied at Kisii University, where she attained her degree in Education in 2025.",
  },
  {
    photo: "/img_19.jpeg",
    name: "James Ngigi",
    achievement: "University Graduate — Degree in Criminology",
    story: "James studied at Masinde Muliro University and graduated with a degree in Criminology in 2022.",
  },
  {
    photo: "/img_20.jpeg",
    name: "Hesbon Willington",
    achievement: "University Graduate — Degree in Business Management",
    story: "Hesbon studied at the University of Nairobi, completing his Degree in Business Management in 2022.",
  },
  {
    photo: "/img_21.jpeg",
    name: "Lilian Owuor",
    achievement: "University Graduate — Degree in Business Administration and Economics",
    story: "Lilian studied at Mount Kenya University, earning her degree in Business Administration and Economics in 2026.",
  },
  {
    photo: "/img_22.jpeg",
    name: "Stephen Omondi",
    achievement: "University Graduate — Degree in Entrepreneurship",
    story: "Stephen studied at Jomo Kenyatta University, attaining his degree in Entrepreneurship in 2020.",
  },
  {
    photo: "/img_29.jpeg",
    name: "Stephen Nkalovwe",
    achievement: "University Graduate — Degree in Analytical Chemistry",
    story: "Stephen studied at Jomo Kenyatta University, attaining his Degree in Analytical Chemistry in 2021.",
  },
  {
    photo: "/img_30.jpeg",
    name: "Walter Oketch",
    achievement: "Diploma in Photogrammetry and Remote Sensing",
    story: "Walter studied at the Kenya Institute of Survey and Mapping, attaining his Diploma in Photogrammetry and Remote Sensing in 2019.",
  },
  {
    photo: "/img_25.jpeg",
    name: "Julius Mutisya",
    achievement: "Diploma in Social Work",
    story: "Julius studied at the East African Institute, attaining his Diploma in Social Work in 2018.",
  },
  {
    photo: "/img_26.jpeg",
    name: "Peter Kioko",
    achievement: "Diploma in Medical Records",
    story: "Peter studied at the Technical University of Kenya, attaining his Diploma in Medical Records in 2019.",
  },
  {
    photo: "/img_27.jpeg",
    name: "Stephine Moseti",
    achievement: "Diploma in Social Work",
    story: "Stephine studied at the East African Institute, attaining her Diploma in Social Work in 2018.",
  },
  {
    photo: "/img_28.jpeg",
    name: "Patrick Odhiambo",
    achievement: "Degree in Statistics",
    story: "Patrick studied at Taita Taveta University, attaining his Degree in Statistics in 2018.",
  },
];

const GALLERY_IMAGES = [
  { src: "/img_2256.jpeg", alt: "Programme photo 1" },
  { src: "/img__2261.jpeg", alt: "Programme photo 2" },
  { src: "/img_15.jpeg", alt: "Programme photo 3" },
  { src: "/img_16.jpeg", alt: "Programme photo 4" },
  { src: "/img_17.jpeg", alt: "Programme photo 5" },
  { src: "/img_4452.jpeg", alt: "Programme photo 6" },
  { src: "/img_14.jpeg", alt: "Programme photo 7" },
  { src: "/img_13.jpeg", alt: "Programme photo 8" },
];

const ACTIVITY_IMAGES = [
  { src: "/img_1.jpeg", alt: "Activity photo 1" },
  { src: "/img_2.jpeg", alt: "Activity photo 2" },
  { src: "/img_3.jpeg", alt: "Activity photo 3" },
  { src: "/img_4.jpeg", alt: "Activity photo 4" },
  { src: "/img_5.jpeg", alt: "Activity photo 5" },
  { src: "/img_12.jpeg", alt: "Activity photo 6" },
  { src: "/img_11.jpeg", alt: "Activity photo 7" },
];

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
  .font-display { font-family: 'Fraunces', serif; }
  .font-body { font-family: 'Inter', sans-serif; }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function toneClasses(tone) {
  return tone === "dark" ? "bg-[#2F0F03] text-[#FFDDAC]" : "bg-[#FFDDAC] text-[#2F0F03]";
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

// ---------------------------------------------------------------------------
// Section (generic content block with scroll-triggered animation)
// ---------------------------------------------------------------------------

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
  const customStyle = bgColor ? { backgroundColor: bgColor, color: textColor || THEME.bgLight } : undefined;

  const activePosition = image?.position || imagePosition;
  const imageList = images || (image ? [image] : []);
  const hasImages = imageList.length > 0;

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
      const animatedTargets = sectionRef.current.querySelectorAll(".animate-in, .animate-in li, .section-img-item");

      if (prefersReducedMotion()) {
        gsap.set(animatedTargets, { opacity: 1, x: 0, y: 0, scale: 1 });
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
          { opacity: 0, y: 30, duration: 0.6, stagger: 0.06, ease: "power3.out" },
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

      return () => split?.revert();
    },
    { scope: sectionRef, dependencies: [direction, listStagger, activePosition, imageList.length] }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${customStyle ? "" : toneClasses(tone)} font-body scroll-mt-20 px-6 py-20 md:px-16`}
      style={customStyle}
    >
      <div className={`mx-auto max-w-6xl ${hasImages ? "grid items-start gap-8 md:grid-cols-2 md:gap-12" : "max-w-3xl"}`}>
        <div className={hasImages && activePosition === "left" ? "md:order-2" : "md:order-1"}>
          <p className="eyebrow-el mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
          <h2 ref={titleRef} className="font-display mb-6 text-3xl font-semibold md:text-4xl">
            {title}
          </h2>
          <div className="animate-in space-y-4 text-base leading-relaxed opacity-90 md:text-lg">{children}</div>
        </div>

        {hasImages && (
          <div className={`w-full max-w-md justify-self-center ${activePosition === "left" ? "md:order-1" : "md:order-2"}`}>
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
                    key={img.src}
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

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

function Stories({ id = "stories", eyebrow = "Real impact", title = "Success Stories", tone = "dark", people = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

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
        tl.from(split.words, { opacity: 0, y: 30, duration: 0.6, stagger: 0.06, ease: "power3.out" });
      }

      tl.from(
        cards,
        { opacity: 0, y: 40, scale: 0.95, duration: 0.7, stagger: 0.15, ease: "power2.out" },
        "-=0.2"
      );

      return () => split?.revert();
    },
    { scope: sectionRef, dependencies: [people.length] }
  );

  return (
    <section id={id} ref={sectionRef} className={`${toneClasses(tone)} font-body scroll-mt-20 px-6 py-20 md:px-16`}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
        <h2 ref={titleRef} className="font-display mb-4 max-w-2xl text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <p className="mb-12 max-w-2xl text-base opacity-80 md:text-lg">
          Young people who grew up in our programme and went on to graduate from university or college.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <div
              key={person.name}
              className="story-card overflow-hidden rounded-2xl bg-white/60 shadow-lg ring-1 ring-[#FAAA48]/30"
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

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

function Gallery({ id = "gallery", eyebrow = "A glimpse", title = "Gallery", tone = "light", images = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

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
    <section id={id} ref={sectionRef} className={`${toneClasses(tone)} font-body scroll-mt-20 px-6 py-20 md:px-16`}>
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">{eyebrow}</p>
        <h2 ref={titleRef} className="font-display mb-10 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {images.map((img) => (
            <div key={img.src} className="gallery-img aspect-square overflow-hidden rounded-xl shadow-md">
              <img src={img.src} alt={img.alt || ""} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Donation modal (shared bank/paybill details)
// ---------------------------------------------------------------------------

function DonateModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#2F0F03] p-6 text-[#FFDDAC] shadow-2xl ring-1 ring-[#FAAA48]/30">
        <button onClick={onClose} className="absolute right-4 top-4 text-[#FFDDAC] hover:text-[#FAAA48]" aria-label="Close">
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
            <p className="text-lg font-bold">{DONATION_INFO.mpesaPaybill}</p>
          </div>
          <div className="border-t border-[#FAAA48]/20 pt-3">
            <p className="text-xs font-medium uppercase text-[#FAAA48]">ABSA Bank Account</p>
            <p className="text-lg font-bold">{DONATION_INFO.absaAccount}</p>
          </div>
        </div>

        <button onClick={onClose} className="mt-6 w-full rounded-full bg-[#FAAA48] py-2.5 text-sm font-bold text-[#2F0F03]">
          Close
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CompanySite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const desktopMenuRef = useRef(null);
  const accountMenuRef = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
        { opacity: 0, y: 24, duration: 0.7, stagger: 0.12, ease: "power2.out" },
        "-=0.3"
      );

      return () => split.revert();
    },
    { scope: heroRef }
  );

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);

    if (prefersReducedMotion()) {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
      return;
    }

    gsap.to(window, { duration: 1, scrollTo: { y: `#${id}`, offsetY: 70 }, ease: "power2.inOut" });
  };

  return (
    <div className="font-body overflow-x-hidden">
      <style>{FONT_IMPORT}</style>

      {/* Top contact banner */}
      <div className="bg-[#240c02] px-4 py-1.5 text-xs text-[#FFDDAC] sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-[#FAAA48]">Get in touch</span>
            <span>
              📧 <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#FAAA48]">{CONTACT_EMAIL}</a>
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? "bg-[#FFDDAC]/95 backdrop-blur shadow-md" : "bg-[#FFDDAC]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
          <button
            onClick={() => scrollTo("home")}
            className="flex shrink-0 items-center gap-3 text-left text-[#2F0F03]"
            aria-label="St Benedict's Children Centre - Home"
          >
            <img
              src="/Logo.png"
              alt="St Benedict's Children Centre logo"
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            />

            <span className="font-display max-w-[180px] text-sm font-semibold leading-tight sm:max-w-none sm:text-base md:text-lg">
              St Benedict's Children Centre
            </span>
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
                className="flex items-center gap-1.5 text-sm font-medium text-[#2F0F03] transition-colors hover:text-[#FAAA48]"
              >
                Menu
                <span className={`inline-block transition-transform duration-200 ${desktopMenuOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {desktopMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl bg-[#2F0F03] shadow-2xl ring-1 ring-[#FAAA48]/30">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollTo(item.id);
                        setDesktopMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#FFDDAC] transition-colors hover:bg-[#FAAA48] hover:text-[#2F0F03]"
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
                  <div className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl bg-[#FFDDAC] shadow-xl ring-1 ring-[#FAAA48]/20">
                    <div className="border-b border-[#FAAA48]/20 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[#2F0F03]">{user.name}</p>
                      <p className="truncate text-xs text-[#2F0F03]/60">{user.email}</p>
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
              className="flex shrink-0 items-center justify-center text-[#2F0F03] md:hidden"
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
          className={`grid overflow-hidden bg-[#FFDDAC] transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto overflow-x-hidden px-6 pb-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="py-2 text-left text-sm font-medium text-[#2F0F03] hover:text-[#FAAA48]"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 border-t border-[#FAAA48]/20 pt-2">
              {user ? (
                <>
                  <p className="truncate py-1 text-xs text-[#2F0F03]/60">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-sm font-medium text-[#2F0F03] hover:text-[#FAAA48]"
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

      {donateModalOpen && <DonateModal onClose={() => setDonateModalOpen(false)} />}

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
            A rehabilitation centre for boys living on the street.
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

      <Section id="background" eyebrow="Who we are" title="Historical Background" tone="dark" direction="up">
        <p>
          St. Benedict's Children Programme is the brainchild of the Kolping Family and St. Benedict's Catholic
          Parish, Ruaraka. The idea for its formation can be traced back to 1993, when a group of foresighted
          individuals led by Fr. Klaus Braunreter OSB, then parish priest of St. Benedict's Nairobi, set out to help
          under-privileged children and young people.
        </p>
        <p>
          A government survey shows there are about 100,000 street children in Nairobi, with at least 30% living in
          Mathare and its adjacent slums — a large part of which falls under the jurisdiction of St. Benedict's
          Parish. Care and protection of the child is a matter of ongoing global concern, addressed through various
          UN conventions and assemblies. St. Benedict's Children Programme has been part of implementing those
          conventions, directly and indirectly, for years.
        </p>
      </Section>

      <Section id="location" eyebrow="Where we are" title="Location" tone="light" direction="left">
        <p>
          St Benedict's Children Centre is located in Mathare North Area 2, near Mathare North Primary School and
          Mathare North Market.
        </p>
      </Section>

      <Section
        id="vision"
        eyebrow="Looking ahead"
        title="Vision Statement"
        tone="dark"
        direction="scale"
        image={{ src: "/img__2261.jpeg", alt: "Vision image", position: "left" }}
      >
        <p>A stable, responsible and morally upright child in society.</p>
      </Section>

      <Section
        id="mission"
        eyebrow="Why we exist"
        title="Mission Statement"
        tone="light"
        direction="right"
        image={{ src: "/img.jpeg", alt: "Mission image", position: "right" }}
      >
        <p>
          St. Benedict's Children Programme is a church-based initiative that provides a strong foundation for
          children — within the context of family and community — to become educated, self-reliant and responsible,
          by involving the family and community in providing basic needs:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Education</li>
          <li>Self-reliance</li>
          <li>Health Care</li>
        </ul>
      </Section>

      <Section
        id="objectives"
        eyebrow="What we're working toward"
        title="Programme Objectives"
        tone="dark"
        direction="left"
        image={{ src: "/img_2379.jpeg", alt: "Objectives image", position: "left" }}
      >
        <p>
          To provide a foundation for new life for street children and other under-privileged children — a healthy
          home, parental care, schooling, food and primary health care, among other basic needs.
        </p>
      </Section>

      <Section
        id="aims"
        eyebrow="What we're reaching for"
        title="Aims And Objectives of the St. Benedict's Children Centre (SBCC)"
        tone="light"
        direction="right"
        image={{ src: "/img_18.jpeg", alt: "Aims image", position: "right" }}
      >
        <p>
          St. Benedict's Children Programme is a church-based initiative that provides a strong foundation for
          children — within the context of family and community — to become responsible and self-reliant.
        </p>
      </Section>

      <Section
        id="activities"
        eyebrow="What we do"
        title="Activities"
        tone="dark"
        direction="up"
        listStagger
        imagePosition="left"
        images={ACTIVITY_IMAGES}
      >
        <ul className="list-disc space-y-2 pl-5">
          <li>Making contact with children's families, referral process and recruiting children</li>
          <li>Day care centre and non-formal primary education</li>
          <li>Recreation (art, music, sports, storytelling and poems)</li>
          <li>Counselling and guidance</li>
          <li>Integrating Christian morals and values with the children's family and community</li>
          <li>Helping families place their children into educational institutions or vocational training</li>
          <li>Home visits, school visits and follow-ups</li>
          <li>Medical care</li>
          <li>Workshops and children's trainings</li>
          <li>Parents' meetings and empowerment</li>
          <li>Feeding programme</li>
          <li>Recruitment of children from the street</li>
          <li>Library and literacy activities serving the entire Mathare slum community for free</li>
          <li>
            Street children rehabilitation, reintegration and school sponsorship from primary school through
            university level
          </li>
          <li>Community services</li>
        </ul>
      </Section>

      <Section id="values" eyebrow="What we believe in" title="Core Values" tone="light" direction="left">
        <div className="flex flex-wrap gap-2.5 pt-2">
          {CORE_VALUES.map((value) => (
            <span
              key={value}
              className="rounded-full bg-[#2F0F03]/5 px-4 py-2 text-sm font-medium text-[#2F0F03] ring-1 ring-[#2F0F03]/15 transition-colors hover:bg-[#FAAA48] hover:text-[#2F0F03]"
            >
              {value}
            </span>
          ))}
        </div>
      </Section>


      {/* -----------------------------------------------------------------------
          Donors
      ------------------------------------------------------------------------ */}

      <Section
        id="donors"
        eyebrow="Our Supporters"
        title="Our Donors"
        tone="dark"
        direction="up"
      >
        <p className="mb-8">
          The Centre relies on three main donors whose generous support helps
          us continue providing care, education, rehabilitation and opportunities
          for the children and young people in our programme.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Kinder-Initiative Kenia (KIK) */}
          <div className="group rounded-2xl bg-[#FFDDAC] p-6 text-[#2F0F03] shadow-lg ring-1 ring-[#FAAA48]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAAA48] text-2xl">
              1
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAAA48]">
              Donor 01
            </p>

            <h3 className="font-display mb-3 text-xl font-semibold">
              Kinder-Initiative Kenia (KIK)
            </h3>

            <p className="mb-4 text-sm font-medium text-[#FAAA48]">
              Germany
            </p>

            <p className="text-sm leading-relaxed opacity-85">
              Kinder-Initiative Kenia (KIK) from Germany is one of the Centre's
              main donors, supporting the continued care, education and
              development of the children in our programme.
            </p>
          </div>

          {/* St. Benedict's Parish */}
          <div className="group rounded-2xl bg-[#FFDDAC] p-6 text-[#2F0F03] shadow-lg ring-1 ring-[#FAAA48]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAAA48] text-2xl">
              2
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAAA48]">
              Donor 02
            </p>

            <h3 className="font-display mb-3 text-xl font-semibold">
              St. Benedict's Parish
            </h3>

            <p className="mb-4 text-sm font-medium text-[#FAAA48]">
              Host Parish
            </p>

            <p className="text-sm leading-relaxed opacity-85">
              St. Benedict's Parish, which is the host of the Centre, is one
              of the main supporters of the programme and plays an important
              role in sustaining the Centre's work.
            </p>
          </div>

          {/* Other Well-Wishers */}
          <div className="group rounded-2xl bg-[#FFDDAC] p-6 text-[#2F0F03] shadow-lg ring-1 ring-[#FAAA48]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAAA48] text-2xl">
              3
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAAA48]">
              Donor 03
            </p>

            <h3 className="font-display mb-3 text-xl font-semibold">
              Other Well-Wishers
            </h3>

            <p className="mb-4 text-sm font-medium text-[#FAAA48]">
              Friends & Supporters
            </p>

            <p className="text-sm leading-relaxed opacity-85">
              The Centre also receives generous support from well-wishers,
              friends and individuals who believe in our mission and contribute
              towards improving the lives and future of the children we serve.
            </p>
          </div>
        </div>
      </Section>

      <Stories id="stories" eyebrow="Real impact" title="Success Stories" tone="light" people={SUCCESS_STORIES} />

      <Gallery id="gallery" eyebrow="A glimpse" title="Gallery" tone="dark" images={GALLERY_IMAGES} />

      <footer className="bg-[#FFDDAC] px-4 py-12 text-[#2F0F03] sm:px-6 md:px-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">Get in touch</p>
            <p className="break-words text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#FAAA48]">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FAAA48]">Support the programme</p>
            <p className="text-sm">Mpesa Paybill: {DONATION_INFO.mpesaPaybill}</p>
            <p className="text-sm">ABSA Bank Account: {DONATION_INFO.absaAccount}</p>
          </div>

          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} St Benedict's Children Programme. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
