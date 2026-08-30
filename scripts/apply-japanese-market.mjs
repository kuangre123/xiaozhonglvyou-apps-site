#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const fileName = "ja-jp.html";
const updatedDate = "2026-08-30";
const aiCleaningStoreUrl = "https://apps.apple.com/jp/app/ai-cleaning-%E5%86%99%E7%9C%9F%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8A%E3%83%BC/id6768019606?uo=4";
const translatorStoreUrl = "https://apps.apple.com/jp/app/translation-specialist/id6755734543?uo=4";

const faqItems = [
  {
    question: "どのアプリから始めるべきですか？",
    answer: "iPhoneの写真整理なら AI Cleaning から始めます。写真を種類別に分類し、重複写真、類似写真、スクリーンショット、ぼやけた写真、容量の大きいメディアを削除前に確認できます。"
  },
  {
    question: "AI Cleaning は写真を自動的に削除しますか？",
    answer: "いいえ。AI Cleaning は分類結果や整理候補を表示しますが、削除する写真は利用者が内容を確認して決めます。重要な書類、身分証、編集済み写真などが含まれていないか確認してから操作してください。"
  },
  {
    question: "写真の分類や分析はオンラインで行われますか？",
    answer: "AI Cleaning の写真分類と分析は iPhone 上で処理されるように設計されています。個人の写真を分類のために外部サービスへアップロードせずに整理を進められます。"
  },
  {
    question: "旅行中の翻訳にはどのアプリを使いますか？",
    answer: "Travel Translator は音声入力、訳文の読み上げ、カメラOCR翻訳、連続通訳に対応し、空港、ホテル、レストラン、メニュー、看板の確認に使えます。出発前に利用予定の言語と機能を試してください。"
  },
  {
    question: "Mac画面プライバシーは何に役立ちますか？",
    answer: "Anti-spy screen は会議、共有スペース、プレゼンテーション、画面共有中に、見せたくないMacのウィンドウや画面領域を守るための補助ツールです。共有するウィンドウやディスプレイ自体は会議アプリ側でも確認してください。"
  },
  {
    question: "医療や法律に関する翻訳をそのまま使ってもよいですか？",
    answer: "日常旅行では機械翻訳が役立ちますが、医療、法律、安全、入国手続きに関する重要情報は、公式情報や資格を持つ通訳者にも確認してください。氏名、日付、金額、住所も原文と照合します。"
  }
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function faqJsonLd() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ja-JP",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  })}</script>`;
}

function faqSection() {
  const details = faqItems.map(({ question, answer }, index) =>
    `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`
  ).join("");

  return `<section class="section faq" id="faq" data-localized-faq="ja-jp"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">よくある質問</p><h2>インストール前に確認したいこと。</h2></div><p>写真整理、旅行翻訳、Mac画面プライバシーの違いと、利用前に知っておきたい範囲をまとめています。</p></div><div class="faq-list">${details}</div></div></section>`;
}

function mainContent() {
  return `<main class="page-main" id="main-content"><section class="page-hero page-hero-simple"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="パンくずリスト"><ol><li><a href="ja-jp.html">ホーム</a></li><li aria-current="page">日本</li></ol></nav><p class="eyebrow">日本向けアプリ</p><h1>iPhoneのAI写真整理、旅行翻訳、Mac画面プライバシー。</h1><p>写真を消す前に分類して確認したい人、海外で会話やメニューを翻訳したい人、会議や画面共有でMacの機密ウィンドウを守りたい人向けに、用途別の選び方と注意点をまとめています。</p><div class="hero-actions" aria-label="日本向けアプリの操作"><a class="button button-primary" href="${aiCleaningStoreUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" aria-label="AI Cleaning 写真クリーナーを日本のApp Storeで開く（新しいタブ）">AI写真整理を試す</a> <a class="button button-secondary" href="${translatorStoreUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="translation-specialist" data-storefront="ios-app-store" aria-label="Translation Specialistを日本のApp Storeで開く（新しいタブ）">旅行翻訳を試す</a></div><p class="article-meta">内容確認日 <time datetime="${updatedDate}">2026年8月30日</time></p></div></section><section class="section content-section" id="apps" data-japanese-market="apps"><div class="section-inner content-grid"><div><p class="section-kicker">用途別の入口</p><h2>まず、解決したい問題を一つ選びます。</h2><p>同じ「便利アプリ」でも、写真整理、旅行翻訳、画面プライバシーでは必要な権限と確認手順が異なります。目的に合うページから確認すると、不要な機能説明を避けられます。</p></div><div class="content-list"><div id="photo-cleaning"><strong>AI Cleaning - Photo Cleaner</strong><p>写真を食べ物、書類、領収書、身分証、植物、動物、集合写真などに分類し、重複・類似・スクリーンショット・ぼやけた写真・容量の大きいメディアを削除前に確認します。<a href="iphone-photo-cleaner.html">写真クリーナーの機能ページ（英語）</a>でも整理範囲を確認できます。</p></div><div id="translation"><strong>Travel Translator</strong><p>音声入力、訳文の読み上げ、カメラOCR、連続通訳を、会話、メニュー、看板、ラベルに使い分けます。<a href="travel-translator.html">旅行翻訳の機能ページ（英語）</a>で対応する流れと注意点を確認できます。</p></div><div id="mac-privacy"><strong>Anti-spy screen</strong><p>選択したアプリの非表示、画面領域を覆うPrivacy Block、プレゼンテーション向けの保護を使い、共有スペースや会議中の露出を減らします。<a href="mac-screen-privacy.html">Mac画面プライバシーの機能ページ（英語）</a>でソフトウェア保護の範囲を確認できます。</p></div></div></div></section><section class="section content-section alt-section" id="decision-guide" data-japanese-market="decision"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">目的別の選び方</p><h2>検索している内容から、次に見るページを決める。</h2></div><p>詳しいガイドは英語ですが、各ページは機能、確認手順、削除や共有前の注意点を具体的に示しています。</p></div><div class="intent-table" role="table" aria-label="日本向けアプリ選択表"><div class="intent-head" role="row"><span role="columnheader">やりたいこと</span><span role="columnheader">最初に見るページ</span><span role="columnheader">確認するポイント</span></div><div role="row"><span role="cell">iPhoneの写真をAIで種類別に整理したい</span><span role="cell"><a href="ai-photo-classification.html">AI写真分類ガイド</a></span><span role="cell">分類カテゴリ、端末上の処理、削除前に利用者が確認する流れ。</span></div><div role="row"><span role="cell">重複写真、類似写真、スクリーンショットを整理したい</span><span role="cell"><a href="duplicate-photo-cleaner-guide.html">重複写真の確認ガイド</a></span><span role="cell">同じ写真と似た写真の違い、残す写真の比較、削除前の最終確認。</span></div><div role="row"><span role="cell">旅行中の会話、メニュー、看板を翻訳したい</span><span role="cell"><a href="voice-camera-translator-guide.html">音声・カメラ翻訳ガイド</a></span><span role="cell">音声、読み上げ、カメラOCR、連続通訳の使い分けと、言語ごとの事前テスト。</span></div><div role="row"><span role="cell">会議や画面共有でMacの私的な内容を守りたい</span><span role="cell"><a href="screen-sharing-privacy-guide.html">画面共有プライバシーガイド</a></span><span role="cell">通知、共有対象、保護するアプリ、テスト通話を開始前に確認すること。</span></div></div></div></section><section class="section content-section" id="preflight" data-japanese-market="preflight"><div class="section-inner content-grid"><div><p class="section-kicker">操作前のチェック</p><h2>削除、翻訳、画面共有は確認してから実行します。</h2><p>アプリは候補や保護機能を提供しますが、残す写真、重要な訳文、共有する画面は利用者が判断します。次のチェックを先に行うと、誤操作と見落としを減らせます。</p></div><div class="content-list"><div><strong>写真を削除する前</strong><p>iCloud写真の同期状態を確認し、重複グループだけでなく、編集済み写真、書類、領収書、身分証、家族写真などの重要カテゴリも見直します。内容を理解できる項目だけを選びます。</p></div><div><strong>類似写真を比較するとき</strong><p>見た目が近くても、表情、ピント、文字の読みやすさ、編集状態が異なる場合があります。候補を一枚ずつ開き、残す理由が明確な写真を先に決めます。</p></div><div><strong>旅行翻訳を使う前</strong><p>出発前に利用する言語の音声入力とカメラ翻訳を試します。氏名、日付、金額、住所は原文と照合し、医療、法律、安全、入国手続きは公式情報や人の通訳にも確認します。</p></div><div><strong>Mac画面を共有する前</strong><p>通知を抑え、共有するウィンドウまたはディスプレイを確認し、私的なチャット、メール、顧客情報を閉じます。本番前に短いテスト共有を行い、保護対象が見えていないか確認します。</p></div><div><strong>日本のApp Storeで確認すること</strong><p><a href="${aiCleaningStoreUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" aria-label="AI Cleaning 写真クリーナーを日本のApp Storeで確認する（新しいタブ）">AI Cleaning</a> と <a href="${translatorStoreUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="translation-specialist" data-storefront="ios-app-store" aria-label="Translation Specialistを日本のApp Storeで確認する（新しいタブ）">Translation Specialist</a> の日区ストアページで、現在の価格、対応OS、利用できる機能、プライバシー表示をインストール前に確認します。</p></div></div></div></section><section class="section content-section alt-section" id="boundaries" data-japanese-market="boundaries"><div class="section-inner content-grid"><div><p class="section-kicker">機能の境界</p><h2>できることと、利用者が判断することを分ける。</h2><p>検索結果の短い説明だけでは、アプリが自動で判断する範囲を誤解しやすくなります。インストール前に、各ツールが補助する部分と、利用者自身が確認する部分を分けて考えてください。</p></div><div class="content-list"><div><strong>写真整理は自動削除ではありません</strong><p>AI分類や重複候補は確認を速くするための手掛かりです。残す写真の品質や意味は利用者が判断し、削除対象を選択します。</p></div><div><strong>写真クリーナーはiOSのシステム清掃ではありません</strong><p>対象は写真ライブラリ内の整理です。保護されたiOSシステムデータ、RAM、架空の「システムごみ」を消す機能として案内していません。</p></div><div><strong>機械翻訳は重要判断の最終確認ではありません</strong><p>日常会話の補助には便利ですが、医療、法律、安全、入国手続きでは、原文、公式窓口、資格を持つ通訳者による確認が必要です。</p></div><div><strong>画面保護は共有元を自動選択しません</strong><p>保護対象のアプリや画面領域を設定しても、会議アプリで共有するウィンドウやディスプレイは利用者が選びます。共有プレビューを必ず確認します。</p></div></div></div></section>${faqSection()}</main>`;
}

function marketLinks() {
  return `<section class="section content-section" data-japanese-market="markets"><div class="section-inner"><p class="section-kicker">他のApp Store市場</p><p><a href="us-apps.html">アメリカ</a> · <a href="uk-apps.html">イギリス</a> · <a href="canada-australia-apps.html">カナダ・オーストラリア</a> · <a href="singapore-apps.html">シンガポール</a> · <a href="switzerland-apps.html">スイス</a> · <a href="netherlands-nordics-apps.html">オランダ・北欧</a> · <a href="de-de.html">ドイツ</a> · <a href="fr-fr.html">フランス</a> · <a href="es-es.html">スペイン</a> · <a href="it-it.html">イタリア</a> · <a href="ko-kr.html">韓国</a> · <a href="zh-cn.html">簡体字中国語</a> · <a href="zh-hant.html">繁体字中国語</a></p></div></section>`;
}

function footer() {
  return `<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="ja-jp.html">ホーム</a> <a href="apps.html">アプリ一覧</a> <a href="guides.html">ガイド</a> <a href="regions.html">国・言語別ページ</a> <a href="directory.html">ページ一覧</a> <a href="search.html">サイト内検索</a> <a href="mailto:cb123428316@gmail.com">お問い合わせ</a></div></div></footer>`;
}

function updateMarketLinks(html) {
  const existing = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)]
    .find((match) => /<p class="section-kicker">\s*(?:Other App Store markets|他のApp Store市場)\s*<\/p>/i.test(match[0]));

  if (!existing) throw new Error("Missing market links section in ja-jp.html");
  return html.replace(existing[0], marketLinks());
}

function updateMetadata(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>iPhone写真整理・旅行翻訳・Mac画面プライバシー | 日本向け</title>")
    .replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="日本向けのiPhone写真整理、重複写真確認、旅行の音声・カメラ翻訳、Mac画面共有プライバシーを用途別に比較。削除・翻訳・共有前の確認点と日区App Storeへの入口を案内します。">')
    .replace(/<meta name="keywords" content="[^"]*">/i, '<meta name="keywords" content="iPhone写真整理, AI写真分類, 写真クリーナー, 重複写真整理, 旅行翻訳アプリ, カメラ翻訳, Mac画面プライバシー, 画面共有">')
    .replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="iPhone写真整理・旅行翻訳・Mac画面プライバシー">')
    .replace(/<meta property="og:description" content="[^"]*">/i, '<meta property="og:description" content="日本向けに、AI写真分類、削除前の確認、旅行翻訳、Mac画面共有プライバシーを用途別に案内。">')
    .replace(/<meta name="twitter:title" content="[^"]*">/i, '<meta name="twitter:title" content="iPhone写真整理・旅行翻訳・Mac画面プライバシー">')
    .replace(/<meta name="twitter:description" content="[^"]*">/i, '<meta name="twitter:description" content="日本向けに、AI写真分類、削除前の確認、旅行翻訳、Mac画面共有プライバシーを用途別に案内。">');
}

function updateJsonLd(html) {
  const replacementFaq = faqJsonLd();
  const scriptPattern = /<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi;
  let foundFaq = false;
  const updated = html.replace(scriptPattern, (block, body) => {
    try {
      const parsed = JSON.parse(body);

      if (parsed?.["@type"] === "WebPage") {
        parsed.name = "iPhone写真整理・旅行翻訳・Mac画面プライバシー";
        parsed.about = [
          "iPhone写真整理",
          "AI写真分類",
          "重複写真整理",
          "旅行翻訳",
          "カメラ翻訳",
          "Mac画面プライバシー"
        ];
        parsed.dateModified = updatedDate;
        return `<script type="application/ld+json">${JSON.stringify(parsed)}</script>`;
      }

      if (parsed?.["@type"] === "BreadcrumbList") {
        parsed.name = "日本";
        parsed.itemListElement = [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.xiaozhonglvyou.com/" },
          { "@type": "ListItem", position: 2, name: "国・言語別ページ", item: "https://www.xiaozhonglvyou.com/regions.html" },
          { "@type": "ListItem", position: 3, name: "日本", item: "https://www.xiaozhonglvyou.com/ja-jp.html" }
        ];
        return `<script type="application/ld+json">${JSON.stringify(parsed)}</script>`;
      }

      if (parsed?.["@type"] === "FAQPage") {
        foundFaq = true;
        return replacementFaq;
      }
    } catch {
      return block;
    }

    return block;
  });

  if (foundFaq) return updated;
  if (!updated.includes("</head>")) throw new Error("Missing </head> in ja-jp.html");
  return updated.replace("</head>", `${replacementFaq}</head>`);
}

function updateBody(html) {
  let updated = html;

  if (!/<body>\s*<a class="skip-link"/i.test(updated)) {
    updated = updated.replace("<body>", '<body><a class="skip-link" href="#main-content">本文へ移動</a>');
  }

  updated = updated.replace(
    /<div class="nav-links">[\s\S]*?<\/div><a class="nav-cta"/i,
    '<div class="nav-links"><a href="#photo-cleaning">写真整理</a> <a href="#translation">旅行翻訳</a> <a href="#mac-privacy">Macプライバシー</a></div><a class="nav-cta"'
  );
  updated = updated.replace(/<main\b[\s\S]*?<\/main>/i, mainContent());
  updated = updateMarketLinks(updated);
  updated = updated.replace(/<footer class="footer">[\s\S]*?<\/footer>/i, footer());
  return updated;
}

const filePath = path.join(siteDir, fileName);
const original = await readFile(filePath, "utf8");
const updated = updateBody(updateJsonLd(updateMetadata(original)));

if (updated !== original) await writeFile(filePath, updated, "utf8");
console.log(`Applied Japanese market content to ${fileName}; changed ${updated === original ? 0 : 1}.`);
