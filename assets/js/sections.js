import { about, languages, skills } from "../content/profile.js";
import { certificates } from "../content/certificates.js";
import { education } from "../content/education.js";
import { experience } from "../content/experience.js";
import { projects } from "../content/projects.js";
import { publications } from "../content/research.js";
import { icon } from "./icons.js";

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const separator = " · ";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function keepHyphenatedWordsTogether(value) {
  return escapeHtml(value).replace(/([\w.]+(?:-[\w.]+)+)/g, '<span class="nw">$1</span>');
}

function renderList(selector, entries, markup) {
  document.querySelector(selector).innerHTML = entries.map(markup).join("");
}

function experienceEntry(entry, index) {
  return `
    <details class="item"${index === 0 ? " open" : ""}>
      <summary>
        <span class="item-main">
          <span class="item-title">${escapeHtml(entry.role)}</span>
          <span class="item-sub">${escapeHtml(entry.org)}</span>
        </span>
        <span class="item-date">${escapeHtml(entry.period)}</span>
        <span class="chev" aria-hidden="true"></span>
      </summary>
      <div class="item-body">
        <p class="item-detail">${escapeHtml(entry.orgDetail)}</p>
        <ul class="bullets">
          ${entry.bullets.map((bullet) => `<li>${keepHyphenatedWordsTogether(bullet)}</li>`).join("")}
        </ul>
      </div>
    </details>`;
}

function projectEntry(project) {
  const breakdown = [
    ["Sorun", project.problem],
    ["Yaklaşım", project.approach],
    ["Sonuç", project.result],
  ];
  const link = project.link
    ? `<a class="link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener"
        aria-label="${escapeHtml(project.name)} projesini GitHub’da incele">GitHub’da incele ${icon("external", 15)}</a>`
    : "";
  const tech = project.tech.map((item) => `<span class="stack-item">${escapeHtml(item)}</span>`).join(separator);

  return `
    <article class="proj">
      <div class="proj-main">
        <h3 class="proj-name">${escapeHtml(project.name)}</h3>
        <p class="proj-summary">${keepHyphenatedWordsTogether(project.summary)}</p>
        <details class="proj-more">
          <summary>Nasıl çalışıyor?</summary>
          <dl class="case">
            ${breakdown.map(([label, value]) => `<div><dt>${label}</dt><dd>${keepHyphenatedWordsTogether(value)}</dd></div>`).join("")}
          </dl>
        </details>
      </div>
      <div class="proj-side">
        <span class="proj-meta">${escapeHtml(project.meta)}</span>
        ${link}
        <p class="stack">${tech}</p>
      </div>
    </article>`;
}

function itemTitle(entry) {
  const title = escapeHtml(entry.title);
  return entry.link
    ? `<a class="list-title" href="${escapeHtml(entry.link)}" target="_blank" rel="noopener">${title} ${icon("external", 15)}</a>`
    : `<span class="list-title plain">${title}</span>`;
}

function publicationEntry(entry) {
  const notes = entry.notes.map((note) => `<span class="tag">${escapeHtml(note)}</span>`).join("");
  return `<li>
    <p class="list-meta"><span class="mono">${escapeHtml(entry.year)}</span>${notes}</p>
    ${itemTitle(entry)}
    <p class="list-sub">${escapeHtml(entry.authors)} · <em>${escapeHtml(entry.venue)}</em></p>
  </li>`;
}

function credentialEntry(entry) {
  const period = entry.period
    ? `<p class="list-meta"><span class="mono">${escapeHtml(entry.period)}</span></p>`
    : "";
  return `<li>${period}${itemTitle(entry)}<p class="list-sub">${escapeHtml(entry.org)}</p></li>`;
}

export function renderSections() {
  renderList(".about-copy", about, (paragraph) => `<p>${keepHyphenatedWordsTogether(paragraph)}</p>`);
  renderList("#education-list", education, credentialEntry);
  renderList(".items", experience, experienceEntry);
  renderList(".proj-list", projects, projectEntry);
  renderList("#publications", publications, publicationEntry);
  renderList(".skills", [...skills, { title: "Diller", items: languages.split(" · ") }], ({ title, items }) =>
    `<div><dt>${escapeHtml(title)}</dt><dd>${items.map(escapeHtml).join(separator)}</dd></div>`);
  renderList("#certificates-list", certificates, credentialEntry);
}
