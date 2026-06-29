(function () {
  var nav = document.getElementById("howNav");
  var navToggle = document.getElementById("howNavToggle");
  var navBackdrop = document.getElementById("howNavBackdrop");

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (navBackdrop) navBackdrop.classList.toggle("is-visible", open);
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  document.querySelectorAll(".how-nav-links a, .how-nav-cta, .how-nav-logo").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNavOpen(false);
  });

  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".how-nav-link").forEach(function (link) {
    if (link.getAttribute("data-page") === page) link.classList.add("active");
  });
  document.querySelectorAll(".how-footer-links a[data-page]").forEach(function (link) {
    if (link.getAttribute("data-page") === page) link.classList.add("active");
  });

  var anims = document.querySelectorAll(".how-anim");
  if (anims.length) {
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
      { threshold: 0.15 }
    );
    anims.forEach(function (el) {
      obs.observe(el);
    });
  }

  var counters = document.querySelectorAll(".how-stat-num");
  if (counters.length) {
    var cObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-target"), 10) || 0;
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
    form.addEventListener("submit", function (e) {
      e.preventDefault();
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
      window.location.href =
        "mailto:info@humbleoakwellness.com?subject=" + subject + "&body=" + body;
    });
  }
})();
