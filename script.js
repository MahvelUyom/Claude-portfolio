(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hero background paths (generative flowing line art, no images/gradients)
  var pathsHost = document.getElementById("hero-paths");
  if (pathsHost) {
    buildFloatingPaths(pathsHost, 1);
    buildFloatingPaths(pathsHost, -1);
  }

  function buildFloatingPaths(host, position) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 696 316");
    svg.setAttribute("fill", "none");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.classList.add("hero-paths-svg");

    var count = 30;
    for (var i = 0; i < count; i++) {
      var d =
        "M-" + (380 - i * 5 * position) + " -" + (189 + i * 6) +
        "C-" + (380 - i * 5 * position) + " -" + (189 + i * 6) +
        " -" + (312 - i * 5 * position) + " " + (216 - i * 6) +
        " " + (152 - i * 5 * position) + " " + (343 - i * 6) +
        "C" + (616 - i * 5 * position) + " " + (470 - i * 6) +
        " " + (684 - i * 5 * position) + " " + (875 - i * 6) +
        " " + (684 - i * 5 * position) + " " + (875 - i * 6);

      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "#2563eb");
      path.setAttribute("stroke-width", String(0.5 + i * 0.03));
      path.setAttribute("stroke-linecap", "round");
      path.classList.add("flow-path");
      path.style.animationDuration = (18 + Math.random() * 12).toFixed(2) + "s";
      path.style.animationDelay = (Math.random() * -20).toFixed(2) + "s";
      svg.appendChild(path);
    }

    host.appendChild(svg);
  }

  // Hero title letter cascade (replaces gradient-clip-text with a solid-color stagger).
  // Rebuilt from a fixed segment list (not parsed from markup) so source-indentation
  // whitespace never leaks in as stray "letters".
  var heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    var segments = [
      { text: "Web Developer building ", accent: false },
      { text: "landing pages", accent: true },
      { text: ", ", accent: false },
      { text: "AI chatbots", accent: true },
      { text: ", and ", accent: false },
      { text: "brand websites", accent: true },
      { text: ".", accent: false }
    ];

    var index = 0;
    heroTitle.textContent = "";

    segments.forEach(function (segment) {
      var container = segment.accent ? document.createElement("span") : heroTitle;
      if (segment.accent) {
        container.className = "accent";
      }

      segment.text.split("").forEach(function (ch) {
        if (ch === " ") {
          container.appendChild(document.createTextNode(" "));
          return;
        }
        var span = document.createElement("span");
        span.className = "letter";
        span.textContent = ch;
        span.style.transitionDelay = index * 22 + "ms";
        index += 1;
        container.appendChild(span);
      });

      if (segment.accent) {
        heroTitle.appendChild(container);
      }
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroTitle.classList.add("letters-in");
      });
    });
  }

  // Mobile nav toggle
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && header && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
