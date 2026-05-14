(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("nav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const heroGrid = document.querySelector(".hero-grid");
  const photoWrap = document.getElementById("hero-photo-wrap");
  const photoImg = photoWrap?.querySelector(".hero-photo");
  function activateHeroPhoto() {
    if (!heroGrid || !photoWrap) return;
    photoWrap.classList.add("is-loaded");
    heroGrid.classList.add("has-photo");
  }
  if (photoImg && photoWrap && heroGrid) {
    photoImg.addEventListener("load", activateHeroPhoto, { once: true });
    photoImg.addEventListener(
      "error",
      () => {
        photoWrap.remove();
        heroGrid.classList.remove("has-photo");
      },
      { once: true },
    );
    if (photoImg.complete && photoImg.naturalWidth > 0) activateHeroPhoto();
  }

  const menuBtn = document.getElementById("menu-btn");
  const drawer = document.getElementById("mobile-drawer");
  function setMenu(open) {
    if (!menuBtn || !drawer || !nav) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    drawer.classList.toggle("is-open", open);
    nav.classList.toggle("is-menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      setMenu(!open);
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // Scroll progress bar
  const progressBar = document.getElementById("scroll-progress");
  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total) * 100 + "%" : "0%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Scroll-hint fade
  const scrollHint = document.querySelector(".scroll-hint");
  if (scrollHint) {
    window.addEventListener("scroll", function hideHint() {
      if (window.scrollY > 80) {
        scrollHint.classList.add("is-hidden");
        window.removeEventListener("scroll", hideHint);
      }
    }, { passive: true });
  }

  // Back-to-top
  const backTop = document.getElementById("back-top");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("is-visible", window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Active nav link via IntersectionObserver
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = document.querySelectorAll("section[id], div[id='top']");
  if (navAnchors.length && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          const id = entry.target.id;
          const match = document.querySelector(`.nav-links a[href='#${id}']`);
          if (match) match.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => sectionObserver.observe(s));
  }

  // Typewriter effect
  const twEl = document.getElementById("typewriter");
  if (twEl && !prefersReducedMotion) {
    const words = ["Full-Stack Engineer", "Cloud Architect", "AWS Certified", "Serverless Specialist", "Data Platform Builder"];
    let wi = 0, ci = 0, deleting = false;
    function typeStep() {
      const word = words[wi];
      if (!deleting) {
        twEl.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) {
          deleting = true;
          setTimeout(typeStep, 1600);
          return;
        }
      } else {
        twEl.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(typeStep, deleting ? 42 : 72);
    }
    setTimeout(typeStep, 1800);
  } else if (twEl) {
    twEl.textContent = "Full-Stack Engineer";
  }

  const glow = document.getElementById("cursor-glow");
  if (glow && !prefersReducedMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;
    window.addEventListener(
      "mousemove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true },
    );
    function tick() {
      gx += (tx - gx) * 0.06;
      gy += (ty - gy) * 0.06;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(tick);
    }
    tick();
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    const tl = document.getElementById("timeline");
    if (tl) tl.classList.add("is-visible");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.getElementById("timeline")?.classList.add("is-visible");
    return;
  }

  const heroInners = document.querySelectorAll(".hero-line-inner");
  if (heroInners.length) {
    gsap.set(heroInners, { yPercent: 110, rotate: 3 });
    const loadTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    loadTl.to(heroInners, {
      yPercent: 0,
      rotate: 0,
      duration: 1.15,
      stagger: 0.12,
      delay: 0.15,
    });
    loadTl.from(
      ".hero-badge, .hero-sub, .hero-actions, .hero-meta > *",
      { opacity: 0, y: 28, duration: 0.65, stagger: 0.08 },
      "-=0.55",
    );
  }

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });

  const timelineEl = document.getElementById("timeline");
  if (timelineEl) {
    ScrollTrigger.create({
      trigger: timelineEl,
      start: "top 75%",
      once: true,
      onEnter: () => timelineEl.classList.add("is-visible"),
    });
    gsap.from(".tl-item .tl-card", {
      opacity: 0,
      x: 40,
      duration: 0.75,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: timelineEl,
        start: "top 78%",
        once: true,
      },
    });
  }

  gsap.utils.toArray(".skill-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateY: px * 8,
        rotateX: -py * 8,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 600,
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    });
  });

  const statNums = document.querySelectorAll(".stat-card .num");
  statNums.forEach((node) => {
    const label = node.textContent.trim();
    if (label === "11+") {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: ".stats",
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            obj,
            { val: 0 },
            {
              val: 11,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = Math.round(obj.val) + "+";
              },
            },
          );
        },
      });
    } else if (label === "3×") {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: ".stats",
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            obj,
            { val: 0 },
            {
              val: 3,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = Math.round(obj.val) + "×";
              },
            },
          );
        },
      });
    }
  });
})();
