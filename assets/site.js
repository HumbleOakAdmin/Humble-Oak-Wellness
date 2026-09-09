(function () {
  var nav = document.getElementById("howNav");
  var navToggle = document.getElementById("howNavToggle");
  var navBackdrop = document.getElementById("howNavBackdrop");
  var progress = document.getElementById("howScrollProgress");
  var lastFocus = null;

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (navBackdrop) navBackdrop.classList.toggle("is-visible", open);
    if (open) {
      lastFocus = document.activeElement;
      var first = nav.querySelector(".how-nav-link, .how-nav-cta, .how-nav-logo");
      if (first) first.focus();
    } else if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  document.querySelectorAll(".how-nav-links a, .how-nav-cta, .how-nav-logo").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNavOpen(false);
    if (!nav || !nav.classList.contains("is-open") || e.key !== "Tab") return;
    var focusable = nav.querySelectorAll("a, button");
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progress.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var baseEl = document.querySelector("base");
  if (baseEl) {
    var homeHref = baseEl.href;
    document
      .querySelectorAll(
        ".how-nav-link[data-page='home'], .how-nav-logo, .how-footer-links a[data-page='home']"
      )
      .forEach(function (link) {
        link.setAttribute("href", homeHref);
      });
  }

  function normalizePath(path) {
    if (!path) return "/";
    path = path.replace(/\/index\.html$/i, "").replace(/\/+$/, "");
    return path || "/";
  }

  var page = document.body.getAttribute("data-page");
  var currentPath = normalizePath(window.location.pathname);
  var basePath = normalizePath(
    document.querySelector("base")
      ? new URL(document.querySelector("base").href).pathname
      : currentPath
  );

  document.querySelectorAll(".how-nav-link").forEach(function (link) {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    var linkPage = link.getAttribute("data-page");
    if (linkPage !== page) return;
    if (linkPage === "home" && currentPath !== basePath) return;
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll(".how-footer-links a[data-page]").forEach(function (link) {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var anims = document.querySelectorAll(".how-anim");
  if (anims.length) {
    if (reduceMotion) {
      anims.forEach(function (el) {
        el.classList.add("visible");
      });
    } else {
      var delayIndex = 0;
      var lastParent = null;
      anims.forEach(function (el) {
        var parent = el.parentElement;
        if (parent !== lastParent) {
          delayIndex = 0;
          lastParent = parent;
        }
        if (delayIndex > 0 && delayIndex <= 5) {
          el.setAttribute("data-delay", String(delayIndex));
        }
        delayIndex += 1;
      });

      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      anims.forEach(function (el) {
        obs.observe(el);
      });
    }
  }

  var counters = document.querySelectorAll(".how-stat-num");
  if (counters.length) {
    var cObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-target"), 10) || 0;
          if (reduceMotion) {
            el.textContent = String(target);
            cObs.unobserve(el);
            return;
          }
          var dur = 1500;
          var start = null;

          function frame(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(frame);
            else el.textContent = String(target);
          }
          requestAnimationFrame(frame);
          cObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      cObs.observe(el);
    });
  }

  var form = document.getElementById("howContactForm");
  if (form) {
    var status = document.getElementById("howFormStatus");
    var submitBtn = form.querySelector("button[type='submit']");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var first = form.querySelector("[name='firstName']").value.trim();
      var last = form.querySelector("[name='lastName']").value.trim();
      var email = form.querySelector("[name='email']").value.trim();
      var phone = form.querySelector("[name='phone']").value.trim();
      var service = form.querySelector("[name='service']").value.trim();
      var message = form.querySelector("[name='message']").value.trim();
      var subject = encodeURIComponent("Website Inquiry — Humble Oak Wellness");
      var body = encodeURIComponent(
        "Name: " +
          first +
          " " +
          last +
          "\nEmail: " +
          email +
          "\nPhone: " +
          phone +
          "\nService Interest: " +
          service +
          "\n\nMessage:\n" +
          message
      );
      if (submitBtn) {
        submitBtn.classList.add("is-busy");
        submitBtn.textContent = "Opening email…";
      }
      if (status) {
        status.hidden = false;
        status.textContent = "Your email app will open with a pre-filled message. If nothing happens, write us at info@humbleoakwellness.com.";
      }
      window.location.href =
        "mailto:info@humbleoakwellness.com?subject=" + subject + "&body=" + body;
      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.classList.remove("is-busy");
          submitBtn.textContent = "Send Message";
        }
      }, 4000);
    });
  }
})();
