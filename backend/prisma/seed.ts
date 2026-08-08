import "dotenv/config";
import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { db, dbPool } from "../src/db";
import { banners, categories, coupons, packPriceTiers, productImages, productSizes, products, users } from "../src/db/schema";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function placeholderImage(seed: string, w = 800, h = 800): string {
  return `https://placehold.co/${w}x${h}?text=${encodeURIComponent(seed)}`;
}

// Real product photography bundled with the frontend at public/products/ (from
// the original Figma Make export) — served at whatever origin hosts the
// frontend, so these are frontend-relative paths, not backend URLs.
const PRODUCT_IMAGES: Record<string, string[]> = {
  "NitroShield Pro Nitrile Gloves": ["/products/nitrile-guard-pro-3.5g.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "LatexGuard Classic Surgical Gloves": ["/products/latex-shield-surgical-7.5g.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "VinylFlex Economy Gloves": ["/products/vinyl-care-examination-clear.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "N95 PureMask Respirator": ["/products/n95-respirator-pro-fit.png", "/products/face-masks.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "ClearView Face Shields": ["/products/face-masks.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "SaniSpritz Hand Sanitizer 500ml": ["/products/hygiene-guard-sanitizer-70ipa.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "FoodGuard Poly Gloves": ["/products/foodguard-poly-gloves.png", "/products/medical-grade-nitrile-gloves.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
  "ShieldPro PPE Complete Kit": ["/products/shieldpro-ppe-complete-kit.png", "/products/ppe-kits.png", "/products/medical-gloves.png", "/products/surgical-gloves.png"],
};

const PACK_LABELS = ["Single Unit", "Box · 100 units", "Box · 500 units", "Pallet · 1000+"];
const PACK_QTY = [1, 100, 500, 1000];

const CATEGORY_NAMES = ["Nitrile", "Latex", "Vinyl", "Masks", "Face Protection", "Hygiene", "PPE Kits", "Lab Coats"];

// Reuses the same real product photography already seeded for products —
// good enough as category-tile art until an admin uploads dedicated images.
const CATEGORY_IMAGES: Record<string, string> = {
  Nitrile: "/products/medical-grade-nitrile-gloves.png",
  Latex: "/products/surgical-gloves.png",
  Vinyl: "/products/vinyl-care-examination-clear.png",
  Masks: "/products/face-masks.png",
  "Face Protection": "/products/face-masks.png",
  Hygiene: "/products/sanitizers.png",
  "PPE Kits": "/products/ppe-kits.png",
  "Lab Coats": "/products/lab-coats.png",
};

interface SeedProduct {
  name: string;
  tagline: string;
  description: string;
  price: number;
  mrp: number;
  ratingAvg: number;
  ratingCount: number;
  category: string;
  badge: string;
  material: string;
  sizes: string[];
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  moq: number;
  packDiscounts: number[];
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "NitroShield Pro Nitrile Gloves",
    tagline: "Superior grip. Zero compromise.",
    description:
      "The NitroShield Pro is engineered for healthcare professionals who demand reliability. Made from 100% synthetic nitrile, these gloves offer excellent chemical resistance while maintaining superior tactile sensitivity. The textured fingertip design ensures a confident grip even in wet conditions, making them ideal for medical examinations, lab work, and industrial applications. Each glove undergoes rigorous AQL 1.5 testing to ensure a defect rate below 1.5%, meeting the strictest healthcare standards.",
    price: 499,
    mrp: 699,
    ratingAvg: 4.8,
    ratingCount: 2341,
    category: "Nitrile",
    badge: "Bestseller",
    material: "100% Nitrile",
    sizes: ["XS", "S", "M", "L", "XL"],
    features: ["Powder-free", "Textured fingertips", "AQL 1.5", "FDA approved", "Latex-free", "Ambidextrous"],
    specs: { Thickness: "3.5 mil", Length: "240 mm", Color: "Blue", Sterility: "Non-sterile", Standard: "EN 374, ASTM D6319" },
    inStock: true,
    moq: 1,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "LatexGuard Classic Surgical Gloves",
    tagline: "Trusted in 10,000+ clinics.",
    description:
      "LatexGuard Classic surgical gloves provide the tactile sensitivity required for delicate surgical procedures. Manufactured with natural rubber latex and featuring a beaded cuff for easy donning, these sterile gloves meet the highest international standards for surgical applications.",
    price: 329,
    mrp: 449,
    ratingAvg: 4.6,
    ratingCount: 1872,
    category: "Latex",
    badge: "Top Rated",
    material: "Natural Latex",
    sizes: ["XS", "S", "M", "L", "XL"],
    features: ["Sterile", "Beaded cuff", "AQL 0.65", "CE certified"],
    specs: { Thickness: "6.0 mil", Length: "280 mm", Color: "Cream", Sterility: "Sterile", Standard: "EN 455, ISO 11135" },
    inStock: true,
    moq: 50,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "VinylFlex Economy Gloves",
    tagline: "Cost-effective. Quality assured.",
    description:
      "VinylFlex Economy Gloves are the smart choice for food service, light-duty cleaning, and general-purpose applications where cost efficiency matters. Made from high-quality PVC with no latex proteins, they are safe for users with latex allergies.",
    price: 199,
    mrp: 279,
    ratingAvg: 4.3,
    ratingCount: 983,
    category: "Vinyl",
    badge: "",
    material: "PVC Vinyl",
    sizes: ["S", "M", "L", "XL"],
    features: ["Ambidextrous", "Smooth finish", "Food safe", "BPA-free"],
    specs: { Thickness: "2.8 mil", Length: "240 mm", Color: "Clear", Sterility: "Non-sterile", Standard: "EN 420, FDA 21 CFR" },
    inStock: true,
    moq: 100,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "N95 PureMask Respirator",
    tagline: "Hospital-grade. Every breath.",
    description:
      "The N95 PureMask Respirator provides 95% filtration efficiency against non-oil-based particles, offering hospital-grade protection in a comfortable, breathable design. The 5-layer construction and NIOSH approval make this the go-to respiratory protection for healthcare workers and industrial users alike.",
    price: 249,
    mrp: 349,
    ratingAvg: 4.9,
    ratingCount: 3210,
    category: "Masks",
    badge: "Bestseller",
    material: "Melt-blown PP",
    sizes: ["Universal"],
    features: ["≥95% filtration", "5-layer protection", "Soft inner lining", "NIOSH approved"],
    specs: { Filtration: "≥95%", Breathability: "≤35 mm H₂O", Color: "White", Type: "FFP2/N95", Standard: "NIOSH 42 CFR 84" },
    inStock: true,
    moq: 20,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "ClearView Face Shields",
    tagline: "360° protection, crystal clarity.",
    description:
      "ClearView Face Shields deliver full-face splash protection with optically clear polycarbonate visors. The adjustable headband fits all head sizes, and the anti-fog coating ensures unobstructed vision in high-humidity environments.",
    price: 649,
    mrp: 899,
    ratingAvg: 4.5,
    ratingCount: 412,
    category: "Face Protection",
    badge: "",
    material: "Polycarbonate",
    sizes: ["Universal"],
    features: ["Anti-fog coating", "Adjustable headband", "Lightweight", "Reusable"],
    specs: { Material: "Polycarbonate", Thickness: "0.8 mm", Coverage: "Full face", Weight: "145 g", Standard: "EN 166, ANSI Z87.1" },
    inStock: true,
    moq: 5,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "SaniSpritz Hand Sanitizer 500ml",
    tagline: "Kill 99.99% germs instantly.",
    description:
      "SaniSpritz Hand Sanitizer uses the WHO-recommended 70% isopropyl alcohol formula to eliminate 99.99% of common bacteria and viruses within 30 seconds. The fragrance-free, skin-conditioning formula is designed for frequent use without excessive drying.",
    price: 159,
    mrp: 219,
    ratingAvg: 4.4,
    ratingCount: 1543,
    category: "Hygiene",
    badge: "",
    material: "70% IPA",
    sizes: ["500ml", "1L", "5L"],
    features: ["WHO formula", "No-rinse", "Fragrance-free", "Tested EN 1500"],
    specs: { Active: "70% IPA", "Kill Rate": "99.99%", "Contact Time": "30 sec", pH: "6.5–7.5", Standard: "EN 1500, EN 14476" },
    inStock: true,
    moq: 12,
    packDiscounts: [0, 8, 15, 22],
  },
  {
    name: "FoodGuard Poly Gloves",
    tagline: "Hygiene for every kitchen.",
    description:
      "FoodGuard Poly Gloves provide reliable barrier protection for food preparation and serving. Ultra-thin and ambidextrous, they allow natural hand movement while maintaining strict food-safety hygiene standards.",
    price: 89,
    mrp: 129,
    ratingAvg: 4.1,
    ratingCount: 764,
    category: "Hygiene",
    badge: "",
    material: "Polyethylene",
    sizes: ["S", "M", "L", "XL"],
    features: ["Food safe", "Ambidextrous", "Ultra-thin", "Disposable"],
    specs: { Material: "LDPE", Color: "Clear", Sterility: "Non-sterile", Usage: "Single use", Standard: "FDA 21 CFR" },
    inStock: true,
    moq: 200,
    packDiscounts: [0, 5, 12, 20],
  },
  {
    name: "ShieldPro PPE Complete Kit",
    tagline: "Full protection. One order.",
    description:
      "The ShieldPro PPE Complete Kit bundles everything a healthcare worker needs: N95 mask, nitrile gloves, face shield, disposable gown, and shoe covers. Packaged individually for sterility and convenience.",
    price: 1249,
    mrp: 1599,
    ratingAvg: 4.6,
    ratingCount: 287,
    category: "PPE Kits",
    badge: "New",
    material: "Multi-material",
    sizes: ["M", "L", "XL", "XXL"],
    features: ["5-in-1 kit", "Individually packed", "CE marked", "Hospital grade"],
    specs: { Contents: "5 items", "Gown Material": "SMS Non-woven", Glove: "Nitrile", Mask: "N95", Standard: "Type 5/6" },
    inStock: true,
    moq: 5,
    packDiscounts: [0, 5, 10, 18],
  },
];

const SEED_BANNERS = [
  {
    badge: "🚀 New Arrivals Weekly",
    headline: "Medical-Grade PPE.",
    subheadline: "Factory-Direct Prices.",
    subtext: "Trusted by 50,000+ hospitals, clinics & retailers across India. ISO 13485 certified.",
    ctaPrimaryText: "Shop Now",
    ctaPrimaryLink: "/listing",
    ctaSecondaryText: "Download Catalogue",
    bgGradient: "royal",
    imageUrl: "/products/nitrile-guard-pro-3.5g.png",
    sortOrder: 0,
  },
  {
    badge: "💰 Volume Savings",
    headline: "Save Up to 20%",
    subheadline: "On Bulk Orders.",
    subtext: "Tiered pricing automatically applied on every product — no codes, no registration needed.",
    ctaPrimaryText: "View Bulk Deals",
    ctaPrimaryLink: "/listing",
    ctaSecondaryText: "Learn More",
    bgGradient: "teal",
    imageUrl: "/products/n95-respirator-pro-fit.png",
    sortOrder: 1,
  },
  {
    badge: "✅ ISO 13485 Certified",
    headline: "Quality You Can",
    subheadline: "Trust With Lives.",
    subtext: "Every product tested to AQL 1.5 standards. CE marked. FDA listed. FSSAI approved.",
    ctaPrimaryText: "Our Products",
    ctaPrimaryLink: "/listing",
    ctaSecondaryText: "View Certifications",
    bgGradient: "purple",
    imageUrl: "/products/shieldpro-ppe-complete-kit.png",
    sortOrder: 2,
  },
];

async function seedAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL ?? "admin@carekart.local";
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.BOOTSTRAP_ADMIN_NAME ?? "CareKart Admin";

  if (process.env.NODE_ENV === "production" && password === "ChangeMe123!") {
    console.error(
      "Refusing to seed: BOOTSTRAP_ADMIN_PASSWORD is still the default value in production. Set a real password before seeding.",
    );
    process.exit(1);
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    console.log(`Bootstrap admin already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ email, name, passwordHash, role: "ADMIN", status: "ACTIVE", claimedAt: new Date(), updatedAt: new Date() });
  console.log(`Bootstrap admin created: ${email} / (password from BOOTSTRAP_ADMIN_PASSWORD)`);
}

async function seedCatalog() {
  const categoryBySlug = new Map<string, number>();

  for (const [index, name] of CATEGORY_NAMES.entries()) {
    const slug = slugify(name);
    let category = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
    if (!category) {
      const [{ id }] = await db
        .insert(categories)
        .values({ name, slug, sortOrder: index, imageUrl: CATEGORY_IMAGES[name], showOnHomepage: true, updatedAt: new Date() })
        .$returningId();
      category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
    }
    categoryBySlug.set(name, category!.id);
  }
  console.log(`Seeded ${categoryBySlug.size} categories`);

  let createdCount = 0;
  for (const p of SEED_PRODUCTS) {
    const slug = slugify(p.name);
    const existing = await db.query.products.findFirst({ where: eq(products.slug, slug) });
    if (existing) continue;

    const categoryId = categoryBySlug.get(p.category);
    if (!categoryId) throw new Error(`Unknown category "${p.category}" for product "${p.name}"`);

    await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(products)
        .values({
          slug,
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          categoryId,
          price: String(p.price),
          mrp: String(p.mrp),
          material: p.material,
          badge: p.badge || null,
          features: p.features,
          specs: p.specs,
          moq: p.moq,
          inStock: p.inStock,
          ratingAvg: String(p.ratingAvg),
          ratingCount: p.ratingCount,
          updatedAt: new Date(),
        })
        .$returningId();

      const images = PRODUCT_IMAGES[p.name] ?? [0, 1, 2, 3].map((i) => placeholderImage(`${p.name} ${i + 1}`));
      await tx.insert(productImages).values(images.map((url, i) => ({ productId: id, url, sortOrder: i })));
      await tx.insert(productSizes).values(p.sizes.map((size, i) => ({ productId: id, size, sortOrder: i })));
      await tx.insert(packPriceTiers).values(
        PACK_LABELS.map((label, i) => ({
          productId: id,
          tierIndex: i,
          label,
          packQty: PACK_QTY[i],
          discountPct: String(p.packDiscounts[i] ?? 0),
        })),
      );
    });
    createdCount += 1;
  }
  console.log(`Seeded ${createdCount} new products (${SEED_PRODUCTS.length - createdCount} already existed)`);

  const [{ value: bannerCount }] = await db.select({ value: count() }).from(banners);
  if (bannerCount === 0) {
    await db.insert(banners).values(SEED_BANNERS);
    console.log(`Seeded ${SEED_BANNERS.length} banners`);
  } else {
    console.log("Banners already seeded, skipping");
  }
}

async function seedCoupons() {
  const [{ value: couponCount }] = await db.select({ value: count() }).from(coupons);
  if (couponCount > 0) {
    console.log("Coupons already seeded, skipping");
    return;
  }
  await db.insert(coupons).values([
    { code: "WELCOME10", type: "PERCENT", value: "10", minOrderAmount: "0", isActive: true },
    { code: "FLAT100", type: "FLAT", value: "100", minOrderAmount: "500", isActive: true },
  ]);
  console.log("Seeded 2 coupons");
}

async function main() {
  await seedAdmin();
  await seedCatalog();
  await seedCoupons();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await dbPool.end();
  });
