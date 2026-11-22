import { channels, profile } from "../content/profile.js";
import { icon } from "./icons.js";

function renderContactLinks() {
  for (const channel of channels) {
    const heroItem = document.createElement("li");
    const heroLink = document.createElement("a");
    heroLink.href = channel.href;
    heroLink.target = "_blank";
    heroLink.rel = "noopener";
    heroLink.ariaLabel = channel.label;
    heroLink.title = channel.label;
    heroLink.innerHTML = icon(channel.key);
    heroItem.append(heroLink);
    document.querySelector(".hero-links").append(heroItem);

    const contactItem = document.createElement("li");
    const contactLink = heroLink.cloneNode();
    const label = document.createElement("span");
    const detail = document.createElement("span");
    label.textContent = channel.label;
    detail.className = "ch-val";
    detail.textContent = channel.val + " ";
    detail.insertAdjacentHTML("beforeend", icon("external", 15));
    contactLink.append(label, detail);
    contactItem.append(contactLink);
    document.querySelector(".channels").append(contactItem);
  }
}

export function buildContactDraft(fields, email) {
  const subject = encodeURIComponent("Portföy hakkında");
  const body = encodeURIComponent(
    `${fields.get("message")}\n\n${fields.get("name")}\n${fields.get("email")}`,
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function initializeContact() {
  const dialog = document.querySelector(".contact");
  const show = () => {
    if (!dialog.open) dialog.showModal();
  };

  for (const button of document.querySelectorAll("[data-open-contact]")) {
    button.addEventListener("click", show);
  }
  const openFromHash = () => {
    if (location.hash === "#contact") show();
  };
  window.addEventListener("hashchange", openFromHash);
  dialog.addEventListener("close", () => {
    if (location.hash === "#contact") {
      history.replaceState(history.state, "", location.pathname + location.search);
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    location.href = buildContactDraft(new FormData(event.currentTarget), profile.email);
  });

  for (const link of document.querySelectorAll("[data-email]")) {
    link.href = `mailto:${profile.email}`;
  }
  document.querySelector(".contact-email").textContent = profile.email;
  document.querySelector(".hero-actions [data-email]").insertAdjacentHTML("afterbegin", icon("email") + " ");
  renderContactLinks();
  openFromHash();
}
