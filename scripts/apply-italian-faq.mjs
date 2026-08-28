#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const fileName = "it-it.html";

const faqItems = [
  {
    question: "Quale app usare per mettere ordine nelle foto dell'iPhone?",
    answer: "Inizia da AI Cleaning: classifica le foto sul dispositivo e permette di controllare duplicati, foto simili, screenshot, foto sfocate e media grandi prima di eliminare qualcosa."
  },
  {
    question: "AI Cleaning elimina automaticamente le foto?",
    answer: "No. L'analisi propone categorie e candidati da controllare; la persona deve rivedere il contenuto e confermare cosa eliminare."
  },
  {
    question: "Quale app serve per tradurre durante un viaggio?",
    answer: "Travel Translator combina input vocale, riproduzione audio e traduzione OCR con la fotocamera per conversazioni, menu, cartelli ed etichette."
  },
  {
    question: "Le foto restano sul dispositivo durante l'analisi?",
    answer: "La classificazione di AI Cleaning è pensata per avvenire sul dispositivo, così le foto personali non devono essere caricate su un servizio remoto per questo flusso."
  },
  {
    question: "Quando è utile la privacy dello schermo su Mac?",
    answer: "Anti-spy screen è utile in riunioni, presentazioni, spazi condivisi e condivisione dello schermo, quando alcune finestre o aree sensibili non devono restare visibili."
  }
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function visibleFaqSection() {
  const items = faqItems.map(({ question, answer }) =>
    `<div><strong>${escapeHtml(question)}</strong><p>${escapeHtml(answer)}</p></div>`
  ).join("");

  return `<section class="section content-section alt-section" data-localized-faq="it-it"><div class="section-inner content-grid"><div><p class="section-kicker">Domande frequenti</p><h2>Scegliere l'app in base al problema.</h2><p>Queste risposte aiutano a confrontare classificazione foto, traduzione di viaggio e privacy dello schermo prima di aprire l'App Store.</p></div><div class="content-list">${items}</div></div></section>`;
}

function faqJsonLd() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "it-IT",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  })}</script>`;
}

function updateVisibleFaq(html) {
  const section = visibleFaqSection();
  const marker = /<section\b[^>]*data-localized-faq="it-it"[^>]*>[\s\S]*?<\/section>/i;

  if (marker.test(html)) return html.replace(marker, section);

  const mainEnd = "</main>";
  if (!html.includes(mainEnd)) throw new Error("Missing </main> in it-it.html");
  return html.replace(mainEnd, `${section}${mainEnd}`);
}

function updateFaqJsonLd(html) {
  const replacement = faqJsonLd();
  const scriptPattern = /<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi;
  let found = false;
  const updated = html.replace(scriptPattern, (block) => {
    const bodyStart = block.indexOf(">");
    const body = block.slice(bodyStart + 1, -"</script>".length).trim();
    try {
      const parsed = JSON.parse(body);
      if (parsed?.["@type"] !== "FAQPage") return block;
      found = true;
      return replacement;
    } catch {
      return block;
    }
  });

  if (found) return updated;
  if (!updated.includes("</head>")) throw new Error("Missing </head> in it-it.html");
  return updated.replace("</head>", `${replacement}</head>`);
}

const filePath = path.join(siteDir, fileName);
const original = await readFile(filePath, "utf8");
const updated = updateFaqJsonLd(updateVisibleFaq(original));

if (updated !== original) await writeFile(filePath, updated, "utf8");
console.log(`Applied ${faqItems.length} Italian FAQ items to ${fileName}; changed ${updated === original ? 0 : 1}.`);
