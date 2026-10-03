document.addEventListener("DOMContentLoaded", function () {
  // ===== AOS Initialization =====
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: "ease-out-cubic",
  });

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // ===== Mobile Menu Toggle =====
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");

  if (navToggle && navMenu && navOverlay) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      navOverlay.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    navOverlay.addEventListener("click", function () {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
      navOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // Close menu on link click
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        navOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // ===== Animated Counter (Stats) =====
  const statNumbers = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString();
        // Add + or % suffix if needed
        if (el.closest(".stat-box")) {
          const label = el.nextElementSibling.textContent;
          if (label.includes("%")) {
            el.textContent = target + "%";
          } else if (label.includes("+") || target > 1000) {
            el.textContent = target.toLocaleString() + "+";
          }
        }
      }
    };

    updateCounter();
  };

  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  statNumbers.forEach((stat) => counterObserver.observe(stat));

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 80;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== Form Validation Enhancement =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const requiredFields = contactForm.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "var(--danger)";
          field.addEventListener(
            "input",
            function () {
              this.style.borderColor = "";
            },
            { once: true },
          );
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  // ===== Parallax Effect for Hero Shapes =====
  const heroShapes = document.querySelectorAll(".shape");

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    heroShapes.forEach((shape, index) => {
      const speed = 0.2 + index * 0.1;
      shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // ===== Lazy Loading Images =====
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
});
