#!/usr/bin/env node

import { applyMarketPages } from "./apply-local-search-markets.mjs";

await applyMarketPages({ marketStores: ["jp"], syncDiscovery: false });
