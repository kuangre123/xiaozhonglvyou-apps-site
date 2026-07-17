# App Store optimization actions for GIFmaker and HappyRide

Last verified: 2026-07-18

This document separates public App Store facts from proposed metadata. Nothing below is represented as live until it is saved in App Store Connect and visible on the public product page.

Apple's current constraints used here:

- App name: no more than 30 characters.
- Subtitle: no more than 30 characters.
- Keywords: no more than 100 UTF-8 bytes; separate terms with commas and no spaces after commas.
- Promotional text: no more than 170 characters and does not affect search ranking.
- Search can use the app name, subtitle, keyword field, and company name, so the keyword field should not repeat those words.

Official references:

- https://developer.apple.com/help/app-store-connect/reference/app-information/app-information/
- https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information
- https://developer.apple.com/app-store/product-page/
- https://developer.apple.com/app-store/search/

## GIFmaker-Gif Studio

Current public facts: version 1.1.1, iOS 17.0+, free, Photo & Video, English + Simplified Chinese + Traditional Chinese. Public App Store subtitle: `GIF maker: photos & video`. The listing states that editing happens on device with no account and no uploads; the public privacy label says Data Not Collected.

### English (US)

| Field | Recommended value | Validation |
| --- | --- | --- |
| Name | `GIFmaker-Gif Studio` | 19 / 30 characters |
| Subtitle | `Photos, Video & Live Photos` | 27 / 30 characters |
| Keywords | `photos,video,live photo,animation,boomerang,meme,caption,frame editor,reverse,loop` | 82 / 100 bytes |
| Promotional text | `Create polished GIFs from photos, videos, or Live Photos—then tune every frame, add captions, and export up to 1080p without uploading your media.` | 146 / 170 characters |

Why: the app name already supplies `GIF`, `maker`, and `studio`, so the keyword field spends its limited bytes on inputs, editing controls, and use cases. The subtitle adds the three strongest source-media intents without repeating the title.

### Simplified Chinese

| Field | Recommended value | Validation |
| --- | --- | --- |
| Name | `GIFmaker-Gif Studio` | 19 / 30 characters |
| Subtitle | `照片视频转GIF与动图编辑` | 13 / 30 characters |
| Keywords | `照片,视频,实况照片,动图,表情包,倒放,回旋,逐帧,字幕,动画` | 78 / 100 bytes |
| Promotional text | `把照片、视频和 Live Photo 做成 GIF，逐帧调速、加文字、倒放或回旋循环；核心编辑完全在 iPhone 本机完成。` | Under 170 characters |

### Product-page screenshot order

1. `Photos, video, and Live Photos to GIF` — show the three input paths.
2. `Tune every frame` — show the filmstrip, per-frame timing, and live preview.
3. `Caption the moment` — show text color, size, and position controls.
4. `Reverse, loop, or boomerang` — show playback options.
5. `Fit every social format` — show 1:1, 4:3, 3:4, 16:9, and 9:16.
6. `On-device. No account. No uploads.` — use only while the product behavior and privacy label remain accurate.

### URLs to update

- Marketing URL: https://www.xiaozhonglvyou.com/gif-maker.html
- Support URL: https://www.xiaozhonglvyou.com/support.html#gifmaker
- Privacy Policy URL: https://www.xiaozhonglvyou.com/privacy.html#gifmaker

Replace the current public Developer Website (`https://kuangre123.github.io/gifmaker-site/`) with the product-specific canonical page above.

## HappyRide: Auto Ride Tracker

Current public facts: version 1.2, iOS 17.0+, free with an optional route-planning subscription, Health & Fitness / Sports, automatic cycling, walking, and running detection, Apple Watch heart rate, Apple Health workout records, and optional network-based route planning. The current on-screen interface is Simplified Chinese only.

### English (US)

| Field | Recommended value | Validation |
| --- | --- | --- |
| Name | `HappyRide: Auto Ride Tracker` | 28 / 30 characters |
| Subtitle | `Cycling, Walks & Runs` | 21 / 30 characters |
| Keywords | `cycling,bike,gps,apple watch,health,workout,route planner,scenic,walking,running` | 80 / 100 bytes |
| Promotional text | `Forget to tap Start? HappyRide detects cycling, walks, and runs, adds Apple Watch heart rate, and saves qualifying workouts to Apple Health.` | 140 / 170 characters |

Why: the name already supplies `auto`, `ride`, and `tracker`. The subtitle adds the other detected activity types, while the keyword field covers device integration, workout records, routing, and common cycling language.

Do not promote an English interface until it ships. The English product description and screenshots should say `Current interface: Simplified Chinese` near the top, not only in the final paragraph.

### Simplified Chinese

| Field | Recommended value | Validation |
| --- | --- | --- |
| Name | `HappyRide: Auto Ride Tracker` | 28 / 30 characters |
| Subtitle | `自动记录骑行步行与跑步` | 11 / 30 characters |
| Keywords | `自行车,骑行,运动,轨迹,定位,心率,手表,健康,路线,导航,跑步,步行` | 86 / 100 bytes |
| Promotional text | `忘记点开始也不怕：自动识别骑行、步行和跑步，结合 Apple Watch 心率，把符合条件的路线、卡路里和锻炼记录写入 Apple 健康。` | Under 170 characters |

### Product-page screenshot order

1. `忘记点开始，也能记录骑行` — show automatic detection and a completed ride.
2. `路线、心率、卡路里一次保存` — show ride details.
3. `连接 Apple Watch 与 Apple 健康` — show the authorized ecosystem workflow.
4. `每周骑了多少，一眼看清` — show weekly statistics.
5. `安静、风景、平衡或最短路线` — show the optional route styles and mark them as subscription features.
6. `核心记录支持离线` — distinguish offline tracking from network-dependent route planning.

### URLs to update

- Marketing URL: https://www.xiaozhonglvyou.com/happyride-auto-ride-tracker.html
- Support URL: https://www.xiaozhonglvyou.com/support.html#happyride
- Privacy Policy URL: https://www.xiaozhonglvyou.com/privacy.html#happyride

Replace the current generic homepage Marketing URL with the product-specific canonical page above.

## Submission and measurement order

1. Save the product-specific Marketing, Support, and Privacy URLs for every active localization.
2. Update subtitle, keywords, promotional text, and localized screenshots with the next editable version.
3. Confirm the public Developer Website and Privacy Policy links after Apple finishes propagating the metadata; Apple says display changes can take up to 24 hours.
4. Annotate the change date in App Store Connect analytics.
5. Compare product-page views, conversion rate, first-time downloads, keyword impressions, and retained users for at least two comparable weekly periods.
6. Test one high-impact element at a time. Start with screenshot order once each app has enough product-page traffic for a meaningful Product Page Optimization test.

### Website-to-App-Store conversion event

Every public App Store link now emits the GA4 event `app_store_click` with these parameters:

- `store_product`: one of the six stable product slugs, including `gifmaker-gif-studio` and `happyride-auto-ride-tracker`.
- `storefront`: `ios-app-store` or `mac-app-store`.
- `link_url`: the localized App Store destination.
- `link_text`: the visible CTA text.

Use this event to compare landing-page CTA demand before and after an ASO release. Treat it as an outbound-click metric, not an install or purchase: App Store Connect remains authoritative for product-page views, downloads, conversion rate, retention, and proceeds.

Avoid changing name, subtitle, keywords, and every screenshot concept simultaneously if the goal is to learn which change improved conversion. URL corrections can ship immediately because they fix attribution and authority rather than creative positioning.
