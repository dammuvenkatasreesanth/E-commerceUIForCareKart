import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// One-off, idempotent fix for rows created by an earlier version of seed.ts
// that stored placehold.co product images and arbitrary-value Tailwind
// gradient strings (which Tailwind's JIT scanner can never generate CSS for,
// since they only exist as data, not as literal text in a scanned source
// file). Only touches Product/ProductImage/Banner rows — never orders, carts,
// users, or addresses. Safe to re-run.

const prisma = new PrismaClient();

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

const BANNER_FIXES: Record<string, { bgGradient: string; imageUrl: string }> = {
  "Medical-Grade PPE.": { bgGradient: "royal", imageUrl: "/products/nitrile-guard-pro-3.5g.png" },
  "Save Up to 20%": { bgGradient: "teal", imageUrl: "/products/n95-respirator-pro-fit.png" },
  "Quality You Can": { bgGradient: "purple", imageUrl: "/products/shieldpro-ppe-complete-kit.png" },
};

async function fixProductImages() {
  let updated = 0;
  for (const [name, images] of Object.entries(PRODUCT_IMAGES)) {
    const product = await prisma.product.findFirst({ where: { name } });
    if (!product) continue;

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: product.id } }),
      prisma.productImage.createMany({
        data: images.map((url, i) => ({ productId: product.id, url, sortOrder: i })),
      }),
    ]);
    updated++;
  }
  console.log(`Fixed images for ${updated} products`);
}

async function fixBanners() {
  let updated = 0;
  for (const [headline, fix] of Object.entries(BANNER_FIXES)) {
    const result = await prisma.banner.updateMany({
      where: { headline },
      data: { bgGradient: fix.bgGradient, imageUrl: fix.imageUrl },
    });
    updated += result.count;
  }
  console.log(`Fixed gradient/image for ${updated} banners`);
}

async function main() {
  await fixProductImages();
  await fixBanners();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
