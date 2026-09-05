import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { priorityStores } from "./japan-germany-turkey-markets.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");
const origin = "https://www.xiaozhonglvyou.com";
const publishedDate = "2026-09-04";
const updatedDate = "2026-09-05";
const appId = "6768019606";
const analyticsVersion = "0bee63cd1708";

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
  image: `${origin}/assets/ai-cleaning-icon.png`,
  description: "Independent App Store utility portfolio for photo organization, travel translation, and screen privacy.",
  founder: { "@id": `${origin}/#developer` },
  contactPoint: { "@type": "ContactPoint", email: "mailto:cb123428316@gmail.com", contactType: "customer support", availableLanguage: ["en", "de", "ja", "tr"] },
  sameAs: [
    "https://apps.apple.com/us/developer/bo-chen/id1321915789?uo=4",
    "https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4",
    "https://github.com/kuangre123/xiaozhonglvyou-apps-site"
  ]
};

const decisionAlternates = [
  ["en", "best-iphone-photo-cleaner-app.html"],
  ["de", "de-de-beste-iphone-foto-cleaner.html"],
  ["ja", "ja-jp-best-iphone-photo-cleaner.html"],
  ["tr", "tr-tr-en-iyi-iphone-fotograf-temizleme.html"],
  ["x-default", "best-iphone-photo-cleaner-app.html"]
];

const pages = [
  {
    file: "ja-jp-best-iphone-photo-cleaner.html",
    lang: "ja-JP",
    locale: "ja_JP",
    storeCountry: "jp",
    title: "iPhone写真整理アプリおすすめ | AIで安全に選ぶ",
    description: "日本語でiPhone写真整理アプリの選び方を解説します。重複写真、類似写真、スクリーンショット、AI分類、プライバシー、削除前確認を比較します。",
    keywords: ["iPhone 写真整理アプリ おすすめ", "iPhone 写真クリーナー 比較", "重複写真 削除 アプリ", "写真整理 AI", "iPhone ストレージ整理", "AI Cleaning"],
    ogTitle: "iPhone写真整理アプリの選び方",
    ogDescription: "日本語で確認するiPhone写真整理アプリの選び方。重複写真、類似写真、AI分類、削除前確認を比較します。",
    breadcrumb: "写真整理アプリの選び方",
    countryName: "日本",
    marketFile: "ja-jp.html",
    guideFile: "ja-jp-photo-cleaner.html",
    guideLabel: "写真整理の使い方を見る",
    navGuide: "ガイド",
    navDirectory: "一覧",
    eyebrow: "日本語の選び方ガイド",
    imageAlt: "AI CleaningのiPhone写真整理候補画面",
    h1: "iPhone写真整理アプリは、削除前に比較できるものを選ぶ。",
    lead: "「おすすめ」の写真整理アプリを選ぶときは、空き容量を増やす数字だけで判断しない方が安全です。重複写真、類似写真、スクリーンショット、ぼやけた写真、大きな動画は性質が違います。日本のユーザーには、候補を見せ、重要な写真を開いて確認し、最後の削除判断を自分でできるアプリが向いています。",
    primary: "日本のApp StoreでAI Cleaningを確認",
    secondary: "写真整理の手順を見る",
    sections: [
      {
        kicker: "結論",
        title: "最初に見るべき基準は、分類精度よりも確認しやすさです。",
        lead: "AI Cleaningは、写真を種類別に分け、削除候補をまとめて確認するためのiPhoneアプリです。おすすめ候補として評価する場合は、次の順で見ます。",
        items: [
          ["削除前レビュー", "写真を自動削除する仕組みより、候補を開いて比較できる流れを優先します。連写、家族写真、領収書、身分証、チケットは一括選択に向きません。"],
          ["AI分類の実用性", "食べ物、書類、領収書、身分証、植物、動物、集合写真などが分かれると、消してはいけない写真を先に除外しやすくなります。"],
          ["日本のApp Store情報", "価格、アプリ内課金、対応OS、プライバシー表示は変わる可能性があります。検索結果だけではなく、日本のApp Storeの表示を最後に確認します。"]
        ]
      },
      {
        kicker: "比較ポイント",
        title: "重複写真アプリと写真整理アプリは同じではありません。",
        lead: "完全な重複だけを探すアプリは役に立ちますが、実際に容量を圧迫するのは似た構図の写真、スクリーンショット、動画、ぼやけた写真であることも多いです。",
        items: [
          ["重複", "同じ画像のコピーなら判断しやすいですが、iCloud同期や共有アルバムの状態を確認してから削除します。"],
          ["類似写真", "似ているだけの写真は別テイクです。表情、ピント、文字の読みやすさ、編集済みかどうかを比べます。"],
          ["スクリーンショット", "一時的な画面保存は消しやすい一方で、予約番号、QRコード、支払い記録が混ざることがあります。"],
          ["大きなメディア", "容量削減には有効ですが、動画は思い出や仕事の記録を含むことがあるため、プレビュー確認が必要です。"]
        ]
      },
      {
        kicker: "向いている人",
        title: "AI Cleaningが合うのは、写真を見ながら整理したい人です。",
        lead: "一度で全部消すより、まず分類して候補を理解したい人に向いています。逆に、iOSのシステムデータやRAMを消したい人には別の問題なので向きません。",
        items: [
          ["合うケース", "旅行写真、料理写真、書類写真、スクリーンショットが混在し、何から見ればよいか分からないとき。"],
          ["慎重に使うケース", "仕事用書類、証明書、家族写真、編集済み写真が多い場合は、分類だけで判断せず元画像を開きます。"],
          ["合わないケース", "写真ライブラリ以外のiOSシステム容量、キャッシュ、RAMを消す目的では使いません。"]
        ]
      }
    ],
    applePhotos: {
      kicker: "標準機能との比較",
      title: "重複写真だけなら、まずiPhone標準の写真アプリを確認。",
      lead: "重複項目の整理は、追加のクリーナーを入れなくても始められます。Appleの日本語ガイドで標準機能を確認し、それでも残る整理作業に合わせて専用アプリを選びます。",
      items: [
        ["写真アプリで重複を整理", "Appleの現行ガイドでは、写真アプリの「コレクション」から「ユーティリティ」、「重複項目」と進みます。表示された組を確認してから結合します。画面の配置はiOSのバージョンで異なることがあります。"],
        ["重複項目が見つからない場合", "まず写真の解析が終わっているかを考えます。Appleによると、検出にはiPhoneをロックして電源につなぐ必要があり、写真の量によって数日かかる場合があります。表示されないだけで、すぐに追加アプリが必要とは限りません。"],
        ["専用アプリを検討する場面", "旅行の連写から残す一枚を選ぶ、書類とスクリーンショットを分ける、大きな動画を見直す、といった作業が残る場合です。AI Cleaningを含む候補の分類、プレビュー、料金を比べ、削除する写真は自分で確認します。"]
      ],
      sources: [
        ["Apple：重複する写真やビデオの結合", "https://support.apple.com/ja-jp/guide/iphone/iph1978d9c23/ios"],
        ["Apple：重複項目が見つからない場合", "https://support.apple.com/ja-jp/102260"]
      ],
      comparisonLabel: "英語の写真クリーナー比較を見る"
    },
    storeTitle: "インストール前に、日本のApp Storeで条件を確認する。",
    storeLead: "ストア上の価格、アプリ内課金、対応OS、言語、プライバシー表示が最終情報です。検索結果や古い紹介記事だけで判断しないでください。",
    faqTitle: "写真整理アプリ選びの質問",
    faq: [
      ["iPhone写真整理アプリのおすすめ基準は何ですか？", "削除前に写真を比較できること、重複と類似写真を区別できること、重要な写真を除外しやすいこと、App Storeの価格とプライバシー表示を確認できることです。"],
      ["AI Cleaningは写真を自動削除しますか？", "いいえ。分類や削除候補は確認の補助です。最終的に削除する写真は利用者が選びます。"],
      ["無料の写真整理機能だけで十分ですか？", "iPhone標準の重複項目だけで足りる場合もあります。類似写真、スクリーンショット、ぼやけた写真、大きな動画をまとめて確認したい場合は専用アプリを比較します。"],
      ["日本語UIかどうかはどこで確認しますか？", "日本のApp Storeの言語欄、スクリーンショット、アプリ内表示をインストール前に確認します。ページ上の説明言語とアプリ画面の言語は別です。"],
      ["削除しても容量が増えないことはありますか？", "あります。iOSは削除した写真を「最近削除した項目」に一定期間保存します。必要な写真がないことを確認してから、そのアルバムも管理します。"]
    ],
    ui: { updated: "2026年9月5日更新", storeLink: "日本のApp Storeを開く", faqKicker: "FAQ", author: "著者", privacy: "プライバシー", contact: "お問い合わせ" }
  },
  {
    file: "de-de-beste-iphone-foto-cleaner.html",
    lang: "de-DE",
    locale: "de_DE",
    storeCountry: "de",
    title: "Beste iPhone Foto Cleaner | KI App richtig wählen",
    description: "Deutschsprachiger Entscheidungsratgeber für iPhone Foto Cleaner: KI-Sortierung, doppelte Fotos, ähnliche Bilder, Datenschutz und Löschkontrolle prüfen.",
    keywords: ["beste iPhone Foto Cleaner", "iPhone Foto Cleaner Vergleich", "doppelte Fotos App", "KI Fotos sortieren", "iPhone Speicher bereinigen", "AI Cleaning"],
    ogTitle: "Beste iPhone Foto Cleaner richtig auswählen",
    ogDescription: "Deutscher Entscheidungsratgeber für iPhone Foto Cleaner: Duplikate, ähnliche Bilder, KI-Sortierung, Datenschutz und Kontrolle vor dem Löschen.",
    breadcrumb: "Beste Foto-Cleaner wählen",
    countryName: "Deutschland",
    marketFile: "de-de.html",
    guideFile: "iphone-foto-cleaner-de.html",
    guideLabel: "Deutschen Fotoratgeber lesen",
    navGuide: "Ratgeber",
    navDirectory: "Verzeichnis",
    eyebrow: "Deutschsprachiger Auswahlratgeber",
    imageAlt: "AI Cleaning zeigt Foto-Kategorien auf dem iPhone",
    h1: "Der beste iPhone Foto Cleaner ist der, der vor dem Löschen Kontrolle lässt.",
    lead: "Wer in Deutschland nach einem iPhone Foto Cleaner sucht, will meist Speicher freigeben, ohne wichtige Fotos zu verlieren. Ein guter Foto-Cleaner sollte nicht nur einen großen Löschen-Knopf anbieten. Entscheidend sind KI-Sortierung, klare Gruppen für Duplikate und ähnliche Bilder, eine verständliche Vorschau, Datenschutzangaben und die Möglichkeit, jede Entscheidung vor dem Löschen selbst zu treffen.",
    primary: "AI Cleaning im deutschen App Store prüfen",
    secondary: "Foto-Cleaner-Ratgeber lesen",
    sections: [
      {
        kicker: "Kurzentscheidung",
        title: "Wählen Sie nach Kontrollfluss, nicht nur nach versprochenem Speichergewinn.",
        lead: "AI Cleaning ist dann eine passende Option, wenn Sie Ihre Fotomediathek zuerst verstehen und danach gezielt aufräumen möchten.",
        items: [
          ["Voransicht vor Löschung", "Die App sollte Gruppen öffnen lassen, damit Sie Schärfe, Gesichter, Text, Bearbeitungen und Erinnerungswert prüfen können."],
          ["KI-Sortierung", "Kategorien wie Dokumente, Belege, Ausweise, Essen, Pflanzen, Tiere und Gruppenfotos helfen, sensible Bilder aus einer Bereinigung herauszunehmen."],
          ["Deutscher App Store", "Preise, In-App-Käufe, iOS-Anforderung, Sprachliste und Datenschutzangaben müssen direkt im deutschen App Store geprüft werden."]
        ]
      },
      {
        kicker: "Vergleich",
        title: "Duplikate, ähnliche Bilder und große Medien brauchen unterschiedliche Regeln.",
        lead: "Eine reine Duplikat-App löst nur einen Teil des Problems. Viele Mediatheken enthalten Serienaufnahmen, Screenshots und große Videos, die getrennt bewertet werden sollten.",
        items: [
          ["Exakte Duplikate", "Kopien lassen sich meist schnell vergleichen. Trotzdem sollten iCloud-Synchronisierung und geteilte Alben berücksichtigt werden."],
          ["Ähnliche Bilder", "Ähnliche Fotos sind oft verschiedene Momente. Gesichtsausdruck, Fokus, lesbarer Text und Bearbeitungsstand entscheiden."],
          ["Screenshots", "Screenshots können leicht entbehrlich sein, enthalten aber auch Tickets, QR-Codes, Rechnungen oder Kontoauszüge."],
          ["Große Videos", "Sie bringen oft den größten Speichergewinn, sollten aber nie ohne Vorschau und Inhaltsprüfung gelöscht werden."]
        ]
      },
      {
        kicker: "Passende Nutzung",
        title: "AI Cleaning eignet sich für manuelle Fotoorganisation mit KI-Hilfe.",
        lead: "Die App hilft beim Sortieren und Gruppieren. Sie ersetzt nicht Ihre Entscheidung und ist kein Werkzeug zum Bereinigen geschützter iOS-Systemdaten.",
        items: [
          ["Geeignet", "Große private Fotomediatheken mit vielen ähnlichen Aufnahmen, Screenshots, Dokumentfotos und Videos."],
          ["Mit Vorsicht", "Berufliche Dokumente, Belege, Ausweise, Familienbilder und bearbeitete Dateien sollten einzeln geöffnet werden."],
          ["Nicht geeignet", "Wenn das Ziel RAM-Reinigung, Systemcache, versteckte iOS-Daten oder automatische Löschung ohne Kontrolle ist."]
        ]
      }
    ],
    applePhotos: {
      kicker: "Apple Fotos oder zusätzliche App",
      title: "Für erkannte Duplikate zuerst die integrierte Fotos-App prüfen.",
      lead: "Zum Zusammenführen erkannter Duplikate brauchen Sie keine zusätzliche Cleaner-App. Prüfen Sie zuerst Apples Funktion und entscheiden Sie dann, welche Aufgaben in Ihrer Mediathek noch offen sind.",
      items: [
        ["Duplikate in Apple Fotos", "Apples aktuelles Handbuch führt über Fotos, Sammlungen und Sonstige zu Duplikate. Prüfen Sie die angezeigten Gruppen, bevor Sie sie zusammenführen. Je nach iOS-Version kann die Anordnung anders aussehen."],
        ["Wenn Duplikate fehlen", "Lassen Sie das iPhone gesperrt und am Strom, damit die Erkennung laufen kann. Apple nennt je nach Mediathek und Hintergrundaufgaben eine Wartezeit von bis zu mehreren Tagen. Eine fehlende Sammlung bedeutet daher nicht automatisch, dass Sie einen Cleaner benötigen."],
        ["Wann eine zusätzliche App hilft", "Wenn Sie aus einer Fotoserie auswählen, Dokumente von Screenshots trennen oder große Videos durchsehen möchten, vergleichen Sie die Gruppierung und Vorschau zusätzlicher Apps. Prüfen Sie bei AI Cleaning und anderen Kandidaten auch Kosten, Datenschutz und die Kontrolle vor dem Löschen."]
      ],
      sources: [
        ["Apple: Doppelte Fotos und Videos zusammenführen", "https://support.apple.com/de-de/guide/iphone/iph1978d9c23/ios"],
        ["Apple: Wenn das Album Duplikate fehlt", "https://support.apple.com/de-de/102260"]
      ],
      comparisonLabel: "Englischen Foto-Cleaner-Vergleich öffnen"
    },
    storeTitle: "Aktuelle Bedingungen im deutschen App Store kontrollieren.",
    storeLead: "Der App-Store-Eintrag ist die maßgebliche Quelle für Preis, In-App-Käufe, iOS-Version, Sprachliste und Datenschutzangaben.",
    faqTitle: "Fragen zur Auswahl eines iPhone Foto Cleaners",
    faq: [
      ["Was macht einen guten iPhone Foto Cleaner aus?", "Wichtig sind klare Prüfgruppen, eine zuverlässige Vorschau, getrennte Behandlung von Duplikaten und ähnlichen Fotos, transparente Datenschutzangaben und manuelle Kontrolle vor dem Löschen."],
      ["Löscht AI Cleaning Fotos automatisch?", "Nein. Die App unterstützt beim Sortieren und Anzeigen möglicher Löschkandidaten. Die endgültige Auswahl trifft der Nutzer."],
      ["Reicht Apples Duplikate-Funktion aus?", "Für exakte Duplikate kann sie ausreichen. Wer auch ähnliche Fotos, Screenshots, unscharfe Bilder und große Medien prüfen möchte, vergleicht zusätzliche Foto-Cleaner-Apps."],
      ["Wo prüfe ich deutsche Preise und Kompatibilität?", "Im deutschen App Store. Dort stehen die aktuellen Preise, In-App-Käufe, iOS-Anforderungen, Spracheinträge und Datenschutzinformationen."],
      ["Ist ein Foto-Cleaner ein Systemreiniger?", "Nein. AI Cleaning ist für die Fotomediathek gedacht. Geschützte iOS-Systemdaten, RAM oder allgemeine Cache-Bereinigung sind nicht der versprochene Anwendungsbereich."]
    ],
    ui: { updated: "Aktualisiert am 5. September 2026", storeLink: "Deutschen App Store öffnen", faqKicker: "FAQ", author: "Autor", privacy: "Datenschutz", contact: "Kontakt" }
  },
  {
    file: "tr-tr-en-iyi-iphone-fotograf-temizleme.html",
    lang: "tr-TR",
    locale: "tr_TR",
    storeCountry: "tr",
    title: "En İyi iPhone Fotoğraf Temizleme | AI Seçim Rehberi",
    description: "Türkçe iPhone fotoğraf temizleme uygulaması seçme rehberi: yapay zeka sınıflandırma, yinelenen fotoğraflar, gizlilik ve silme kontrolü.",
    keywords: ["en iyi iPhone fotoğraf temizleme", "iPhone fotoğraf temizleme uygulaması", "yinelenen fotoğrafları silme", "yapay zeka fotoğraf düzenleme", "iPhone depolama temizleme", "AI Cleaning"],
    ogTitle: "En iyi iPhone fotoğraf temizleme uygulaması nasıl seçilir",
    ogDescription: "Türkçe karar rehberi: yinelenen fotoğraflar, benzer kareler, yapay zeka sınıflandırma, gizlilik ve silmeden önce kontrol.",
    breadcrumb: "En iyi fotoğraf temizleme seçimi",
    countryName: "Türkiye",
    marketFile: "tr-tr.html",
    guideFile: "tr-tr-photo-cleaner.html",
    guideLabel: "Türkçe fotoğraf temizleme rehberini oku",
    navGuide: "Rehberler",
    navDirectory: "Dizin",
    eyebrow: "Türkçe seçim rehberi",
    imageAlt: "AI Cleaning iPhone fotoğraf temizleme adaylarını gösterir",
    h1: "En iyi iPhone fotoğraf temizleme uygulaması, silmeden önce kontrol ettirir.",
    lead: "Türkiye'de iPhone fotoğraf temizleme uygulaması arayan kullanıcılar genellikle depolama alanı açmak ister, ancak aile fotoğrafları, belgeler, ekran görüntüleri ve videolar aynı yerde durur. Bu yüzden en iyi seçim, fotoğrafları yapay zeka ile gruplandıran, yinelenen ve benzer kareleri ayıran, kullanıcıya önizleme veren ve silme kararını otomatikleştirmeyen uygulamadır.",
    primary: "Türkiye App Store'da AI Cleaning'i incele",
    secondary: "Fotoğraf temizleme rehberini oku",
    sections: [
      {
        kicker: "Kısa karar",
        title: "Depolama vaadinden önce kontrol akışını değerlendirin.",
        lead: "AI Cleaning, fotoğraf arşivini anlamak ve silme adaylarını incelemek isteyen kullanıcılar için konumlandırılır.",
        items: [
          ["Silmeden önce inceleme", "Uygulama adayları göstermeli, kullanıcı da fotoğrafı açıp netlik, yüz ifadesi, metin ve düzenleme durumunu görebilmelidir."],
          ["Yapay zeka sınıflandırma", "Belge, makbuz, kimlik, yemek, bitki, hayvan ve grup fotoğrafı gibi kategoriler önemli görselleri ayırmayı kolaylaştırır."],
          ["Türkiye App Store doğrulaması", "Fiyat, uygulama içi satın alma, iOS sürümü, dil ve gizlilik bilgileri yüklemeden önce Türkiye mağazasında kontrol edilmelidir."]
        ]
      },
      {
        kicker: "Karşılaştırma",
        title: "Yinelenen fotoğraf ve benzer fotoğraf aynı karar değildir.",
        lead: "Sadece birebir kopyaları bulmak çoğu arşiv için yeterli olmayabilir. Seri çekimler, ekran görüntüleri, bulanık fotoğraflar ve büyük videolar ayrı ayrı değerlendirilmelidir.",
        items: [
          ["Yinelenenler", "Aynı dosya veya aynı görselin kopyaları daha kolay seçilir, ancak iCloud ve paylaşılan albüm durumu yine de kontrol edilir."],
          ["Benzer kareler", "Benzer fotoğraflar farklı anlar olabilir. Netlik, yüz ifadesi, düzenleme ve okunabilir metin önemlidir."],
          ["Ekran görüntüleri", "Geçici olabilirler, fakat bilet, QR kod, ödeme kaydı veya kimlik bilgisi de içerebilirler."],
          ["Büyük medya", "Depolama alanına etkisi yüksek olabilir. Silmeden önce videoyu oynatmak ve içeriğini anlamak gerekir."]
        ]
      },
      {
        kicker: "Kime uygun",
        title: "AI Cleaning, yapay zeka desteğiyle manuel düzenleme yapmak isteyenlere uygundur.",
        lead: "Uygulama karar desteği sağlar. Kullanıcının yerine otomatik silme yapması veya iOS sistem verilerini temizlemesi beklenmemelidir.",
        items: [
          ["Uygun durum", "Çok sayıda seyahat, yemek, belge, ekran görüntüsü ve seri çekim fotoğrafının karıştığı arşivler."],
          ["Dikkatli kullanım", "İş belgeleri, kimlikler, makbuzlar, aile fotoğrafları ve düzenlenmiş görseller tek tek açılmalıdır."],
          ["Uygun olmayan beklenti", "RAM temizleme, sistem önbelleği, korunan iOS verisi veya kullanıcı kontrolü olmadan otomatik silme bekleniyorsa doğru araç değildir."]
        ]
      }
    ],
    applePhotos: {
      kicker: "Fotoğraflar mı, ek uygulama mı?",
      title: "Saptanan yinelenenler için önce iPhone'un Fotoğraflar uygulamasına bakın.",
      lead: "Saptanan yinelenenleri birleştirmek için ek bir temizleme uygulaması gerekmez. Önce Apple'ın sunduğu özelliği deneyin; ardından arşivde kalan düzenleme ihtiyacınıza göre seçim yapın.",
      items: [
        ["Fotoğraflar'da yinelenenleri birleştirme", "Apple'ın güncel kılavuzunda Fotoğraflar içinden Koleksiyonlar, Diğer ve Yinelenenler yolunu izlersiniz. Birleştirmeden önce gösterilen grubu kontrol edin. Menülerin yeri iOS sürümüne göre değişebilir."],
        ["Yinelenenler görünmüyorsa", "Saptama işlemi için iPhone'u kilitli ve güç kaynağına bağlı bırakın. Apple, arşiv boyutuna ve arka plan işlemlerine göre taramanın birkaç gün sürebileceğini belirtiyor. Albümün görünmemesi tek başına ek bir uygulama gerektiği anlamına gelmez."],
        ["Ek uygulama ne zaman düşünülebilir?", "Seri çekimlerden bir kare seçmek, belgeleri ekran görüntülerinden ayırmak veya büyük videoları incelemek istiyorsanız uygulamaların gruplama ve önizleme özelliklerini karşılaştırın. AI Cleaning ve diğer seçeneklerde ücretleri, gizliliği ve silme kontrolünü de değerlendirin."]
      ],
      sources: [
        ["Apple: Yinelenen fotoğrafları ve videoları birleştirme", "https://support.apple.com/tr-tr/guide/iphone/iph1978d9c23/ios"],
        ["Apple: Yinelenenler albümünü bulamıyorsanız", "https://support.apple.com/tr-tr/102260"]
      ],
      comparisonLabel: "İngilizce fotoğraf temizleme karşılaştırmasını aç"
    },
    storeTitle: "Yüklemeden önce Türkiye App Store kaydını kontrol edin.",
    storeLead: "Mağaza kaydı güncel fiyat, uygulama içi satın alma, iOS sürümü, dil listesi ve gizlilik bilgileri için son kontrol noktasıdır.",
    faqTitle: "iPhone fotoğraf temizleme uygulaması seçimi",
    faq: [
      ["En iyi iPhone fotoğraf temizleme uygulaması nasıl seçilir?", "Silmeden önce önizleme sunması, yinelenen ve benzer fotoğrafları ayırması, önemli kategorileri dışarıda bırakmayı kolaylaştırması ve güncel App Store bilgilerini açıkça kontrol ettirmesi gerekir."],
      ["AI Cleaning fotoğrafları kendiliğinden siler mi?", "Hayır. Uygulama aday grupları gösterir. Hangi fotoğrafların silineceğine kullanıcı karar verir."],
      ["iPhone'un yerleşik yinelenenler özelliği yeterli mi?", "Sadece birebir kopyalar için yeterli olabilir. Benzer fotoğraflar, ekran görüntüleri, bulanık görseller ve büyük videolar için ek bir uygulama karşılaştırılabilir."],
      ["Türkçe arayüzü nereden doğrularım?", "Türkiye App Store'daki dil listesi, ekran görüntüleri ve uygulama içi deneyim kontrol edilmelidir. Türkçe sayfa açıklaması, her zaman uygulama arayüzünün Türkçe olduğu anlamına gelmez."],
      ["Fotoğrafları sildikten sonra alan neden hemen açılmaz?", "iOS silinen fotoğrafları bir süre Son Silinenler albümünde tutar. Önemli içerik olmadığını doğruladıktan sonra bu albüm de yönetilmelidir."]
    ],
    ui: { updated: "5 Eylül 2026 tarihinde güncellendi", storeLink: "Türkiye App Store'u aç", faqKicker: "FAQ", author: "Yazar", privacy: "Gizlilik", contact: "İletişim" }
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

function alternateMarkup() {
  return decisionAlternates.map(([code, file]) => `<link rel="alternate" hreflang="${code}" href="${origin}/${file}">`).join("");
}

function storeLink(page, label, className) {
  const href = priorityStores[page.storeCountry].ai;
  return `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" data-store-country="${page.storeCountry}" aria-label="${escapeHtml(label)} (opens in a new tab)">${escapeHtml(label)}</a>`;
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

function relatedMarkup(page) {
  return [
    [page.guideLabel, page.guideFile],
    ["English decision guide", "best-iphone-photo-cleaner-app.html"],
    ["Photo cleaner comparison", "iphone-photo-cleaner-comparison.html"],
    ["日本語おすすめ", "ja-jp-best-iphone-photo-cleaner.html"],
    ["Beste Foto-Cleaner", "de-de-beste-iphone-foto-cleaner.html"],
    ["Türkçe seçim rehberi", "tr-tr-en-iyi-iphone-fotograf-temizleme.html"]
  ]
    .filter(([, file]) => file !== page.file)
    .map(([label, file]) => `<a href="${file}">${escapeHtml(label)}</a>`)
    .join(" ");
}

function render(page) {
  const url = `${origin}/${page.file}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    image: `${origin}/assets/og-ai-photo-cleaner-iphone.jpg`,
    mainEntityOfPage: url,
    citation: page.applePhotos.sources.map(([, url]) => url),
    articleSection: "Localized Decision Guides",
    inLanguage: page.lang,
    datePublished: publishedDate,
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
  const head = [
    "<!doctype html>", `<html lang="${page.lang}"><head>`,
    `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests">`,
    `<link rel="preconnect" href="https://www.googletagmanager.com"><link rel="preconnect" href="https://apps.apple.com"><script src="analytics.js?v=${analyticsVersion}"></script><script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-JY8T5JJGNH"></script>`,
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`,
    `<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}">`,
    `<meta name="keywords" content="${escapeHtml(page.keywords.join(", "))}">`,
    `<meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#111827">`,
    `<meta name="apple-itunes-app" content="app-id=${appId}, app-argument=${url}">`,
    `<link rel="canonical" href="${url}">`, alternateMarkup(),
    `<link rel="alternate" type="application/rss+xml" title="CrazyAIAgent RSS" href="${origin}/feed.xml"><link rel="alternate" type="application/atom+xml" title="CrazyAIAgent Atom" href="${origin}/atom.xml">`,
    `<meta property="og:type" content="article"><meta property="og:locale" content="${page.locale}"><meta property="article:published_time" content="${publishedDate}"><meta property="article:modified_time" content="${updatedDate}">`,
    `<meta property="og:url" content="${url}"><meta property="og:title" content="${escapeHtml(page.ogTitle)}"><meta property="og:site_name" content="CrazyAIAgent"><meta property="og:description" content="${escapeHtml(page.ogDescription)}">`,
    `<meta property="og:image" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg"><meta property="og:image:secure_url" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(page.imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.ogTitle)}"><meta name="twitter:description" content="${escapeHtml(page.ogDescription)}"><meta name="twitter:image" content="${origin}/assets/og-ai-photo-cleaner-iphone.jpg">`,
    `<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="styles.css?v=b83323801a7e">`,
    jsonLd(article), jsonLd(faq), jsonLd(breadcrumb), "</head>"
  ].join("");
  const header = `<body class="localized-photo-cleaner-page"><header class="site-header" data-elevate><nav class="nav" aria-label="Primary"><a class="brand" href="${page.marketFile}" aria-label="CrazyAIAgent"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="${page.marketFile}">${escapeHtml(page.countryName)}</a><a href="guides.html">${escapeHtml(page.navGuide)}</a><a href="directory.html">${escapeHtml(page.navDirectory)}</a></div>${storeLink(page, "App Store", "nav-cta")}</nav></header>`;
  const hero = `<main class="page-main"><section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="${page.marketFile}">${escapeHtml(page.countryName)}</a></li><li aria-current="page">${escapeHtml(page.breadcrumb)}</li></ol></nav><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p><p class="article-meta"><time datetime="${updatedDate}">${escapeHtml(page.ui.updated)}</time> · ${escapeHtml(page.ui.author)} <a href="about.html" rel="author">Bo Chen</a></p><div class="hero-actions">${storeLink(page, page.primary, "button button-primary")}<a class="button button-secondary" href="${page.guideFile}">${escapeHtml(page.secondary)}</a></div></div><div class="page-hero-media"><picture><source srcset="assets/ai-cleaning-screen.webp" type="image/webp"><img src="assets/ai-cleaning-screen.png" width="331" height="720" decoding="async" fetchpriority="high" alt="${escapeHtml(page.imageAlt)}"></picture></div></section>`;
  const sections = page.sections.map((section, index) => `<section class="section content-section${index % 2 === 1 ? " alt-section" : ""}"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(section.kicker)}</p><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.lead)}</p></div><div class="content-list">${listMarkup(section.items)}</div></div></section>`).join("");
  const appleSources = page.applePhotos.sources.map(([label, href]) => `<p><a href="${href}">${escapeHtml(label)}</a></p>`).join("");
  const applePhotosSection = `<section class="section content-section alt-section" data-apple-photos-comparison><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(page.applePhotos.kicker)}</p><h2>${escapeHtml(page.applePhotos.title)}</h2><p>${escapeHtml(page.applePhotos.lead)}</p>${appleSources}</div><div class="content-list">${listMarkup(page.applePhotos.items)}<div><a class="store-link store-link-secondary" href="iphone-photo-cleaner-comparison.html">${escapeHtml(page.applePhotos.comparisonLabel)}</a></div></div></div></section>`;
  const storeSection = `<section class="section content-section alt-section"><div class="section-inner content-grid"><div><p class="section-kicker">App Store</p><h2>${escapeHtml(page.storeTitle)}</h2><p>${escapeHtml(page.storeLead)}</p></div><div class="content-list"><div><strong>AI Cleaning - Photo Cleaner</strong><p>${escapeHtml(page.description)}</p></div><div>${storeLink(page, page.ui.storeLink, "store-link")}</div></div></div></section>`;
  const faqSection = `<section class="section faq"><div class="section-inner"><div class="section-heading"><p class="section-kicker">${escapeHtml(page.ui.faqKicker)}</p><h2>${escapeHtml(page.faqTitle)}</h2></div><div class="faq-list">${page.faq.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></div></section>`;
  const relatedSection = `<section class="section content-section alt-section"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">Related</p><h2>${escapeHtml(page.guideLabel)}</h2></div></div><p>${relatedMarkup(page)}</p></div></section></main>`;
  const footer = `<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="${page.marketFile}">${escapeHtml(page.countryName)}</a> <a href="guides.html">${escapeHtml(page.navGuide)}</a> <a href="directory.html">${escapeHtml(page.navDirectory)}</a> <a href="search.html">Search</a> <a href="privacy.html">${escapeHtml(page.ui.privacy)}</a> <a href="mailto:cb123428316@gmail.com">${escapeHtml(page.ui.contact)}</a></div></div></footer><script src="script.js?v=fda667de6672" defer></script></body></html>\n`;
  return `${head}${header}${hero}${sections}${applePhotosSection}${storeSection}${faqSection}${relatedSection}${footer}`;
}

async function syncEnglishDecisionAlternates() {
  const filePath = path.join(siteDir, "best-iphone-photo-cleaner-app.html");
  const original = await readFile(filePath, "utf8");
  let html = original.replace(/(?:<link\b(?=[^>]*rel=["']alternate["'])(?=[^>]*hreflang=)[^>]*>)+/i, "");
  html = html.replace(
    /(<link rel="canonical" href="https:\/\/www\.xiaozhonglvyou\.com\/best-iphone-photo-cleaner-app\.html">)/,
    `$1${alternateMarkup()}`
  );
  const localizedSection = `<section class="section content-section alt-section" data-localized-decision-guides><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">Localized decision guides</p><h2>Compare iPhone photo cleaner choices in Japanese, German, or Turkish.</h2></div><p>Read how Apple Photos and dedicated cleaners handle your tasks, then check prices, language support, and privacy details in your local App Store.</p></div><p><a href="ja-jp-best-iphone-photo-cleaner.html">日本語 iPhone写真整理アプリおすすめ</a> <a href="de-de-beste-iphone-foto-cleaner.html">Beste iPhone Foto Cleaner</a> <a href="tr-tr-en-iyi-iphone-fotograf-temizleme.html">En iyi iPhone fotoğraf temizleme</a></p></div></section>`;
  if (html.includes("data-localized-decision-guides")) {
    html = html.replace(/<section\b[^>]*data-localized-decision-guides[^>]*>[\s\S]*?<\/section>/, localizedSection);
  } else {
    html = html.replace(/(<section class="section related-articles")/, `${localizedSection}$1`);
  }
  if (html !== original) await writeFile(filePath, html, "utf8");
  console.log(`${html === original ? "Verified" : "Updated"} best-iphone-photo-cleaner-app.html decision hreflang`);
}

for (const page of pages) {
  const filePath = path.join(siteDir, page.file);
  const updated = render(page);
  let current = "";
  try { current = await readFile(filePath, "utf8"); } catch {}
  if (current !== updated) await writeFile(filePath, updated, "utf8");
  console.log(`${current === updated ? "Verified" : "Generated"} ${page.file}`);
}

await syncEnglishDecisionAlternates();
