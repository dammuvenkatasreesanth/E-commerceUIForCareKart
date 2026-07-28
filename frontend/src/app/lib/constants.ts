export const CATEGORIES = ["All", "Nitrile", "Latex", "Vinyl", "Masks", "Face Protection", "Hygiene", "PPE Kits", "Lab Coats"];
export const PACK_LABELS = ["Single Unit", "Box · 100 units", "Box · 500 units", "Pallet · 1000+"];
export const PACK_QTY = [1, 100, 500, 1000];

// Banner.bgGradient stores one of these preset KEYS, not a raw class string —
// see BannerCarousel.tsx's BANNER_GRADIENT_CLASSES for why. Add a preset here
// AND a matching entry there AND a --gradient-banner-<key>-{from,to} pair in
// theme.css to introduce a new option; change the hex values in theme.css to
// reskin an existing one.
export const BG_PRESETS = [
  { key: "royal", label: "Royal Blue" },
  { key: "teal", label: "Medical Teal" },
  { key: "purple", label: "Premium Purple" },
  { key: "orange", label: "Warm Orange" },
  { key: "navy", label: "Dark Navy" },
];
