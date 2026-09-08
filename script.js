/* =========================================================
   Daniel Ovie — Portfolio Script
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSmoothScroll();
  initActiveNavOnScroll();
  initScrollReveal();
  initThemeToggle();
  renderSkills();
  renderProjects();
  renderCommitLog();
  initHeroTyping();
  initContactForm();
  initBackToTop();
  setCurrentYear();
});

function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
    });
  });
}

function initSmoothScroll() {
  const header = document.getElementById("siteHeader");
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight +
        1;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active-link",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const iconMoon = document.getElementById("iconMoon");
  const iconSun = document.getElementById("iconSun");
  const root = document.documentElement;

  if (!toggle || !iconMoon || !iconSun) return;

  const stored = safeGetStorage("do-theme");

  if (stored === "light") {
    applyTheme("light");
  }

  toggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      iconMoon.hidden = true;
      iconSun.hidden = false;
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Switch to dark theme");
    } else {
      root.removeAttribute("data-theme");
      iconMoon.hidden = false;
      iconSun.hidden = true;
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Switch to light theme");
    }

    safeSetStorage("do-theme", theme);
  }
}

function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {}
}

const SKILLS_DATA = [
  {
    category: "Programming",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    items: [
      { name: "C++", level: 2 },
      { name: "Python", level: 2 },
      { name: "JavaScript", level: 2 },
    ],
  },
  {
    category: "Web Development",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/></svg>',
    items: [
      { name: "HTML", level: 3 },
      { name: "CSS", level: 3 },
      { name: "JavaScript", level: 2 },
    ],
  },
  {
    category: "Data",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 13v5M12 8v10M17 5v13"/></svg>',
    items: [{ name: "Data Analysis", level: 1 }],
  },
];

function renderSkills() {
  const grid = document.getElementById("skillsGrid");

  if (!grid) return;

  grid.innerHTML = SKILLS_DATA.map(
    (group) => `
      <div class="skill-category">
        <h3>
          <span class="cat-icon">${group.icon}</span>
          ${group.category}
        </h3>

        ${group.items
          .map(
            (skill) => `
              <div class="skill-item">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-dots" aria-label="Comfort level ${skill.level} out of 3">
                  ${[1, 2, 3]
                    .map(
                      (n) =>
                        `<span class="${n <= skill.level ? "filled" : ""}"></span>`
                    )
                    .join("")}
                </span>
              </div>
            `
          )
          .join("")}
      </div>
    `
  ).join("");
}

const PROJECTS_DATA = [
  {
    name: "Personal Portfolio Website",
    description:
      "This site, a responsive, dark-themed portfolio built from scratch with plain HTML, CSS and JavaScript to practice layout, accessibility and animation.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/dexxlinks/Personal-Portfolio-Website.git",
    demo: "#",
  },
  {
    name: "Number Information Analyzer",
    description:
      "A Python program that asks the user for a number and prints a detailed analysis of it: sign, type, factors, binary/hex form, and more.",
    tech: ["Python"],
    github: "https://github.com/dexxlinks/Number-information-analyzer.git",
    demo: "#",
  },
  {
    name: "Student Grade Analyzer",
    description:
      "A small C++ program for calculating averages and grade distributions from student results, exploring basic programming and data analysis concepts.",
    tech: ["C++"],
    github: "https://github.com/dexxlinks/Student-Grade-Analyzer.git",
    demo: "#",
  },
   {
    name: "Expense Tracker",
    description: "A simple web application to track basic expenses.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "#",
    demo: "#",
    sample: true,
  }
];

function renderProjects() {
  const grid = document.getElementById("projectsGrid");

  if (!grid) return;

  const cards = PROJECTS_DATA.map(
    (project) => `
      <article class="project-card">
        <div class="project-top">
          <span class="project-badge">Project</span>
        </div>

        <div class="project-body">
          <h3>${project.name}</h3>
          <p>${project.description}</p>

          <div class="tech-tags">
            ${project.tech
              .map((t) => `<span class="tech-tag">${t}</span>`)
              .join("")}
          </div>

          <div class="project-links">
            ${
              project.github !== "#"
                ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`
                : ""
            }

            ${
              project.demo !== "#"
                ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>`
                : ""
            }
          </div>
        </div>
      </article>
    `
  ).join("");

  const comingSoon = `
    <article class="project-card coming-soon">
      <div class="soon-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>

      <h3>More projects coming soon</h3>
      <p>
        I'm actively building. Real, completed projects will be added
        as soon as they are finished.
      </p>
    </article>
  `;

  grid.innerHTML = cards + comingSoon;
}

const JOURNEY_DATA = [
  {
    hash: "September",
    date: "2024",
    title: "Started B.Sc. Computer Science",
    desc:
      "Enrolled at the University of Ilorin and began building a foundation in programming and computing concepts.",
  },
  {
    hash: "October",
    date: "2024",
    title: "Learned HTML & CSS fundamentals",
    desc:
      "Started structuring and styling web pages, understanding layout, and writing semantic markup.",
  },
  {
    hash: "January",
    date: "2025",
    title: "Picked up JavaScript & C++",
    desc:
      "Began learning core programming logic in C++ and adding interactivity to web pages with JavaScript.",
  },
  {
    hash: "March",
    date: "2025",
    title: "Explored Python & data analysis",
    desc:
      "Started using Python for scripting and basic data analysis to complement web development skills.",
  },
  {
    hash: "November",
    date: "Ongoing",
    title: "Building real-world projects",
    desc:
      "Currently working through practical projects to apply what I'm learning and prepare for internships.",
  },
];

function renderCommitLog() {
  const log = document.getElementById("commitLog");

  if (!log) return;

  log.innerHTML = JOURNEY_DATA.map(
    (entry) => `
      <li class="commit-item reveal">
        <span class="commit-hash">${entry.hash}</span>
        <span class="commit-date">${entry.date}</span>
        <h3 class="commit-title">${entry.title}</h3>
        <p class="commit-desc">${entry.desc}</p>
      </li>
    `
  ).join("");

  initScrollReveal();
}

function initHeroTyping() {
  const codeEl = document.getElementById("typedCode");
  const cursor = document.getElementById("cursorBlink");

  if (!codeEl) return;

  const lines = [
    { text: "const ", cls: "tok-key" },
    { text: "developer", cls: "" },
    { text: " = {\n", cls: "tok-punc" },
    { text: " name", cls: "tok-key" },
    { text: ": ", cls: "tok-punc" },
    { text: '"Daniel Ovie"', cls: "tok-str" },
    { text: ",\n", cls: "tok-punc" },
    { text: " role", cls: "tok-key" },
    { text: ": ", cls: "tok-punc" },
    { text: '"CS Student"', cls: "tok-str" },
    { text: ",\n", cls: "tok-punc" },
    { text: " skills", cls: "tok-key" },
    { text: ": [", cls: "tok-punc" },
    { text: '"HTML"', cls: "tok-str" },
    { text: ", ", cls: "tok-punc" },
    { text: '"CSS"', cls: "tok-str" },
    { text: ", ", cls: "tok-punc" },
    { text: '"JS"', cls: "tok-str" },
    { text: ", ", cls: "tok-punc" },
    { text: '"Python"', cls: "tok-str" },
    { text: ", ", cls: "tok-punc" },
    { text: '"C++"', cls: "tok-str" },
    { text: "],\n", cls: "tok-punc" },
    { text: " learning", cls: "tok-key" },
    { text: ": ", cls: "tok-punc" },
    { text: "true", cls: "tok-str" },
    { text: ",\n", cls: "tok-punc" },
    { text: " available", cls: "tok-key" },
    { text: ": ", cls: "tok-punc" },
    { text: '"internships, SIWES, collabs"', cls: "tok-str" },
    { text: "\n};", cls: "tok-punc" },
  ];

  function spanify(line) {
    const escaped = line.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return line.cls
      ? `<span class="${line.cls}">${escaped}</span>`
      : escaped;
  }

  const prefersReducedMotion = window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  if (prefersReducedMotion) {
    codeEl.innerHTML = lines.map((l) => spanify(l)).join("");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let builtHTML = "";
  const speed = 18;

  function typeNext() {
    if (lineIndex >= lines.length) {
      if (cursor) cursor.style.opacity = "1";
      return;
    }

    const current = lines[lineIndex];
    charIndex++;

    const partial = current.text.slice(0, charIndex);

    codeEl.innerHTML =
      builtHTML +
      spanify({
        text: partial,
        cls: current.cls,
      });

    if (charIndex >= current.text.length) {
      builtHTML += spanify(current);
      lineIndex++;
      charIndex = 0;
    }

    setTimeout(typeNext, speed);
  }

  typeNext();
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
    },
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    status.textContent = "";
    status.className = "form-status";

    const values = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
    };

    const errors = validateContactForm(values);
    let hasErrors = false;

    Object.keys(fields).forEach((key) => {
      const { input, error } = fields[key];
      const row = input.closest(".form-row");

      if (errors[key]) {
        row.classList.add("invalid");
        error.textContent = errors[key];
        hasErrors = true;
      } else {
        row.classList.remove("invalid");
        error.textContent = "";
      }
    });

    if (hasErrors) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }

    submitContactForm(values, form, status);
  });
}

function validateContactForm({ name, email, message }) {
  const errors = {};

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name looks too short.";
  }

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message) {
    errors.message = "Please write a short message.";
  } else if (message.length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

function submitContactForm(values, form, status) {
  status.textContent = "Sending...";
  status.className = "form-status";

  setTimeout(() => {
    console.log("Contact form submitted (not actually sent):", values);

    status.textContent =
      "The backend isn't connected yet, but I'm still working on it. Thanks for reaching out — my email is active.";

    status.classList.add("success");
    form.reset();
  }, 600);
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");

  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setCurrentYear() {
  const el = document.getElementById("currentYear");

  if (el) {
    el.textContent = new Date().getFullYear();
  }
}