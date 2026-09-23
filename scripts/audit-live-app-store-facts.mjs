#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredIds = new Set([
  "6768019606", "6755734543", "6761301764", "6766485393", "6783559364",
  "6786365305", "6775935474", "6810287923", "6800405096"
]);

export function publishedFacts(html) {
  const facts = new Map();
  const scripts = html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  for (const [, json] of scripts) {
    const parsed = JSON.parse(json);
    const nodes = parsed["@graph"] ?? [parsed];
    for (const node of nodes) {
      const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
      if (!types.includes("SoftwareApplication")) continue;
      const id = node.url?.match(/\/id(\d+)/)?.[1];
      if (!id) continue;
      if (facts.has(id)) throw new Error(`Duplicate homepage SoftwareApplication for App Store ID ${id}`);
      facts.set(id, {
        name: node.name,
        version: node.softwareVersion,
        price: Number(node.offers?.price),
        currency: node.offers?.priceCurrency
      });
    }
  }

  for (const id of requiredIds) {
    if (!facts.has(id)) throw new Error(`Missing homepage SoftwareApplication for App Store ID ${id}`);
  }
  return facts;
}

export function compareFacts(published, listings) {
  const issues = [];
  const listingsById = new Map(listings.map((listing) => [String(listing.trackId), listing]));

  for (const [id, fact] of published) {
    const listing = listingsById.get(id);
    if (!listing) {
      issues.push(`${fact.name}: missing from the US App Store lookup`);
      continue;
    }
    if (fact.version !== listing.version) {
      issues.push(`${fact.name}: site version ${fact.version ?? "missing"}, App Store ${listing.version}`);
    }
    if (!Number.isFinite(fact.price) || Math.abs(fact.price - listing.price) > 0.001 || fact.currency !== "USD") {
      issues.push(`${fact.name}: site offer ${fact.price} ${fact.currency ?? "missing"}, App Store ${listing.price} USD`);
    }
  }
  return issues;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const html = await readFile(path.join(siteDir, "index.html"), "utf8");
    const facts = publishedFacts(html);
    const query = new URLSearchParams({ id: [...facts.keys()].join(","), country: "us" });
    const response = await fetch(`https://itunes.apple.com/lookup?${query}`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`App Store lookup returned HTTP ${response.status}`);
    const payload = await response.json();
    const issues = compareFacts(facts, payload.results ?? []);
    if (issues.length) {
      console.error(`Live US App Store facts: DRIFT (${issues.length})`);
      for (const issue of issues) console.error(`- ${issue}`);
      process.exitCode = 1;
    } else {
      console.log(`Live US App Store facts: PASS (${facts.size} apps, versions and upfront prices)`);
    }
  } catch (error) {
    console.error(`Live US App Store facts: unavailable (${error.message})`);
    process.exitCode = 2;
  }
}
