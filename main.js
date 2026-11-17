/* =========================================================
   Your Barber – הגדרות העסק
   👇 כאן משנים טלפון, וואטסאפ, כתובת והודעה מוכנה.
   כל הכפתורים באתר מתעדכנים אוטומטית מהערכים האלה.
   (כל הערכים כרגע לדוגמה בלבד!)
   ========================================================= */
const CONFIG = {
  // טלפון לתצוגה באתר
  phoneDisplay: "050-000-0000",
  // טלפון לחיוג (פורמט בינלאומי, בלי רווחים ומקפים)
  phoneDial: "+972500000000",
  // מספר וואטסאפ: 972 + המספר בלי ה-0 שבהתחלה, בלי + ובלי מקפים
  whatsapp: "972500000000",
  // ההודעה שתופיע מוכנה בוואטסאפ
  whatsappMessage: "היי 👑 אשמח לקבוע תור",
  // כתובת המספרה (מוצגת באתר ומשמשת לניווט ולמפה)
  address: "רחוב הדוגמה 1, תל אביב",
};

(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- חיבור כל הקישורים לפרטי העסק ---------- */
  const waLink = (service) => {
    const text = service
      ? `${CONFIG.whatsappMessage} ל${service}`
      : CONFIG.whatsappMessage;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  };
  const mapsQuery = encodeURIComponent(CONFIG.address);

  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.service);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach((el) => { el.href = `tel:${CONFIG.phoneDial}`; });
  document.querySelectorAll("[data-phone-text]").forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
  document.querySelectorAll("[data-address]").forEach((el) => { el.textContent = CONFIG.address; });
  document.querySelectorAll("[data-maps]").forEach((el) => {
    el.href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  });
  const map = document.querySelector("[data-map-embed]");
  if (map) map.src = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header בגלילה ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- תפריט מובייל ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- סימון הקישור הפעיל בתפריט ---------- */
  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- אנימציות כניסה ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => {
    // השהיה מדורגת לאלמנטים שכנים (כרטיסים, תמונות)
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (siblings.length > 2) el.style.transitionDelay = `${(i % 3) * 0.12}s`;
    revealObs.observe(el);
  });

  /* ---------- מונים באזור אודות ---------- */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1800;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("he-IL") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => counterObs.observe(el));

  /* ---------- Lightbox לגלריה ---------- */
  const items = [...document.querySelectorAll(".g-item")];
  const box = document.getElementById("lightbox");
  const boxImg = box.querySelector(".lightbox__img");
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + items.length) % items.length;
    const item = items[current];
    boxImg.src = item.dataset.full;
    boxImg.alt = item.querySelector("img").alt;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    box.querySelector(".lightbox__close").focus();
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { box.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((item, i) => item.addEventListener("click", () => open(i)));
  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lightbox__nav--next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    // ב-RTL: חץ ימינה = הקודם, חץ שמאלה = הבא
    if (e.key === "ArrowRight") show(current - 1);
    if (e.key === "ArrowLeft") show(current + 1);
  });

  /* ---------- גיבוי לתמונות שלא נטענו ---------- */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.visibility = "hidden";
      if (img.parentElement) img.parentElement.style.background = "linear-gradient(135deg,#1a1a1d,#2a2418)";
    }, { once: true });
  });
})();
