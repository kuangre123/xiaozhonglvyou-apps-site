#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { priorityMarkets, priorityStores } from "./japan-germany-turkey-markets.mjs";
import { latinAmericanMarkets, latinAmericanStores } from "./latin-america-markets.mjs";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const origin = "https://www.xiaozhonglvyou.com";
const updatedDate = "2026-09-01";
const styleVersion = createHash("sha256")
  .update(await readFile(path.join(siteDir, "styles.css")))
  .digest("hex")
  .slice(0, 12);

const productPages = [
  ["ai", "iphone-photo-cleaner.html", "ai-cleaning-photo-cleaner", "ios-app-store"],
  ["translator", "travel-translator.html", "translation-specialist", "ios-app-store"],
  ["privacy", "mac-screen-privacy.html", "anti-spy-screen", "mac-app-store"],
  ["privacyLite", "mac-screen-privacy.html#lite", "anti-spy-screen-lite", "mac-app-store"],
  ["gif", "gif-maker.html", "gifmaker-gif-studio", "ios-app-store"],
  ["ride", "happyride-auto-ride-tracker.html", "happyride-auto-ride-tracker", "ios-app-store"]
];

const stores = {
  ru: {
    ai: "https://apps.apple.com/ru/app/ai-cleaning-%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE/id6768019606?uo=4",
    translator: "https://apps.apple.com/ru/app/translation-specialist/id6755734543?uo=4",
    privacy: "https://apps.apple.com/ru/app/anti-spy-screen/id6761301764?mt=12&uo=4",
    privacyLite: "https://apps.apple.com/ru/app/anti-spy-screen-lite/id6766485393?mt=12&uo=4",
    gif: "https://apps.apple.com/ru/app/gifmaker-gif-studio/id6783559364?uo=4",
    ride: "https://apps.apple.com/ru/app/happyride-auto-ride-tracker/id6786365305?uo=4"
  },
  cz: {
    ai: "https://apps.apple.com/cz/app/ai-cleaning-photo-cleaner/id6768019606?uo=4",
    translator: "https://apps.apple.com/cz/app/translation-specialist/id6755734543?uo=4",
    privacy: "https://apps.apple.com/cz/app/anti-spy-screen/id6761301764?mt=12&uo=4",
    privacyLite: "https://apps.apple.com/cz/app/anti-spy-screen-lite/id6766485393?mt=12&uo=4",
    gif: "https://apps.apple.com/cz/app/gifmaker-gif-studio/id6783559364?uo=4",
    ride: "https://apps.apple.com/cz/app/happyride-auto-ride-tracker/id6786365305?uo=4"
  },
  vn: {
    ai: "https://apps.apple.com/vn/app/ai-cleaning-photo-cleaner/id6768019606?uo=4",
    translator: "https://apps.apple.com/vn/app/translation-specialist/id6755734543?uo=4",
    privacy: "https://apps.apple.com/vn/app/anti-spy-screen/id6761301764?mt=12&uo=4",
    privacyLite: "https://apps.apple.com/vn/app/anti-spy-screen-lite/id6766485393?mt=12&uo=4",
    gif: "https://apps.apple.com/vn/app/gifmaker-gif-studio/id6783559364?uo=4",
    ride: "https://apps.apple.com/vn/app/happyride-auto-ride-tracker/id6786365305?uo=4"
  },
  ...priorityStores,
  ...latinAmericanStores
};

const markets = [
  {
    file: "ru-ru.html",
    store: "ru",
    lang: "ru-RU",
    ogLocale: "ru_RU",
    country: "Россия",
    breadcrumb: "Россия",
    title: "Приложения для iPhone и Mac в России | CrazyAIAgent",
    description: "Приложения для очистки фото на iPhone, перевода в поездках, создания GIF, записи поездок и защиты экрана Mac с прямыми ссылками на российский App Store.",
    keywords: "очистка фото айфон, удалить дубликаты фото, переводчик для путешествий, создать GIF на iPhone, трекер поездок, защита экрана Mac",
    ogTitle: "Приложения для iPhone и Mac в России",
    ogDescription: "Выберите приложение для фото, перевода, GIF, поездок или защиты экрана и проверьте его в российском App Store.",
    skip: "Перейти к содержанию",
    nav: ["Приложения", "Руководства", "Страны"],
    eyebrow: "Приложения в России",
    h1: "Очистка фото, перевод в поездках и полезные приложения для iPhone и Mac.",
    lead: "Здесь собраны шесть приложений для конкретных задач: разобрать медиатеку перед удалением, перевести речь или меню, защитить содержимое экрана Mac, сделать GIF и записать поездку. Все ссылки ведут в российский App Store или Mac App Store.",
    primary: "Открыть очистку фото",
    secondary: "Выбрать приложение",
    checked: "Данные App Store проверены",
    appsKicker: "Шесть приложений",
    appsTitle: "Сначала выберите задачу.",
    appsIntro: "Страница на русском языке не меняет возможности приложения. Перед установкой проверьте системные требования, языки интерфейса, цену и сведения о конфиденциальности в карточке App Store.",
    detailsLabel: "Подробнее",
    storeLabel: "App Store в России",
    products: {
      ai: ["AI Cleaning — очистка фото", "Для iPhone с iOS 16 и новее. Группирует фотографии по типам и показывает дубликаты, похожие снимки, скриншоты, размытые фото и крупные медиа для проверки перед удалением."],
      translator: ["Translation Specialist", "Для iPhone с iOS 17.4 и новее. Голосовой ввод, озвучивание перевода, распознавание текста камерой и режим непрерывного перевода помогают в аэропорту, отеле и ресторане."],
      privacy: ["Anti-spy screen", "Для Mac с macOS 13 и новее. Помогает скрывать выбранные приложения или области экрана во время презентации, работы в общем пространстве и демонстрации экрана."],
      privacyLite: ["Anti-spy screen Lite", "Бесплатная облегчённая версия для Mac с macOS 13 и новее. Подходит для знакомства с базовым сценарием защиты перед выбором полной версии."],
      gif: ["GIFmaker — GIF Studio", "Для iPhone с iOS 17 и новее. Преобразует видео и фото в GIF для сообщений, социальных сетей, инструкций и коротких демонстраций."],
      ride: ["HappyRide — трекер поездок", "Для iPhone с iOS 17 и новее. Автоматически формирует журнал поездок и помогает просматривать маршрут и сведения о заезде после завершения." ]
    },
    decisionKicker: "Подбор по задаче",
    decisionTitle: "Перейдите к подробному руководству.",
    decisionIntro: "Руководства на английском языке объясняют порядок действий, ограничения и проверки перед удалением или публикацией.",
    table: ["Задача", "Страница", "Что проверить"],
    decisions: [
      ["Разобрать фото по категориям", "ai-photo-classification.html", "Классификация фото с ИИ", "Обработка на устройстве и ручная проверка результата."],
      ["Найти дубликаты и похожие снимки", "duplicate-photo-cleaner-guide.html", "Проверка дубликатов", "Разница между точными копиями и похожими кадрами."],
      ["Перевести речь, меню или вывеску", "voice-camera-translator-guide.html", "Голосовой и камерный перевод", "Проверка нужной языковой пары до поездки."],
      ["Скрыть данные при демонстрации экрана", "screen-sharing-privacy-guide.html", "Защита демонстрации экрана", "Уведомления, выбранное окно и пробный звонок."],
      ["Сделать GIF из видео", "make-gif-on-iphone-guide.html", "GIF из видео на iPhone", "Обрезка, размер файла и качество экспорта."]
    ],
    languageKicker: "Язык интерфейса",
    languageTitle: "Язык страницы и язык приложения могут различаться.",
    languageIntro: "По данным Apple на дату проверки, AI Cleaning, Anti-spy screen и Anti-spy screen Lite включают русский язык. В списках языков Translation Specialist, GIFmaker и HappyRide русский интерфейс не указан.",
    languageItems: [
      ["Перевод русского текста", "Отсутствие русского интерфейса не обязательно означает отсутствие перевода на русский. Проверьте нужную языковую пару внутри Translation Specialist до важной поездки."],
      ["Актуальные сведения", "Apple может менять карточки приложений. Окончательными считаются языки, совместимость, цена и политика конфиденциальности, показанные в российском App Store перед загрузкой."]
    ],
    safetyKicker: "Перед действием",
    safetyTitle: "Проверяйте результат, который нельзя отменить.",
    safetyItems: [
      ["Перед удалением фото", "Проверьте синхронизацию iCloud, документы, чеки, удостоверения, отредактированные и семейные фотографии. Удаляйте только понятные вам элементы."],
      ["Перед важным переводом", "Имена, даты, суммы и адреса сверяйте с оригиналом. Медицинские, юридические, пограничные и аварийные сообщения подтверждайте у официального источника или переводчика."],
      ["Перед демонстрацией экрана", "Закройте личные чаты и письма, отключите лишние уведомления и выполните короткую пробную демонстрацию нужного окна или дисплея."],
      ["Перед публикацией GIF или маршрута", "Проверьте лица, номера документов, адреса и точки начала или окончания поездки, чтобы не раскрыть личные сведения."]
    ],
    faqKicker: "Частые вопросы",
    faqTitle: "Что проверить до установки.",
    faqs: [
      ["Какое приложение помогает очистить фотографии на iPhone?", "AI Cleaning группирует фото и показывает кандидатов на удаление, включая дубликаты, похожие кадры, скриншоты и крупные медиа. Пользователь сам просматривает и выбирает элементы."],
      ["Удаляет ли AI Cleaning фотографии автоматически?", "Нет. Приложение помогает найти и сгруппировать кандидатов, но решение об удалении принимает пользователь после просмотра."],
      ["Обрабатываются ли фотографии на устройстве?", "Классификация AI Cleaning рассчитана на обработку на iPhone. Проверяйте актуальные сведения о конфиденциальности в карточке App Store перед установкой."],
      ["Есть ли русская версия интерфейса у всех шести приложений?", "Нет. В карточках Apple русский язык указан для AI Cleaning и двух версий Anti-spy screen. Для остальных приложений проверяйте текущий список языков в App Store."],
      ["Можно ли полагаться на машинный перевод в медицинской или юридической ситуации?", "Нет. Для важных медицинских, юридических, пограничных и связанных с безопасностью сообщений нужен официальный источник или квалифицированный переводчик."],
      ["Как проверить, что приложение доступно в России?", "Откройте местную ссылку App Store на этой странице. Карточка Apple показывает текущую доступность, совместимость, цену, языки и сведения о конфиденциальности."]
    ],
    marketsKicker: "Другие страны и языки",
    marketsTitle: "Выберите ближайший рынок App Store.",
    marketsIntro: "Откройте региональную страницу, соответствующую стране вашей учётной записи Apple или предпочитаемому языку.",
    footer: ["Приложения", "Руководства", "Страны", "Поддержка", "Конфиденциальность"]
  },
  {
    file: "cs-cz.html",
    store: "cz",
    lang: "cs-CZ",
    ogLocale: "cs_CZ",
    country: "Česko",
    breadcrumb: "Česko",
    title: "Aplikace pro iPhone a Mac v Česku | CrazyAIAgent",
    description: "Český přehled aplikací pro úklid fotek na iPhonu, překlad na cestách, tvorbu GIFů, záznam jízd a ochranu obrazovky Macu s odkazy do českého App Storu.",
    keywords: "čištění fotek iphone, duplicitní fotky, překladač na cesty, tvorba GIF iPhone, záznam jízdy, ochrana obrazovky Mac",
    ogTitle: "Aplikace pro iPhone a Mac v Česku",
    ogDescription: "Vyberte nástroj pro fotky, překlad, GIF, jízdy nebo ochranu obrazovky a otevřete jej v českém App Storu.",
    skip: "Přejít na obsah",
    nav: ["Aplikace", "Návody", "Země"],
    eyebrow: "Aplikace v Česku",
    h1: "Úklid fotek, překlad na cestách a praktické aplikace pro iPhone a Mac.",
    lead: "Na jedné stránce najdete šest nástrojů pro konkrétní úkoly: kontrolu fotek před smazáním, překlad řeči a textu z fotoaparátu, ochranu obsahu na Macu, tvorbu GIFů a záznam jízd. Odkazy míří do českého App Storu nebo Mac App Storu.",
    primary: "Otevřít čistič fotek",
    secondary: "Vybrat aplikaci",
    checked: "Údaje z App Storu ověřeny",
    appsKicker: "Šest aplikací",
    appsTitle: "Začněte úkolem, který chcete dokončit.",
    appsIntro: "Čeština této stránky neznamená české rozhraní aplikace. Před instalací zkontrolujte požadavky na systém, jazyky, cenu a údaje o soukromí přímo v App Storu.",
    detailsLabel: "Podrobnosti",
    storeLabel: "Český App Store",
    products: {
      ai: ["AI Cleaning — čištění fotek", "Pro iPhone s iOS 16 nebo novějším. Třídí fotky podle typu a před smazáním ukazuje duplikáty, podobné snímky, screenshoty, rozmazané fotky a velká média."],
      translator: ["Translation Specialist", "Pro iPhone s iOS 17.4 nebo novějším. Hlasový vstup, přehrání překladu, překlad textu fotoaparátem a průběžné tlumočení pomáhají na letišti, v hotelu i restauraci."],
      privacy: ["Anti-spy screen", "Pro Mac s macOS 13 nebo novějším. Pomáhá zakrýt vybrané aplikace nebo části obrazovky při prezentaci, práci na veřejnosti a sdílení obrazovky."],
      privacyLite: ["Anti-spy screen Lite", "Bezplatná lehčí verze pro Mac s macOS 13 nebo novějším. Slouží k vyzkoušení základního způsobu ochrany před volbou plné verze."],
      gif: ["GIFmaker — GIF Studio", "Pro iPhone s iOS 17 nebo novějším. Vytváří GIFy z videí a fotek pro zprávy, sociální sítě, návody a krátké ukázky."],
      ride: ["HappyRide — automatický záznam jízd", "Pro iPhone s iOS 17 nebo novějším. Automaticky vytváří historii jízd a po dokončení umožňuje prohlédnout trasu a podrobnosti záznamu."]
    },
    decisionKicker: "Podle konkrétního úkolu",
    decisionTitle: "Otevřete podrobný postup.",
    decisionIntro: "Návody jsou v angličtině a popisují pracovní postup, omezení a kontrolu před smazáním nebo zveřejněním.",
    table: ["Úkol", "Stránka", "Co zkontrolovat"],
    decisions: [
      ["Roztřídit fotky podle obsahu", "ai-photo-classification.html", "Třídění fotek pomocí AI", "Zpracování v zařízení a ruční kontrola výsledků."],
      ["Najít duplikáty a podobné snímky", "duplicate-photo-cleaner-guide.html", "Kontrola duplicit", "Rozdíl mezi přesnou kopií a podobným záběrem."],
      ["Přeložit řeč, menu nebo ceduli", "voice-camera-translator-guide.html", "Hlasový a kamerový překlad", "Ověření potřebné jazykové dvojice před cestou."],
      ["Skrýt data při sdílení obrazovky", "screen-sharing-privacy-guide.html", "Ochrana při sdílení", "Oznámení, vybrané okno a zkušební hovor."],
      ["Vytvořit GIF z videa", "make-gif-on-iphone-guide.html", "GIF z videa na iPhonu", "Ořez, velikost souboru a kvalita exportu."]
    ],
    languageKicker: "Jazyk aplikací",
    languageTitle: "Česká stránka není příslib českého rozhraní.",
    languageIntro: "Ve veřejných údajích Apple nebyla k datu kontroly u žádné z těchto šesti aplikací uvedena čeština. Funkce lze používat v podporovaných jazycích, ale texty ovládání mohou být například v angličtině.",
    languageItems: [
      ["Překlad češtiny", "Jazyk rozhraní a podporované překladové jazyky jsou odlišné údaje. Po instalaci ověřte konkrétní jazykovou dvojici před důležitou cestou."],
      ["Aktuální zdroj", "Apple může seznam jazyků a kompatibilitu měnit. Rozhodující je aktuální záznam v českém App Storu při instalaci."]
    ],
    safetyKicker: "Před provedením změny",
    safetyTitle: "Výsledek vždy zkontrolujte.",
    safetyItems: [
      ["Před smazáním fotek", "Zkontrolujte synchronizaci iCloudu, dokumenty, účtenky, průkazy, upravené snímky a rodinné fotografie. Mažte jen položky, kterým rozumíte."],
      ["Před důležitým překladem", "Jména, data, částky a adresy porovnejte s originálem. Zdravotní, právní, hraniční a bezpečnostní sdělení ověřte u oficiálního zdroje nebo tlumočníka."],
      ["Před sdílením obrazovky", "Zavřete soukromé chaty a e-maily, ztlumte nepotřebná oznámení a vyzkoušejte sdílení správného okna nebo displeje."],
      ["Před publikováním GIFu nebo trasy", "Zkontrolujte obličeje, čísla dokladů, adresy a místa začátku či konce jízdy, aby nebyly zveřejněny soukromé údaje."]
    ],
    faqKicker: "Časté otázky",
    faqTitle: "Co vědět před instalací.",
    faqs: [
      ["Která aplikace pomáhá s úklidem fotek na iPhonu?", "AI Cleaning třídí fotografie a zobrazuje kandidáty ke smazání, například duplikáty, podobné záběry, screenshoty a velká média. Výběr potvrzuje uživatel."],
      ["Maže AI Cleaning fotografie automaticky?", "Ne. Aplikace pomáhá najít a seskupit kandidáty, ale uživatel je před smazáním prohlédne a sám vybere."],
      ["Probíhá analýza fotek v zařízení?", "Třídění v AI Cleaning je navrženo pro zpracování na iPhonu. Před instalací zkontrolujte aktuální údaje o soukromí v App Storu."],
      ["Mají všechny aplikace české rozhraní?", "Ne. Ve veřejných seznamech jazyků Apple není u těchto šesti aplikací čeština uvedena. Aktuální seznam ověřte v českém App Storu."],
      ["Lze strojový překlad použít pro zdravotní nebo právní rozhodnutí?", "Pro důležitá zdravotní, právní, hraniční a bezpečnostní sdělení použijte také oficiální zdroj nebo kvalifikovaného tlumočníka."],
      ["Jak zjistím dostupnost aplikace v Česku?", "Otevřete místní odkaz App Store na této stránce. Apple zobrazí aktuální dostupnost, kompatibilitu, cenu, jazyky a údaje o soukromí."]
    ],
    marketsKicker: "Další země a jazyky",
    marketsTitle: "Vyberte nejbližší trh App Storu.",
    marketsIntro: "Použijte stránku odpovídající zemi účtu Apple nebo upřednostňovanému jazyku.",
    footer: ["Aplikace", "Návody", "Země", "Podpora", "Soukromí"]
  },
  {
    file: "vi-vn.html",
    store: "vn",
    lang: "vi-VN",
    ogLocale: "vi_VN",
    country: "Việt Nam",
    breadcrumb: "Việt Nam",
    title: "Ứng dụng iPhone và Mac tại Việt Nam | CrazyAIAgent",
    description: "Ứng dụng dọn ảnh iPhone, dịch khi du lịch, tạo GIF, ghi hành trình và bảo vệ màn hình Mac với liên kết trực tiếp đến App Store Việt Nam.",
    keywords: "dọn ảnh iPhone, xóa ảnh trùng lặp, ứng dụng dịch du lịch, tạo GIF iPhone, ghi hành trình, bảo vệ màn hình Mac",
    ogTitle: "Ứng dụng iPhone và Mac tại Việt Nam",
    ogDescription: "Chọn công cụ cho ảnh, dịch thuật, GIF, hành trình hoặc bảo vệ màn hình và mở trong App Store Việt Nam.",
    skip: "Chuyển đến nội dung",
    nav: ["Ứng dụng", "Hướng dẫn", "Quốc gia"],
    eyebrow: "Ứng dụng tại Việt Nam",
    h1: "Dọn ảnh, dịch khi du lịch và các tiện ích thiết thực cho iPhone, Mac.",
    lead: "Trang này tập hợp sáu ứng dụng theo việc cần làm: xem lại ảnh trước khi xóa, dịch lời nói hoặc thực đơn, bảo vệ nội dung trên màn hình Mac, tạo GIF và ghi lại hành trình. Mỗi nút tải đều mở App Store hoặc Mac App Store Việt Nam.",
    primary: "Mở ứng dụng dọn ảnh",
    secondary: "Chọn ứng dụng",
    checked: "Đã kiểm tra dữ liệu App Store",
    appsKicker: "Sáu ứng dụng",
    appsTitle: "Bắt đầu từ việc bạn muốn hoàn thành.",
    appsIntro: "Ngôn ngữ của trang không quyết định ngôn ngữ giao diện ứng dụng. Trước khi tải, hãy kiểm tra yêu cầu hệ điều hành, ngôn ngữ, giá và nhãn quyền riêng tư trong App Store.",
    detailsLabel: "Xem chi tiết",
    storeLabel: "App Store Việt Nam",
    products: {
      ai: ["AI Cleaning — dọn ảnh", "Dành cho iPhone chạy iOS 16 trở lên. Phân loại ảnh và đưa ra ảnh trùng lặp, ảnh tương tự, ảnh chụp màn hình, ảnh mờ và tệp lớn để bạn xem trước khi xóa."],
      translator: ["Translation Specialist", "Dành cho iPhone chạy iOS 17.4 trở lên. Nhập bằng giọng nói, phát âm bản dịch, dịch chữ qua camera và phiên dịch liên tục cho sân bay, khách sạn, nhà hàng."],
      privacy: ["Anti-spy screen", "Dành cho Mac chạy macOS 13 trở lên. Hỗ trợ che ứng dụng hoặc vùng màn hình đã chọn khi thuyết trình, làm việc nơi công cộng và chia sẻ màn hình."],
      privacyLite: ["Anti-spy screen Lite", "Phiên bản nhẹ miễn phí cho Mac chạy macOS 13 trở lên. Phù hợp để thử quy trình bảo vệ cơ bản trước khi chọn bản đầy đủ."],
      gif: ["GIFmaker — GIF Studio", "Dành cho iPhone chạy iOS 17 trở lên. Tạo GIF từ video và ảnh cho tin nhắn, mạng xã hội, hướng dẫn và đoạn minh họa ngắn."],
      ride: ["HappyRide — ghi hành trình tự động", "Dành cho iPhone chạy iOS 17 trở lên. Tự động tạo lịch sử hành trình để bạn xem tuyến đường và thông tin chuyến đi sau khi hoàn tất."]
    },
    decisionKicker: "Chọn theo công việc",
    decisionTitle: "Mở hướng dẫn chi tiết.",
    decisionIntro: "Các hướng dẫn hiện bằng tiếng Anh, mô tả từng bước, giới hạn và những điểm cần kiểm tra trước khi xóa hoặc chia sẻ.",
    table: ["Việc cần làm", "Trang hướng dẫn", "Điểm cần kiểm tra"],
    decisions: [
      ["Phân loại ảnh theo nội dung", "ai-photo-classification.html", "Phân loại ảnh bằng AI", "Xử lý trên thiết bị và xem lại kết quả thủ công."],
      ["Tìm ảnh trùng và ảnh tương tự", "duplicate-photo-cleaner-guide.html", "Kiểm tra ảnh trùng lặp", "Phân biệt bản sao chính xác với khung hình tương tự."],
      ["Dịch lời nói, thực đơn hoặc biển báo", "voice-camera-translator-guide.html", "Dịch giọng nói và camera", "Thử cặp ngôn ngữ cần dùng trước chuyến đi."],
      ["Ẩn dữ liệu khi chia sẻ màn hình", "screen-sharing-privacy-guide.html", "Bảo vệ khi chia sẻ", "Thông báo, cửa sổ được chọn và cuộc gọi thử."],
      ["Tạo GIF từ video", "make-gif-on-iphone-guide.html", "Tạo GIF trên iPhone", "Cắt đoạn, dung lượng tệp và chất lượng xuất."]
    ],
    languageKicker: "Ngôn ngữ ứng dụng",
    languageTitle: "Trang tiếng Việt và giao diện ứng dụng có thể khác nhau.",
    languageIntro: "Theo dữ liệu công khai của Apple tại ngày kiểm tra, AI Cleaning có liệt kê tiếng Việt. Năm ứng dụng còn lại chưa liệt kê tiếng Việt trong danh sách ngôn ngữ giao diện.",
    languageItems: [
      ["Khả năng dịch tiếng Việt", "Ngôn ngữ giao diện và ngôn ngữ có thể dịch là hai thông tin khác nhau. Hãy thử đúng cặp ngôn ngữ cần dùng trong Translation Specialist trước chuyến đi quan trọng."],
      ["Thông tin mới nhất", "Apple có thể cập nhật ngôn ngữ và khả năng tương thích. Danh sách trong App Store Việt Nam tại thời điểm tải là nguồn quyết định."]
    ],
    safetyKicker: "Trước khi thực hiện",
    safetyTitle: "Luôn xem lại kết quả quan trọng.",
    safetyItems: [
      ["Trước khi xóa ảnh", "Kiểm tra đồng bộ iCloud, giấy tờ, hóa đơn, ảnh đã chỉnh sửa và ảnh gia đình. Chỉ xóa những mục bạn đã mở và hiểu rõ."],
      ["Trước bản dịch quan trọng", "Đối chiếu tên, ngày, số tiền và địa chỉ với bản gốc. Nội dung y tế, pháp lý, xuất nhập cảnh hoặc an toàn cần nguồn chính thức hay phiên dịch viên."],
      ["Trước khi chia sẻ màn hình", "Đóng tin nhắn và email riêng tư, tắt thông báo không cần thiết rồi thử chia sẻ đúng cửa sổ hoặc màn hình."],
      ["Trước khi đăng GIF hoặc tuyến đường", "Kiểm tra khuôn mặt, số giấy tờ, địa chỉ và điểm đầu hoặc cuối hành trình để tránh lộ thông tin riêng tư."]
    ],
    faqKicker: "Câu hỏi thường gặp",
    faqTitle: "Những điều cần biết trước khi tải.",
    faqs: [
      ["Ứng dụng nào hỗ trợ dọn ảnh trên iPhone?", "AI Cleaning phân loại ảnh và hiển thị các mục có thể xóa như ảnh trùng, ảnh tương tự, ảnh chụp màn hình và tệp lớn. Người dùng xem lại rồi tự chọn."],
      ["AI Cleaning có tự động xóa ảnh không?", "Không. Ứng dụng giúp tìm và nhóm các mục cần xem xét, còn người dùng quyết định ảnh nào sẽ xóa sau khi kiểm tra."],
      ["Ảnh có được phân tích trên thiết bị không?", "Tính năng phân loại của AI Cleaning được thiết kế để xử lý trên iPhone. Hãy kiểm tra nhãn quyền riêng tư mới nhất trong App Store trước khi cài."],
      ["Cả sáu ứng dụng đều có giao diện tiếng Việt không?", "Không. Trong danh sách ngôn ngữ công khai của Apple, AI Cleaning có tiếng Việt; năm ứng dụng còn lại chưa liệt kê tiếng Việt."],
      ["Có nên dùng bản dịch máy cho tình huống y tế hoặc pháp lý không?", "Với nội dung quan trọng về y tế, pháp lý, xuất nhập cảnh hoặc an toàn, hãy xác nhận thêm bằng nguồn chính thức hoặc phiên dịch viên đủ chuyên môn."],
      ["Làm sao kiểm tra ứng dụng có tại Việt Nam?", "Mở liên kết App Store Việt Nam trên trang này. Apple sẽ hiển thị tình trạng phát hành, khả năng tương thích, giá, ngôn ngữ và nhãn quyền riêng tư hiện tại."]
    ],
    marketsKicker: "Quốc gia và ngôn ngữ khác",
    marketsTitle: "Chọn thị trường App Store gần nhất.",
    marketsIntro: "Hãy dùng trang phù hợp với quốc gia của tài khoản Apple hoặc ngôn ngữ bạn muốn đọc.",
    footer: ["Ứng dụng", "Hướng dẫn", "Quốc gia", "Hỗ trợ", "Quyền riêng tư"]
  },
  ...priorityMarkets,
  ...latinAmericanMarkets
];

const regionalLinks = [
  ["United States", "us-apps.html"], ["United Kingdom", "uk-apps.html"],
  ["Deutschland", "de-de.html"], ["France", "fr-fr.html"], ["España", "es-es.html"],
  ["Italia", "it-it.html"], ["日本", "ja-jp.html"], ["한국", "ko-kr.html"],
  ["简体中文", "zh-cn.html"], ["Русский", "ru-ru.html"], ["Čeština", "cs-cz.html"], ["Tiếng Việt", "vi-vn.html"],
  ["Türkçe", "tr-tr.html"], ["Brasil", "pt-br.html"], ["México", "es-mx.html"]
];

const globalAlternates = [
  ["en", "/"], ["en-US", "/us-apps.html"], ["en-GB", "/uk-apps.html"],
  ["en-CA", "/canada-australia-apps.html"], ["en-AU", "/canada-australia-apps.html"],
  ["en-SG", "/singapore-apps.html"], ["en-CH", "/switzerland-apps.html"],
  ["en-NL", "/netherlands-nordics-apps.html"], ["en-SE", "/netherlands-nordics-apps.html"],
  ["en-DK", "/netherlands-nordics-apps.html"], ["en-NO", "/netherlands-nordics-apps.html"],
  ["en-FI", "/netherlands-nordics-apps.html"], ["de-DE", "/de-de.html"],
  ["fr-FR", "/fr-fr.html"], ["es-ES", "/es-es.html"], ["it-IT", "/it-it.html"],
  ["ko-KR", "/ko-kr.html"], ["ja-JP", "/ja-jp.html"], ["ru-RU", "/ru-ru.html"],
  ["cs-CZ", "/cs-cz.html"], ["vi-VN", "/vi-vn.html"], ["tr-TR", "/tr-tr.html"],
  ["pt-BR", "/pt-br.html"], ["es-MX", "/es-mx.html"], ["zh-CN", "/zh-cn.html"],
  ["zh-Hant", "/zh-hant.html"], ["zh-TW", "/zh-hant.html"], ["zh-HK", "/zh-hant.html"],
  ["x-default", "/"]
];

const hreflangMarkup = globalAlternates
  .map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${origin}${href}">`)
  .join("");

const clusterFiles = [
  "index.html", "us-apps.html", "uk-apps.html", "canada-australia-apps.html",
  "singapore-apps.html", "switzerland-apps.html", "netherlands-nordics-apps.html",
  "de-de.html", "fr-fr.html", "es-es.html", "it-it.html", "ko-kr.html", "ja-jp.html",
  "ru-ru.html", "cs-cz.html", "vi-vn.html", "tr-tr.html", "pt-br.html", "es-mx.html",
  "zh-cn.html", "zh-hant.html"
];

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`;
}

function storeLink(market, key, label, className = "button button-secondary") {
  const product = productPages.find(([productKey]) => productKey === key);
  return `<a class="${className}" href="${stores[market.store][key]}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="${product[2]}" data-storefront="${product[3]}" data-store-country="${market.store}" aria-label="${escapeHtml(label)} (${escapeHtml(market.newTab ?? "opens in a new tab")})">${escapeHtml(label)}</a>`;
}

function productCards(market) {
  return productPages.map(([key, defaultPage]) => {
    const page = market.productPageOverrides?.[key] ?? defaultPage;
    const [name, description] = market.products[key];
    const detailsLabel = market.detailLabels?.[key] ?? market.detailsLabel;
    const extraLinks = (market.extraProductLinks?.[key] ?? [])
      .map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`)
      .join("");
    return `<article class="market-product"><div><p class="market-product-label">${key === "privacy" || key === "privacyLite" ? "Mac" : "iPhone"}</p><h3>${escapeHtml(name)}</h3><p>${escapeHtml(description)}</p></div><div class="market-product-actions"><a href="${page}">${escapeHtml(detailsLabel)}</a>${extraLinks}${storeLink(market, key, market.storeLabel, "store-link")}</div></article>`;
  }).join("");
}

function tableRows(market) {
  return market.decisions.map(([task, href, label, check]) => `<div role="row"><span role="cell">${escapeHtml(task)}</span><span role="cell"><a href="${href}">${escapeHtml(label)}</a></span><span role="cell">${escapeHtml(check)}</span></div>`).join("");
}

function pairList(items) {
  return items.map(([title, text]) => `<div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>`).join("");
}

function faqSection(market) {
  return market.faqs.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("");
}

function updateRegionsPage(html) {
  const newCards = [
    ["ru-ru.html", "Russian", "Russian page for iPhone and Mac utility app discovery."],
    ["cs-cz.html", "Czech", "Czech page for iPhone and Mac utility app discovery."],
    ["vi-vn.html", "Vietnamese", "Vietnamese page for iPhone and Mac utility app discovery."],
    ["tr-tr.html", "Turkish", "Turkish page for iPhone and Mac utility app discovery."],
    ["pt-br.html", "Brazilian Portuguese", "Brazilian Portuguese page for iPhone and Mac utility app discovery."],
    ["es-mx.html", "Mexican Spanish", "Mexican Spanish page for iPhone and Mac utility app discovery."]
  ];
  let updated = html;

  const missingCards = newCards.filter(([href]) => !updated.includes(`href="${href}"`));
  if (missingCards.length > 0) {
    const cards = missingCards.map(([href, label, description]) => `<a class="region-card" href="${href}"><span>${label}</span><strong>${description}</strong></a>`).join("");
    updated = updated.replace(/(<a class="region-card" href="tr-tr\.html">[\s\S]*?<\/a>)/i, `$1${cards}`);
  }

  updated = updated.replace(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi, (block, body) => {
    try {
      const data = JSON.parse(body);
      const nodes = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
      const collection = nodes.find((node) => node?.["@type"] === "CollectionPage");
      const list = nodes.find((node) => node?.["@type"] === "ItemList");
      if (!collection || !list) return block;

      collection.description = "A market and localized page index for CrazyAIAgent app discovery in English, Chinese, Japanese, Korean, Russian, Czech, Vietnamese, Turkish, Brazilian Portuguese, Mexican Spanish, and major European languages.";
      collection.about = [
        "English App Store utility markets", "Chinese, Japanese, and Korean app pages",
        "Russian, Czech, Vietnamese, and Turkish app pages", "German, French, Spanish, and Italian app pages",
        "Brazilian Portuguese and Mexican Spanish app pages"
      ];
      const existing = (list.itemListElement ?? []).filter((item) => !newCards.some(([href]) => String(item.item).endsWith(`/${href}`)));
      list.itemListElement = [
        ...existing,
        ...newCards.map(([href, label], index) => ({
          "@type": "ListItem", position: existing.length + index + 1,
          name: `${label} App Page`, item: `${origin}/${href}`
        }))
      ];
      list.itemListElement.forEach((item, index) => { item.position = index + 1; });
      list.numberOfItems = list.itemListElement.length;
      return jsonLd(data);
    } catch {
      return block;
    }
  });

  return updated;
}

function render(market) {
  const url = `${origin}/${market.file}`;
  const webpage = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#page`,
    name: market.ogTitle, url, inLanguage: market.lang, dateModified: updatedDate,
    about: Object.values(market.products).map(([name]) => name),
    isPartOf: { "@id": `${origin}/#website` }, publisher: { "@id": `${origin}/#publisher` }, author: { "@id": `${origin}/#developer` }
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, name: market.breadcrumb,
    numberOfItems: 3, itemListElement: [
      { "@type": "ListItem", position: 1, name: "CrazyAIAgent", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Regions", item: `${origin}/regions.html` },
      { "@type": "ListItem", position: 3, name: market.breadcrumb, item: url }
    ]
  };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: market.lang, mainEntity: market.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };

  return `<!doctype html><html lang="${market.lang}"><head><meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests"><link rel="preconnect" href="https://www.googletagmanager.com"><link rel="preconnect" href="https://apps.apple.com"><script src="analytics.js?v=0bee63cd1708"></script><script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-JY8T5JJGNH"></script><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(market.title)}</title><meta name="description" content="${escapeHtml(market.description)}"><meta name="keywords" content="${escapeHtml(market.keywords)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#111827"><link rel="canonical" href="${url}"><link rel="alternate" type="application/rss+xml" title="CrazyAIAgent RSS" href="${origin}/feed.xml"><link rel="alternate" type="application/atom+xml" title="CrazyAIAgent Atom" href="${origin}/atom.xml">${hreflangMarkup}<meta property="og:type" content="website"><meta property="og:locale" content="${market.ogLocale}"><meta property="og:url" content="${url}"><meta property="og:title" content="${escapeHtml(market.ogTitle)}"><meta property="og:site_name" content="CrazyAIAgent"><meta property="og:description" content="${escapeHtml(market.ogDescription)}"><meta property="og:image" content="${origin}/assets/og-default.png"><meta property="og:image:secure_url" content="${origin}/assets/og-default.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(market.imageAlt ?? "CrazyAIAgent iPhone and Mac applications")}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(market.ogTitle)}"><meta name="twitter:description" content="${escapeHtml(market.ogDescription)}"><meta name="twitter:image" content="${origin}/assets/og-default.png"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="styles.css?v=${styleVersion}">${jsonLd(webpage)}${jsonLd(breadcrumb)}${jsonLd(faq)}</head><body class="local-market-page"><a class="skip-link" href="#main-content">${escapeHtml(market.skip)}</a><header class="site-header" data-elevate><nav class="nav" aria-label="Primary"><a class="brand" href="/" aria-label="CrazyAIAgent"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="apps.html">${escapeHtml(market.nav[0])}</a><a href="guides.html">${escapeHtml(market.nav[1])}</a><a href="regions.html">${escapeHtml(market.nav[2])}</a></div>${storeLink(market, "ai", "App Store", "nav-cta")}</nav></header><main class="page-main" id="main-content"><section class="page-hero local-market-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">CrazyAIAgent</a></li><li><a href="regions.html">${escapeHtml(market.nav[2])}</a></li><li aria-current="page">${escapeHtml(market.breadcrumb)}</li></ol></nav><p class="eyebrow">${escapeHtml(market.eyebrow)}</p><h1>${escapeHtml(market.h1)}</h1><p>${escapeHtml(market.lead)}</p><div class="hero-actions">${storeLink(market, "ai", market.primary, "button button-primary")}<a class="button button-secondary" href="#apps">${escapeHtml(market.secondary)}</a></div><p class="article-meta">${escapeHtml(market.checked)}: <time datetime="${updatedDate}">${updatedDate}</time></p></div><div class="local-market-visual"><picture><source srcset="assets/ai-cleaning-screen.webp" type="image/webp"><img src="assets/ai-cleaning-screen.png" width="331" height="720" alt="${escapeHtml(market.imageAlt ?? "AI Cleaning photo classification screen")}" fetchpriority="high" decoding="async"></picture></div></section><section class="section local-products" id="apps" data-local-search-market="${market.store}"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(market.appsKicker)}</p><h2>${escapeHtml(market.appsTitle)}</h2></div><p>${escapeHtml(market.appsIntro)}</p></div><div class="market-product-grid">${productCards(market)}</div></div></section><section class="section content-section alt-section" data-local-search-market="${market.store}-decisions"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(market.decisionKicker)}</p><h2>${escapeHtml(market.decisionTitle)}</h2></div><p>${escapeHtml(market.decisionIntro)}</p></div><div class="intent-table" role="table" aria-label="${escapeHtml(market.decisionTitle)}"><div class="intent-head" role="row"><span role="columnheader">${escapeHtml(market.table[0])}</span><span role="columnheader">${escapeHtml(market.table[1])}</span><span role="columnheader">${escapeHtml(market.table[2])}</span></div>${tableRows(market)}</div></div></section><section class="section content-section" data-local-search-market="${market.store}-language"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(market.languageKicker)}</p><h2>${escapeHtml(market.languageTitle)}</h2><p>${escapeHtml(market.languageIntro)}</p></div><div class="content-list">${pairList(market.languageItems)}</div></div></section><section class="section content-section alt-section" data-local-search-market="${market.store}-safety"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(market.safetyKicker)}</p><h2>${escapeHtml(market.safetyTitle)}</h2></div><div class="content-list">${pairList(market.safetyItems)}</div></div></section><section class="section faq" data-localized-faq="${market.store}"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(market.faqKicker)}</p><h2>${escapeHtml(market.faqTitle)}</h2></div></div><div class="faq-list">${faqSection(market)}</div></div></section><section class="section region-section alt-section"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${escapeHtml(market.marketsKicker)}</p><h2>${escapeHtml(market.marketsTitle)}</h2></div><p>${escapeHtml(market.marketsIntro)}</p></div><div class="region-grid">${regionalLinks.map(([label, href]) => `<a class="region-card" href="${href}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(label)}</strong></a>`).join("")}</div></div></section></main><footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="apps.html">${escapeHtml(market.footer[0])}</a> <a href="guides.html">${escapeHtml(market.footer[1])}</a> <a href="regions.html">${escapeHtml(market.footer[2])}</a> <a href="support.html">${escapeHtml(market.footer[3])}</a> <a href="privacy.html">${escapeHtml(market.footer[4])}</a></div></div></footer><script src="script.js?v=fda667de6672" defer></script></body></html>\n`;
}

export async function applyMarketPages({ marketStores = null, syncDiscovery = true } = {}) {
  const selectedMarkets = marketStores ? markets.filter((market) => marketStores.includes(market.store)) : markets;
  for (const market of selectedMarkets) {
    const filePath = path.join(siteDir, market.file);
    const updated = render(market);
    let current = "";
    try { current = await readFile(filePath, "utf8"); } catch {}
    if (current !== updated) await writeFile(filePath, updated, "utf8");
    console.log(`${current === updated ? "Verified" : "Updated"} ${market.file}`);
  }

  if (!syncDiscovery) return;
  const regionsPath = path.join(siteDir, "regions.html");
  const regionsCurrent = await readFile(regionsPath, "utf8");
  const regionsUpdated = updateRegionsPage(regionsCurrent);
  if (regionsUpdated !== regionsCurrent) await writeFile(regionsPath, regionsUpdated, "utf8");

  for (const fileName of clusterFiles) {
    const filePath = path.join(siteDir, fileName);
    const current = await readFile(filePath, "utf8");
    const updated = current.replace(/(?:<link\b(?=[^>]*rel=["']alternate["'])(?=[^>]*hreflang=)[^>]*>)+/i, hreflangMarkup);
    if (updated === current && !current.includes('hreflang="es-MX"')) {
      throw new Error(`Unable to synchronize hreflang links in ${fileName}`);
    }
    if (updated !== current) await writeFile(filePath, updated, "utf8");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await applyMarketPages();
}
