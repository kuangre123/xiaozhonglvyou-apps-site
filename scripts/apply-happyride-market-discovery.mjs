#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseSiteDir(argv) {
  let siteDir = process.env.SITE_DIR
    ? path.resolve(process.cwd(), process.env.SITE_DIR)
    : path.resolve(import.meta.dirname, "..");

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--site-dir") throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[++index];
    if (!value || value.startsWith("--")) throw new Error("--site-dir requires a directory");
    siteDir = path.resolve(process.cwd(), value);
  }

  return siteDir;
}

const markets = [
  {
    file: "fr-fr.html",
    lang: "fr-FR",
    country: "fr",
    kicker: "Trajets à vélo en France",
    title: "HappyRide : enregistrer ses trajets à vélo sur iPhone.",
    summary: "HappyRide peut détecter et enregistrer automatiquement les trajets à vélo, les marches et les courses admissibles, sans appuyer sur Démarrer à chaque sortie.",
    storeLabel: "HappyRide sur l’App Store France",
    permissionTitle: "Vérifier les autorisations",
    permissionText: "La détection utilise Mouvements et forme et la localisation en arrière-plan. Pour enregistrer les parcours en arrière-plan, vérifiez l’accès à la position Toujours ; l’accès à Apple Santé reste facultatif.",
    reviewTitle: "Contrôler un premier trajet",
    reviewText: "Les trajets très courts ou interrompus peuvent ne pas être détectés. Après une sortie habituelle, vérifiez le parcours, la distance et la durée enregistrés avant de vous y fier.",
    guideTitle: "Lire avant d’installer",
    productLabel: "Page produit HappyRide en anglais",
    guideLabel: "Guide de suivi automatique à vélo en anglais",
    languageText: "Consultez la fiche App Store pour les langues, la compatibilité et la disponibilité actuelles."
  },
  {
    file: "it-it.html",
    lang: "it-IT",
    country: "it",
    kicker: "Percorsi in bici in Italia",
    title: "HappyRide: registrare automaticamente i giri in bici su iPhone.",
    summary: "HappyRide può rilevare e registrare automaticamente giri in bici, camminate e corse che soddisfano i criteri di rilevamento, senza premere Avvia a ogni uscita.",
    storeLabel: "HappyRide sull’App Store Italia",
    permissionTitle: "Controllare le autorizzazioni",
    permissionText: "Il rilevamento usa Movimento e fitness e la posizione in background. Per registrare i percorsi in background, verifica l’accesso alla posizione Sempre; l’accesso ad Apple Salute è facoltativo.",
    reviewTitle: "Verificare un primo percorso",
    reviewText: "I tragitti molto brevi o con frequenti interruzioni possono non essere rilevati. Dopo un’uscita abituale, controlla percorso, distanza e durata registrati prima di affidarti al rilevamento.",
    guideTitle: "Leggere prima di installare",
    productLabel: "Pagina prodotto HappyRide in inglese",
    guideLabel: "Guida al rilevamento automatico dei giri in bici in inglese",
    languageText: "Controlla la scheda App Store per le lingue, la compatibilità e la disponibilità attuali."
  },
  {
    file: "us-apps.html",
    lang: "en-US",
    country: "us",
    kicker: "US bike ride tracking",
    title: "HappyRide for the bike ride you forget to start.",
    summary: "HappyRide can automatically detect and record qualifying bike rides, walks, and runs on iPhone, without tapping Start for every trip.",
    storeLabel: "HappyRide on the US App Store",
    permissionTitle: "Review activity and location access",
    permissionText: "Detection uses Motion & Fitness and background location. Review Always location access for background route recording; Apple Health access is optional.",
    reviewTitle: "Check one familiar ride first",
    reviewText: "Very short trips or frequent interruptions may not produce a detected activity. Review the recorded route, distance, and duration after a normal ride before relying on automatic detection.",
    guideTitle: "Compare the workflow before installing",
    productLabel: "HappyRide product page in English",
    guideLabel: "Automatic iPhone bike ride tracking guide in English",
    languageText: "Review the App Store listing for current languages, compatibility, and availability."
  },
  {
    file: "netherlands-nordics-apps.html",
    lang: "sv-SE",
    country: "se",
    kicker: "Cykelturer i Sverige",
    title: "HappyRide för automatisk registrering av cykelturer på iPhone.",
    summary: "HappyRide kan automatiskt upptäcka och registrera cykelturer, promenader och löpturer som uppfyller villkoren för registrering, utan att du trycker på Start varje gång. Länken nedan går till den svenska App Store-butiken.",
    storeLabel: "HappyRide i svenska App Store",
    permissionTitle: "Kontrollera rörelse- och platsbehörigheter",
    permissionText: "Registreringen använder Rörelse och fitness samt platsåtkomst i bakgrunden. Kontrollera platsåtkomst Alltid för att spela in rutter i bakgrunden; åtkomst till Apple Hälsa är valfri.",
    reviewTitle: "Granska en välbekant tur först",
    reviewText: "Mycket korta turer eller täta avbrott kan göra att en aktivitet inte registreras. Kontrollera rutt, sträcka och tid efter en vanlig tur innan du förlitar dig på den automatiska registreringen.",
    guideTitle: "Läs om arbetsflödet före installation",
    productLabel: "HappyRides produktsida på engelska",
    guideLabel: "Guide till automatisk cykelregistrering på iPhone på engelska",
    languageText: "Kontrollera aktuella språk, kompatibilitet och tillgänglighet i den svenska App Store-butiken."
  }
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function discoverySection(market) {
  const text = (key) => escapeHtml(market[key]);
  const storeHref = `https://apps.apple.com/${market.country}/app/happyride-auto-ride-tracker/id6786365305?uo=4`;
  return `<section class="section content-section" id="happyride-local-rides" lang="${market.lang}" aria-labelledby="happyride-local-rides-title"><div class="section-inner content-grid"><div><p class="section-kicker">${text("kicker")}</p><h2 id="happyride-local-rides-title">${text("title")}</h2><p>${text("summary")}</p><p><a class="button button-primary" href="${storeHref}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="happyride-auto-ride-tracker" data-storefront="ios-app-store" data-store-country="${market.country}" aria-label="${text("storeLabel")}">${text("storeLabel")}</a></p></div><div class="content-list"><div><strong>${text("permissionTitle")}</strong><p>${text("permissionText")}</p></div><div><strong>${text("reviewTitle")}</strong><p>${text("reviewText")}</p></div><div><strong>${text("guideTitle")}</strong><p><a href="happyride-auto-ride-tracker.html" hreflang="en">${text("productLabel")}</a>. <a href="automatic-bike-ride-tracker-iphone.html" hreflang="en">${text("guideLabel")}</a>. ${text("languageText")}</p></div></div></div></section>`;
}

function updatePage(html, market) {
  if (!/<\/main\s*>/i.test(html)) throw new Error(`Missing </main> in ${market.file}`);
  const section = discoverySection(market);
  const marker = /<section\b(?=[^>]*\bid\s*=\s*["']happyride-local-rides["'])[^>]*>[\s\S]*?<\/section\s*>/gi;
  let replaced = false;
  const updated = html.replace(marker, () => {
    if (replaced) return "";
    replaced = true;
    return section;
  });

  return replaced ? updated : updated.replace(/<\/main\s*>/i, (mainEnd) => `${section}${mainEnd}`);
}

const siteDir = parseSiteDir(process.argv.slice(2));
const pages = await Promise.all(markets.map(async (market) => {
  const filePath = path.join(siteDir, market.file);
  const original = await readFile(filePath, "utf8");
  return { filePath, original, updated: updatePage(original, market) };
}));
let changed = 0;
for (const page of pages) {
  if (page.updated === page.original) continue;
  await writeFile(page.filePath, page.updated, "utf8");
  changed += 1;
}
console.log(`Applied HappyRide discovery to ${pages.length} existing market pages; changed ${changed}.`);
