document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ===== 1. AOS Initialization =====
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }

  // ===== 2. Navbar Scroll Effect =====
  // Utilisation de querySelector pour plus de sécurité si l'ID change
  const navbar = document.querySelector(".navbar") || document.getElementById("navbar");
  
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // ===== 3. Mobile Menu Toggle (UNIFIÉ ET SANS DOUBLON) =====
  const navToggle = document.querySelector(".nav-toggle") || document.getElementById("navToggle");
  const navMenu = document.querySelector(".nav-menu") || document.getElementById("navMenu");
  const navOverlay = document.querySelector(".nav-overlay") || document.getElementById("navOverlay");

  // Fonction pour fermer le menu proprement
  function closeMobileMenu() {
    if (navToggle) navToggle.classList.remove("active");
    if (navMenu) navMenu.classList.remove("active");
    if (navOverlay) navOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Réactive le scroll sur mobile
  }

  if (navToggle && navMenu) {
    // Ouvrir / Fermer au clic sur le hamburger
    navToggle.addEventListener("click", function () {
      const isActive = navMenu.classList.contains("active");
      
      if (!isActive) {
        navToggle.classList.add("active");
        navMenu.classList.add("active");
        if (navOverlay) navOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Empêche le scroll du fond sur mobile
      } else {
        closeMobileMenu();
      }
    });

    // Fermer au clic sur l'overlay (fond noir)
    if (navOverlay) {
      navOverlay.addEventListener("click", closeMobileMenu);
    }

    // Fermer le menu quand on clique sur un lien (très important pour le responsive)
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  // ===== 4. Animated Counter (Stats) =====
  const statNumbers = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString("fr-FR");
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString("fr-FR");
        // Ajout des suffixes + ou % si nécessaire
        if (el.closest(".stat-box")) {
          const label = el.nextElementSibling ? el.nextElementSibling.textContent : "";
          if (label.includes("%")) {
            el.textContent = target + "%";
          } else if (label.includes("+") || target > 1000) {
            el.textContent = target.toLocaleString("fr-FR") + "+";
          }
        }
      }
    };
    updateCounter();
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => counterObserver.observe(stat));

  // ===== 5. Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        // Calcul dynamique de la hauteur de la navbar pour un scroll précis
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== 6. Form Validation Enhancement =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const requiredFields = contactForm.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "var(--danger, #ef4444)";
          
          // Retire l'erreur dès que l'utilisateur tape
          field.addEventListener("input", function () {
            this.style.borderColor = "";
          }, { once: true });
        }
      });

      if (!isValid) {
        e.preventDefault();
        // Amélioration responsive : scroller vers le premier champ en erreur
        const firstError = contactForm.querySelector("[required]:invalid, [style*='border-color']");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
      }
    });
  }

  // ===== 7. Parallax Effect for Hero Shapes =====
  const heroShapes = document.querySelectorAll(".shape");
  // Désactivé sur mobile (< 768px) pour éviter les saccades et économiser la batterie
  if (heroShapes.length > 0 && window.innerWidth > 768) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      heroShapes.forEach((shape, index) => {
        const speed = 0.2 + index * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // ===== 8. Lazy Loading Images =====
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
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
  } else {
    // Fallback pour les très vieux navigateurs
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

});
