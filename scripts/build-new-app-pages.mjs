import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.xiaozhonglvyou.com";
const assetVersions = { analytics: "0bee63cd1708", styles: "989efcb20c21", script: "fda667de6672" };
const lailemmaLanguages = [
  ["en", "lailemma-period-tracker.html", "English"],
  ["zh-CN", "lailemma-period-tracker-cn.html", "简体中文"],
  ["ja-JP", "lailemma-period-tracker-ja.html", "日本語"],
  ["de-DE", "lailemma-period-tracker-de.html", "Deutsch"],
  ["tr-TR", "lailemma-period-tr.html", "Türkçe"]
];

const labels = {
  en: { nav: "Primary", apps: "Apps", guides: "Guides", support: "Support", breadcrumb: "Breadcrumb", home: "Home", newTab: "opens in a new tab", screen: "Real product screen", preview: "Body Readiness screens", inside: "Inside the app", faq: "Common questions", before: "Before you download", directory: "Directory", privacy: "Privacy", checked: "Product details checked" },
  "zh-CN": { nav: "主导航", apps: "全部应用", guides: "使用指南", support: "支持", breadcrumb: "路径", home: "首页", newTab: "在新标签页打开", screen: "真实产品画面", preview: "身体准备度新版截图", inside: "应用截图", faq: "常见问题", before: "下载前先确认", directory: "网站目录", privacy: "隐私" },
  "ja-JP": { nav: "主なナビゲーション", apps: "アプリ", guides: "ガイド", support: "サポート", breadcrumb: "現在地", home: "ホーム", newTab: "新しいタブで開く", screen: "実際の画面", preview: "身体コンディションの画面", inside: "アプリの画面", faq: "よくある質問", before: "ダウンロード前に確認", directory: "サイトマップ", privacy: "プライバシー" },
  "de-DE": { nav: "Hauptnavigation", apps: "Apps", guides: "Ratgeber", support: "Support", breadcrumb: "Pfad", home: "Startseite", newTab: "öffnet einen neuen Tab", screen: "Produktansicht", preview: "Ansichten der Körperbereitschaft", inside: "In der App", faq: "Häufige Fragen", before: "Vor dem Download", directory: "Verzeichnis", privacy: "Datenschutz" },
  "tr-TR": { nav: "Ana gezinme", apps: "Uygulamalar", guides: "Rehberler", support: "Destek", breadcrumb: "Sayfa yolu", home: "Ana sayfa", newTab: "yeni sekmede açılır", screen: "Gerçek ürün ekranı", preview: "Body Readiness ekranları", inside: "Uygulama içinden", faq: "Sık sorulan sorular", before: "İndirmeden önce", directory: "Dizin", privacy: "Gizlilik" }
};

const products = [
  {
    file: "lailemma-period-tracker.html",
    lang: "en",
    ogLocale: "en_US",
    title: "Laleme Period Tracker & Body Readiness (Lailemma)",
    description: "Track periods, ovulation and symptoms with Laleme, formerly Lailemma. Version 2.0.7 estimates Body Readiness on device from authorized Apple Health signals.",
    keywords: "period tracker iPhone, cycle tracker, ovulation log, Body Readiness, Apple Health, Laleme, Lailemma",
    kicker: "Cycle tracking · iPhone and iPad",
    heading: "Laleme: cycle tracking and Body Readiness",
    lead: "Laleme, formerly Lailemma, brings cycle logs and daily health context together. Version 2.0.7 estimates Body Readiness on device from signals you authorize in Apple Health.",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "Lailemma Body Readiness card on the Today screen in a Chinese-language screenshot", caption: "Developer-supplied Chinese-language screen: daily estimate on Today." },
      { file: "lailemma-readiness-detail.webp", alt: "Lailemma Body Readiness details with sleep, HRV and cycle-phase contributions", caption: "Developer-supplied screen: the estimate explains contributing signals." },
      { file: "lailemma-readiness-snapshot.webp", alt: "Chinese-language Health screen with a daily snapshot, cycle chart and all-metrics entry", caption: "Developer-supplied Chinese-language screen: daily health snapshot, cycle chart and indicator navigation." },
      { file: "lailemma-readiness-all-metrics.webp", alt: "Chinese-language list of Apple Health indicators grouped into vital signs, sleep and activity", caption: "Developer-supplied Chinese-language screen: the available health indicators used for daily context." }
    ],
    previewLabel: "Available in version 2.0.7",
    status: "The current US, Japan, Germany and Turkey App Store listings identify Laleme as version 2.0.7. These developer-supplied screenshots show a Chinese-language interface; the app's listed interface languages are English, Simplified Chinese, German, Japanese and Korean.",
    storeUrl: "https://apps.apple.com/us/app/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "us",
    storeLabel: "Get Laleme on App Store",
    appName: "Laleme - Health Tracker",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 or later",
    softwareVersion: "2.0.7",
    price: "0",
    currency: "USD",
    appDescription: "Period and ovulation tracking, symptom logging, cycle insights and an on-device Body Readiness estimate in version 2.0.7.",
    alternate: { file: "lailemma-period-tracker-cn.html", label: "简体中文", lang: "zh-CN" },
    sections: [
      {
        kicker: "Available now",
        heading: "Record your cycle without losing the context",
        intro: "The current App Store listing covers period prediction, ovulation tracking, daily logs, cycle alerts and an optional Apple Health connection.",
        items: [
          ["Cycle and symptoms", "Record period flow, mood, symptoms and temperature, then review predicted cycle dates."],
          ["Fertility and pregnancy modes", "Use ovulation and fertile-window estimates, a pregnancy-week view and a due-date calculator as planning aids, not clinical predictions."],
          ["Your data", "The listing says records stay on your device, with optional Apple Health access that you can turn off."]
        ]
      },
      {
        kicker: "Available in version 2.0.7",
        heading: "What the Body Readiness estimate explains",
        intro: "With permission, version 2.0.7 combines available sleep, heart-rate variability, resting heart rate, wrist temperature, blood oxygen, activity and cycle-phase context into an app-estimated daily score. Missing signals are not presented as measured data.",
        items: [
          ["A score with reasons", "The screen shows a 0–100 estimate and contributions such as sleep, HRV and cycle phase, so the number is not presented without context."],
          ["On-device interpretation", "The estimate uses data you authorize from Apple Health. It is this app's estimate, not an Apple readiness score."],
          ["Health boundary", "Use it for everyday reflection only. It does not diagnose illness, determine fitness to exercise or replace medical advice."]
        ]
      }
    ],
    faqs: [
      ["Is Body Readiness in the current App Store release?", "Yes. The current US, Japan, Germany and Turkey listings show version 2.0.7 with Body Readiness. Check your local listing for availability and current release details."],
      ["Does Laleme calculate an Apple readiness score?", "No. Laleme estimates its own score on device from available, authorized health signals and cycle context. It is not a medical diagnosis."]
    ]
  },
  {
    file: "lailemma-period-tracker-cn.html",
    lang: "zh-CN",
    ogLocale: "zh_CN",
    title: "来了么 Laleme 经期记录与身体准备度 | 2.0.7",
    description: "来了么（Laleme，曾用名 Lailemma）2.0.7 提供本机身体准备度估算，结合授权的 Apple 健康数据与周期阶段。中国大陆区可用性请核对商店。",
    keywords: "来了么, Laleme, Lailemma, 经期记录, 排卵记录, 身体准备度, Apple 健康",
    kicker: "经期记录 · iPhone 与 iPad",
    heading: "来了么 Laleme：经期记录与身体准备度",
    lead: "记录经期、排卵窗口和每日身体感受。2.0.7 会结合你授权的健康信号在本机估算身体准备度；来了么是 Laleme 的中文名称，旧名为 Lailemma。",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "来了么今日页面中的身体准备度卡片", caption: "开发者提供的中文截图：今日页展示本 App 估算的身体准备度。" },
      { file: "lailemma-readiness-detail.webp", alt: "来了么健康页的身体准备度明细，包含睡眠、心率变异性和周期阶段", caption: "开发者提供的中文截图：睡眠、HRV 和周期阶段的贡献明细。" },
      { file: "lailemma-readiness-snapshot.webp", alt: "来了么健康页中文截图，展示今日健康快照、周期体征图表和全部指标入口", caption: "开发者提供的中文截图：今日快照、周期图表与指标列表入口。" },
      { file: "lailemma-readiness-all-metrics.webp", alt: "来了么全部指标中文列表，按生命体征、睡眠和活动分类", caption: "开发者提供的中文截图：Apple 健康中可用指标的分类列表。" }
    ],
    previewLabel: "2.0.7 已包含身体准备度",
    status: "截至 2026 年 9 月 29 日，日本、德国、土耳其及美国 App Store 均显示 Laleme 2.0.7。截图由开发者提供，展示中文界面；中国大陆区是否可下载仍请按 Apple 账户地区核对。",
    storeUrl: "https://apps.apple.com/us/app/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "us",
    storeLabel: "查看 App Store 商品页",
    appName: "Laleme - Health Tracker",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 或更高版本",
    softwareVersion: "2.0.7",
    price: "0",
    currency: "USD",
    appDescription: "经期、排卵与症状记录应用。2.0.7 提供在本机估算的身体准备度，商店可用性依账户地区而异。",
    alternate: { file: "lailemma-period-tracker.html", label: "English", lang: "en" },
    sections: [
      {
        kicker: "目前可用",
        heading: "把周期与日常记录放在一起",
        intro: "当前商店版本支持经期预测、排卵记录、每日症状、周期异常提醒和可选的 Apple 健康连接。",
        items: [
          ["周期与症状", "记录经量、心情、症状和体温，并查看预测日期；预测只用于日常参考。"],
          ["备孕与怀孕模式", "查看排卵窗口、孕周和预产期等辅助信息，不应把预测结果作为医疗结论。"],
          ["数据与权限", "商店说明称记录保存在本机；Apple 健康访问可按需授权，也可关闭。"]
        ]
      },
      {
        kicker: "2.0.7 已上线",
        heading: "身体准备度怎样得出估算",
        intro: "在用户授权且有对应数据时，2.0.7 会参考睡眠、心率变异性、静息心率、手腕温度、血氧、活动和周期阶段，在本机生成身体准备度估算。缺失信号不会被当作已测量数据。",
        items: [
          ["分数有依据", "截图展示了睡眠、HRV、周期阶段和手腕温度等因素对当天分数的影响。"],
          ["不是 Apple 官方分数", "估算在本机利用已授权的健康数据生成，不是 Apple 准备度分数。"],
          ["不替代医疗判断", "仅供日常状态参考，不能据此诊断疾病，也不能单独决定是否适合运动。"]
        ]
      }
    ],
    faqs: [
      ["现在下载就能用身体准备度吗？", "美国、日本、德国和土耳其 App Store 当前列出的 2.0.7 版本包含身体准备度。中国大陆商店可用性请先按 Apple 账户地区核对。"],
      ["身体准备度是 Apple 官方或医疗分数吗？", "不是。它是 Laleme（来了么）在本机依据已授权数据和周期信息计算的日常估算，不提供医疗诊断。"]
    ]
  },
  {
    file: "lailemma-period-tracker-ja.html",
    lang: "ja-JP",
    ogLocale: "ja_JP",
    title: "Laleme 生理日管理・妊活アプリ | 体調推定 2.0.7",
    description: "Laleme（旧Lailemma）で生理日と症状を記録。2.0.7では許可したAppleヘルスケアデータから身体コンディションを端末上で推定します。",
    keywords: "生理日管理アプリ, 生理周期 記録 iPhone, 排卵日 目安, 身体コンディション 推定, Laleme, Lailemma",
    kicker: "生理周期の記録 · iPhoneとiPad",
    heading: "Lalemeで生理周期と体調を記録する",
    lead: "生理日、症状、排卵の目安を一か所で確認できます。2.0.7では許可したヘルスケアデータを端末上で分析し、身体コンディションを推定します。",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "中国語UIの今日の画面に表示された身体コンディション推定", caption: "開発者提供の画面。画像の表示言語は中国語です。" },
      { file: "lailemma-readiness-detail.webp", alt: "睡眠、心拍変動、周期の段階を説明する中国語UIの詳細画面", caption: "睡眠や心拍変動など、推定に使われた信号の内訳。" },
      { file: "lailemma-readiness-snapshot.webp", alt: "今日の健康スナップショット、周期チャート、全指標への入口を示す中国語UI", caption: "開発者提供の中国語UI。今日の健康データと周期チャートを表示します。" },
      { file: "lailemma-readiness-all-metrics.webp", alt: "バイタル、睡眠、活動に分類されたAppleヘルスケア指標の中国語一覧", caption: "開発者提供の中国語UI。利用可能な健康指標の一覧です。" }
    ],
    previewLabel: "公開版2.0.7で利用可能",
    status: "日本のApp StoreはLaleme 2.0.7を掲載しています。掲載画像は開発者提供の中国語UIで、実際のアプリ表示言語は日本語、英語、ドイツ語、簡体字中国語、韓国語です。",
    storeUrl: "https://apps.apple.com/jp/app/laleme-%E5%81%A5%E5%BA%B7%E8%A8%98%E9%8C%B2/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "jp",
    storeLabel: "日本のApp StoreでLalemeを見る",
    appName: "Laleme - 健康記録",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0以降",
    softwareVersion: "2.0.7",
    price: "0",
    currency: "JPY",
    appDescription: "生理周期、症状、排卵の目安を記録。公開版2.0.7には端末上で計算する身体コンディション推定が含まれます。",
    sections: [
      {
        kicker: "現在の公開版",
        heading: "周期と毎日の変化をまとめて確認",
        intro: "日本のApp Storeの説明には、生理予測、排卵の目安、日々の症状記録、妊娠関連の表示、任意のAppleヘルスケア連携が掲載されています。予測値は医療上の判断には使わないでください。",
        items: [
          ["生理日と症状", "経血量、気分、症状、体温を記録し、周期の変化を振り返れます。"],
          ["妊活の目安", "排卵日や妊娠しやすい時期の推定を予定の参考にできます。避妊や診断の根拠にはなりません。"],
          ["言語とデータ", "App Storeの対応言語には日本語が含まれます。ヘルスケアへのアクセスは任意で、許可した項目を設定で管理できます。"]
        ]
      },
      {
        kicker: "公開版2.0.7の機能",
        heading: "身体コンディション推定の読み方",
        intro: "公開版2.0.7では、許可済みで実際に取得できる睡眠、心拍変動、安静時心拍数、手首温度、血中酸素、活動量、周期の段階などを参考に、その日の状態を端末上で推定します。掲載画像は中国語UIで撮影されています。",
        items: [
          ["数字だけに頼らない", "画面には0〜100の推定値と、睡眠や心拍変動などの寄与を一緒に表示します。"],
          ["Apple公式のスコアではない", "このアプリが端末上で計算した目安です。Appleが提供する準備度スコアではありません。"],
          ["健康上の注意", "病気の診断、運動可否の決定、医療相談の代わりには使えません。"]
        ]
      }
    ],
    faqs: [
      ["今ダウンロードすると身体コンディション機能を使えますか？", "はい。日本のApp Storeで公開中の2.0.7に含まれます。利用前に最新のストア情報をご確認ください。"],
      ["日本語の画面で使えますか？", "はい。App Storeの対応言語に日本語が含まれます。このページの掲載画像は中国語UIで撮影されたものです。"]
    ]
  },
  {
    file: "lailemma-period-tracker-de.html",
    lang: "de-DE",
    ogLocale: "de_DE",
    title: "Laleme Zyklus-App | Körperbereitschaft Version 2.0.7",
    description: "Laleme (früher Lailemma) dokumentiert Zyklus und Symptome. Version 2.0.7 schätzt Körperbereitschaft auf dem Gerät anhand freigegebener Health-Daten.",
    keywords: "Zyklus App iPhone, Periode dokumentieren, Eisprung Schätzung, Körperbereitschaft, Laleme, Lailemma",
    kicker: "Zyklus dokumentieren · iPhone und iPad",
    heading: "Laleme: Zyklus, Symptome und Körperbereitschaft",
    lead: "Halte Periode und tägliche Symptome fest und sieh Schätzungen zum fruchtbaren Fenster. Version 2.0.7 ergänzt eine tägliche Schätzung der Körperbereitschaft aus freigegebenen Health-Daten.",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "Körperbereitschaft auf der Lailemma-Startseite mit chinesischer Oberfläche", caption: "Vom Entwickler bereitgestellte Ansicht; die abgebildete Oberfläche ist chinesisch." },
      { file: "lailemma-readiness-detail.webp", alt: "Detailansicht mit Beiträgen von Schlaf, Herzfrequenzvariabilität und Zyklusphase in chinesischer Oberfläche", caption: "Die Schätzung erläutert Schlaf, HRV und weitere verfügbare Signale." },
      { file: "lailemma-readiness-snapshot.webp", alt: "Chinesische Health-Ansicht mit Tagesübersicht, Zyklusdiagramm und Link zu allen Messwerten", caption: "Vom Entwickler bereitgestellte Ansicht mit chinesischer Oberfläche: Tagesübersicht und Zyklusdiagramm." },
      { file: "lailemma-readiness-all-metrics.webp", alt: "Chinesische Liste verfügbarer Health-Messwerte für Vitalzeichen, Schlaf und Aktivität", caption: "Vom Entwickler bereitgestellte Ansicht mit chinesischer Oberfläche: gruppierte Health-Messwerte." }
    ],
    previewLabel: "In der öffentlichen Version 2.0.7 verfügbar.",
    status: "Der deutsche App Store führt Laleme in Version 2.0.7. Die vom Entwickler bereitgestellten Bilder zeigen eine chinesische Oberfläche; die App-Sprachliste enthält Deutsch, Englisch, vereinfachtes Chinesisch, Japanisch und Koreanisch.",
    storeUrl: "https://apps.apple.com/de/app/laleme-gesundheit/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "de",
    storeLabel: "Laleme im deutschen App Store ansehen",
    appName: "Laleme - Gesundheit",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 oder neuer",
    softwareVersion: "2.0.7",
    price: "0",
    currency: "EUR",
    appDescription: "Zyklus, Symptome und Eisprung-Schätzungen dokumentieren. Version 2.0.7 enthält eine auf dem Gerät berechnete Schätzung der Körperbereitschaft.",
    sections: [
      {
        kicker: "Schon verfügbar",
        heading: "Zyklusdaten mit Alltagseinträgen verbinden",
        intro: "Der deutsche App Store beschreibt Periodenvorhersagen, geschätzte Eisprungtage, Symptomprotokolle, Schwangerschaftsansichten und eine optionale Verbindung mit Apple Health. Vorhersagen sind keine medizinischen Feststellungen.",
        items: [
          ["Periode und Symptome", "Blutung, Stimmung, Beschwerden und Temperatur festhalten und Entwicklungen im Zeitverlauf vergleichen."],
          ["Fruchtbares Fenster", "Geschätzte Tage zur Planung nutzen, aber nicht als zuverlässige Verhütungsmethode oder Diagnose verstehen."],
          ["Sprache und Berechtigungen", "Deutsch steht in Apples Sprachliste. Der Zugriff auf Health-Daten ist optional und lässt sich in iOS verwalten."]
        ]
      },
      {
        kicker: "In Version 2.0.7 verfügbar",
        heading: "Was die Körperbereitschaft erklärt",
        intro: "Version 2.0.7 schätzt den Tageszustand anhand tatsächlich verfügbarer, freigegebener Signale wie Schlaf, Herzfrequenzvariabilität, Ruhepuls, Handgelenktemperatur, Blutsauerstoff, Aktivität und Zyklusphase auf dem Gerät. Die Screenshots zeigen eine chinesische Oberfläche.",
        items: [
          ["Schätzung mit Gründen", "Die Ansicht zeigt einen Wert von 0 bis 100 und den Beitrag einzelner Signale, statt nur eine Zahl auszugeben."],
          ["Kein Apple-Score", "Die Berechnung stammt von Lailemma und erfolgt auf dem Gerät. Sie ist kein offizieller Apple-Bereitschaftswert."],
          ["Keine medizinische Aussage", "Der Wert dient der alltäglichen Orientierung und ersetzt weder eine Diagnose noch ärztlichen Rat."]
        ]
      }
    ],
    faqs: [
      ["Ist Körperbereitschaft bereits im App Store verfügbar?", "Ja. Der deutsche App Store führt Version 2.0.7 mit dieser Funktion. Prüfe vor dem Download die aktuellen Versionshinweise."],
      ["Ist die App auf Deutsch nutzbar?", "Ja, Deutsch ist in der Sprachliste enthalten. Die Bilder auf dieser Seite wurden mit einer chinesischen Oberfläche aufgenommen."]
    ]
  },
  {
    file: "lailemma-period-tr.html",
    lang: "tr-TR",
    ogLocale: "tr_TR",
    title: "Laleme Döngü Takibi ve Body Readiness Tahmini | 2.0.7",
    description: "Laleme (eski adı Lailemma) ile döngü ve belirtileri kaydedin. 2.0.7, izin verilen Apple Health verilerinden cihaz üzerinde günlük Body Readiness tahmini sunar.",
    keywords: "adet takip uygulaması, regl takibi iPhone, döngü takibi, yumurtlama takibi, Body Readiness, Laleme, Lailemma",
    kicker: "Döngü takibi · iPhone ve iPad",
    heading: "Laleme: döngü takibi ve Body Readiness tahmini",
    lead: "Regl dönemini, belirtileri ve günlük sağlık sinyallerini tek yerde kaydedin. Sürüm 2.0.7, izin verdiğiniz Apple Health verilerinden günlük Body Readiness tahminini cihaz üzerinde hesaplar.",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "Çince arayüzlü Laleme ekranında günlük Body Readiness tahmini", caption: "Geliştiricinin sağladığı ekran görüntüsü Çince arayüzden alınmıştır." },
      { file: "lailemma-readiness-detail.webp", alt: "Uyku, HRV ve döngü evresinin günlük tahmine katkılarını gösteren Çince ekran", caption: "Ayrıntı ekranı tahmine katkı sağlayan mevcut sinyalleri açıklar." },
      { file: "lailemma-readiness-snapshot.webp", alt: "Günlük sağlık özeti, döngü grafiği ve tüm ölçümlere bağlantı içeren Çince Sağlık ekranı", caption: "Geliştiricinin sağladığı Çince arayüz: günlük sağlık özeti ve döngü grafiği." },
      { file: "lailemma-readiness-all-metrics.webp", alt: "Yaşamsal bulgular, uyku ve aktivite olarak gruplanmış Apple Health ölçümlerinin Çince listesi", caption: "Geliştiricinin sağladığı Çince arayüz: kullanılabilir sağlık ölçümlerinin listesi." }
    ],
    previewLabel: "2.0.7 sürümünde kullanılabilir",
    status: "Türkiye App Store, Laleme'yi 2.0.7 sürümüyle listeliyor. Uygulama dil listesinde Türkçe yer almıyor; ekran görüntüleri Çince arayüzü gösteriyor. Bu tahmin Apple Readiness puanı veya tıbbi tavsiye değildir.",
    storeUrl: "https://apps.apple.com/tr/app/laleme-health-tracker/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "tr",
    storeLabel: "Türkiye App Store'da Laleme",
    appName: "Laleme - Health Tracker",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 veya üzeri",
    softwareVersion: "2.0.7",
    price: "0",
    currency: "TRY",
    appDescription: "Döngü, belirtiler ve yumurtlama tahminlerini kaydedin. 2.0.7 sürümü, izin verilen sağlık sinyallerinden cihaz üzerinde Body Readiness tahmini sunar.",
    sections: [
      {
        kicker: "Günlük sağlık kaydı",
        heading: "Döngü bilgilerini günlük kayıtlarla birlikte inceleyin",
        intro: "Türkiye App Store açıklaması regl tahmini, yumurtlama takibi, günlük belirtiler, döngü uyarıları ve isteğe bağlı Apple Health bağlantısından söz eder. Tahminler tıbbi değerlendirme değildir.",
        items: [
          ["Döngü ve belirtiler", "Akış, ruh hali, belirtiler ve sıcaklık kayıtlarını ekleyip zaman içindeki değişimleri gözden geçirin."],
          ["Doğurganlık ve gebelik görünümleri", "Yumurtlama tahminleri, doğurganlık zamanlaması ve gebelik haftası bilgilerini planlama desteği olarak değerlendirin; klinik sonuç olarak kullanmayın."],
          ["Hatırlatmalar", "2.0.7; beklenen regl gününde ve 6-10. günlerde kayıt hatırlatmaları sunar. Açık kalan regl kaydı 10. günde otomatik sona erer."]
        ]
      },
      {
        kicker: "Sürüm 2.0.7",
        heading: "Body Readiness tahminini bağlamıyla okuyun",
        intro: "İzin verildiğinde uyku, HRV, dinlenik kalp hızı, bilek sıcaklığı, kan oksijeni, aktivite ve döngü evresi gibi mevcut sinyaller cihazda değerlendirilir. Eksik ölçümler varmış gibi gösterilmez.",
        items: [
          ["Uygulamaya ait tahmin", "Gösterilen değer Laleme'nin kendi tahminidir; Apple Readiness puanı değildir."],
          ["Cihaz üzerinde değerlendirme", "Geliştirici açıklaması, sağlık analizinin cihazda yapıldığını ve kayıtların sunuculara yüklenmediğini belirtir."],
          ["Tıbbi sınır", "Sonuç yalnızca günlük referans içindir; hastalık tanısı koymaz, egzersiz uygunluğunu belirlemez ve sağlık uzmanı tavsiyesinin yerini almaz."]
        ]
      }
    ],
    faqs: [
      ["Laleme Türkçe arayüz sunuyor mu?", "Türkiye App Store'daki dil listesi İngilizce, Basitleştirilmiş Çince, Almanca, Japonca ve Koreceyi kapsıyor; Türkçe arayüz listelenmiyor. Bu sayfa Türkçe ürün bilgisi sunar."],
      ["Body Readiness Apple'ın resmi puanı mı?", "Hayır. Laleme'nin izin verilen sağlık sinyallerinden cihaz üzerinde hesapladığı günlük tahmindir; Apple puanı veya tıbbi değerlendirme değildir."],
      ["Regl kaydı açık kalırsa ne olur?", "Sürüm 2.0.7, bitiş kaydı yapılmamış açık regl dönemini 10. günde otomatik olarak tamamlar; isterseniz kaydı ayrıca inceleyebilirsiniz."]
    ]
  },
  {
    file: "inkstone-markdown-notes.html",
    lang: "en",
    ogLocale: "en_US",
    title: "Inkstone Notes: Markdown Files on iPhone",
    description: "Write Markdown notes as .md files in iCloud Drive with Inkstone. Use wiki links, backlinks, offline formulas and diagrams, search and PDF export.",
    keywords: "Markdown notes iPhone, plain Markdown files, iCloud Drive notes, wiki links, Inkstone",
    kicker: "Markdown writing · iPhone",
    heading: "Inkstone Notes keeps your Markdown notes as files",
    lead: "Inkstone keeps each note as an ordinary .md file. When iCloud Drive syncing is enabled and available, the same folder can be opened on a Mac or in another editor. Your notes are not locked in a database.",
    icon: "inkstone-icon.webp",
    socialImage: "og-inkstone-notes.jpg",
    socialImageAlt: "Inkstone Notes Markdown with its real iPhone editor, Markdown files in iCloud Drive, wiki links, backlinks and PDF or HTML export",
    screenshots: [{ file: "inkstone-editor-screen.webp", width: 520, height: 1130, alt: "Inkstone Notes Markdown editor showing links, task lists and rich-text copy controls", caption: "The iPhone editor works directly with Markdown files." }],
    storeUrl: "https://apps.apple.com/us/app/inkstone-notes-markdown/id6810287923?uo=4",
    storeProduct: "inkstone-notes-markdown",
    storeCountry: "us",
    storeLabel: "Open Inkstone on App Store",
    appName: "Inkstone Notes Markdown",
    appCategory: "ProductivityApplication",
    operatingSystem: "iOS",
    softwareRequirements: "iOS 18.0 or later",
    softwareVersion: "1.0.1",
    checkedAt: "2026-10-03",
    price: "0.99",
    currency: "USD",
    appDescription: "Markdown writing app with plain files in iCloud Drive, wiki links, backlinks, offline formulas and diagrams, and PDF or HTML export.",
    sections: [
      {
        kicker: "File ownership",
        heading: "Your notes remain plain Markdown",
        intro: "A folder of .md files is the source of truth. Find it in Files on iPhone, or in Finder on a Mac when the notes sync through iCloud Drive. Local-only notes do not automatically appear on another device.",
        items: [
          ["Connected notes", "Use [[note title]] links, backlinks and rename-aware links to navigate a growing collection."],
          ["Writing tools", "Syntax highlighting, live preview, outlines, inline tags, daily notes and full-text search stay close to the editor."],
          ["Publish or hand off", "Copy with one of eight typesetting styles or export PDF and HTML with embedded images."]
        ]
      },
      {
        kicker: "Connected writing",
        heading: "Keep an index, notes and tasks connected",
        intro: "A project can have an overview, separate meeting notes and a daily log. Link the notes together while keeping each one as an ordinary Markdown file.",
        items: [
          ["Start with an overview", "Write the project's purpose in an index note and add links such as [[Meeting Notes]] and [[Tasks]]. An unwritten link can become a new note; backlinks show which notes point to the one you are reading."],
          ["Capture details in smaller notes", "Keep decisions in meeting notes, dated progress in daily notes and checklists in task notes. Tick tasks in the preview, follow the outline or use full-text search when the collection grows."],
          ["Share a document or keep the source", "Use the .md files when another person or editor needs the source. For readers who need a finished document, copy styled rich text or export PDF or HTML with images included."]
        ]
      },
      {
        id: "inkstone-export-options",
        kicker: "Export choices",
        heading: "Export Markdown from iPhone as PDF or HTML",
        intro: "Choose a rendered document for readers, styled text for a publishing composer, or the original files for another Markdown editor. Each option preserves different parts of the note.",
        items: [
          ["PDF with pictures", "Open the note, open the More menu and choose Export as PDF. In version 1.0.1 the PDF is named after the note and includes available image attachments. Save or share it from the system share sheet, then check the resulting file before sending it."],
          ["Standalone HTML", "Choose Export as HTML in the same menu for a rendered HTML document with available attached images embedded. It is a publishing copy, not the original editable Markdown source; how it is saved depends on the receiving app."],
          ["Styled copy", "Choose a Publishing style in More, then use Copy Styled in the bottom bar. Paste into an editor that accepts rich text and check its headings and images: the receiving editor can change the formatting."],
          ["Original Markdown files", "Use Files to copy the original .md file when another editor needs the source. Keep the attachments folder and its relative paths with notes that contain pictures. More > Share Markdown sends source text, not a .md file or an attachment bundle."]
        ]
      },
      {
        kicker: "Offline rendering",
        heading: "Formulas and diagrams without a web service",
        intro: "KaTeX and Mermaid are bundled for local rendering. The App Store privacy label says the developer does not collect data from this app.",
        items: [
          ["Requirements", "Inkstone is an iPhone app requiring iOS 18.0 or later; the interface is available in English and Simplified Chinese."],
          ["PDF export", "Version 1.0.1 fixes exported PDFs so the file is named after the note and includes pictures from the note. The same release improves editing responsiveness in notes with large photos."],
          ["Store price and download size", "The US App Store lists Version 1.0.1 at $0.99 with an 8.7 MB download size, checked on 3 October 2026. Price and download size may vary by storefront."]
        ]
      }
    ],
    faqs: [
      ["Are Inkstone notes locked in its own database?", "No. Notes are ordinary Markdown files that can be opened or edited by other tools. Cross-device access requires the notes to be in the synced iCloud Drive folder; local-only notes stay on that device."],
      ["Can I use Inkstone's editor on a Mac?", "The current App Store listing is for iPhone. When your notes sync through iCloud Drive, you can access the same Markdown files on a Mac and edit them with another app; this is not a native Inkstone Mac editor."],
      ["Do formulas and diagrams need an internet connection?", "KaTeX and Mermaid are bundled and render locally. Availability and syncing of the note files themselves depend on iCloud Drive, your device settings and your connection."],
      ["Which format should I use to share a note?", "Use Files for the original .md file and its referenced image attachments. The Share Markdown menu sends source text, not a file bundle. Use Copy Styled for a rich-text composer, or PDF and HTML for rendered documents, and inspect the result in the receiving app."],
      ["How do I export a Markdown note as PDF on iPhone?", "Open the note in Inkstone, open More and choose Export as PDF. Save or send the result using the system share sheet. Version 1.0.1 names the PDF after the note and includes available attached pictures; reopen the result to check it before sharing."],
      ["Will wiki links still open my other notes in an export?", "No. PDF and HTML exports and the bottom copy controls turn wiki links into display text rather than links into your note collection. Keep the original .md files and referenced notes together for an editor that supports their wiki-link syntax. A rendered document is not a portable linked vault."]
    ]
  },
  {
    file: "twopic-dual-camera.html",
    lang: "en",
    ogLocale: "en_US",
    title: "TwoPic Dual Camera: Front and Back at Once",
    description: "Capture both iPhone cameras with TwoPic. Use picture-in-picture or split layouts for photos and video. Check iPhone compatibility and UI language.",
    keywords: "dual camera iPhone, front and back camera, picture in picture camera, TwoPic",
    kicker: "Dual-camera capture · iPhone",
    heading: "TwoPic records the scene and your reaction together",
    lead: "Use the front and back iPhone cameras at the same time, then save one photo or video to your library. Switch between picture-in-picture, top-and-bottom and left-and-right layouts while framing.",
    icon: "twopic-icon.webp",
    screenshots: [{ file: "twopic-pip-screen.webp", alt: "TwoPic live front and back camera view with picture-in-picture layout", caption: "Live dual-camera framing in picture-in-picture mode." }],
    storeUrl: "https://apps.apple.com/us/app/twopic-dual-camera/id6800405096?uo=4",
    storeProduct: "twopic-dual-camera",
    storeCountry: "us",
    storeLabel: "Open TwoPic on App Store",
    appName: "TwoPic Dual Camera",
    appCategory: "MultimediaApplication",
    operatingSystem: "iOS",
    softwareRequirements: "iOS 18.0 or later; iPhone XS or newer for simultaneous dual-camera capture",
    softwareVersion: "1.1.3",
    checkedAt: "2026-09-30",
    price: "0.99",
    currency: "USD",
    appDescription: "Simultaneous iPhone front and back camera capture with picture-in-picture or split layouts for photos and video.",
    sections: [
      {
        kicker: "Capture",
        heading: "Three layouts, one moment",
        intro: "Both camera feeds stay live. In picture-in-picture mode, tap the small window to switch which camera fills the frame.",
        items: [
          ["Photo and video", "Shoot either format and save the result directly to the system Photos library."],
          ["Framing controls", "Choose supported camera pairs, recording quality and microphone direction for your device."],
          ["Device check", "Simultaneous capture requires an A12-class iPhone XS or newer and iOS 18.0 or later. The app reports unsupported hardware on launch."]
        ]
      },
      {
        kicker: "Two viewpoints",
        heading: "Choose a layout for the moment",
        intro: "Frame the scene and your reaction together before capturing. The choice of layout determines how much space each viewpoint gets in the saved photo or video.",
        items: [
          ["Picture in picture", "Keep the scene large and your reaction in the inset. Tap the small window to swap the main and secondary cameras when the explanation or reaction should fill the frame."],
          ["Top and bottom", "Give the two live views separate horizontal halves. This suits a composition where the scene and the person both need prominent space instead of a small inset."],
          ["Left and right", "Arrange the two views side by side. Check both halves while framing so a face, sign or other important detail is not cut off by the split."]
        ]
      },
      {
        kicker: "Before you buy",
        heading: "Check the interface language and price",
        intro: "The current app interface is Simplified Chinese, even though this product description is in English. The US App Store listed an upfront $0.99 price on 30 September 2026; prices vary by region.",
        items: [
          ["Film Grain and Vintage Tone", "Version 1.1.3 refines these looks for photos and videos: stronger grain and a more faded vintage tone. Compare the live views before deciding which look suits the capture."],
          ["Privacy", "The App Store listing says TwoPic has no network access and the developer does not collect data; captures stay in your Photos library."],
          ["No automatic editing claim", "TwoPic captures both perspectives at once. The page does not promise automatic post-production or cloud syncing."]
        ]
      }
    ],
    faqs: [
      ["Does TwoPic require a newer iPhone?", "Yes. Simultaneous front and back camera capture requires an iPhone XS or later with an A12-class chip and iOS 18.0 or later."],
      ["Is the TwoPic app interface available in English?", "Not in the current version checked on 30 September 2026. Its interface is in Simplified Chinese, although the App Store description is translated."],
      ["Does TwoPic save both camera views together?", "Yes. The chosen layout combines the front and back views in one photo or video and saves the result to the system Photos library."],
      ["Which permissions does TwoPic need?", "Camera access enables capture, microphone access enables recorded audio, and Photos permission enables saving captures. You can manage these permissions in iOS Settings."]
    ]
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function itemList(items) {
  return items.map(([title, body]) => `<div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div>`).join("\n");
}

function schemaFor(page) {
  const canonical = `${origin}/${page.file}`;
  const primaryScreenshot = page.screenshots[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${canonical}#page`, url: canonical, name: page.title,
        description: page.description, inLanguage: page.lang,
        ...(primaryScreenshot ? { primaryImageOfPage: {
          "@type": "ImageObject", url: `${origin}/assets/${primaryScreenshot.file}`,
          width: primaryScreenshot.width ?? 520, height: primaryScreenshot.height ?? 1125,
          caption: primaryScreenshot.alt
        } } : {}),
        isPartOf: { "@id": `${origin}/#website` }, publisher: { "@id": `${origin}/#publisher` },
        mainEntity: { "@id": `${canonical}#app` }
      },
      {
        "@type": "SoftwareApplication", "@id": `${canonical}#app`, name: page.appName,
        ...(page.file.startsWith("lailemma") ? { alternateName: ["Lailemma", "Lailemma - Period & Fertility", "来了么"] } : {}),
        applicationCategory: page.appCategory, operatingSystem: page.operatingSystem,
        softwareRequirements: page.softwareRequirements, softwareVersion: page.softwareVersion,
        url: page.storeUrl, downloadUrl: page.storeUrl, description: page.appDescription,
        image: `${origin}/assets/${page.icon}`,
        ...(page.screenshots.length ? { screenshot: page.screenshots.map((shot) => `${origin}/assets/${shot.file}`) } : {}),
        offers: { "@type": "Offer", price: page.price, priceCurrency: page.currency, availability: "https://schema.org/InStock" }
      },
      {
        "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, name: page.appName, numberOfItems: 3,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Apps", item: `${origin}/apps.html` },
          { "@type": "ListItem", position: 3, name: page.appName, item: canonical }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map(([question, answer]) => ({
          "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      }
    ]
  };
}

function render(page) {
  const canonical = `${origin}/${page.file}`;
  const socialImageUrl = `${origin}/assets/${page.socialImage ?? "og-default.png"}`;
  const socialImageAlt = page.socialImageAlt ?? `${page.appName} by CrazyAIAgent`;
  const ui = labels[page.lang] ?? labels.en;
  const appId = page.storeUrl.match(/\/id(\d+)/)?.[1];
  if (!appId) throw new Error(`${page.file}: App Store ID missing`);
  const schema = JSON.stringify(schemaFor(page)).replace(/</g, "\\u003c");
  const isLailemma = page.file.startsWith("lailemma");
  const isInkstone = page.file === "inkstone-markdown-notes.html";
  const alternates = isLailemma ? `\n${lailemmaLanguages.map(([lang, file]) => `<link rel="alternate" hreflang="${lang}" href="${origin}/${file}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${origin}/lailemma-period-tracker.html">` : "";
  const screenshotMarkup = page.screenshots.map((shot) => `<figure><img src="assets/${shot.file}" width="${shot.width ?? 520}" height="${shot.height ?? 1125}" loading="${isInkstone ? "eager" : "lazy"}" ${isInkstone ? 'fetchpriority="high"' : ""} decoding="async" alt="${escapeHtml(shot.alt)}"><figcaption>${escapeHtml(shot.caption)}</figcaption></figure>`).join("\n");
  const heroScreensMarkup = isInkstone ? `<div class="notes-app-hero-visual" aria-labelledby="new-app-screen-title"><p class="section-kicker">${ui.screen}</p><h2 id="new-app-screen-title">${ui.inside}</h2><div class="new-app-screens">${screenshotMarkup}</div></div>` : "";
  const visualSectionMarkup = isInkstone ? "" : `<section class="section new-app-visual" aria-labelledby="new-app-screen-title"><div class="section-inner"><p class="section-kicker">${ui.screen}</p><h2 id="new-app-screen-title">${page.status ? ui.preview : ui.inside}</h2><div class="new-app-screens">${screenshotMarkup}</div></div></section>`;
  const sectionMarkup = page.sections.map((section, index) => `<section class="section content-section${index % 2 ? " alt-section" : ""}"${section.id ? ` id="${escapeHtml(section.id)}"` : ""}><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(section.kicker)}</p><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.intro)}</p></div><div class="content-list">${itemList(section.items)}</div></div></section>`).join("\n");
  const faqMarkup = page.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("\n");
  const languageLinks = isLailemma ? lailemmaLanguages.filter(([, file]) => file !== page.file).map(([lang, file, name]) => `<a href="${file}" lang="${lang}">${escapeHtml(name)}</a>`).join("") : "";
  const statusMarkup = page.status ? `<p class="new-app-status"><strong>${escapeHtml(page.previewLabel)}</strong> ${escapeHtml(page.status)}</p>` : "";
  const productMeta = page.checkedAt ? `<p class="article-meta"><a href="about.html">CrazyAIAgent</a> · <span>Version ${escapeHtml(page.softwareVersion)}</span> · ${ui.checked} <time datetime="${page.checkedAt}">${new Date(`${page.checkedAt}T00:00:00Z`).toLocaleDateString(page.lang, { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></p>` : "";
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests">
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://apps.apple.com">
<script src="analytics.js?v=${assetVersions.analytics}"></script>
<script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-JY8T5JJGNH"></script>
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<meta name="keywords" content="${escapeHtml(page.keywords)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#111827">
<meta name="apple-itunes-app" content="app-id=${appId}, app-argument=${canonical}">
<link rel="canonical" href="${canonical}">${alternates}
<link rel="alternate" type="application/rss+xml" title="CrazyAIAgent RSS" href="${origin}/feed.xml">
<link rel="alternate" type="application/atom+xml" title="CrazyAIAgent Atom" href="${origin}/atom.xml">
<meta property="og:type" content="website"><meta property="og:locale" content="${page.ogLocale}">
<meta property="og:url" content="${canonical}"><meta property="og:title" content="${escapeHtml(page.title)}">
<meta property="og:site_name" content="CrazyAIAgent"><meta property="og:description" content="${escapeHtml(page.description)}">
<meta property="og:image" content="${socialImageUrl}"><meta property="og:image:secure_url" content="${socialImageUrl}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.title)}">
<meta name="twitter:description" content="${escapeHtml(page.description)}"><meta name="twitter:image" content="${socialImageUrl}"><meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest">
<link rel="stylesheet" href="styles.css?v=${assetVersions.styles}">
<script type="application/ld+json">${schema}</script>
</head>
<body>
<header class="site-header" data-elevate><nav class="nav" aria-label="${ui.nav}"><a class="brand" href="/" aria-label="CrazyAIAgent home"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="apps.html">${ui.apps}</a><a href="guides.html">${ui.guides}</a><a href="support.html">${ui.support}</a></div></nav></header>
<main class="new-app-page ${page.file.startsWith("lailemma") ? "health-app" : page.file.startsWith("inkstone") ? "notes-app" : "camera-app"}">
<section class="page-hero new-app-intro"><div class="section-inner${isInkstone ? " notes-app-hero-inner" : ""}">${isInkstone ? '<div class="notes-app-hero-copy">' : ""}
<nav class="breadcrumb" aria-label="${ui.breadcrumb}"><ol><li><a href="/">${ui.home}</a></li><li><a href="apps.html">${ui.apps}</a></li><li aria-current="page">${escapeHtml(page.appName)}</li></ol></nav>
<div class="new-app-title"><img src="assets/${page.icon}" width="112" height="112" fetchpriority="${isInkstone ? "low" : "high"}" decoding="async" alt="${escapeHtml(page.appName)} icon"><div><p class="section-kicker">${escapeHtml(page.kicker)}</p><h1>${escapeHtml(page.heading)}</h1></div></div>
<p class="new-app-lead">${escapeHtml(page.lead)}</p>${statusMarkup}${productMeta}
<div class="hero-actions"><a class="button button-primary" href="${page.storeUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="${page.storeProduct}" data-storefront="ios-app-store" data-store-country="${page.storeCountry}" aria-label="${escapeHtml(page.storeLabel)} (${ui.newTab})">${escapeHtml(page.storeLabel)}</a>${languageLinks}</div>
${isInkstone ? "</div>" : ""}${heroScreensMarkup}</div></section>
${visualSectionMarkup}
${sectionMarkup}
<section class="section content-section new-app-faq"><div class="section-inner"><p class="section-kicker">${ui.faq}</p><h2>${ui.before}</h2><div class="faq-list">${faqMarkup}</div></div></section>
</main>
<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="/">${ui.home}</a><a href="apps.html">${ui.apps}</a><a href="directory.html">${ui.directory}</a>${languageLinks}<a href="privacy.html">${ui.privacy}</a><a href="support.html">${ui.support}</a></div></div></footer>
<script src="script.js?v=${assetVersions.script}" defer></script>
</body>
</html>\n`;
}

let changed = 0;
for (const page of products) {
  const file = path.join(siteDir, page.file);
  const html = render(page);
  const current = await readFile(file, "utf8").catch(() => "");
  if (current !== html) {
    await writeFile(file, html);
    changed += 1;
  }
}
console.log(`New app pages ready: ${products.length}; updated: ${changed}`);
