import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.xiaozhonglvyou.com";
const lailemmaLanguages = [
  ["en", "lailemma-period-tracker.html", "English"],
  ["zh-CN", "lailemma-period-tracker-cn.html", "简体中文"],
  ["ja-JP", "lailemma-period-tracker-ja.html", "日本語"],
  ["de-DE", "lailemma-period-tracker-de.html", "Deutsch"]
];

const labels = {
  en: { nav: "Primary", apps: "Apps", guides: "Guides", support: "Support", breadcrumb: "Breadcrumb", home: "Home", newTab: "opens in a new tab", screen: "Real product screen", preview: "Body Readiness build preview", inside: "Inside the app", faq: "Common questions", before: "Before you download", directory: "Directory", privacy: "Privacy" },
  "zh-CN": { nav: "主导航", apps: "全部应用", guides: "使用指南", support: "支持", breadcrumb: "路径", home: "首页", newTab: "在新标签页打开", screen: "真实产品画面", preview: "身体准备度新版截图", inside: "应用截图", faq: "常见问题", before: "下载前先确认", directory: "网站目录", privacy: "隐私" },
  "ja-JP": { nav: "主なナビゲーション", apps: "アプリ", guides: "ガイド", support: "サポート", breadcrumb: "現在地", home: "ホーム", newTab: "新しいタブで開く", screen: "実際の画面", preview: "新しいビルドの画面プレビュー", inside: "アプリの画面", faq: "よくある質問", before: "ダウンロード前に確認", directory: "サイトマップ", privacy: "プライバシー" },
  "de-DE": { nav: "Hauptnavigation", apps: "Apps", guides: "Ratgeber", support: "Support", breadcrumb: "Pfad", home: "Startseite", newTab: "öffnet einen neuen Tab", screen: "Produktansicht", preview: "Vorschau eines neueren Builds", inside: "In der App", faq: "Häufige Fragen", before: "Vor dem Download", directory: "Verzeichnis", privacy: "Datenschutz" }
};

const products = [
  {
    file: "lailemma-period-tracker.html",
    lang: "en",
    ogLocale: "en_US",
    title: "Lailemma Period Tracker & Body Readiness Preview",
    description: "Track periods, ovulation and symptoms with Lailemma. Preview an upcoming on-device Body Readiness estimate using permitted Apple Health data.",
    keywords: "period tracker iPhone, cycle tracker, ovulation log, Body Readiness preview, Apple Health",
    kicker: "Cycle tracking · iPhone and iPad",
    heading: "Lailemma: period tracking with a Body Readiness preview",
    lead: "Log your cycle, symptoms and fertile window in one place. A newer build adds a daily Body Readiness estimate; the screenshots below are a preview, not a feature promised in the current App Store release.",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "Preview of Lailemma's upcoming Body Readiness card on the Today screen", caption: "Newer-build preview: daily estimate on the Today screen." },
      { file: "lailemma-readiness-detail.webp", alt: "Preview of the detailed Body Readiness estimate with sleep, HRV and cycle-phase contributions", caption: "Newer-build preview: the score explains contributing signals." }
    ],
    previewLabel: "Feature preview, not yet in the public version",
    status: "As checked on 23 September 2026, the public App Store release is v2.0.3. Body Readiness is shown here from a newer build and should not be expected until that update is published.",
    storeUrl: "https://apps.apple.com/us/app/lailemma-period-fertility/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "us",
    storeLabel: "Open current App Store version",
    appName: "Lailemma - Period & Fertility",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 or later",
    price: "0",
    currency: "USD",
    appDescription: "Period and ovulation tracking, symptom logging and cycle insights. A Body Readiness estimate is in a newer build, not the public App Store release checked on 23 September 2026.",
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
        kicker: "Newer-build preview",
        heading: "What the Body Readiness estimate explains",
        intro: "With permission, the newer build combines available sleep, heart-rate variability, resting heart rate, wrist temperature, blood oxygen, activity load and cycle-phase context into an app-estimated daily score. Missing signals are shown rather than silently invented.",
        items: [
          ["A score with reasons", "The preview shows a 0–100 estimate and contributions such as sleep, HRV and cycle phase, so the number is not presented without context."],
          ["On-device interpretation", "The estimate uses data you authorize from Apple Health. It is this app's estimate, not an Apple readiness score."],
          ["Health boundary", "Use it for everyday reflection only. It does not diagnose illness, determine fitness to exercise or replace medical advice."]
        ]
      }
    ],
    faqs: [
      ["Is Body Readiness in the App Store release today?", "No. On 23 September 2026 the public listing was v2.0.3; the screenshots show a newer build. Check the App Store release notes before expecting this feature."],
      ["Does Lailemma calculate an Apple readiness score?", "No. The newer build estimates its own score on device from available, authorized health signals and cycle context. It is not a medical diagnosis."]
    ]
  },
  {
    file: "lailemma-period-tracker-cn.html",
    lang: "zh-CN",
    ogLocale: "zh_CN",
    title: "来了么经期记录与备孕助手 | 身体准备度新版预览",
    description: "来了么提供经期记录、排卵与备孕计划、每日症状记录及周期洞察。查看新版身体准备度真实截图：基于授权的 Apple 健康数据在本机估算，并明确区分目前已上架版本与待发布功能。",
    keywords: "来了么, 经期记录, 排卵记录, 身体准备度新版预览, Apple 健康",
    kicker: "经期记录 · iPhone 与 iPad",
    heading: "来了么：经期记录与身体准备度新版预览",
    lead: "记录经期、排卵窗口和每日身体感受。下面的“身体准备度”截图来自较新版本构建，是功能预览；当前 App Store 公开版不包含该功能。",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "来了么新版今日页面中的身体准备度卡片预览", caption: "新版预览：今日页展示本 App 估算的身体准备度。" },
      { file: "lailemma-readiness-detail.webp", alt: "来了么新版健康页的身体准备度明细，包含睡眠、心率变异性和周期阶段", caption: "新版预览：睡眠、HRV 和周期阶段的贡献明细。" }
    ],
    previewLabel: "新版功能预览，当前公开版尚未上线",
    status: "截至 2026 年 9 月 23 日，App Store 公开版为 2.0.3。截图来自较新版本构建；请以商店更新说明确认身体准备度何时正式可用。",
    storeUrl: "https://apps.apple.com/cn/app/lailemma-period-fertility/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "cn",
    storeLabel: "查看目前公开版",
    appName: "Lailemma - Period & Fertility",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 或更高版本",
    price: "0",
    currency: "CNY",
    appDescription: "经期、排卵与症状记录应用。身体准备度是较新版本预览，不属于 2026 年 9 月 23 日核对时的公开版。",
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
        kicker: "新版预览",
        heading: "身体准备度怎样得出估算",
        intro: "在用户授权且有对应数据时，新版会参考睡眠、心率变异性、静息心率、手腕温度、血氧、活动负荷和周期阶段，生成 0–100 的本 App 估算分数。没有的数据不会被当作已测得的数据。",
        items: [
          ["分数有依据", "截图展示了睡眠、HRV、周期阶段和手腕温度等因素对当天分数的影响。"],
          ["不是 Apple 官方分数", "估算在本机利用已授权的健康数据生成，不是 Apple 准备度分数。"],
          ["不替代医疗判断", "仅供日常状态参考，不能据此诊断疾病，也不能单独决定是否适合运动。"]
        ]
      }
    ],
    faqs: [
      ["现在下载就能用身体准备度吗？", "截至 2026 年 9 月 23 日，公开版为 2.0.3，尚未包含身体准备度。这里的截图是新版预览，请以 App Store 更新说明为准。"],
      ["身体准备度是 Apple 官方或医疗分数吗？", "不是。它是来了么在本机依据已授权数据和周期信息计算的日常估算，不提供医疗诊断。"]
    ]
  },
  {
    file: "lailemma-period-tracker-ja.html",
    lang: "ja-JP",
    ogLocale: "ja_JP",
    title: "Lailemma 生理日管理・妊活アプリ | 身体コンディションの新機能プレビュー",
    description: "Lailemmaで生理日、症状、排卵の目安を記録。Appleヘルスケアの許可済みデータを使う身体コンディション推定は開発中の画面プレビューで、現在のApp Store版には含まれません。",
    keywords: "生理日管理アプリ, 生理周期 記録 iPhone, 排卵日 目安, 身体コンディション プレビュー",
    kicker: "生理周期の記録 · iPhoneとiPad",
    heading: "Lailemmaで生理周期を記録する",
    lead: "生理日、症状、排卵の目安を一か所で確認できます。身体コンディションの推定画面は新しいビルドのプレビューであり、現在公開中のApp Store版の機能ではありません。",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "中国語UIの新しいビルドで、今日の画面に身体コンディション推定が表示されるプレビュー", caption: "新しいビルドのプレビュー。画像の画面表示は中国語です。" },
      { file: "lailemma-readiness-detail.webp", alt: "睡眠、心拍変動、周期の段階を説明する中国語UIの詳細画面", caption: "睡眠や心拍変動など、推定に使われた信号の内訳。" }
    ],
    previewLabel: "未公開機能のプレビュー",
    status: "2026年9月23日に確認したApp Storeの公開版は2.0.3です。身体コンディション機能はまだ公開されていません。実際の提供状況は更新履歴で確認してください。",
    storeUrl: "https://apps.apple.com/jp/app/lailemma-%E7%94%9F%E7%90%86%E6%97%A5%E7%AE%A1%E7%90%86%E3%81%A8%E5%A6%8A%E6%B4%BB/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "jp",
    storeLabel: "日本のApp Storeで公開版を見る",
    appName: "Lailemma - 生理日管理と妊活",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0以降",
    price: "0",
    currency: "JPY",
    appDescription: "生理周期、症状、排卵の目安を記録。身体コンディション推定は2026年9月23日時点の公開版にはない新しいビルドのプレビューです。",
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
        kicker: "開発中の画面",
        heading: "身体コンディション推定の読み方",
        intro: "新しいビルドでは、許可済みで実際に取得できる睡眠、心拍変動、安静時心拍数、手首温度、活動量、周期の段階などを参考に、その日の状態をアプリ内で推定します。画像は中国語UIで撮影されています。",
        items: [
          ["数字だけに頼らない", "プレビューでは0〜100の推定値と、睡眠や心拍変動などの寄与を一緒に表示します。"],
          ["Apple公式のスコアではない", "このアプリが端末上で計算した目安です。Appleが提供する準備度スコアではありません。"],
          ["健康上の注意", "病気の診断、運動可否の決定、医療相談の代わりには使えません。"]
        ]
      }
    ],
    faqs: [
      ["今ダウンロードすると身体コンディション機能を使えますか？", "いいえ。2026年9月23日時点の公開版2.0.3には含まれません。公開状況はApp Storeの更新履歴で確認してください。"],
      ["日本語の画面で使えますか？", "公開版のApp Store対応言語には日本語が含まれます。このページの新機能プレビュー画像は中国語UIのビルドで撮影されたものです。"]
    ]
  },
  {
    file: "lailemma-period-tracker-de.html",
    lang: "de-DE",
    ogLocale: "de_DE",
    title: "Lailemma Zyklus-App | Körperbereitschaft als Vorschau",
    description: "Lailemma dokumentiert Periode und Symptome. Körperbereitschaft ist nur eine Vorschau aus einem neueren Build, nicht Teil der aktuellen App-Store-Version.",
    keywords: "Zyklus App iPhone, Periode dokumentieren, Eisprung Schätzung, Körperbereitschaft Vorschau",
    kicker: "Zyklus dokumentieren · iPhone und iPad",
    heading: "Lailemma: Zyklus und Symptome im Blick",
    lead: "Halte Periode und tägliche Symptome fest und sieh Schätzungen zum fruchtbaren Fenster. Die gezeigte Körperbereitschaft stammt aus einem neueren Build und ist noch keine Funktion der öffentlich verfügbaren App-Store-Version.",
    icon: "lailemma-icon.webp",
    screenshots: [
      { file: "lailemma-readiness-home.webp", alt: "Vorschau der Körperbereitschaft auf der Startseite eines neueren Builds mit chinesischer Oberfläche", caption: "Vorschau aus einem neueren Build; die abgebildete Oberfläche ist chinesisch." },
      { file: "lailemma-readiness-detail.webp", alt: "Detailansicht mit Beiträgen von Schlaf, Herzfrequenzvariabilität und Zyklusphase in chinesischer Oberfläche", caption: "Die Schätzung erläutert Schlaf, HRV und weitere verfügbare Signale." }
    ],
    previewLabel: "Vorschau, noch nicht öffentlich verfügbar.",
    status: "Am 23. September 2026 war Version 2.0.3 im App Store öffentlich. Körperbereitschaft ist darin noch nicht enthalten. Prüfe die Versionshinweise vor der Installation.",
    storeUrl: "https://apps.apple.com/de/app/lailemma-zyklus-fertilit%C3%A4t/id6775935474?uo=4",
    storeProduct: "lailemma-period-fertility",
    storeCountry: "de",
    storeLabel: "Öffentliche Version im App Store ansehen",
    appName: "Lailemma - Zyklus & Fertilität",
    appCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    softwareRequirements: "iOS 17.0 oder neuer",
    price: "0",
    currency: "EUR",
    appDescription: "Zyklus, Symptome und Eisprung-Schätzungen dokumentieren. Körperbereitschaft ist eine Vorschau aus einem neueren Build und fehlt in der am 23. September 2026 geprüften öffentlichen Version.",
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
        kicker: "Vorschau eines neueren Builds",
        heading: "Was die Körperbereitschaft erklärt",
        intro: "Ein neuerer Build schätzt den Tageszustand anhand tatsächlich verfügbarer, freigegebener Signale wie Schlaf, Herzfrequenzvariabilität, Ruhepuls, Handgelenktemperatur, Aktivität und Zyklusphase. Die abgebildeten Screenshots zeigen eine chinesische Oberfläche.",
        items: [
          ["Schätzung mit Gründen", "Der Vorschaubildschirm zeigt einen Wert von 0 bis 100 und den Beitrag einzelner Signale, statt nur eine Zahl auszugeben."],
          ["Kein Apple-Score", "Die Berechnung stammt von Lailemma und erfolgt auf dem Gerät. Sie ist kein offizieller Apple-Bereitschaftswert."],
          ["Keine medizinische Aussage", "Der Wert dient der alltäglichen Orientierung und ersetzt weder eine Diagnose noch ärztlichen Rat."]
        ]
      }
    ],
    faqs: [
      ["Ist Körperbereitschaft bereits im App Store verfügbar?", "Nein. In der am 23. September 2026 geprüften öffentlichen Version 2.0.3 fehlt diese Funktion. Maßgeblich sind die aktuellen Versionshinweise im App Store."],
      ["Ist die App auf Deutsch nutzbar?", "Ja, Deutsch steht in der Sprachliste der öffentlichen App. Die Vorschaubilder für die neue Funktion wurden jedoch mit einer chinesischen Oberfläche aufgenommen."]
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
    lead: "Every note is an ordinary .md file in iCloud Drive, so you can open the same folder on a Mac or in another editor. Inkstone adds a focused native writing surface without locking your notes in a database.",
    icon: "inkstone-icon.webp",
    screenshots: [{ file: "inkstone-editor-screen.webp", alt: "Inkstone Notes Markdown editor showing links, task lists and rich-text copy controls", caption: "The iPhone editor works directly with Markdown files." }],
    storeUrl: "https://apps.apple.com/us/app/inkstone-notes-markdown/id6810287923?uo=4",
    storeProduct: "inkstone-notes-markdown",
    storeCountry: "us",
    storeLabel: "Open Inkstone on App Store",
    appName: "Inkstone Notes Markdown",
    appCategory: "ProductivityApplication",
    operatingSystem: "iOS",
    softwareRequirements: "iOS 18.0 or later",
    price: "0.99",
    currency: "USD",
    appDescription: "Markdown writing app with plain files in iCloud Drive, wiki links, backlinks, offline formulas and diagrams, and PDF or HTML export.",
    sections: [
      {
        kicker: "File ownership",
        heading: "Your notes remain plain Markdown",
        intro: "A folder of .md files is the source of truth. Open it from Finder on a Mac, edit with another app or move it without a proprietary export step.",
        items: [
          ["Connected notes", "Use [[note title]] links, backlinks and rename-aware links to navigate a growing collection."],
          ["Writing tools", "Syntax highlighting, live preview, outlines, inline tags, daily notes and full-text search stay close to the editor."],
          ["Publish or hand off", "Copy with one of eight typesetting styles or export PDF and HTML with embedded images."]
        ]
      },
      {
        kicker: "Offline rendering",
        heading: "Formulas and diagrams without a web service",
        intro: "KaTeX and Mermaid are bundled for local rendering. The App Store privacy label says the developer does not collect data from this app.",
        items: [
          ["Requirements", "Inkstone is an iPhone app requiring iOS 18.0 or later; the interface is available in English and Simplified Chinese."],
          ["Store price", "The US App Store listed a $0.99 upfront price when checked on 23 September 2026; regional prices may differ."]
        ]
      }
    ],
    faqs: [
      ["Are Inkstone notes locked in its own database?", "No. Notes are ordinary Markdown files in an iCloud Drive folder that can be opened or edited by other tools."],
      ["Can I use Inkstone's editor on a Mac?", "The current App Store listing is for iPhone. You can access the same Markdown files on a Mac through iCloud Drive and edit them with another app."]
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
    price: "1.99",
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
        kicker: "Before you buy",
        heading: "Check the interface language and price",
        intro: "The current app interface is Simplified Chinese, even though this product description is in English. The US App Store listed an upfront $1.99 price on 23 September 2026; prices vary by region.",
        items: [
          ["Privacy", "The App Store listing says TwoPic has no network access and the developer does not collect data; captures stay in your Photos library."],
          ["No automatic editing claim", "TwoPic captures both perspectives at once. The page does not promise automatic post-production or cloud syncing."]
        ]
      }
    ],
    faqs: [
      ["Does TwoPic require a newer iPhone?", "Yes. Simultaneous front and back camera capture requires an iPhone XS or later with an A12-class chip and iOS 18.0 or later."],
      ["Is the TwoPic app interface available in English?", "Not in the current version checked on 23 September 2026. Its interface is in Simplified Chinese, although the App Store description is translated."]
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
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${canonical}#page`, url: canonical, name: page.title,
        description: page.description, inLanguage: page.lang,
        isPartOf: { "@id": `${origin}/#website` }, publisher: { "@id": `${origin}/#publisher` },
        mainEntity: { "@id": `${canonical}#app` }
      },
      {
        "@type": "SoftwareApplication", "@id": `${canonical}#app`, name: page.file.startsWith("lailemma") ? "Lailemma - Period & Fertility" : page.appName,
        ...(page.file.startsWith("lailemma") && page.appName !== "Lailemma - Period & Fertility" ? { alternateName: page.appName } : {}),
        applicationCategory: page.appCategory, operatingSystem: page.operatingSystem,
        softwareRequirements: page.softwareRequirements,
        url: page.storeUrl, downloadUrl: page.storeUrl, description: page.appDescription,
        image: `${origin}/assets/${page.icon}`,
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
  const ui = labels[page.lang] ?? labels.en;
  const appId = page.storeUrl.match(/\/id(\d+)/)?.[1];
  if (!appId) throw new Error(`${page.file}: App Store ID missing`);
  const schema = JSON.stringify(schemaFor(page)).replace(/</g, "\\u003c");
  const isLailemma = page.file.startsWith("lailemma");
  const alternates = isLailemma ? `\n${lailemmaLanguages.map(([lang, file]) => `<link rel="alternate" hreflang="${lang}" href="${origin}/${file}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${origin}/lailemma-period-tracker.html">` : "";
  const screenshotMarkup = page.screenshots.map((shot) => `<figure><img src="assets/${shot.file}" width="520" height="1125" loading="lazy" decoding="async" alt="${escapeHtml(shot.alt)}"><figcaption>${escapeHtml(shot.caption)}</figcaption></figure>`).join("\n");
  const sectionMarkup = page.sections.map((section, index) => `<section class="section content-section${index % 2 ? " alt-section" : ""}"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(section.kicker)}</p><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.intro)}</p></div><div class="content-list">${itemList(section.items)}</div></div></section>`).join("\n");
  const faqMarkup = page.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("\n");
  const languageLinks = isLailemma ? lailemmaLanguages.filter(([, file]) => file !== page.file).map(([lang, file, name]) => `<a href="${file}" lang="${lang}">${escapeHtml(name)}</a>`).join("") : "";
  const statusMarkup = page.status ? `<p class="new-app-status"><strong>${escapeHtml(page.previewLabel)}</strong> ${escapeHtml(page.status)}</p>` : "";
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests">
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://apps.apple.com">
<script src="analytics.js"></script>
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
<meta property="og:image" content="${origin}/assets/og-default.png"><meta property="og:image:secure_url" content="${origin}/assets/og-default.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(page.appName)} by CrazyAIAgent">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.title)}">
<meta name="twitter:description" content="${escapeHtml(page.description)}"><meta name="twitter:image" content="${origin}/assets/og-default.png">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest">
<link rel="stylesheet" href="styles.css">
<script type="application/ld+json">${schema}</script>
</head>
<body>
<header class="site-header" data-elevate><nav class="nav" aria-label="${ui.nav}"><a class="brand" href="/" aria-label="CrazyAIAgent home"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="apps.html">${ui.apps}</a><a href="guides.html">${ui.guides}</a><a href="support.html">${ui.support}</a></div></nav></header>
<main class="new-app-page ${page.file.startsWith("lailemma") ? "health-app" : page.file.startsWith("inkstone") ? "notes-app" : "camera-app"}">
<section class="page-hero new-app-intro"><div class="section-inner">
<nav class="breadcrumb" aria-label="${ui.breadcrumb}"><ol><li><a href="/">${ui.home}</a></li><li><a href="apps.html">${ui.apps}</a></li><li aria-current="page">${escapeHtml(page.appName)}</li></ol></nav>
<div class="new-app-title"><img src="assets/${page.icon}" width="112" height="112" fetchpriority="high" decoding="async" alt="${escapeHtml(page.appName)} icon"><div><p class="section-kicker">${escapeHtml(page.kicker)}</p><h1>${escapeHtml(page.heading)}</h1></div></div>
<p class="new-app-lead">${escapeHtml(page.lead)}</p>${statusMarkup}
<div class="hero-actions"><a class="button button-primary" href="${page.storeUrl}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="${page.storeProduct}" data-storefront="ios-app-store" data-store-country="${page.storeCountry}" aria-label="${escapeHtml(page.storeLabel)} (${ui.newTab})">${escapeHtml(page.storeLabel)}</a>${languageLinks}</div>
</div></section>
<section class="section new-app-visual" aria-labelledby="new-app-screen-title"><div class="section-inner"><p class="section-kicker">${ui.screen}</p><h2 id="new-app-screen-title">${page.status ? ui.preview : ui.inside}</h2><div class="new-app-screens">${screenshotMarkup}</div></div></section>
${sectionMarkup}
<section class="section content-section new-app-faq"><div class="section-inner"><p class="section-kicker">${ui.faq}</p><h2>${ui.before}</h2><div class="faq-list">${faqMarkup}</div></div></section>
</main>
<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="/">${ui.home}</a><a href="apps.html">${ui.apps}</a><a href="directory.html">${ui.directory}</a>${languageLinks}<a href="privacy.html">${ui.privacy}</a><a href="support.html">${ui.support}</a></div></div></footer>
<script src="script.js" defer></script>
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
