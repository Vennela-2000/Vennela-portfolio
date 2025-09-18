import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Doraemon-Steps Portfolio (React + Tailwind + Framer Motion)
 * -----------------------------------------------------------
 * - Left sidebar lists sections (About, Experience, Education, Projects, Skills, Contact)
 * - Doraemon avatar "steps" (animates) alongside the currently active section
 * - IntersectionObserver updates active section while scrolling
 *
 * HOW TO USE A DORAEMON IMAGE:
 * Put a file named doraemon.png inside the /public folder (project root: public/doraemon.png).
 * If you don't have one yet, the code will still work; just use any placeholder image.
 */
const DORAEMON_IMG = "/doraemon.png"
// Place your image at public/doraemon.png


// ---------- Data (filled from your resume) ----------
const profile = {
  name: "Vennela Ravilla",
  title: "Full-Stack Developer • Java/Spring Boot • React • AWS",
  location: "Arlington, TX, USA",
  phone: "+1 (682) 718-6691",
  email: "vennelaravilla1720@gmail.com",
  linkedin: "https://linkedin.com/in/vennela-ravilla/",
  summary:
    "Full-stack developer with experience delivering secure, scalable microservices and modern frontends. Proven in Spring Boot, React/TypeScript, PostgreSQL, Docker/Kubernetes, and AWS. Focused on performance, reliability (99.9%+ uptime), and developer productivity with CI/CD and test automation.",
  experience: [
    {
      company: "S2 Global Solutions",
      role: "Full Stack Developer",
      location: "United States",
      period: "Jan 2025 – Present",
      bullets: [
        "Built secured REST APIs in Spring Boot for Wallet & Payment Service; supported ~10k concurrent ops/day with 99.98% uptime.",
        "ReactJS fund transfer & bank linking flows lifted top-up conversions by ~30% and reduced drop-offs.",
        "Designed JPA entities (BankAccount, Wallet, FundTransferLog) for 50k+ daily rows; integrated AWS RDS (PostgreSQL).",
        "CI/CD via GitHub Actions enabled daily releases across dev/stage/prod; deployment effort reduced by ~50%.",
        "Implemented JWT/CORS/secure headers for safe session handling across React + Spring Boot.",
      ],
      tech: [
        "Spring Boot",
        "React",
        "Java",
        "PostgreSQL (AWS RDS)",
        "GitHub Actions",
        "Docker/Kubernetes",
      ],
    },
    {
      company: "Infosys",
      role: "Software Engineer",
      location: "India",
      period: "Jan 2022 – Dec 2022",
      bullets: [
        "Shipped a scalable e-commerce platform (Spring Boot + React) serving 50k+ monthly users.",
        "Cart microservice achieved 99.95% uptime; 2k+ daily transactions.",
        "Role-based access with Spring Security eliminated unauthorized access incidents.",
        "Automated deployments via GitHub Actions; ≈30% productivity boost.",
        "Cypress/Selenium framework cut regression time by ~50%; Jest/Mocha raised FE coverage by ~40%.",
        "Containerized services with Docker/K8s => less downtime and faster rollouts.",
        "Redis cache trimmed API latency; AWS EC2/S3 maintained high availability.",
      ],
      tech: ["Spring Boot", "React", "Redis", "Docker/Kubernetes", "AWS EC2/S3"],
    },
    {
      company: "Wipro",
      role: "Software Engineer",
      location: "India",
      period: "Jan 2021 – Dec 2021",
      bullets: [
        "Built Loan Management Service processing 10k+ loan apps/month; optimized backend reduced checks latency.",
        "PostgreSQL + Hibernate schema supported large volumes without degradation.",
        "Kafka events cut disbursement notification latency significantly; Spring Security + JWT passed audits.",
        "React improvements (lazy loading, state) sped up UI; EMI calc UI reduced abandonment.",
        "Audit logging via Redis/PostgreSQL shortened incident resolution cycles.",
      ],
      tech: ["Spring Boot", "React", "PostgreSQL", "Kafka", "Redis"],
    },
  ],
  education: [
    {
      school: "University of Texas at Arlington",
      location: "Texas, USA",
      degree: "M.S. in Computer Science",
      gpa: "GPA: 3.6/4",
      period: "Jan 2023 – Dec 2024",
    },
    {
      school: "Nalla Narasimha Reddy Group of Institutions",
      location: "Hyderabad, India",
      degree: "B.Tech in Computer Science and Engineering",
      gpa: "GPA: 3.2/4",
      period: "Aug 2018 – Jul 2022",
    },
  ],
  skills: {
    languages: ["Java", "Python", "JavaScript", "TypeScript", "C#", "C/C++", "Bash"],
    web: ["React", "Next.js", "Node.js", "HTML5/CSS3", "Spring Boot", "Angular", "GraphQL", "Django"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Oracle", "Cassandra"],
    cloud: ["AWS", "GCP", "Azure"],
    devops: ["Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "Maven", "Gradle"],
    testing: ["JUnit", "Cypress", "Selenium", "Cucumber", "Jasmine", "Postman", "TestNG", "Jest", "Mocha"],
  },
  projects: [
    {
      name: "Skillify: Empowering Education at UTA",
      date: "Dec 2023",
      details: [
        "React.js frontend + Spring Boot backend educational platform.",
        "PostgreSQL storage + Redis caching for responsiveness.",
        "RESTful APIs for student–educator interactions; scalable architecture.",
      ],
      links: [],
    },
  ],
};

// ---------- Small UI helpers ----------
const Tag = ({ children }) => (
  <span className="inline-block text-xs md:text-sm rounded-full border px-3 py-1 mr-2 mb-2">
    {children}
  </span>
);

// Section that can receive a ref (so IO sees the real section DOM)
const Section = React.forwardRef(function Section({ id, title, children }, ref) {
  return (
    <section id={id} ref={ref} className="scroll-mt-28 py-16" aria-label={title}>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div>{children}</div>
    </section>
  );
});

// Doraemon marker that moves vertically along the left nav
const DoraemonMarker = ({ y }) => {
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 -translate-x-1/2"
      animate={{ y }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.img
        src={DORAEMON_IMG}
        alt="Doraemon stepping"
        className="w-16 h-16 rounded-full shadow-xl ring-4 ring-sky-200 bg-white"
        initial={{ scale: 0.8, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -4 }}
      />
      <motion.div
        className="mx-auto mt-1 h-1.5 w-6 rounded-full bg-slate-400/40"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
      />
    </motion.div>
  );
};

export default function App() {
  const sections = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  const [active, setActive] = useState(0);
  const navRefs = useRef([]);
  const sectionRefs = useRef([]);

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = sections.findIndex((s) => s.id === entry.target.id);
          if (idx !== -1) setActive(idx);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Compute Doraemon Y (centered on the active nav item)
  const doraemonY = useMemo(() => {
    const el = navRefs.current[active];
    if (!el) return 0;
    const { offsetTop, offsetHeight } = el;
    return offsetTop + offsetHeight / 2 - 32;
  }, [active]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/50 border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={DORAEMON_IMG}
              alt="Doraemon avatar"
              className="w-10 h-10 rounded-full ring-2 ring-sky-200"
            />
            <div>
              <h1 className="text-xl font-bold leading-tight">{profile.name}</h1>
              <p className="text-sm text-slate-600">{profile.title}</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-2 text-sm">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-3 py-2 rounded-full transition ${
                  active === i ? "bg-sky-100 text-sky-700" : "hover:bg-slate-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8">
        {/* Left Nav with Doraemon marker */}
        <aside className="relative md:sticky md:top-24 self-start">
          <div className="relative">
            <DoraemonMarker y={doraemonY} />
            <ul className="pl-12 border-l border-dashed border-slate-300">
              {sections.map((s, i) => (
                <li key={s.id} className="mb-4">
                  <button
                    ref={(el) => (navRefs.current[i] = el)}
                    onClick={() => scrollTo(s.id)}
                    className={`block text-left w-full px-3 py-2 rounded-lg transition ${
                      active === i
                        ? "bg-white shadow-sm ring-1 ring-sky-200 text-sky-700"
                        : "hover:bg-white/60"
                    }`}
                  >
                    <span className="font-medium">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div>
          {/* About */}
          <Section
            id="about"
            title="About"
            ref={(el) => (sectionRefs.current[0] = el)}
          >
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <img
                  src={DORAEMON_IMG}
                  alt="Doraemon greeter"
                  className="w-24 h-24 rounded-full ring-4 ring-sky-200 bg-white"
                />
                <div>
                  <h2 className="text-3xl font-bold">Hi, I’m {profile.name} 👋</h2>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    {profile.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a
                      href={`mailto:${profile.email}`}
                      className="px-3 py-1.5 rounded-full bg-slate-900 text-white"
                    >
                      Email
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full bg-sky-600 text-white"
                    >
                      LinkedIn
                    </a>
                    <span className="px-3 py-1.5 rounded-full bg-slate-100">
                      {profile.location}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-100">
                      {profile.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Experience */}
          <Section
            id="experience"
            title="Experience"
            ref={(el) => (sectionRefs.current[1] = el)}
          >
            <ol className="relative border-l border-slate-200">
              {profile.experience.map((exp, idx) => (
                <li key={idx} className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 ring-2 ring-sky-200">
                    💼
                  </span>
                  <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl font-semibold">
                        {exp.role} • {exp.company}
                      </h3>
                      <span className="text-sm text-slate-600">{exp.period}</span>
                    </div>
                    <div className="text-sm text-slate-600">{exp.location}</div>
                    <ul className="mt-3 list-disc ms-5 space-y-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      {exp.tech.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* Education */}
          <Section
            id="education"
            title="Education"
            ref={(el) => (sectionRefs.current[2] = el)}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {profile.education.map((ed, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                  <h3 className="text-lg font-semibold">{ed.school}</h3>
                  <div className="text-sm text-slate-600">{ed.location}</div>
                  <div className="mt-2">{ed.degree}</div>
                  <div className="text-sm text-slate-600">{ed.period}</div>
                  <div className="mt-1 text-sm">{ed.gpa}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Projects */}
          <Section
            id="projects"
            title="Projects"
            ref={(el) => (sectionRefs.current[3] = el)}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map((p, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <span className="text-sm text-slate-600">{p.date}</span>
                  </div>
                  <ul className="mt-2 list-disc ms-5 space-y-1">
                    {p.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                  {p.links?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.links.map((l, k) => (
                        <a
                          className="text-sm underline decoration-sky-400 underline-offset-4"
                          key={k}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section
            id="skills"
            title="Skills"
            ref={(el) => (sectionRefs.current[4] = el)}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                <h3 className="font-semibold mb-2">Languages</h3>
                {profile.skills.languages.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
                <h3 className="font-semibold mt-4 mb-2">Web & Frameworks</h3>
                {profile.skills.web.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5">
                <h3 className="font-semibold mb-2">Databases</h3>
                {profile.skills.databases.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
                <h3 className="font-semibold mt-4 mb-2">Cloud</h3>
                {profile.skills.cloud.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
                <h3 className="font-semibold mt-4 mb-2">DevOps & CI/CD</h3>
                {profile.skills.devops.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
                <h3 className="font-semibold mt-4 mb-2">Testing</h3>
                {profile.skills.testing.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section
            id="contact"
            title="Contact"
            ref={(el) => (sectionRefs.current[5] = el)}
          >
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Email</div>
                  <a
                    className="font-medium underline decoration-sky-400 underline-offset-4"
                    href={`mailto:${profile.email}`}
                  >
                    {profile.email}
                  </a>
                </div>
                <div>
                  <div className="text-slate-500">Phone</div>
                  <div className="font-medium">{profile.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500">LinkedIn</div>
                  <a
                    className="font-medium underline decoration-sky-400 underline-offset-4"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.linkedin}
                  </a>
                </div>
                <div>
                  <div className="text-slate-500">Location</div>
                  <div className="font-medium">{profile.location}</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <footer className="py-10 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {profile.name}. Built with React • Tailwind • Framer Motion.</p>
            <p className="mt-1">Mascot hopping between sections = Doraemon-steps theme.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
