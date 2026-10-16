/* Creatiobs Creative Academy — vanilla JavaScript */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  // Sticky header / mobile navigation
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 30);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Active page indicator
  const pathParts = location.pathname.split("/");
  const current = pathParts.pop() || "index.html";
  const coursePages = [
    "graphic-design-course-dehradun.html",
    "video-editing-course-dehradun.html",
    "ui-ux-design-course-dehradun.html",
    "diploma-graphic-design-video-editing.html"
  ];
  const currentPage = pathParts.includes("blog") ? "blog" : (coursePages.includes(current) ? "courses" : (current.replace(".html", "") || "index"));
  document.querySelectorAll(".main-nav a[data-page]").forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add("active");
  });

  // Footer year
  document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Hero carousel
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".hero-slide")];
    const dots = [...carousel.querySelectorAll(".carousel-dots button")];
    const prev = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    let index = 0;
    let timer;

    const show = nextIndex => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), 5500); };
    const stop = () => clearInterval(timer);

    prev?.addEventListener("click", () => { show(index - 1); start(); });
    next?.addEventListener("click", () => { show(index + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); start(); }));
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Keyboard controls when the carousel has focus.
    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { show(index - 1); start(); }
      if (e.key === "ArrowRight") { show(index + 1); start(); }
    });

    // Basic touch/swipe support.
    let startX = 0;
    carousel.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX, { passive: true });
    carousel.addEventListener("touchend", e => {
      const delta = e.changedTouches[0].screenX - startX;
      if (Math.abs(delta) > 45) { show(index + (delta < 0 ? 1 : -1)); start(); }
    }, { passive: true });
    start();
  }

  // Infinite-feel brand marquee: duplicate cards and animate the track vertically.
  const logoTrack = document.querySelector(".logo-track");
  if (logoTrack && !logoTrack.dataset.cloned) {
    logoTrack.innerHTML += logoTrack.innerHTML;
    logoTrack.dataset.cloned = "true";
    logoTrack.style.animation = "marquee 28s linear infinite";
    const marquee = document.querySelector("[data-logo-marquee]");
    marquee?.addEventListener("mouseenter", () => logoTrack.style.animationPlayState = "paused");
    marquee?.addEventListener("mouseleave", () => logoTrack.style.animationPlayState = "running");
  }

  // Portfolio filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      button.classList.add("is-active");
      const filter = button.dataset.filter;
      portfolioItems.forEach(item => {
        item.classList.toggle("is-hidden", filter !== "all" && item.dataset.category !== filter);
      });
    });
  });

  // Portfolio modal / lightbox
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  document.querySelectorAll(".project-open").forEach(button => {
    button.addEventListener("click", () => {
      if (!modal) return;
      modalTitle.textContent = button.dataset.title || "Project";
      modalCategory.textContent = button.dataset.category || "STUDENT WORK";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modal.querySelector(".modal-close")?.focus();
    });
  });
  modal?.querySelectorAll("[data-modal-close]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // Demo form: frontend-only validation and confirmation.
  const form = document.getElementById("demoForm");
  const status = document.getElementById("formStatus");
  const trackEvent = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  };
  form?.addEventListener("submit", e => {
    e.preventDefault();
    status.className = "form-status";
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const course = form.course.value;
    const message = form.message.value.trim();
    const phoneOk = /^[0-9+\-\s()]{7,20}$/.test(phone);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !phone || !email || !course || !message) {
      status.textContent = "Please complete all fields before submitting.";
      status.classList.add("error");
      return;
    }
    if (!phoneOk) {
      status.textContent = "Please enter a valid phone number.";
      status.classList.add("error");
      return;
    }
    if (!emailOk) {
      status.textContent = "Please enter a valid email address.";
      status.classList.add("error");
      return;
    }
    trackEvent("admission_form_submit", { course });
    status.textContent = "Thanks — your enquiry has been validated locally. Connect a backend or form service to receive submissions.";
    status.classList.add("success");
    form.reset();
  });

  document.querySelectorAll(".track-click").forEach(link => {
    link.addEventListener("click", () => {
      trackEvent(link.dataset.track || "cta_click", { label: link.textContent.trim(), href: link.href });
    });
  });

  const blogSearch = document.getElementById("blogSearch");
  const blogCards = [...document.querySelectorAll(".blog-card")];
  const blogCategoryButtons = document.querySelectorAll("[data-blog-category]");
  let activeBlogCategory = "all";
  const filterBlog = () => {
    const query = (blogSearch?.value || "").trim().toLowerCase();
    blogCards.forEach(card => {
      const categoryMatch = activeBlogCategory === "all" || card.dataset.category === activeBlogCategory;
      const textMatch = !query || `${card.textContent} ${card.dataset.search || ""}`.toLowerCase().includes(query);
      card.classList.toggle("is-hidden", !categoryMatch || !textMatch);
    });
  };
  blogSearch?.addEventListener("input", filterBlog);
  blogCategoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeBlogCategory = button.dataset.blogCategory;
      blogCategoryButtons.forEach(b => b.classList.remove("is-active"));
      button.classList.add("is-active");
      filterBlog();
    });
  });

  const adminForm = document.getElementById("blogAdminForm");
  const adminOutput = document.getElementById("blogAdminOutput");
  adminForm?.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminForm).entries());
    const today = new Date().toISOString().slice(0, 10);
    const article = {
      title: data.title.trim(),
      metaDescription: data.description.trim(),
      h1: data.h1.trim(),
      slug: data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      category: data.category.trim(),
      author: data.author.trim(),
      featuredImageAlt: data.alt.trim(),
      publishedDate: today,
      updatedDate: today,
      body: data.body.trim()
    };
    localStorage.setItem(`creatiobs_article_${article.slug}`, JSON.stringify(article, null, 2));
    adminOutput.textContent = JSON.stringify(article, null, 2);
  });

  // Animated mentor counters.
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1100;
        const start = performance.now();
        const tick = now => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${Math.round(target * eased)}+`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.7 });
    counters.forEach(c => counterObserver.observe(c));
  }
});
