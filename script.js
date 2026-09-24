(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Skeleton loaders for every image on the page: show a pulsing placeholder
  // until each image has actually decoded, then reveal it.
  Array.prototype.forEach.call(document.querySelectorAll("img"), function (img) {
    img.classList.add("img-skeleton");

    function markLoaded() {
      img.classList.add("is-loaded");
    }

    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    }
  });

  // Testimonials marquee: duplicate each column's cards once so the
  // translateY(-50%) loop wraps seamlessly, unless motion is reduced.
  if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    Array.prototype.forEach.call(document.querySelectorAll(".testimonials-track"), function (track) {
      var items = Array.prototype.slice.call(track.children);
      items.forEach(function (item) {
        track.appendChild(item.cloneNode(true));
      });
    });
  }

  // Demo video modal (AI calling agent)
  var demoOpenBtn = document.getElementById("demo-open");
  var demoModal = document.getElementById("demo-modal");
  var demoCloseBtn = document.getElementById("demo-close");
  var demoBackdrop = document.getElementById("demo-backdrop");
  var demoVideo = document.getElementById("demo-video");

  if (demoOpenBtn && demoModal && demoVideo) {
    var demoLastFocused = null;

    function openDemo() {
      demoLastFocused = document.activeElement;
      demoModal.hidden = false;
      document.body.style.overflow = "hidden";
      if (demoCloseBtn) {
        demoCloseBtn.focus();
      }
      demoVideo.play().catch(function () {});
    }

    function closeDemo() {
      demoModal.hidden = true;
      document.body.style.overflow = "";
      demoVideo.pause();
      if (demoLastFocused && demoLastFocused.focus) {
        demoLastFocused.focus();
      }
    }

    demoOpenBtn.addEventListener("click", openDemo);
    if (demoCloseBtn) {
      demoCloseBtn.addEventListener("click", closeDemo);
    }
    if (demoBackdrop) {
      demoBackdrop.addEventListener("click", closeDemo);
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !demoModal.hidden) {
        closeDemo();
      }
    });
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
      path.setAttribute("stroke-opacity", String(Math.min(0.12 + i * 0.018, 0.5)));
      path.classList.add("flow-path");
      svg.appendChild(path);
    }

    host.appendChild(svg);

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Animate a small traveling gap along each path's own measured length using
    // native SVG SMIL <animate> (CSS keyframes animating toward a custom-property
    // calc() value don't interpolate reliably per-element here). Most of the stroke
    // stays lit (large "on" segment) so the line is always visible even though most
    // of its length sweeps outside the viewBox — only the thin gap circles around,
    // which reads as a continuous flow instead of a hard blink.
    Array.prototype.forEach.call(svg.querySelectorAll(".flow-path"), function (p) {
      var len = p.getTotalLength();
      if (!len) return;
      var gap = len * (0.08 + Math.random() * 0.1);
      p.setAttribute("stroke-dasharray", (len - gap).toFixed(2) + " " + gap.toFixed(2));

      if (reduceMotion) return;

      var dur = (9 + Math.random() * 9).toFixed(2);
      var animate = document.createElementNS(svgNS, "animate");
      animate.setAttribute("attributeName", "stroke-dashoffset");
      animate.setAttribute("from", "0");
      animate.setAttribute("to", (position < 0 ? len : -len).toFixed(2));
      animate.setAttribute("dur", dur + "s");
      animate.setAttribute("begin", (Math.random() * -dur).toFixed(2) + "s");
      animate.setAttribute("repeatCount", "indefinite");
      p.appendChild(animate);
    });
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

      // Split into words and the whitespace between them (keeping the
      // delimiters) so each word's letters share one inline-block wrapper.
      // Adjacent inline-block letter spans each count as their own
      // breakable "atomic inline", so without this a line can wrap
      // mid-word; the wrapper keeps a word's letters glued together while
      // still allowing wraps at the real spaces between words.
      segment.text.split(/(\s+)/).forEach(function (token) {
        if (token === "") {
          return;
        }
        if (/^\s+$/.test(token)) {
          container.appendChild(document.createTextNode(token));
          return;
        }
        var word = document.createElement("span");
        word.className = "word";
        token.split("").forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "letter";
          span.textContent = ch;
          span.style.transitionDelay = index * 22 + "ms";
          index += 1;
          word.appendChild(span);
        });
        container.appendChild(word);
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
