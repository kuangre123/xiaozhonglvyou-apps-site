// Apple Search API and release notes checked in US/JP/DE/TR/MX/BR on 2026-10-15.
export const gifmakerRelease = {
  appId: "6783559364",
  version: "1.2.0",
  checkedDate: "2026-10-15",
  languages: ["English", "Simplified Chinese", "Traditional Chinese", "Japanese", "Korean", "German", "Spanish"]
};

export function gifmakerCheckedDateLabel(locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(`${gifmakerRelease.checkedDate}T00:00:00Z`));
}
