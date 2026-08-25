import "dotenv/config";
import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { db, dbPool } from "../src/db";
import { banners, categories, contentPages, coupons, packPriceTiers, productImages, productSizes, products, users } from "../src/db/schema";

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

// Real legal/business copy supplied by the client (About Us, Cancellation &
// Refund Policy, Privacy Policy, Shipping & Delivery Policy, Terms &
// Conditions) — rendered via the existing ContentPage CMS + public
// GET /content/pages/:slug endpoint, which had no real data behind it before.
const H2 = "text-xl font-extrabold font-['Plus_Jakarta_Sans'] mt-8 mb-3 first:mt-0";
const H3 = "text-base font-bold mt-6 mb-2";
const P = "text-sm text-muted-foreground leading-relaxed mb-4";
const UL = "list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4";

const CONTACT_BLOCK = `
<div class="${P} not-prose">
  <p class="font-semibold text-foreground mb-1">Potent Brand Solutions Pvt. Ltd.</p>
  <p>SPSR Nellore, Andhra Pradesh, India – 524004</p>
  <p>Email: <a href="mailto:care@mycarekart.com" class="text-primary underline">care@mycarekart.com</a></p>
</div>`;

const CONTENT_PAGES: { slug: string; title: string; bodyHtml: string }[] = [
  {
    slug: "about-us",
    title: "About Us",
    bodyHtml: `
<p class="${P}">Potent Brand Solutions Pvt. Ltd. is a trusted provider of high-quality medical disposable and surgical devices under the brand name Carekart. We are committed to delivering reliable healthcare solutions to individuals and businesses across India, ensuring access to safe, effective, and affordable medical products.</p>
<p class="${P}">At Carekart, we understand that healthcare is not just a service—it's a responsibility. Our curated range of products is designed to meet the evolving needs of hospitals, clinics, and at-home care providers, combining innovation with compliance to the highest quality standards.</p>
<p class="${P}">Driven by a mission to improve everyday healthcare experiences, we aim to empower our customers with the tools they need for better care and faster recovery. From advanced surgical instruments to essential diagnostic tools, Carekart stands for performance, precision, and peace of mind.</p>
<p class="${P}">Partner with Potent Brand Solutions and discover a commitment to care that goes beyond products—because your well-being is our priority.</p>`,
  },
  {
    slug: "cancellation-refund-policy",
    title: "Cancellation & Refund Policy",
    bodyHtml: `
<p class="${P}">At Carekart, we aim to offer a smooth and transparent shopping experience. Please read our cancellation and refund terms carefully:</p>
<h3 class="${H3}">Order Cancellation</h3>
<ul class="${UL}">
  <li>You may cancel your order before it is dispatched. Once the order has been shipped, cancellation is no longer possible.</li>
  <li>To cancel an order, please contact us immediately at <a href="mailto:care@mycarekart.com" class="text-primary underline">care@mycarekart.com</a> / <a href="tel:+919035557875" class="text-primary underline">9035557875</a>.</li>
  <li>If your cancellation is approved, the refund will be processed within 5–7 business days to your original payment method.</li>
</ul>
<h3 class="${H3}">Refunds</h3>
<p class="${P}">Refunds are issued only under the following conditions:</p>
<ul class="${UL}">
  <li>Damaged or defective product received</li>
  <li>Incorrect item delivered</li>
  <li>Non-delivery of product (after courier verification)</li>
</ul>
<p class="${P}">To be eligible for a refund, please raise a request within 48 hours of delivery by emailing us with proof (photos/videos). Refunds may take 5–10 business days to reflect, depending on your bank or payment service provider.</p>
<h3 class="${H3}">Non-Refundable Items</h3>
<ul class="${UL}">
  <li>Used or opened medical/surgical products (due to hygiene and safety reasons)</li>
  <li>Products returned without original packaging, invoice, or seal</li>
</ul>`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    bodyHtml: `
<p class="text-xs text-muted-foreground mb-4"><strong>Effective Date:</strong> 29 June 2025</p>
<p class="${P}">Potent Brand Solutions Pvt. Ltd., operating under the brand name Carekart, is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website or purchase products from us.</p>
<h3 class="${H3}">1. Information We Collect</h3>
<p class="${P}">When you interact with our website, we may collect the following information:</p>
<ul class="${UL}">
  <li>Personal Information: Name, email address, phone number, billing and shipping addresses</li>
  <li>Payment Details: Processed securely via third-party payment gateways (we do not store card details)</li>
  <li>Order Information: Purchase history and transaction details</li>
  <li>Device Information: IP address, browser type, and browsing behavior through cookies or analytics tools</li>
</ul>
<h3 class="${H3}">2. How We Use Your Information</h3>
<p class="${P}">We use your information to:</p>
<ul class="${UL}">
  <li>Process and fulfill orders</li>
  <li>Communicate order status and delivery updates</li>
  <li>Respond to customer service requests</li>
  <li>Improve website functionality and user experience</li>
  <li>Send promotional offers (only if you opt-in)</li>
  <li>Ensure security and prevent fraudulent transactions</li>
</ul>
<h3 class="${H3}">3. Sharing of Information</h3>
<p class="${P}">We do not sell or rent your personal information. However, we may share data with trusted third parties necessary for:</p>
<ul class="${UL}">
  <li>Payment processing (e.g., Razorpay, Paytm)</li>
  <li>Order delivery and logistics</li>
  <li>Customer support tools</li>
  <li>Analytics and website performance tracking (e.g., Google Analytics)</li>
</ul>
<p class="${P}">These partners are obligated to handle your data securely and only for specified purposes.</p>
<h3 class="${H3}">4. Cookies and Tracking Technologies</h3>
<p class="${P}">Our website uses cookies and similar technologies to enhance user experience, remember preferences, and analyze site traffic. You may adjust your browser settings to block cookies, but some site features may not function correctly.</p>
<h3 class="${H3}">5. Data Security</h3>
<p class="${P}">We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, disclosure, or destruction.</p>
<h3 class="${H3}">6. Your Rights</h3>
<p class="${P}">You have the right to:</p>
<ul class="${UL}">
  <li>Access, correct, or delete your personal information</li>
  <li>Withdraw consent for marketing communications</li>
  <li>Request details about how your data is being used</li>
</ul>
<p class="${P}">You can exercise these rights by contacting us at <a href="mailto:care@mycarekart.com" class="text-primary underline">care@mycarekart.com</a>.</p>
<h3 class="${H3}">7. Children's Privacy</h3>
<p class="${P}">Our website is not intended for individuals under the age of 18. We do not knowingly collect data from minors.</p>
<h3 class="${H3}">8. Changes to This Policy</h3>
<p class="${P}">We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.</p>
<h3 class="${H3}">9. Contact Us</h3>
<p class="${P}">If you have questions or concerns about this Privacy Policy, please contact us at:</p>
${CONTACT_BLOCK}`,
  },
  {
    slug: "shipping-delivery-policy",
    title: "Shipping & Delivery Policy",
    bodyHtml: `
<p class="${P}">We are committed to delivering your products safely and on time.</p>
<h3 class="${H3}">Shipping Coverage</h3>
<p class="${P}">We currently ship across India through trusted logistics partners.</p>
<h3 class="${H3}">Dispatch Time</h3>
<ul class="${UL}">
  <li>Orders are typically dispatched within 1–3 business days from the date of confirmation.</li>
  <li>Some specialized products may take longer. This will be indicated on the product page.</li>
</ul>
<h3 class="${H3}">Estimated Delivery Time</h3>
<ul class="${UL}">
  <li>Delivery usually takes 3–7 business days depending on your location.</li>
  <li>Remote areas may experience slightly longer timelines.</li>
</ul>
<h3 class="${H3}">Tracking</h3>
<p class="${P}">Once shipped, you will receive a tracking ID via SMS/email to monitor your order status.</p>
<h3 class="${H3}">Shipping Charges</h3>
<ul class="${UL}">
  <li>We offer free shipping on most products unless specified.</li>
  <li>Any shipping fee (if applicable) will be displayed during checkout.</li>
</ul>
<h3 class="${H3}">Delays</h3>
<p class="${P}">We are not responsible for delivery delays caused by courier partners, natural disasters, public holidays, or other unforeseen circumstances. However, we will assist you in tracking and resolving the issue.</p>`,
  },
  {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    bodyHtml: `
<p class="text-xs text-muted-foreground mb-4"><strong>Effective Date:</strong> 29 June 2025</p>
<p class="${P}">Welcome to Carekart, owned and operated by Potent Brand Solutions Pvt. Ltd. These Terms & Conditions govern your access to and use of our website and services. By using our website or placing an order, you agree to be bound by these terms.</p>
<h3 class="${H3}">1. General</h3>
<p class="${P}">By accessing or using www.mycarekart.com (the "Site"), you agree to comply with and be legally bound by these Terms & Conditions, our Privacy Policy, and any other policies posted on the site. If you do not agree, please do not use the Site.</p>
<h3 class="${H3}">2. Products & Orders</h3>
<ul class="${UL}">
  <li>All products listed on the Site are subject to availability.</li>
  <li>We reserve the right to limit the quantity of items purchased and to cancel or refuse orders at our discretion.</li>
  <li>Prices are subject to change without notice. However, the price you pay is the price confirmed at checkout.</li>
  <li>Images and descriptions are for informational purposes only. While we strive for accuracy, we cannot guarantee that product images, specifications, or descriptions are 100% error-free.</li>
</ul>
<h3 class="${H3}">3. Payment</h3>
<p class="${P}">We accept secure online payments via trusted third-party gateways such as Razorpay, PhonePe, or others listed during checkout. Your payment details are processed securely and are not stored on our servers.</p>
<h3 class="${H3}">4. Shipping & Delivery</h3>
<ul class="${UL}">
  <li>Orders are shipped within the estimated dispatch time mentioned on each product page.</li>
  <li>Delivery timelines may vary based on your location, courier partners, and unforeseen circumstances.</li>
  <li>We are not liable for delays once the order has been handed over to the courier.</li>
</ul>
<h3 class="${H3}">5. Returns & Refunds</h3>
<p class="${P}">Please refer to our <a href="/cancellation-refund-policy" class="text-primary underline">Cancellation & Refund Policy</a> for details on how to return items and claim refunds or exchanges.</p>
<h3 class="${H3}">6. Intellectual Property</h3>
<p class="${P}">All content on the Site, including logos, images, text, graphics, product descriptions, and software, is the property of Potent Brand Solutions Pvt. Ltd. or its licensors and is protected by applicable copyright and trademark laws. Unauthorized use is prohibited.</p>
<h3 class="${H3}">7. User Conduct</h3>
<p class="${P}">You agree not to:</p>
<ul class="${UL}">
  <li>Use the website for unlawful purposes</li>
  <li>Attempt to gain unauthorized access to the website or its systems</li>
  <li>Post or transmit harmful, offensive, or misleading content</li>
  <li>Interfere with the security or functionality of the Site</li>
</ul>
<h3 class="${H3}">8. Limitation of Liability</h3>
<p class="${P}">To the maximum extent permitted by law, Potent Brand Solutions Pvt. Ltd. shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the Site or products purchased through it.</p>
<h3 class="${H3}">9. Governing Law</h3>
<p class="${P}">These Terms & Conditions shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the jurisdiction of courts in SPSR Nellore, Andhra Pradesh.</p>
<h3 class="${H3}">10. Changes to Terms</h3>
<p class="${P}">We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Changes will be effective immediately upon posting.</p>
<h3 class="${H3}">11. Contact Us</h3>
<p class="${P}">For any questions about these Terms, please contact us at:</p>
${CONTACT_BLOCK}`,
  },
];

async function seedContentPages() {
  let createdCount = 0;
  for (const page of CONTENT_PAGES) {
    const existing = await db.query.contentPages.findFirst({ where: eq(contentPages.slug, page.slug) });
    if (existing) continue;
    await db.insert(contentPages).values({ slug: page.slug, title: page.title, bodyHtml: page.bodyHtml, isPublished: true, updatedAt: new Date() });
    createdCount += 1;
  }
  console.log(`Seeded ${createdCount} new content pages (${CONTENT_PAGES.length - createdCount} already existed)`);
}

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
  await seedContentPages();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await dbPool.end();
  });
