import { malaysiaMarket } from "./market-malaysia-content.mjs";
import { egyptMarket } from "./market-egypt-content.mjs";
import { polandMarket } from "./market-poland-content.mjs";
import { portfolioMarketFacts } from "./portfolio-market-facts.mjs";

// Reuse verified storefront destinations; page language and app UI language
// are documented separately in each market's content.
const productIds = {
  ai: "6768019606", translator: "6755734543", privacy: "6761301764",
  privacyLite: "6766485393", gif: "6783559364", ride: "6786365305",
  inkstone: "6810287923", twopic: "6800405096", health: "6775935474"
};

export const nineCountryMarkets = [malaysiaMarket, egyptMarket, polandMarket];
export const nineCountryStores = Object.fromEntries(nineCountryMarkets.map(({ store }) => [
  store,
  Object.fromEntries(Object.entries(productIds).map(([key, id]) => {
    const url = portfolioMarketFacts.find((product) => product.id === id)?.storefrontUrls[store];
    if (!url) throw new Error(`Missing verified ${store} storefront for ${key}`);
    return [key, url];
  }))
]));
