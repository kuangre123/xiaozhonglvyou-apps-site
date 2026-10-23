// Apple Search API: US/FR/DE/JP/MY/SE/EG/IT/PL checked 2026-10-23.
// Version 1.4.2 release notes add six languages to the previously listed six.
export const happyrideRelease = {
  appId: "6786365305",
  version: "1.4.2",
  checkedDate: "2026-10-23",
  minimumIOS: "17.0",
  languages: ["Arabic", "English", "French", "German", "Italian", "Japanese", "Korean", "Malay", "Polish", "Simplified Chinese", "Swedish", "Traditional Chinese"],
  chineseLanguages: ["阿拉伯语", "英语", "法语", "德语", "意大利语", "日语", "韩语", "马来语", "波兰语", "简体中文", "瑞典语", "繁体中文"],
  source: "https://apps.apple.com/us/app/happyride-auto-ride-tracker/id6786365305"
};

export function happyrideCheckedDateLabel(locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(`${happyrideRelease.checkedDate}T00:00:00Z`));
}
