import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { priorityStores } from "./japan-germany-turkey-markets.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");
const origin = "https://www.xiaozhonglvyou.com";
const updatedDate = "2026-09-01";
const appId = "6768019606";

const developer = {
  "@type": "Person",
  "@id": `${origin}/#developer`,
  name: "Bo Chen",
  alternateName: "bo chen",
  jobTitle: "Independent iOS and macOS Developer",
  description: "Independent developer of focused iPhone, iPad, Apple Watch, and Mac apps.",
  url: `${origin}/about.html`,
  email: "mailto:cb123428316@gmail.com",
  sameAs: ["https://apps.apple.com/us/developer/bo-chen/id1321915789?uo=4"],
  knowsAbout: ["iOS apps", "on-device AI", "AI photo classification", "photo cleanup", "iPhone storage cleanup"]
};

const publisher = {
  "@type": ["Organization", "Brand"],
  "@id": `${origin}/#publisher`,
  name: "CrazyAIAgent",
  url: `${origin}/`,
  logo: { "@type": "ImageObject", url: `${origin}/apple-touch-icon.png` },
  image: `${origin}/assets/anti-spy-screen.png`,
  description: "Independent App Store utility portfolio for photo organization, travel translation, and screen privacy.",
  founder: { "@id": `${origin}/#developer` },
  contactPoint: { "@type": "ContactPoint", email: "mailto:cb123428316@gmail.com", contactType: "customer support", availableLanguage: ["en", "de", "ja", "tr"] },
  sameAs: [
    "https://apps.apple.com/us/developer/bo-chen/id1321915789?uo=4",
    "https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4",
    "https://github.com/kuangre123/xiaozhonglvyou-apps-site"
  ]
};

const hreflangAlternates = [
  ["en", "iphone-photo-cleaner.html"],
  ["zh-CN", "iphone-photo-cleaner-cn.html"],
  ["de", "iphone-foto-cleaner-de.html"],
  ["fr", "nettoyeur-photo-iphone-fr.html"],
  ["ja", "ja-jp-photo-cleaner.html"],
  ["tr", "tr-tr-photo-cleaner.html"],
  ["x-default", "iphone-photo-cleaner.html"]
];

const pages = [
  {
    file: "ja-jp-photo-cleaner.html",
    lang: "ja-JP",
    locale: "ja_JP",
    storeCountry: "jp",
    title: "iPhone写真整理アプリ | AIで重複・類似写真を確認",
    description: "iPhoneの写真整理アプリを日本語で解説。AIで写真を分類し、重複・類似写真、スクリーンショット、ぼやけた写真を削除前に確認する手順を紹介します。",
    keywords: ["iPhone 写真整理アプリ", "iPhone 写真クリーナー", "重複写真 削除", "類似写真 整理", "写真整理 AI", "iPhone ストレージ整理"],
    ogTitle: "iPhone写真整理アプリをAIで比較・確認",
    ogDescription: "日本語で確認するiPhone写真整理ガイド。分類してから重複・類似写真を見直し、削除は自分で決めます。",
    breadcrumb: "iPhone写真整理ガイド",
    countryName: "日本",
    marketFile: "ja-jp.html",
    decisionFile: "ja-jp-best-iphone-photo-cleaner.html",
    decisionLabel: "おすすめアプリの選び方",
    navGuide: "ガイド",
    navDirectory: "一覧",
    eyebrow: "日本語のiPhone写真整理ガイド",
    imageAlt: "AI CleaningのiPhone写真分類画面",
    h1: "写真をAIで分類してから、重複写真を安全に整理する。",
    lead: "iPhoneの写真整理は、空き容量の数字だけを見て一括削除するより、写真の内容を先に把握する方が安全です。AI Cleaningは、写真を分類し、重複・類似写真、スクリーンショット、ぼやけた写真、大きなメディアを確認するための補助ツールです。",
    primary: "日本のApp StoreでAI Cleaningを確認",
    secondary: "日本向けアプリページを見る",
    quickTitle: "iPhone写真整理アプリは、分類・確認・削除の順で使います。",
    quickLead: "AI Cleaningは写真ライブラリを理解するための候補を示します。重要な写真を先に確認し、削除する項目は最後に自分で選択してください。",
    quickItems: [
      ["1. 写真を内容で分類", "書類、領収書、身分証、食べ物、植物、動物、集合写真などを先に見分けます。必要な写真を除外しやすくなります。"],
      ["2. 重複・類似写真を比較", "完全な重複と似た構図の連写は同じ意味ではありません。表情、ピント、編集状態、文字の読みやすさを一枚ずつ比べます。"],
      ["3. スクリーンショットと大きなファイルを確認", "一時的な画面保存や容量の大きい動画をまとめて確認します。削除後は「最近削除した項目」も確認してください。"]
    ],
    checksTitle: "写真整理の範囲と注意点。",
    checksLead: "写真を消す操作には、同期、重要書類、共有予定の画像、最近削除した項目を含む確認が必要です。",
    checks: [
      ["写真は自動削除されません", "分類結果や削除候補は確認のための情報です。残す写真と削除する写真は利用者が決めます。"],
      ["写真ライブラリの整理が対象です", "iOSの保護されたシステムデータやRAMを消去するアプリではありません。写真整理とシステムメンテナンスを混同しないでください。"],
      ["重要な写真は別に確認します", "書類、チケット、領収書、家族写真、編集済みの写真は、候補グループだけで判断せず元画像を開いて確認します。"],
      ["現在の条件はストアで再確認します", "対応OS、価格、アプリ内課金、プライバシー表示は、日本のApp Storeに表示される最新情報を基準にしてください。"]
    ],
    storeTitle: "最新の価格と対応条件を確認してから始める。",
    storeLead: "日本のApp StoreでAI Cleaningの対応OS、価格、アプリ内課金、言語、プライバシー表示を確認できます。",
    storeText: "写真を端末上で分類し、確認したい候補をまとめるiPhone向けユーティリティです。",
    faqTitle: "インストール前に確認すること。",
    faq: [
      ["iPhone写真整理アプリで重複写真を削除できますか？", "重複写真や類似写真を候補としてまとめて確認できます。ただし、削除する写真は利用者が内容を確認して選択します。"],
      ["AI Cleaningは写真をサーバーにアップロードしますか？", "現在の製品説明では写真の分類と分析はiPhone上で行われ、写真ライブラリはアップロードされません。インストール時にはApp Storeの最新プライバシー表示も確認してください。"],
      ["類似写真と完全な重複の違いは何ですか？", "完全な重複は同じ画像のコピーですが、類似写真は連写や別テイクの可能性があります。ピント、表情、文字、編集状態を比べてから判断します。"],
      ["削除後もiPhoneの容量が増えないのはなぜですか？", "iOSは削除した写真を「最近削除した項目」に一定期間保管します。すぐに容量を空ける場合は、内容を確認した上でそのアルバムも整理してください。"],
      ["AI CleaningはどのiPhoneで使えますか？", "現在の製品情報ではiOS 16.0以降が対象です。対応機種、バージョン、価格は日本のApp Storeでインストール前に確認してください。"]
    ],
    relatedTitle: "同じ写真整理ガイドを別の言語で読む。",
    relatedLabel: "関連する言語ページ",
    ui: {
      answerKicker: "先に答え",
      checksKicker: "確認ポイント",
      faqKicker: "よくある質問",
      storeKicker: "App Storeで確認",
      storeLink: "日本のApp Storeを開く",
      updated: "2026年9月1日更新",
      author: "著者",
      privacy: "プライバシー",
      contact: "お問い合わせ"
    }
  },
  {
    file: "iphone-foto-cleaner-de.html",
    lang: "de-DE",
    locale: "de_DE",
    storeCountry: "de",
    title: "iPhone Foto Cleaner | KI sortieren und Duplikate prüfen",
    description: "Deutscher iPhone-Foto-Cleaner-Leitfaden: Fotos mit KI sortieren und Duplikate, ähnliche Bilder, Screenshots und unscharfe Fotos vor dem Löschen prüfen.",
    keywords: ["iPhone Foto Cleaner", "KI Fotos sortieren", "doppelte Fotos iPhone", "iPhone Fotos aufräumen", "ähnliche Bilder prüfen", "iPhone Speicher bereinigen"],
    ogTitle: "iPhone Foto Cleaner mit KI Foto Sortierung",
    ogDescription: "Deutscher Leitfaden: Erst Fotos sortieren, dann Duplikate, Screenshots, unscharfe Fotos und große Medien prüfen.",
    breadcrumb: "iPhone Foto Cleaner",
    countryName: "Deutschland",
    marketFile: "de-de.html",
    decisionFile: "de-de-beste-iphone-foto-cleaner.html",
    decisionLabel: "Beste Foto-Cleaner wählen",
    navGuide: "Ratgeber",
    navDirectory: "Verzeichnis",
    eyebrow: "Deutschsprachiger iPhone-Foto-Cleaner-Ratgeber",
    imageAlt: "AI Cleaning iPhone-Foto-Klassifizierung",
    h1: "Fotos zuerst mit KI sortieren, dann sicher bereinigen.",
    lead: "Eine große iPhone-Fotomediathek enthält nicht nur doppelte Bilder. Darin liegen auch Dokumente, Belege, Ausweise, Screenshots, Gruppenfotos und Erinnerungen. AI Cleaning hilft beim Sortieren, bevor Sie mögliche Löschkandidaten prüfen.",
    primary: "AI Cleaning im deutschen App Store prüfen",
    secondary: "Zur Deutschland-Seite",
    quickTitle: "Ein iPhone-Foto-Cleaner sollte Sortieren, Prüfen und Löschen trennen.",
    quickLead: "AI Cleaning zeigt Kategorien und mögliche Bereinigungsgruppen als Entscheidungshilfe. Wichtige Bilder prüfen Sie zuerst; die endgültige Auswahl zum Löschen bleibt bei Ihnen.",
    quickItems: [
      ["1. Fotos nach Inhalt sortieren", "Ordnen Sie Dokumente, Belege, Ausweise, Essen, Pflanzen, Tiere und Gruppenfotos zunächst ein. So können Sie wichtige Bilder leichter aus der Bereinigung ausschließen."],
      ["2. Duplikate und ähnliche Bilder vergleichen", "Eine exakte Kopie und eine ähnliche Aufnahme sind nicht dasselbe. Vergleichen Sie Schärfe, Gesichtsausdruck, Bearbeitungsstand und lesbaren Text, bevor Sie eine Version behalten."],
      ["3. Screenshots und große Medien prüfen", "Temporäre Screenshots, unscharfe Fotos und große Videos sind eigene Prüfschritte. Nach dem Löschen sollten Sie auch das Album ‚Zuletzt gelöscht‘ kontrollieren."]
    ],
    checksTitle: "Der sichere Umfang einer Foto-Bereinigung.",
    checksLead: "Synchronisierung, wichtige Dokumente und das Album ‚Zuletzt gelöscht‘ gehören zur Kontrolle. Ein Speicherwert allein sagt nicht, welches Bild entbehrlich ist.",
    checks: [
      ["Fotos werden nicht automatisch gelöscht", "Kategorien und Kandidaten dienen der Orientierung. Sie öffnen die Gruppe, prüfen den Inhalt und entscheiden selbst, welche Fotos entfernt werden."],
      ["Die Fotomediathek ist der Anwendungsbereich", "Die App wird nicht als Werkzeug zum Löschen geschützter iOS-Systemdaten oder zum Reinigen des Arbeitsspeichers angeboten. Fotoorganisation und Systemwartung sind unterschiedliche Aufgaben."],
      ["Wichtige Bilder einzeln öffnen", "Dokumente, Tickets, Belege, Familienfotos und bearbeitete Aufnahmen nicht nur anhand einer Gruppe auswählen. Öffnen Sie das Original und prüfen Sie die Synchronisierung."],
      ["Aktuelle Bedingungen im Store prüfen", "Preise, In-App-Käufe, iOS-Anforderung, Sprachen und Datenschutzangaben können sich ändern. Maßgeblich ist der aktuelle deutsche App-Store-Eintrag vor der Installation."]
    ],
    storeTitle: "Aktuelle Preise und Anforderungen vor der Installation prüfen.",
    storeLead: "Im deutschen App Store können Sie die aktuelle iOS-Anforderung, den Preis, mögliche In-App-Käufe, die Sprachliste und die Datenschutzangaben von AI Cleaning prüfen.",
    storeText: "Ein iPhone-Dienstprogramm, das Fotos auf dem Gerät klassifiziert und mögliche Prüfgruppen für die Mediathek zusammenstellt.",
    faqTitle: "Fragen vor dem Download.",
    faq: [
      ["Kann ein iPhone Foto Cleaner doppelte Fotos löschen?", "Er kann Duplikate und ähnliche Fotos als Prüfgruppen anzeigen. Sie sollten jede Gruppe vergleichen und die zu löschenden Fotos selbst auswählen."],
      ["Lädt AI Cleaning meine Fotos auf einen Server hoch?", "Nach der aktuellen Produktbeschreibung erfolgt die Fotoanalyse auf dem iPhone; die Fotomediathek wird nicht hochgeladen. Prüfen Sie beim Installieren zusätzlich die aktuelle Datenschutzangabe im deutschen App Store."],
      ["Was ist der Unterschied zwischen Duplikaten und ähnlichen Fotos?", "Duplikate sind Kopien desselben Bildes. Ähnliche Fotos können verschiedene Aufnahmen einer Serie sein. Schärfe, Ausdruck, Bearbeitung und wichtige Details müssen vor dem Löschen verglichen werden."],
      ["Warum wird der iPhone-Speicher nach dem Löschen nicht sofort frei?", "iOS bewahrt gelöschte Fotos zunächst im Album ‚Zuletzt gelöscht‘ auf. Wenn Sie Speicher freigeben möchten, prüfen und verwalten Sie dieses Album erst nach der inhaltlichen Kontrolle."],
      ["Welche iPhones unterstützt AI Cleaning?", "Nach den aktuellen Produktinformationen wird iOS 16.0 oder neuer benötigt. Kompatible Geräte, Version, Preis und Datenschutzangaben prüfen Sie vor dem Download im deutschen App Store."]
    ],
    relatedTitle: "Diesen Foto-Cleaner-Ratgeber in einer anderen Sprache lesen.",
    relatedLabel: "Verwandte Sprachseiten",
    ui: {
      answerKicker: "Direkte Antwort",
      checksKicker: "Prüfpunkte",
      faqKicker: "Häufige Fragen",
      storeKicker: "Im App Store prüfen",
      storeLink: "Deutschen App Store öffnen",
      updated: "Am 1. September 2026 aktualisiert",
      author: "Autor",
      privacy: "Datenschutz",
      contact: "Kontakt"
    }
  },
  {
    file: "tr-tr-photo-cleaner.html",
    lang: "tr-TR",
    locale: "tr_TR",
    storeCountry: "tr",
    title: "iPhone Fotoğraf Temizleme | Yapay Zeka Rehberi",
    description: "Türkçe iPhone fotoğraf temizleme rehberi: Fotoğrafları yapay zeka ile sınıflandırın, yinelenen ve benzer fotoğrafları silmeden önce inceleyin.",
    keywords: ["iPhone fotoğraf temizleme", "iPhone fotoğraf düzenleme uygulaması", "yinelenen fotoğrafları silme", "benzer fotoğraflar", "yapay zeka fotoğraf düzenleme", "iPhone depolama alanı temizleme"],
    ogTitle: "iPhone fotoğraf temizleme uygulamasını inceleyin",
    ogDescription: "Türkçe iPhone fotoğraf temizleme rehberi. Önce sınıflandırın, sonra yinelenen ve benzer fotoğrafları karşılaştırın; silme kararını siz verin.",
    breadcrumb: "iPhone Fotoğraf Temizleme Rehberi",
    countryName: "Türkiye",
    marketFile: "tr-tr.html",
    decisionFile: "tr-tr-en-iyi-iphone-fotograf-temizleme.html",
    decisionLabel: "En iyi uygulamayı seç",
    navGuide: "Rehberler",
    navDirectory: "Dizin",
    eyebrow: "Türkçe iPhone fotoğraf temizleme rehberi",
    imageAlt: "AI Cleaning iPhone fotoğraf sınıflandırma ekranı",
    h1: "Fotoğrafları yapay zeka ile sınıflandırın, sonra yinelenenleri güvenle inceleyin.",
    lead: "iPhone depolama alanı azaldığında her şeyi tek seferde silmek yerine fotoğraf arşivinin içeriğini önce görmek daha güvenlidir. AI Cleaning; fotoğrafları sınıflandırmayı, yinelenen ve benzer kareleri, ekran görüntülerini, bulanık fotoğrafları ve büyük medyayı silmeden önce incelemeyi kolaylaştırır.",
    primary: "Türkiye App Store'da AI Cleaning'i incele",
    secondary: "Türkiye uygulama sayfasına git",
    quickTitle: "iPhone fotoğraf temizleme uygulaması sınıflandırma, inceleme ve seçme sırasıyla kullanılmalı.",
    quickLead: "AI Cleaning, fotoğraf arşivini anlamanıza yardımcı olan aday grupları gösterir. Önemli görselleri önce kontrol edin; silinecek öğeleri son adımda kendiniz seçin.",
    quickItems: [
      ["1. Fotoğrafları içeriğine göre ayırın", "Belge, makbuz, kimlik, yemek, bitki, hayvan ve grup fotoğraflarını önce ayırmak, önemli görselleri yanlışlıkla seçme riskini azaltır."],
      ["2. Yinelenen ve benzer kareleri karşılaştırın", "Birebir kopya ile aynı anın farklı çekimleri aynı değildir. Netlik, yüz ifadeleri, düzenleme ve metin okunabilirliğini karşılaştırın."],
      ["3. Ekran görüntülerini ve büyük dosyaları gözden geçirin", "Geçici ekran görüntülerini ve çok yer kaplayan videoları ayrı değerlendirin. Silme işleminden sonra Son Silinenler albümünü de kontrol edin."]
    ],
    checksTitle: "Fotoğraf temizliğinin sınırları.",
    checksLead: "Fotoğraf silme işlemi; eşzamanlama, önemli belgeler, paylaşılacak görseller ve Son Silinenler albümü kontrol edilerek yapılmalıdır.",
    checks: [
      ["Fotoğraflar otomatik silinmez", "Sınıflandırma ve temizlik adayları karar desteğidir. Hangi fotoğrafların kalacağına kullanıcı karar verir."],
      ["Kapsam fotoğraf arşividir", "Uygulama korunan iOS sistem verilerini veya RAM'i temizleyen bir sistem aracı olarak sunulmaz. Fotoğraf temizliği ile sistem bakımını ayırın."],
      ["Önemli görselleri ayrıca kontrol edin", "Belgeleri, biletleri, makbuzları, aile fotoğraflarını ve düzenlenmiş kareleri yalnızca aday grubuna bakarak silmeyin; orijinal fotoğrafı açın."],
      ["Güncel koşulları mağazada doğrulayın", "Uyumluluk, fiyat, uygulama içi satın alımlar ve gizlilik bilgileri için yükleme öncesinde Türkiye App Store kaydını esas alın."]
    ],
    storeTitle: "Başlamadan önce güncel fiyatı ve uyumluluğu kontrol edin.",
    storeLead: "Türkiye App Store kaydında AI Cleaning'in işletim sistemi gereksinimini, fiyatını, uygulama içi satın alımlarını, dilini ve gizlilik bilgilerini inceleyebilirsiniz.",
    storeText: "Fotoğrafları cihaz üzerinde sınıflandırmaya ve incelenecek adayları gruplamaya yardımcı olan iPhone yardımcı programıdır.",
    faqTitle: "Yüklemeden önce bilinmesi gerekenler.",
    faq: [
      ["iPhone fotoğraf temizleme uygulaması yinelenen fotoğrafları silebilir mi?", "Yinelenen ve benzer fotoğrafları inceleme gruplarında gösterebilir. Ancak silme kararını kullanıcı verir ve silmeden önce içerik kontrol edilmelidir."],
      ["AI Cleaning fotoğrafları sunucuya yükler mi?", "Mevcut ürün açıklamasına göre fotoğraf sınıflandırma ve analiz iPhone üzerinde yapılır; fotoğraf arşivi yüklenmez. Yükleme sırasında App Store'un güncel gizlilik etiketini de inceleyin."],
      ["Benzer fotoğraf ile yinelenen fotoğraf arasındaki fark nedir?", "Yinelenen fotoğraf aynı görüntünün kopyasıdır. Benzer fotoğraf ise seri çekim veya farklı bir çekim olabilir; netlik, yüz ifadesi ve düzenleme durumunu karşılaştırın."],
      ["Silme işleminden sonra iPhone depolama alanı neden hemen boşalmıyor?", "iOS, silinen fotoğrafları Son Silinenler albümünde bir süre tutar. Alanı hemen boşaltmanız gerekiyorsa içeriği kontrol ettikten sonra bu albümü de yönetin."],
      ["AI Cleaning hangi iPhone sürümlerinde çalışır?", "Mevcut ürün bilgisine göre iOS 16.0 veya daha yenisi gerekir. Uyumlu cihazları, sürümü ve fiyatı yüklemeden önce Türkiye App Store'da doğrulayın."]
    ],
    relatedTitle: "Aynı fotoğraf temizleme konusunu farklı dillerde okuyun.",
    relatedLabel: "İlgili dil sayfaları",
    ui: {
      answerKicker: "Kısa cevap",
      checksKicker: "Kontrol noktaları",
      faqKicker: "Sık sorulan sorular",
      storeKicker: "App Store'da doğrulama",
      storeLink: "Türkiye App Store'u aç",
      updated: "1 Eylül 2026 tarihinde güncellendi",
      author: "Yazar",
      privacy: "Gizlilik",
      contact: "İletişim"
    }
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`;
}

function storeLink(page, label, className) {
  const href = priorityStores[page.storeCountry].ai;
  return `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" data-store-country="${page.storeCountry}" aria-label="${escapeHtml(label)} (opens in a new tab)">${escapeHtml(label)}</a>`;
}

function alternateMarkup() {
  return hreflangAlternates.map(([code, file]) => `<link rel="alternate" hreflang="${code}" href="${origin}/${file}">`).join("");
}

function appEntity(page) {
  const appUrl = priorityStores[page.storeCountry].ai;
  return {
    "@type": "SoftwareApplication",
    name: "AI Cleaning - Photo Cleaner",
    alternateName: "AI Cleaning - Photo Tidy",
    operatingSystem: "iOS",
    applicationCategory: "UtilitiesApplication",
    url: appUrl,
    downloadUrl: appUrl,
    softwareVersion: "1.1.3",
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    sameAs: [appUrl],
    identifier: { "@type": "PropertyValue", propertyID: "Apple App Store ID", value: appId },
    image: `${origin}/assets/ai-cleaning-icon.png`,
    author: { "@id": `${origin}/#developer` },
    provider: { "@id": `${origin}/#publisher` },
    publisher: { "@id": `${origin}/#publisher` }
  };
}

function listMarkup(items) {
  return items.map(([title, text]) => `<div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>`).join("");
}

const relatedGuides = [
  ["English photo cleaner guide", "iphone-photo-cleaner.html"],
  ["中文照片清理页", "iphone-photo-cleaner-cn.html"],
  ["Deutscher Foto-Cleaner", "iphone-foto-cleaner-de.html"],
  ["Guide photo en français", "nettoyeur-photo-iphone-fr.html"],
  ["日本語の写真整理ガイド", "ja-jp-photo-cleaner.html"],
  ["Türkçe fotoğraf temizleme rehberi", "tr-tr-photo-cleaner.html"]
];

function render(page) {
  const url = `${origin}/${page.file}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    image: `${origin}/assets/ai-cleaning-screen.png`,
    mainEntityOfPage: url,
    wordCount: page.lead.length + page.quickLead.length + page.quickItems.flat().join("").length + page.checks.flat().join("").length + page.faq.flat().join("").length,
    articleSection: "Regional Guides",
    inLanguage: page.lang,
    datePublished: updatedDate,
    dateModified: updatedDate,
    author: developer,
    about: [appEntity(page)],
    publisher,
    isPartOf: { "@id": `${origin}/#website` },
    "@id": `${url}#article`,
    keywords: page.keywords
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: page.lang,
    mainEntity: page.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    name: page.breadcrumb,
    numberOfItems: 3,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.countryName, item: `${origin}/${page.marketFile}` },
      { "@type": "ListItem", position: 2, name: page.navGuide, item: `${origin}/guides.html` },
      { "@type": "ListItem", position: 3, name: page.breadcrumb, item: url }
    ]
  };
  const relatedFiles = relatedGuides.filter(([, file]) => file !== page.file);
  const relatedMarkup = relatedFiles.map(([label, file]) => `<a href="${file}">${escapeHtml(label)}</a>`).join(" ");
  const storeSection = `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(page.ui.storeKicker)}</p><h2>${escapeHtml(page.storeTitle)}</h2><p>${escapeHtml(page.storeLead)}</p></div><div class="content-list"><div><strong>AI Cleaning - Photo Cleaner</strong><p>${escapeHtml(page.storeText)}</p></div><div>${storeLink(page, page.ui.storeLink, "store-link")}</div></div></div></section>`;
  const head = [
    "<!doctype html>", `<html lang="${page.lang}"><head>`,
    `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests">`,
    `<link rel="preconnect" href="https://www.googletagmanager.com"><link rel="preconnect" href="https://apps.apple.com"><script src="analytics.js"></script><script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-JY8T5JJGNH"></script>`,
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`,
    `<title>${escapeHtml(page.title)}</title>`, `<meta name="description" content="${escapeHtml(page.description)}">`,
    `<meta name="keywords" content="${escapeHtml(page.keywords.join(", "))}">`,
    `<meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#111827">`,
    `<meta name="apple-itunes-app" content="app-id=${appId}, app-argument=${url}">`,
    `<link rel="canonical" href="${url}">`, alternateMarkup(),
    `<link rel="alternate" type="application/rss+xml" title="CrazyAIAgent RSS" href="${origin}/feed.xml"><link rel="alternate" type="application/atom+xml" title="CrazyAIAgent Atom" href="${origin}/atom.xml">`,
    `<meta property="og:type" content="article"><meta property="og:locale" content="${page.locale}"><meta property="article:published_time" content="${updatedDate}"><meta property="article:modified_time" content="${updatedDate}">`,
    `<meta property="og:url" content="${url}"><meta property="og:title" content="${escapeHtml(page.ogTitle)}"><meta property="og:site_name" content="CrazyAIAgent"><meta property="og:description" content="${escapeHtml(page.ogDescription)}">`,
    `<meta property="og:image" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg"><meta property="og:image:secure_url" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="iPhone photo cleaner with AI sorting">`,
    `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.ogTitle)}"><meta name="twitter:description" content="${escapeHtml(page.ogDescription)}"><meta name="twitter:image" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg">`,
    `<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="styles.css?v=b83323801a7e">`,
    jsonLd(article), jsonLd(faq), jsonLd(breadcrumb), "</head>"
  ].join("");
  const header = `<body class="localized-photo-cleaner-page"><header class="site-header" data-elevate><nav class="nav" aria-label="Primary"><a class="brand" href="${page.marketFile}" aria-label="CrazyAIAgent"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="${page.marketFile}">${page.countryName}</a><a href="guides.html">${page.navGuide}</a><a href="directory.html">${page.navDirectory}</a></div>${storeLink(page, "App Store", "nav-cta")}</nav></header>`;
  const decisionAction = page.decisionFile ? `<a class="button button-secondary" href="${page.decisionFile}">${escapeHtml(page.decisionLabel)}</a>` : "";
  const hero = `<main class="page-main"><section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="${page.marketFile}">${page.countryName}</a></li><li aria-current="page">${escapeHtml(page.breadcrumb)}</li></ol></nav><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p><p class="article-meta"><time datetime="${updatedDate}">${escapeHtml(page.ui.updated)}</time> · ${escapeHtml(page.ui.author)} <a href="about.html" rel="author">Bo Chen</a></p><div class="hero-actions">${storeLink(page, page.primary, "button button-primary")}<a class="button button-secondary" href="${page.marketFile}">${escapeHtml(page.secondary)}</a>${decisionAction}</div></div><div class="page-hero-media"><picture><source srcset="assets/ai-cleaning-screen.webp" type="image/webp"><img src="assets/ai-cleaning-screen.png" width="331" height="720" decoding="async" fetchpriority="high" alt="${escapeHtml(page.imageAlt ?? "AI Cleaning photo classification screen")}"></picture></div></section>`;
  const quickSection = `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(page.ui.answerKicker)}</p><h2>${escapeHtml(page.quickTitle)}</h2><p>${escapeHtml(page.quickLead)}</p></div><div class="content-list">${listMarkup(page.quickItems)}</div></div></section>`;
  const checksSection = `<section class="section content-section alt-section"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(page.ui.checksKicker)}</p><h2>${escapeHtml(page.checksTitle)}</h2><p>${escapeHtml(page.checksLead)}</p></div><div class="content-list">${listMarkup(page.checks)}</div></div></section>`;
  const faqSection = `<section class="section faq"><div class="section-inner"><div class="section-heading"><p class="section-kicker">${escapeHtml(page.ui.faqKicker)}</p><h2>${escapeHtml(page.faqTitle)}</h2></div><div class="faq-list">${page.faq.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></div></section>`;
  const relatedSection = `<section class="section content-section alt-section"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(page.relatedLabel)}</p><h2>${escapeHtml(page.relatedTitle)}</h2></div></div><p>${relatedMarkup}</p></div></section></main>`;
  const footer = `<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="${page.marketFile}">${page.countryName}</a> <a href="guides.html">${page.navGuide}</a> <a href="directory.html">${page.navDirectory}</a> <a href="search.html">Search</a> <a href="privacy.html">${page.ui.privacy}</a> <a href="mailto:cb123428316@gmail.com">${page.ui.contact}</a></div></div></footer><script src="script.js?v=fda667de6672" defer></script></body></html>\n`;
  return `${head}${header}${hero}${quickSection}${checksSection}${storeSection}${faqSection}${relatedSection}${footer}`;
}

for (const page of pages) {
  const filePath = path.join(siteDir, page.file);
  const updated = render(page);
  let current = "";
  try { current = await readFile(filePath, "utf8"); } catch {}
  if (current !== updated) await writeFile(filePath, updated, "utf8");
  console.log(`${current === updated ? "Verified" : "Generated"} ${page.file}`);
}

for (const file of ["iphone-photo-cleaner.html", "iphone-photo-cleaner-cn.html", "iphone-foto-cleaner-de.html", "nettoyeur-photo-iphone-fr.html", ...pages.map(({ file }) => file)]) {
  const filePath = path.join(siteDir, file);
  let html;
  try { html = await readFile(filePath, "utf8"); } catch { continue; }
  const updated = html.replace(/(?:<link\b(?=[^>]*rel=["']alternate["'])(?=[^>]*hreflang=)[^>]*>)+/i, alternateMarkup());
  if (updated !== html) await writeFile(filePath, updated, "utf8");
}
