// ===== Mobile menu (hamburger) =====
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const menuIsOpen = navLinks.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", menuIsOpen);
  menuToggle.setAttribute(
    "aria-label",
    menuIsOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// ===== Dark mode / Light mode =====
const themeToggle = document.querySelector("#theme-toggle");
const root = document.documentElement;

// Outline icons 
const moonIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const sunIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="5"/>' +
  '<line x1="12" y1="1" x2="12" y2="3"/>' +
  '<line x1="12" y1="21" x2="12" y2="23"/>' +
  '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
  '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
  '<line x1="1" y1="12" x2="3" y2="12"/>' +
  '<line x1="21" y1="12" x2="23" y2="12"/>' +
  '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
  '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

// Kinukuha ang naka-save na theme. Kung wala, susundin ang theme ng device.
function getStartingTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch (error) {
    
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Inilalapat ang theme at pinapalitan ang icon.
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  const isDark = theme === "dark";
  themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

applyTheme(getStartingTheme());

// Nagpapalit ng theme 
themeToggle.addEventListener("click", () => {
  const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(newTheme);

  try {
    localStorage.setItem("theme", newTheme);
  } catch (error) {
    
  }
});

// ===== highlight ng nav =====
const siteHeader = document.querySelector(".site-header");
const navAnchors = Array.from(navLinks.querySelectorAll("a"));

const navItems = navAnchors
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  }))
  .filter((item) => item.section);

function updateActiveLink() {
  const offset = siteHeader.offsetHeight + 80;
  let currentItem = navItems[0];

  navItems.forEach((item) => {
    if (item.section.getBoundingClientRect().top <= offset) {
      currentItem = item;
    }
  });

  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  if (atBottom) {
    currentItem = navItems[navItems.length - 1];
  }

  navItems.forEach((item) => {
    const isActive = item === currentItem;
    item.link.classList.toggle("active", isActive);
    if (isActive) {
      item.link.setAttribute("aria-current", "page");
    } else {
      item.link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();