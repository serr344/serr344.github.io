import { profile } from "../content/profile.js";
import { initializeContact } from "./contact.js";
import { renderSections } from "./sections.js";

function fillProfile() {
  for (const element of document.querySelectorAll("[data-profile]")) {
    const field = element.dataset.profile;
    element.textContent = profile[field];
  }
  document.querySelector("#copyright").textContent = `© ${new Date().getFullYear()} ${profile.name}`;
}

function initializeNavigation() {
  const navigation = document.querySelector(".nav");
  const updateScroll = () => navigation.classList.toggle("scrolled", scrollY > 8);
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  const links = [...navigation.querySelectorAll(".nav-links a")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;
    for (const link of links) {
      link.classList.toggle("active", link.hash === `#${visible.target.id}`);
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  for (const link of links) {
    observer.observe(document.querySelector(link.hash));
  }
}

fillProfile();
renderSections();
initializeNavigation();
initializeContact();
