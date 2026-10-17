(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("DOMContentLoaded", function () {
        initAOS();
        initNavbarScroll();
        initMobileMenu();
        initCounters();
        initContactForm();
        initFAQ();
        initPrintButtons();
    });

    /* ----------------------------------------------------------
       Animations au défilement
       ---------------------------------------------------------- */
    function initAOS() {
        if (!window.AOS) {
            return;
        }
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: "ease-out-cubic",
            disable: reduceMotion
        });
    }

    /* ----------------------------------------------------------
       Ombre de la barre de navigation après un défilement
       ---------------------------------------------------------- */
    function initNavbarScroll() {
        var navbar = document.getElementById("navbar");
        if (!navbar) {
            return;
        }

        var update = function () {
            navbar.classList.toggle("scrolled", window.pageYOffset > 50);
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    /* ----------------------------------------------------------
       Menu mobile : une seule gestion, accessible
       ---------------------------------------------------------- */
    function initMobileMenu() {
        var toggle = document.getElementById("navToggle");
        var menu = document.getElementById("navMenu");
        var overlay = document.getElementById("navOverlay");

        if (!toggle || !menu) {
            return;
        }

        var isOpen = function () {
            return menu.classList.contains("active");
        };

        var setOpen = function (open) {
            toggle.classList.toggle("active", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
            menu.classList.toggle("active", open);
            if (overlay) {
                overlay.classList.toggle("active", open);
            }
            document.body.classList.toggle("nav-open", open);
        };

        toggle.addEventListener("click", function () {
            setOpen(!isOpen());
        });

        if (overlay) {
            overlay.addEventListener("click", function () {
                setOpen(false);
            });
        }

        menu.querySelectorAll(".nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                setOpen(false);
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen()) {
                setOpen(false);
                toggle.focus();
            }
        });

        // Si l'écran repasse en grand format, on referme le menu mobile
        var wideScreen = window.matchMedia("(min-width: 769px)");
        var closeOnWide = function (event) {
            if (event.matches) {
                setOpen(false);
            }
        };
        if (wideScreen.addEventListener) {
            wideScreen.addEventListener("change", closeOnWide);
        } else {
            wideScreen.addListener(closeOnWide); // anciens navigateurs
        }
    }

    /* ----------------------------------------------------------
       Compteurs animés (chiffres clés)
       Attributs : data-count="2000" data-suffix="+"
       La valeur affichée avant l'animation doit être la valeur finale.
       ---------------------------------------------------------- */
    function initCounters() {
        var counters = document.querySelectorAll("[data-count]");
        if (!counters.length) {
            return;
        }

        var format = function (value, suffix) {
            return value.toLocaleString("fr-FR") + (suffix || "");
        };

        var run = function (el) {
            var target = parseInt(el.getAttribute("data-count"), 10);
            var suffix = el.getAttribute("data-suffix") || "";

            if (!isFinite(target)) {
                return;
            }
            if (reduceMotion) {
                el.textContent = format(target, suffix);
                return;
            }

            var duration = 1600;
            var start = null;

            var tick = function (now) {
                if (start === null) {
                    start = now;
                }
                var progress = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = format(Math.round(target * eased), suffix);
                if (progress < 1) {
                    window.requestAnimationFrame(tick);
                }
            };

            window.requestAnimationFrame(tick);
        };

        if (!("IntersectionObserver" in window)) {
            counters.forEach(run);
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    run(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------------
       Formulaire de contact : contrôle des champs obligatoires
       Le formulaire a l'attribut novalidate : la validation
       navigateur est désactivée, celle-ci la remplace.
       ---------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById("contactForm");
        if (!form) {
            return;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.addEventListener("submit", function (event) {
            var firstInvalid = null;

            form.querySelectorAll("[required]").forEach(function (field) {
                var value = (field.value || "").trim();
                var invalid = value === "";

                if (!invalid && field.type === "email") {
                    invalid = !emailPattern.test(value);
                }

                field.setAttribute("aria-invalid", String(invalid));
                if (invalid && !firstInvalid) {
                    firstInvalid = field;
                }
            });

            if (firstInvalid) {
                event.preventDefault();
                firstInvalid.focus();
                return;
            }

            // Empêche un double envoi
            var submit = form.querySelector('button[type="submit"]');
            if (submit) {
                submit.disabled = true;
            }
        });
    }

    /* ----------------------------------------------------------
       FAQ : recherche et filtres par catégorie
       Les questions utilisent <details>, donc l'accordéon fonctionne sans JavaScript.
       ---------------------------------------------------------- */
    function initFAQ() {
        var search = document.getElementById("faqSearch");
        var buttons = document.querySelectorAll(".faq-page .cat-btn");
        var sections = document.querySelectorAll(".faq-page .faq-categorie");
        var empty = document.getElementById("faqEmpty");

        if (!sections.length) {
            return;
        }

        var currentCategory = "all";

        var apply = function () {
            var term = search ? search.value.trim().toLowerCase() : "";
            var visibleTotal = 0;

            sections.forEach(function (section) {
                var inCategory = currentCategory === "all" || section.getAttribute("data-category") === currentCategory;
                var visibleInSection = 0;

                section.querySelectorAll(".faq-item").forEach(function (item) {
                    var matches = term === "" || item.textContent.toLowerCase().indexOf(term) !== -1;
                    item.hidden = !matches;
                    if (matches) {
                        visibleInSection++;
                    }
                });

                section.hidden = !inCategory || visibleInSection === 0;
                if (inCategory) {
                    visibleTotal += visibleInSection;
                }
            });

            if (empty) {
                empty.hidden = visibleTotal > 0;
            }
        };

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                currentCategory = button.getAttribute("data-filter");
                buttons.forEach(function (other) {
                    var active = other === button;
                    other.classList.toggle("is-active", active);
                    other.setAttribute("aria-pressed", String(active));
                });
                apply();
            });
        });

        if (search) {
            search.addEventListener("input", apply);
        }
    }

    /* ----------------------------------------------------------
       Boutons « Imprimer » (ex. calendrier)
       Usage : <button data-print>…</button>
       ---------------------------------------------------------- */
    function initPrintButtons() {
        document.querySelectorAll("[data-print]").forEach(function (button) {
            button.addEventListener("click", function () {
                window.print();
            });
        });
    }
})();
