import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// One-off, idempotent fix for categories seeded before showOnHomepage/imageUrl
// existed on the model. Only touches Category rows. Safe to re-run.

const prisma = new PrismaClient();

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

async function main() {
  let updated = 0;
  for (const [name, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    const result = await prisma.category.updateMany({
      where: { name },
      data: { imageUrl, showOnHomepage: true },
    });
    updated += result.count;
  }
  console.log(`Fixed image/homepage flag for ${updated} categories`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
