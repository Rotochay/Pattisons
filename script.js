/* =========================
   NAV SCROLL EFFECT
========================= */

const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});


/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});


/* =========================
   MENU FILTERS
========================= */

const filters = document.querySelectorAll(".filter");
const menuItems = document.querySelectorAll(".menu-item");

filters.forEach(filter => {

  filter.addEventListener("click", () => {

    const category = filter.dataset.category;

    filters.forEach(btn => {
      btn.classList.remove("active");
    });

    filter.classList.add("active");

    menuItems.forEach(item => {

      if (
        category === "all" ||
        item.dataset.category === category
      ) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }

    });

  });

});


/* =========================
   OPENING HOURS
========================= */

const openingHours = {
  1: [6, 15],   // Monday
  2: [6, 21],   // Tuesday
  3: [6, 21],   // Wednesday
  4: [6, 22],   // Thursday
  5: [6, 22],   // Friday
  6: [8, 22],   // Saturday
  0: [14, 20]   // Sunday
};

const openStatus = document.getElementById("openStatus");
const openDot = document.getElementById("openDot");

function updateOpeningStatus() {

  const now = new Date();

  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const currentTime = hour + minute / 60;

  const hours = openingHours[day];

  if (!hours) {
    openStatus.textContent = "Closed today";
    return;
  }

  const opening = hours[0];
  const closing = hours[1];

  if (
    currentTime >= opening &&
    currentTime < closing
  ) {

    openStatus.textContent =
      `Open now · Closes at ${formatHour(closing)}`;

    openDot.style.background = "#5d9b63";

  } else if (currentTime < opening) {

    openStatus.textContent =
      `Closed now · Opens at ${formatHour(opening)}`;

    openDot.style.background = "#c56d3d";

  } else {

    openStatus.textContent =
      "Closed now · See tomorrow's opening hours";

    openDot.style.background = "#c56d3d";

  }

}

function formatHour(hour) {

  if (hour === 12) return "12:00";

  if (hour > 12) {
    return `${hour - 12}:00pm`;
  }

  return `${hour}:00am`;

}

updateOpeningStatus();


/* =========================
   YEAR
========================= */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* =========================
   MENU MODAL
========================= */

const modal = document.getElementById("menuModal");
const modalClose = document.getElementById("modalClose");

function openModal() {
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {

  if (event.target === modal) {
    closeModal();
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});


/* =========================
   SMOOTH INTERNAL LINKS
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});