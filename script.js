(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Nav shadow on scroll */
  const nav = $("#navbar");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const toggle = $("#menuToggle"), menu = $("#mobileMenu");
  const setMenu = (open) => {
    menu.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "✕" : "☰";
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("active")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  matchMedia("(min-width:901px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* Menu filters */
  const buttons = $$(".filter-button"), items = $$(".menu-item");
  buttons.forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("active"));
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn);
      });
      items.forEach((i) => (i.hidden = btn.dataset.filter !== "all" && i.dataset.category !== btn.dataset.filter));
    });
  });

  /* Opening hours. 0 = Sunday ... 6 = Saturday; [open, close] in 24h, null = closed.
     CONFIRM THESE WITH THE CAFE BEFORE LAUNCH. */
  const HOURS = { 1: [6, 15], 2: [6, 21], 3: [6, 21], 4: [6, 22], 5: [6, 22], 6: [8, 22], 0: [14, 20] };
  const NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmt = (h) => {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return `${hh % 12 || 12}${mm ? ":" + String(mm).padStart(2, "0") : ""}${hh >= 12 ? "pm" : "am"}`;
  };
  const now = () => {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return { day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")], time: (+g("hour") % 24) + +g("minute") / 60 };
  };

  const list = $("#hoursList");
  if (list) {
    const today = now().day;
    list.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const h = HOURS[d];
      return `<div class="hours-row${d === today ? " today" : ""}"><span>${NAMES[d]}</span><span>${h ? fmt(h[0]) + " – " + fmt(h[1]) : "Closed"}</span></div>`;
    }).join("");
  }

  const status = $("#openStatus"), dot = $("#openDot");
  const update = () => {
    const { day, time } = now(), t = HOURS[day];
    const open = t && time >= t[0] && time < t[1];
    dot.classList.toggle("is-open", !!open);
    if (open) return (status.textContent = `Open now · Closes at ${fmt(t[1])}`);
    if (t && time < t[0]) return (status.textContent = `Closed now · Opens today at ${fmt(t[0])}`);
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HOURS[d]) return (status.textContent = `Closed now · Opens ${i === 1 ? "tomorrow" : NAMES[d]} at ${fmt(HOURS[d][0])}`);
    }
  };
  update();
  setInterval(update, 60000);

  $("#year").textContent = new Date().getFullYear();
})();

/* Scroll reveal + rating count-up */
(() => {
  const els = [...document.querySelectorAll(".reveal")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = (el) => {
    const to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (reduce || !("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll(".count").forEach(count);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  els.forEach((el) => { el.style.transitionDelay = (el.dataset.d || 0) + "ms"; io.observe(el); });
})();
