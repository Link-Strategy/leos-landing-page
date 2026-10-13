// Builds public/wp-content/wp-legacy.min.css: the WordPress/Elementor CSS used by the (wp) routes, with every rule that
// no page uses removed, in the original order and with url()s made absolute.
//
//   node scripts/build-wp-css.mjs [baseUrl]      (default https://www.letrongroup.com)
//
// Content = the rendered HTML of every (wp) page. Re-run it after those pages change.
import fs from "node:fs";
import path from "node:path";
import { PurgeCSS } from "purgecss";

const base = (process.argv[2] || "https://www.letrongroup.com").replace(/\/$/, "");
const root = process.cwd();

const src = fs.readFileSync(path.join(root, "src/lib/wp-assets.ts"), "utf8");
const hrefs = [...src.matchAll(/"(\/wp-[^"]+)"/g)].map((m) => m[1]);

// Pages rendered with the legacy markup (keep in sync with app/[locale]/(wp)).
const pages = ["/tuyen-dung", "/cong-ty-thanh-vien"];
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = new URL(m[1]).pathname;
  if (p.startsWith("/tuyen-dung/") || p.startsWith("/san-pham/")) pages.push(p);
}
pages.push("/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh");
const unique = [...new Set(pages)];

const html = [];
for (const p of unique) {
  for (const prefix of ["", "/en"]) {
    const r = await fetch(base + prefix + p, { redirect: "follow", headers: { "Accept-Language": prefix ? "en" : "vi" } });
    if (r.ok) html.push(await r.text());
  }
}
console.log("content pages:", unique.length, "html docs:", html.length);

const abs = (css, fileHref) => {
  const dir = path.posix.dirname(fileHref.split("?")[0]);
  return css.replace(/url\(\s*(['"]?)(?!data:|https?:|\/\/|\/)([^'")]+)\1\s*\)/g, (_m, q, u) => `url(${q}${path.posix.normalize(path.posix.join(dir, u))}${q})`);
};

const safelist = {
  standard: ["animated", "elementor-invisible", "elementor-motion-effects-element", "e-active", "e-collapse", "e-open"],
  greedy: [/^fadeIn/, /^e-animation/, /^animated/, /^elementor-animation/, /^swiper/, /^elementor-swiper/],
};

let out = "";
let rawTotal = 0;
for (const href of hrefs) {
  const file = path.join(root, "public", href.split("?")[0]);
  // Elementor leaves template placeholders like `text-align:{{VALUE}};` in some files; browsers drop them and PurgeCSS cannot parse them.
  const css = fs.readFileSync(file, "utf8").replace(/[a-z-]+\s*:\s*\{\{[^}]*\}\}\s*;?/gi, "");
  rawTotal += css.length;
  const [res] = await new PurgeCSS().purge({
    content: html.map((h) => ({ raw: h, extension: "html" })),
    css: [{ raw: css }],
    safelist,
    keyframes: true,
    fontFace: true,
    variables: false,
  });
  out += `/* ${href.split("?")[0].replace(/^\/wp-content\//, "")} */\n` + abs(res.css, href) + "\n";
}

const dest = path.join(root, "public/wp-content/wp-legacy.min.css");
fs.writeFileSync(dest, out);
console.log("raw KB", Math.round(rawTotal / 1024), "-> purged KB", Math.round(out.length / 1024));
