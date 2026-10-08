/* ==========================================================================
   Dream Spaces Interior Designs — script.js
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- Sticky nav + scroll progress ---------- */
  const navbar = document.querySelector(".navbar");
  const progress = document.querySelector(".scroll-progress");

  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop;
    if(navbar) navbar.classList.toggle("is-scrolled", y > 40);

    if(progress){
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }

    const backTop = document.querySelector(".back-to-top");
    if(backTop) backTop.classList.toggle("show", y > 600);
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if(navToggle && navLinks){
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", navLinks.classList.contains("open"));
    });
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }

  /* ---------- Dark mode ---------- */
  const themeToggles = document.querySelectorAll(".theme-toggle");
  const root = document.documentElement;
  const savedTheme = (typeof window !== "undefined" && window.__dsTheme) || null;

  function applyTheme(t){
    root.setAttribute("data-theme", t);
    window.__dsTheme = t;
    themeToggles.forEach(btn => {
      btn.innerHTML = t === "dark" ? sunIcon() : moonIcon();
    });
  }
  function moonIcon(){ return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>'; }
  function sunIcon(){ return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'; }

  applyTheme(savedTheme || "light");
  themeToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector(".back-to-top");
  if(backTop){
    backTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  }

  /* ---------- Project filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = cat === "all" || card.dataset.category === cat;
        card.classList.toggle("hide", !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.querySelector(".lightbox");
  if(lightbox){
    const lbImg = lightbox.querySelector("img");
    const lbCat = lightbox.querySelector(".project-cat");
    const lbTitle = lightbox.querySelector(".lightbox-info h3");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lb-prev");
    const nextBtn = lightbox.querySelector(".lb-next");
    let items = [];
    let idx = 0;

    function refreshItems(){
      items = Array.from(document.querySelectorAll(".project-card:not(.hide)"));
    }

    function openAt(i){
      refreshItems();
      if(!items.length) return;
      idx = (i + items.length) % items.length;
      const card = items[idx];
      lbImg.src = card.querySelector("img").src;
      lbImg.alt = card.querySelector("img").alt;
      lbCat.textContent = card.dataset.category;
      lbTitle.textContent = card.querySelector(".project-title")?.textContent || "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => {
        refreshItems();
        const i = items.indexOf(card);
        openAt(i);
      });
    });

    function close(){
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    closeBtn?.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => { if(e.target === lightbox) close(); });
    prevBtn?.addEventListener("click", () => openAt(idx - 1));
    nextBtn?.addEventListener("click", () => openAt(idx + 1));
    document.addEventListener("keydown", (e) => {
      if(!lightbox.classList.contains("open")) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowRight") openAt(idx + 1);
      if(e.key === "ArrowLeft") openAt(idx - 1);
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector("#contactForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      const success = document.querySelector(".form-success");
      form.reset();
      if(success){
        success.classList.add("show");
        setTimeout(() => success.classList.remove("show"), 6000);
      }
    });
  }

  /* ---------- Lazy loading fallback (native + observer safeguard) ---------- */
  if("loading" in HTMLImageElement.prototype === false){
    const lazyImgs = document.querySelectorAll("img[loading='lazy']");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          if(img.dataset.src) img.src = img.dataset.src;
          io.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => io.observe(img));
  }

  /* ---------- Scroll reveal (subtle) ---------- */
  const revealEls = document.querySelectorAll(".service-card, .feature-card, .testi-card, .project-card, .mvv-card, .process-step");
  if("IntersectionObserver" in window){
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.style.transition = "opacity .6s ease, transform .6s ease";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold:.12 });
    revealEls.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      revealIO.observe(el);
    });
  }

  /* ---------- Active nav link by current page ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path || (path === "" && href === "index.html")){
      a.classList.add("active");
    }
  });

})();

/*-------------------loader--------------------*/
window.addEventListener("load", function () {

    setTimeout(function () {

        document.getElementById("loader").style.opacity = "0";
        document.getElementById("loader").style.visibility = "hidden";

    },1500);

});