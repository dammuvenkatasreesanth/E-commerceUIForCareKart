// Generates dist/sitemap.xml from the live catalog after `vite build` — the
// frontend is a static SPA (no server-side rendering), so this is the only
// way to get real product/category URLs into a crawlable sitemap. Run again
// (rebuild + redeploy) whenever the catalog changes meaningfully; this isn't
// live-updating.
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://mycarekart.com";
const API_BASE_URL = process.env.SITEMAP_API_BASE_URL || "https://api.mycarekart.com/api/v1";
const DIST_DIR = path.resolve(import.meta.dirname, "../dist");

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  const limit = 100;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await fetch(`${API_BASE_URL}/catalog/products?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to fetch products page ${page}: ${res.status}`);
    const data = await res.json();
    products.push(...data.items);
    if (data.items.length < limit) break;
    page += 1;
  }
  return products;
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/catalog/categories`);
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

function urlEntry(loc, { changefreq = "weekly", priority = "0.5" } = {}) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Static informational pages — not catalog-driven, so they don't come from
// the API like products/categories do. Kept as a plain list here rather than
// fetched from /content/pages, since that endpoint has no "list all slugs"
// route and this list changes rarely enough not to need one.
const STATIC_PAGES = ["about-us", "privacy-policy", "terms-conditions", "shipping-delivery-policy", "cancellation-refund-policy"];

async function main() {
  const [products, categories] = await Promise.all([fetchAllProducts(), fetchCategories()]);

  const entries = [
    urlEntry(`${SITE_URL}/`, { changefreq: "daily", priority: "1.0" }),
    urlEntry(`${SITE_URL}/products`, { changefreq: "daily", priority: "0.9" }),
    ...STATIC_PAGES.map((slug) => urlEntry(`${SITE_URL}/${slug}`, { changefreq: "monthly", priority: "0.6" })),
    ...categories
      .filter((c) => c.isActive)
      .map((c) => urlEntry(`${SITE_URL}/products?category=${c.slug}`, { changefreq: "weekly", priority: "0.7" })),
    ...products
      .filter((p) => p.isActive)
      .map((p) => urlEntry(`${SITE_URL}/products/${p.slug}`, { changefreq: "weekly", priority: "0.8" })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml);
  console.log(`sitemap.xml written with ${products.length} products and ${categories.length} categories`);
}

main().catch((err) => {
  // Sitemap generation failing shouldn't fail the whole deploy — the site
  // still works fine without a fresh sitemap, just log it clearly.
  console.error("Sitemap generation failed (build continues):", err.message);
});
