#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { minifyHtml } from "./minify-html.mjs";

export const frenchPhotoFile = "nettoyeur-photo-iphone-fr.html";
const origin = "https://www.xiaozhonglvyou.com";
const modifiedDate = "2026-11-18";
const storeUrl = "https://apps.apple.com/fr/app/ai-cleaning-nettoyeur-photo/id6768019606?uo=4";
const description = "Nettoyez les photos iPhone : fusionnez les doublons dans Photos, vérifiez iCloud et comparez le classement IA avec Pro avant de choisir une app.";
const summary = "Commencez par Photos pour fusionner les doublons déjà détectés, sans installer d’app. Pour classer aussi documents, reçus et autres contenus, comparez ensuite les neuf catégories d’AI Cleaning avec Pro. Dans les deux cas, vérifiez les images avant de confirmer leur suppression.";
const sources = [
  ["Apple : fusionner, supprimer et récupérer des photos", "https://support.apple.com/fr-fr/104967"],
  ["Apple : pourquoi Doublons n’apparaît pas", "https://support.apple.com/fr-fr/102260"],
  ["AI Cleaning : fonctionnalités et abonnement dans l’App Store France", storeUrl]
];
export const frenchPhotoFaq = [
  ["Comment supprimer les photos en double sur iPhone sans autre app ?", "Dans Photos, ouvrez Collections, puis Doublons sous Autres. Comparez les images d’un groupe, touchez Fusionner et confirmez seulement les éléments vérifiés. Les noms et l’emplacement des collections peuvent varier selon la version d’iOS."],
  ["Pourquoi la collection Doublons n’apparaît-elle pas ?", "L’iPhone doit analyser la photothèque et identifier des doublons. Laissez-le verrouillé et branché ; selon la taille de la photothèque et les tâches en arrière-plan, cela peut prendre plusieurs jours. L’absence de cette collection ne prouve pas qu’une autre app est nécessaire."],
  ["Le classement photo IA d’AI Cleaning est-il gratuit ?", "Le téléchargement est gratuit, mais la catégorisation automatique en neuf catégories est une fonction Pro. Consultez le prix et les conditions de l’abonnement mensuel ou annuel dans l’App Store France avant de vous engager. Les conditions des outils de nettoyage sont distinctes de celles du classement."],
  ["Comment vérifier les doublons et les photos similaires ?", "Comparez la netteté, l’expression, le cadrage, les retouches et les textes visibles. Deux photos similaires peuvent être deux souvenirs différents. Gardez les originaux importants et confirmez vous-même les photos à retirer."],
  ["AI Cleaning supprime-t-il des photos automatiquement ?", "Non. L’app propose des groupes et des candidats à examiner, puis demande confirmation avant la suppression. Une catégorie ou un groupe de photos similaires ne décide pas de la valeur d’une image."],
  ["Que devient une photo supprimée si Photos iCloud est activé ?", "La suppression se répercute sur les autres appareils utilisant le même compte Apple avec Photos iCloud. Les éléments restent normalement récupérables pendant 30 jours dans Supprimées récemment. Les supprimer définitivement de cette collection met fin à cette possibilité de récupération."],
  ["Les photos sont-elles envoyées sur un serveur pour l’analyse ?", "Le développeur décrit une analyse sur l’iPhone, sans téléversement de la photothèque. Les déclarations de confidentialité de l’App Store proviennent du développeur et ne sont pas vérifiées par Apple. La synchronisation éventuelle de Photos iCloud est un service séparé."],
  ["Un nettoyeur photo peut-il effacer les données système ou la RAM d’iOS ?", "Non. AI Cleaning se concentre sur la photothèque et n’a pas accès aux fichiers système protégés pour les nettoyer. Le nombre de gigaoctets occupés ne permet pas de décider quelles photos peuvent être supprimées."]
];
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const blockPattern = (id) => new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, "g");
function storeLink(label, primary = false) {
  return `<a class="${primary ? "button button-secondary" : "store-link"}" href="${storeUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" data-store-country="fr" aria-label="${escape(label)} — nouvel onglet">${escape(label)}</a>`;
}
function contentSections() {
  const steps = [
    ["Ouvrir les doublons dans Photos", "Dans Photos, ouvrez Collections, puis cherchez Doublons sous Autres. Les intitulés peuvent varier selon votre version d’iOS. Commencez par un seul groupe et regardez les images en détail."],
    ["Fusionner uniquement les copies vérifiées", "Utilisez Fusionner après comparaison, puis confirmez les éléments concernés. Pour une série de prises ressemblantes, comparez le cadrage et l’expression avant de retirer une variante."],
    ["Si Doublons n’apparaît pas, laisser l’analyse se terminer", "Branchez l’iPhone et laissez-le verrouillé. La détection peut demander plusieurs jours selon la photothèque et les tâches en arrière-plan. N’achetez pas une app uniquement parce que la collection manque."],
    ["Vérifier la synchronisation avant de supprimer", "Avec Photos iCloud, une suppression concerne aussi les autres appareils du même compte. Sauvegardez séparément les originaux importants et examinez les tickets, documents et souvenirs avant de choisir quoi retirer."],
    ["Contrôler Supprimées récemment", "Cette collection permet normalement de récupérer les éléments pendant 30 jours. Vérifiez d’abord ce qui doit être conservé. Une suppression définitive depuis cette collection ne peut pas être annulée par ce moyen."]
  ];
  const builtIn = `<section class="section content-section" id="doublons-sans-app" aria-labelledby="doublons-sans-app-title"><div class="section-inner content-grid"><div><p class="section-kicker">Avec l’app Photos</p><h2 id="doublons-sans-app-title">Fusionner les doublons iPhone sans installer de nettoyeur.</h2><p>Ces étapes utilisent les fonctions intégrées de Photos. Elles suffisent si les copies détectées et la sélection manuelle répondent à votre besoin.</p><p><a href="#classement-ia-pro">Comparer ensuite le classement avec Pro</a></p></div><div class="content-list"><ol>${steps.map(([heading, text]) => `<li><h3>${escape(heading)}</h3><p>${escape(text)}</p></li>`).join("")}</ol><p>${sources.slice(0, 2).map(([label, href]) => `<a href="${href}">${escape(label)}</a>`).join(" · ")}</p></div></div></section>`;
  const choice = `<section class="section content-section alt-section" id="classement-ia-pro" aria-labelledby="classement-ia-pro-title"><div class="section-inner content-grid"><div><p class="section-kicker">Choisir selon la tâche</p><h2 id="classement-ia-pro-title">Photos, nettoyage et classement IA : vérifier ce qui vous manque.</h2><p>Le classement est un outil d’organisation. Une catégorie ne prouve jamais qu’une photo peut être supprimée.</p></div><div class="content-list"><div><h3>Retrouver et conserver des photos</h3><p>Commencez par les collections, la recherche et les albums de Photos. Protégez les documents, reçus et images que vous voulez garder avant de préparer une sélection.</p></div><div><h3>Classer avec les neuf catégories Pro</h3><p>AI Cleaning peut regrouper les contenus sur l’iPhone : animaux, plantes, cuisine, restaurants, groupes, documents, factures, reçus et pièces d’identité. La fiche française réserve cette catégorisation automatique à Pro ; le téléchargement gratuit ne l’inclut pas.</p></div><div><h3>Examiner les autres candidats au nettoyage</h3><p>Ouvrez les groupes proposés pour les doublons, les photos similaires, les captures ou les images floues. Contrôlez les originaux et les conditions de chaque outil avant de confirmer une action.</p></div><div><h3>Comparer le prix et les langues avant de télécharger</h3><p>La fiche française consultée le 18 novembre 2026 liste le français, iOS 16.0 ou ultérieur et un téléchargement gratuit avec abonnement pour Pro. Vérifiez les conditions actuelles à l’ouverture du magasin.</p>${storeLink("Vérifier AI Cleaning et les conditions Pro en France")}</div></div></div></section>`;
  return builtIn + choice;
}
export function updateFrenchPhotoWorkflow(original) {
  if (!original.includes(`<link rel="canonical" href="${origin}/${frenchPhotoFile}">`)) throw new Error("Unexpected French photo canonical");
  let html = original;
  html = html.replace(/<a\b[^>]*href="https:\/\/apps\.apple\.com\/fr\/[^>]*>/g, (tag) => {
    if (!tag.includes('data-store-country="fr"')) tag = tag.replace(/>$/, ' data-store-country="fr">');
    return tag.replace(/aria-label="[^"]*"/, 'aria-label="AI Cleaning dans l’App Store France — nouvel onglet"');
  });
  for (const [attribute, name] of [["name", "description"], ["property", "og:description"], ["name", "twitter:description"]]) {
    const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}="${name}")[^>]*>`);
    if (!pattern.test(html)) throw new Error(`Missing ${name}`);
    html = html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/, `content="${escape(description)}"`));
  }
  html = html.replace(/<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/, (hero) => {
    hero = hero.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)<p\b[^>]*>[\s\S]*?<\/p>/, `$1<p>${escape(summary)}</p>`);
    hero = hero.replace(/<div\b[^>]*class="hero-actions"[^>]*>[\s\S]*?<\/div>/, `<div class="hero-actions" aria-label="Choisir une étape"><a class="button button-primary" href="#doublons-sans-app">Voir les étapes gratuites dans Photos</a>${storeLink("Comparer AI Cleaning et Pro", true)}<a class="button button-secondary" href="fr-fr.html">Retour France</a></div>`);
    return hero.replace(/<time\b[^>]*>[\s\S]*?<\/time>/, `<time datetime="${modifiedDate}">18 novembre 2026</time>`);
  });
  // Replace the old generic workflow block while leaving page identity and media intact.
  html = html.replace(blockPattern("doublons-sans-app"), "").replace(blockPattern("classement-ia-pro"), "");
  const oldSection = /<section class="section content-section">[\s\S]*?<\/section>/;
  if (oldSection.test(html)) html = html.replace(oldSection, "");
  html = html.replace(/(<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>)/, `$1${contentSections()}`);
  const faq = `<section class="section faq"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">Questions courantes</p><h2>Doublons, iCloud et Pro : les réponses avant de choisir.</h2></div></div><div class="faq-list">${frenchPhotoFaq.map(([question, answer], i) => `<details${i === 0 ? " open" : ""}><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join("")}</div></div></section>`;
  html = html.replace(/<section class="section faq">[\s\S]*?<\/section>/, faq);
  html = html.replace(/(<meta\b(?=[^>]*property="article:modified_time")[^>]*content=")[^"]*(")/, `$1${modifiedDate}$2`);
  const count = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
  html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, body, close) => {
    const data = JSON.parse(body);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (node["@type"] === "Article") {
        node.description = description; node.dateModified = modifiedDate; node.wordCount = count;
        node.citation = [...new Set([...(node.citation ?? []), ...sources.map(([, href]) => href)])];
        const apps = [].concat(node.about ?? []);
        for (const app of apps) if (app["@type"] === "SoftwareApplication" && app.offers) app.offers.priceCurrency = "EUR";
      }
      if (node["@type"] === "FAQPage") {
        node.inLanguage = "fr-FR";
        node.mainEntity = frenchPhotoFaq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }));
      }
      Object.values(node).forEach(visit);
    };
    visit(data); return open + JSON.stringify(data).replaceAll("<", "\\u003c") + close;
  });
  return minifyHtml(html);
}
export async function applyFrenchPhotoWorkflow(siteDir) {
  const file = path.join(siteDir, frenchPhotoFile);
  const original = await readFile(file, "utf8");
  const updated = updateFrenchPhotoWorkflow(original);
  if (updated !== original) await writeFile(file, updated);
  console.log(`${updated === original ? "Verified" : "Updated"} ${frenchPhotoFile}`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const index = process.argv.indexOf("--site-dir");
  await applyFrenchPhotoWorkflow(path.resolve(index < 0 ? process.env.SITE_DIR ?? path.join(import.meta.dirname, "..") : process.argv[index + 1]));
}
