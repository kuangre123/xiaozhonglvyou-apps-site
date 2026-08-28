#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const fileName = "ko-kr.html";

const faqItems = [
  {
    question: "iPhone 사진 정리는 어떤 앱부터 보면 되나요?",
    answer: "iPhone 사진 정리는 AI Cleaning부터 보면 됩니다. AI 사진 분류로 사진을 유형별로 나누고, 중복 사진, 스크린샷, 흐린 사진, 큰 미디어를 삭제 전 검토할 수 있습니다."
  },
  {
    question: "여행 중 번역에는 어떤 앱을 쓰나요?",
    answer: "Travel Translator는 음성 입력, 번역 음성 재생, 카메라 OCR 번역을 지원해 공항, 호텔, 식당, 표지판 확인에 사용할 수 있습니다."
  },
  {
    question: "Mac 화면 개인정보 보호 앱은 언제 필요하나요?",
    answer: "Anti-spy screen은 회의, 공유 공간, 화면 공유 중 보이고 싶지 않은 Mac 화면이나 창을 보호하는 데 도움이 되는 개인정보 보호 도구입니다."
  },
  {
    question: "AI Cleaning은 사진을 자동으로 삭제하나요?",
    answer: "아니요. AI Cleaning은 사진을 분류하고 검토할 후보를 보여 주지만, 사용자가 내용을 확인한 뒤 삭제할 항목을 직접 결정합니다."
  },
  {
    question: "사진 분석은 온라인으로 처리되나요?",
    answer: "AI Cleaning의 사진 분류와 분석은 iPhone 기기에서 처리되도록 설계되어 개인 사진을 원격 서비스에 업로드하지 않고 정리 흐름을 진행할 수 있습니다."
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

  return `<section class="section content-section" data-localized-faq="ko-kr"><div class="section-inner content-grid"><div><p class="section-kicker">자주 묻는 질문</p><h2>용도에 맞는 앱을 빠르게 고르기.</h2><p>사진 정리, 여행 번역, Mac 화면 개인정보 보호 중 어떤 흐름을 먼저 볼지 한국어 검색 사용자에게 맞춰 정리했습니다.</p></div><div class="content-list">${items}</div></div></section>`;
}

function faqJsonLd() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ko-KR",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  })}</script>`;
}

function updateVisibleFaq(html) {
  const section = visibleFaqSection();
  const marker = /<section\b[^>]*data-localized-faq="ko-kr"[^>]*>[\s\S]*?<\/section>/i;
  if (marker.test(html)) return html.replace(marker, section);

  const legacy = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)]
    .find((match) => /<p class="section-kicker">\s*자주 묻는 질문\s*<\/p>/i.test(match[0]));
  if (legacy) return html.replace(legacy[0], section);

  const mainEnd = "</main>";
  if (!html.includes(mainEnd)) throw new Error("Missing </main> in ko-kr.html");
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
  if (!updated.includes("</head>")) throw new Error("Missing </head> in ko-kr.html");
  return updated.replace("</head>", `${replacement}</head>`);
}

const filePath = path.join(siteDir, fileName);
const original = await readFile(filePath, "utf8");
const updated = updateFaqJsonLd(updateVisibleFaq(original));

if (updated !== original) await writeFile(filePath, updated, "utf8");
console.log(`Applied ${faqItems.length} Korean FAQ items to ${fileName}; changed ${updated === original ? 0 : 1}.`);
