/*
 * LYMAO — Comportements du site
 *
 * Corrections par rapport à la version précédente :
 * - Le menu mobile n'était géré qu'une fois (deux gestionnaires ouvraient puis refermaient le menu).
 * - Plus d'exception sur les liens href="#" (querySelector('#') est invalide).
 * - Les compteurs conservent leur suffixe (« + » ou « % ») au lieu de le perdre.
 * - AOS n'est initialisé qu'à un seul endroit, et désactivé si l'utilisateur réduit les animations.
 * - Le verrou de défilement passe par la classe « nav-open » (utilisée par la feuille de style).
 * - Parallaxe retirée (défilement non optimisé, mouvement inutile).
 * - Carrousel d'accueil (ex-slider.js) et galerie (filtres, visionneuse) intégrés ici.
 */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("DOMContentLoaded", function () {
        initNavbarScroll();
        initMobileMenu();
        initCounters();
        initContactForm();
        initFAQ();
        initPrintButtons();
        initSliders();
        initGallery();
    });

    /* ----------------------------------------------------------
       Carrousel de la page d'accueil (voir la documentation dans les commentaires HTML)
       Conforme WCAG 2.2.2 : bouton pause visible, arrêt si mouvement réduit.
       ---------------------------------------------------------- */
    function initSliders() {
        document.querySelectorAll("[data-slider]").forEach(initSlider);
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
       Attribut : data-count="2000" (le texte de l'élément donne le préfixe et le suffixe)
       La valeur affichée avant l'animation doit être la valeur finale.
       ---------------------------------------------------------- */
    function initCounters() {
        var counters = document.querySelectorAll("[data-count]");
        if (!counters.length) {
            return;
        }

        // Le texte d'origine (ex. « +2000 », « 98 % ») donne le préfixe et le suffixe :
        // le texte affiché reste identique à celui de la page.
        var format = function (value, prefix, suffix) {
            return (prefix || "") + String(value) + (suffix || "");
        };

        var run = function (el) {
            var target = parseInt(el.getAttribute("data-count"), 10);
            if (!isFinite(target)) {
                return;
            }

            var text = el.textContent.trim();
            var match = text.match(/^(\D*)\d[\d\s.,]*(\D*)$/);
            var prefix = match ? match[1] : "";
            var suffix = match ? match[2] : "";

            if (reduceMotion) {
                el.textContent = format(target, prefix, suffix);
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
                el.textContent = format(Math.round(target * eased), prefix, suffix);
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

    function initSlider(root) {
        var slides = [].slice.call(root.querySelectorAll(".slider-slide"));
        var dots = [].slice.call(root.querySelectorAll(".slider-dot"));
        var prevBtn = root.querySelector(".slider-prev");
        var nextBtn = root.querySelector(".slider-next");
        var pauseBtn = root.querySelector(".slider-pause");
        var pauseIcon = pauseBtn ? pauseBtn.querySelector("i") : null;
        var interval = parseInt(root.getAttribute("data-interval"), 10) || 5000;

        // Un seul diaporama : inutile de le piloter
        if (slides.length < 2) {
            return;
        }

        var index = 0;
        var timer = null;
        var userPaused = reduceMotion; // démarre à l'arrêt si l'utilisateur réduit les animations
        var hovered = false;
        var focused = false;
        var offscreen = false;

        // Les contrôles n'apparaissent que si le script fonctionne
        root.classList.add("is-enhanced");

        function show(i) {
            var n = slides.length;
            index = ((i % n) + n) % n;

            slides.forEach(function (slide, k) {
                slide.classList.toggle("is-active", k === index);
            });

            dots.forEach(function (dot, k) {
                var active = k === index;
                dot.classList.toggle("is-active", active);
                if (active) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        function canRun() {
            return !userPaused && !hovered && !focused && !offscreen && !document.hidden;
        }

        // Relance le minuteur selon l'état courant (appelé après chaque changement d'état)
        function sync() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            if (canRun()) {
                timer = setInterval(function () {
                    show(index + 1);
                }, interval);
            }
        }

        function setPauseLabel() {
            if (!pauseBtn) {
                return;
            }
            if (userPaused) {
                pauseBtn.setAttribute("aria-label", "Lancer le diaporama");
                if (pauseIcon) {
                    pauseIcon.className = "fas fa-play";
                }
            } else {
                pauseBtn.setAttribute("aria-label", "Mettre le diaporama en pause");
                if (pauseIcon) {
                    pauseIcon.className = "fas fa-pause";
                }
            }
        }

        // Navigation manuelle : on repart d'un intervalle complet pour laisser le temps de lire
        function goTo(i) {
            show(i);
            sync();
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () { goTo(index - 1); });
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", function () { goTo(index + 1); });
        }
        dots.forEach(function (dot, k) {
            dot.addEventListener("click", function () { goTo(k); });
        });

        if (pauseBtn) {
            pauseBtn.addEventListener("click", function () {
                userPaused = !userPaused;
                setPauseLabel();
                sync();
            });
        }

        // Pause au survol (souris uniquement)
        root.addEventListener("mouseenter", function () { hovered = true; sync(); });
        root.addEventListener("mouseleave", function () { hovered = false; sync(); });

        // Pause pendant la navigation clavier dans le carrousel
        root.addEventListener("focusin", function () { focused = true; sync(); });
        root.addEventListener("focusout", function (event) {
            if (!root.contains(event.relatedTarget)) {
                focused = false;
                sync();
            }
        });

        // Flèches gauche et droite quand le focus est dans le carrousel
        root.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(index + 1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(index - 1);
            }
        });

        // Glissement au doigt (horizontal uniquement, pour ne pas gêner le défilement de la page)
        var startX = null;
        var startY = null;
        root.addEventListener("pointerdown", function (event) {
            startX = event.clientX;
            startY = event.clientY;
        });
        root.addEventListener("pointerup", function (event) {
            if (startX === null) {
                return;
            }
            var dx = event.clientX - startX;
            var dy = event.clientY - startY;
            startX = null;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                goTo(dx < 0 ? index + 1 : index - 1);
            }
        });

        // Arrêt quand le carrousel n'est pas visible à l'écran
        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                offscreen = !entries[0].isIntersecting;
                sync();
            }, { threshold: 0.25 });
            observer.observe(root);
        }

        // Arrêt quand l'onglet du navigateur est caché
        document.addEventListener("visibilitychange", sync);

        show(0);
        setPauseLabel();
        sync();
    }

    /* ----------------------------------------------------------
       Galerie : filtres et visionneuse
       Le filtre n'affiche que les catégories et types présents.
       ---------------------------------------------------------- */
    function initGallery() {
        var grid = document.getElementById("galleryGrid");
        var lightbox = document.getElementById("lightbox");
        if (!grid || !lightbox) {
            return;
        }

        var filterBtns = [].slice.call(document.querySelectorAll(".filter-btn"));
        var items = [].slice.call(grid.querySelectorAll(".gallery-item"));
        var closeBtn = lightbox.querySelector(".lightbox-close");
        var prevBtn = lightbox.querySelector(".lightbox-prev");
        var nextBtn = lightbox.querySelector(".lightbox-next");
        var imgEl = document.getElementById("lightboxImg");
        var iframeEl = document.getElementById("lightboxIframe");
        var captionEl = document.getElementById("lightboxCaption");

        var matches = function (item, btn) {
            var type = btn.getAttribute("data-filter");
            var cat = btn.getAttribute("data-category");
            var okType = !type || type === "all" || item.getAttribute("data-type") === type;
            var okCat = !cat || item.getAttribute("data-category") === cat;
            return okType && okCat;
        };

        // Masquer les filtres qui ne correspondent à aucun élément
        filterBtns.forEach(function (btn) {
            if (btn.getAttribute("data-filter") === "all") {
                return;
            }
            var count = items.filter(function (item) { return matches(item, btn); }).length;
            if (count === 0) {
                btn.hidden = true;
            }
        });

        // Filtres
        filterBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                filterBtns.forEach(function (other) {
                    var on = other === btn;
                    other.classList.toggle("active", on);
                    other.setAttribute("aria-pressed", String(on));
                });
                items.forEach(function (item) {
                    item.hidden = !matches(item, btn);
                });
            });
        });

        // Visionneuse
        var list = [];
        var index = 0;
        var lastLink = null;

        var visibleLinks = function () {
            return items.filter(function (it) { return !it.hidden; })
                        .map(function (it) { return it.querySelector(".gallery-link"); });
        };

        var show = function (link) {
            var isVideo = link.classList.contains("video-link");
            var src = link.getAttribute("href");
            var title = link.getAttribute("data-title") || "";

            imgEl.hidden = true;
            iframeEl.hidden = true;
            imgEl.removeAttribute("src");
            iframeEl.removeAttribute("src");

            if (isVideo) {
                iframeEl.src = src;
                iframeEl.hidden = false;
            } else {
                imgEl.src = src;
                imgEl.alt = title;
                imgEl.hidden = false;
            }
            captionEl.textContent = title;

            list = visibleLinks();
            index = list.indexOf(link);
            lastLink = link;

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeBtn.focus();
        };

        var close = function () {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            imgEl.removeAttribute("src");
            iframeEl.removeAttribute("src");
            document.body.style.overflow = "";
            if (lastLink) {
                lastLink.focus();
            }
        };

        var navigate = function (direction) {
            if (!list.length) {
                return;
            }
            var next = (index + direction + list.length) % list.length;
            show(list[next]);
        };

        items.forEach(function (item) {
            var link = item.querySelector(".gallery-link");
            if (link) {
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    show(link);
                });
            }
        });

        closeBtn.addEventListener("click", close);
        if (prevBtn) { prevBtn.addEventListener("click", function () { navigate(-1); }); }
        if (nextBtn) { nextBtn.addEventListener("click", function () { navigate(1); }); }
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                close();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (!lightbox.classList.contains("active")) {
                return;
            }
            if (event.key === "Escape") {
                close();
            } else if (event.key === "ArrowLeft") {
                navigate(-1);
            } else if (event.key === "ArrowRight") {
                navigate(1);
            } else if (event.key === "Tab") {
                // Le focus reste dans la visionneuse
                var focusable = [closeBtn, prevBtn, nextBtn].filter(function (el) {
                    return el && el.offsetParent !== null;
                });
                if (!focusable.length) {
                    return;
                }
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
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
