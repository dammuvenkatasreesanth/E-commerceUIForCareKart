import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingCart, Search, User, Star, Shield, Truck, Package,
  CheckCircle, Phone, MapPin, Minus, Plus, Trash2,
  CreditCard, BarChart3, Clock, TrendingUp, Users,
  Check, Lock, ChevronRight, ChevronLeft, LogOut, Filter, Download,
  Eye, Heart, Zap, ShieldCheck, BadgeCheck, X, Award,
  LayoutDashboard, ArrowLeft, Building2, RefreshCw,
  IndianRupee, Edit2, Home, ThumbsUp, ThumbsDown,
  Play, Film, Image as ImageIcon, Trash2 as TrashIcon,
  FileText, UserCheck, Globe, Mail, Instagram, Twitter, Facebook,
  Tag, Settings, AlertTriangle, Bell, Percent, ChevronDown
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Logo } from "./components/Logo";
import img0618 from "@/imports/Document/0618c73c0fd5ca9c0a3cc2e20eb36fb8ebe5ff4e.png";
import img5f3d from "@/imports/Document/5f3d77342e755ac73a0887cb0cb4c3de54018121.png";
import img85e2 from "@/imports/Document/85e2fd11b1e1ec375e5b2b5d6212f268e89a2025.png";
import img695d from "@/imports/Document/695d5298535e7a1966d3f7b2b11d3faf582f12c3.png";
import img6f20 from "@/imports/Document/6f2069019bc727494435c7b930bf02bb4a72f0c8.png";
import img55bf from "@/imports/Document/55bfc50f33e0494ec26664921ec70ceb398979b3.png";
import img637b from "@/imports/Document/637b90dd7628417dbdbda1564328cd9a8e67ca42.png";
import img7e22 from "@/imports/Document/7e22642eb8994afae63bf913cc4e4a32e84d5361.png";
import img9c80 from "@/imports/Document/9c8029a01369b24b808ff1833eda68a4927b5127.png";
import img8b83 from "@/imports/Document/8b836f41a7bf66d2b4fbd0a52d9817683093a22d.png";
import imgcf1a from "@/imports/Document/cf1ab2b7c271c21c3be10293b49b1d6d0fb6b082.png";
import img88a7 from "@/imports/Document/88a75e38ac0aeaddacadf253ae243c0a6d38c746.png";
import img8dbf from "@/imports/Document/8dbf17c5b2871e68ce5601a2e83e4bd0689c0260.png";
import img1320 from "@/imports/Document/13209470330be70a964431d3769a15fef435f051.png";
import img2a17 from "@/imports/Document/2a17f545520ad6df9190a6a7f17d6152b074c035.png";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Page = "home" | "listing" | "detail" | "cart" | "checkout" | "confirmation" | "account" | "account-order" | "admin" | "login";
type AdminView = "dashboard" | "products" | "orders" | "order-detail" | "customers" | "customer-detail" | "marketing" | "content" | "settings" | "reports";

interface Product {
  id: number; name: string; tagline: string; description: string;
  price: number; mrp: number; rating: number; reviews: number;
  category: string; badge: string; material: string; sizes: string[];
  images: string[]; videoUrl: string; features: string[];
  specs: Record<string, string>; inStock: boolean; moq: number;
  packDiscounts: number[]; // [0, pct_100, pct_500, pct_1000]
}

interface CartItem extends Product { qty: number; selectedSize: string; packSize: number; packPrice: number; }

interface Banner {
  id: string; active: boolean; badge: string; headline: string; subheadline: string;
  subtext: string; ctaPrimary: string; ctaPrimaryLink: string;
  ctaSecondary: string; bg: string; imageUrl: string;
}

interface AppUser {
  phone: string; name: string; email: string; gstin: string;
  accountType: "retail" | "business"; joinedAt: string;
}

interface AdminOrder {
  id: string; customer: string; phone: string; email: string; date: string;
  total: number; payStatus: "paid" | "pending" | "failed" | "refunded";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  items: { name: string; qty: number; price: number; img: string }[];
  address: string; payMethod: string; notes: string[]; trackingId: string;
}

interface Coupon {
  id: string; code: string; type: "percent" | "flat"; value: number;
  minOrder: number; maxUses: number; usedCount: number; active: boolean; expiry: string;
}

// ─── Initial data ───────────────────────────────────────────────────────────────
const INIT_PRODUCTS: Product[] = [
  { id: 1, name: "NitroShield Pro Nitrile Gloves", tagline: "Superior grip. Zero compromise.", description: "The NitroShield Pro is engineered for healthcare professionals who demand reliability. Made from 100% synthetic nitrile, these gloves offer excellent chemical resistance while maintaining superior tactile sensitivity. The textured fingertip design ensures a confident grip even in wet conditions, making them ideal for medical examinations, lab work, and industrial applications. Each glove undergoes rigorous AQL 1.5 testing to ensure a defect rate below 1.5%, meeting the strictest healthcare standards.", price: 499, mrp: 699, rating: 4.8, reviews: 2341, category: "Nitrile", badge: "Bestseller", material: "100% Nitrile", sizes: ["XS","S","M","L","XL"], images: [img9c80, img0618, img5f3d, img85e2], videoUrl: "", features: ["Powder-free","Textured fingertips","AQL 1.5","FDA approved","Latex-free","Ambidextrous"], specs: { "Thickness": "3.5 mil", "Length": "240 mm", "Color": "Blue", "Sterility": "Non-sterile", "Standard": "EN 374, ASTM D6319" }, inStock: true, moq: 1, packDiscounts: [0, 5, 12, 20] },
  { id: 2, name: "LatexGuard Classic Surgical Gloves", tagline: "Trusted in 10,000+ clinics.", description: "LatexGuard Classic surgical gloves provide the tactile sensitivity required for delicate surgical procedures. Manufactured with natural rubber latex and featuring a beaded cuff for easy donning, these sterile gloves meet the highest international standards for surgical applications.", price: 329, mrp: 449, rating: 4.6, reviews: 1872, category: "Latex", badge: "Top Rated", material: "Natural Latex", sizes: ["XS","S","M","L","XL"], images: [img8b83, img0618, img5f3d, img85e2], videoUrl: "", features: ["Sterile","Beaded cuff","AQL 0.65","CE certified"], specs: { "Thickness": "6.0 mil", "Length": "280 mm", "Color": "Cream", "Sterility": "Sterile", "Standard": "EN 455, ISO 11135" }, inStock: true, moq: 50, packDiscounts: [0, 5, 12, 20] },
  { id: 3, name: "VinylFlex Economy Gloves", tagline: "Cost-effective. Quality assured.", description: "VinylFlex Economy Gloves are the smart choice for food service, light-duty cleaning, and general-purpose applications where cost efficiency matters. Made from high-quality PVC with no latex proteins, they are safe for users with latex allergies.", price: 199, mrp: 279, rating: 4.3, reviews: 983, category: "Vinyl", badge: "", material: "PVC Vinyl", sizes: ["S","M","L","XL"], images: [imgcf1a, img0618, img5f3d, img85e2], videoUrl: "", features: ["Ambidextrous","Smooth finish","Food safe","BPA-free"], specs: { "Thickness": "2.8 mil", "Length": "240 mm", "Color": "Clear", "Sterility": "Non-sterile", "Standard": "EN 420, FDA 21 CFR" }, inStock: true, moq: 100, packDiscounts: [0, 5, 12, 20] },
  { id: 4, name: "N95 PureMask Respirator", tagline: "Hospital-grade. Every breath.", description: "The N95 PureMask Respirator provides 95% filtration efficiency against non-oil-based particles, offering hospital-grade protection in a comfortable, breathable design. The 5-layer construction and NIOSH approval make this the go-to respiratory protection for healthcare workers and industrial users alike.", price: 249, mrp: 349, rating: 4.9, reviews: 3210, category: "Masks", badge: "Bestseller", material: "Melt-blown PP", sizes: ["Universal"], images: [img88a7, img695d, img5f3d, img85e2], videoUrl: "", features: ["≥95% filtration","5-layer protection","Soft inner lining","NIOSH approved"], specs: { "Filtration": "≥95%", "Breathability": "≤35 mm H₂O", "Color": "White", "Type": "FFP2/N95", "Standard": "NIOSH 42 CFR 84" }, inStock: true, moq: 20, packDiscounts: [0, 5, 12, 20] },
  { id: 5, name: "ClearView Face Shields", tagline: "360° protection, crystal clarity.", description: "ClearView Face Shields deliver full-face splash protection with optically clear polycarbonate visors. The adjustable headband fits all head sizes, and the anti-fog coating ensures unobstructed vision in high-humidity environments.", price: 649, mrp: 899, rating: 4.5, reviews: 412, category: "Face Protection", badge: "", material: "Polycarbonate", sizes: ["Universal"], images: [img695d, img0618, img5f3d, img85e2], videoUrl: "", features: ["Anti-fog coating","Adjustable headband","Lightweight","Reusable"], specs: { "Material": "Polycarbonate", "Thickness": "0.8 mm", "Coverage": "Full face", "Weight": "145 g", "Standard": "EN 166, ANSI Z87.1" }, inStock: true, moq: 5, packDiscounts: [0, 5, 12, 20] },
  { id: 6, name: "SaniSpritz Hand Sanitizer 500ml", tagline: "Kill 99.99% germs instantly.", description: "SaniSpritz Hand Sanitizer uses the WHO-recommended 70% isopropyl alcohol formula to eliminate 99.99% of common bacteria and viruses within 30 seconds. The fragrance-free, skin-conditioning formula is designed for frequent use without excessive drying.", price: 159, mrp: 219, rating: 4.4, reviews: 1543, category: "Hygiene", badge: "", material: "70% IPA", sizes: ["500ml","1L","5L"], images: [img8dbf, img0618, img5f3d, img85e2], videoUrl: "", features: ["WHO formula","No-rinse","Fragrance-free","Tested EN 1500"], specs: { "Active": "70% IPA", "Kill Rate": "99.99%", "Contact Time": "30 sec", "pH": "6.5–7.5", "Standard": "EN 1500, EN 14476" }, inStock: true, moq: 12, packDiscounts: [0, 8, 15, 22] },
  { id: 7, name: "FoodGuard Poly Gloves", tagline: "Hygiene for every kitchen.", description: "FoodGuard Poly Gloves provide reliable barrier protection for food preparation and serving. Ultra-thin and ambidextrous, they allow natural hand movement while maintaining strict food-safety hygiene standards.", price: 89, mrp: 129, rating: 4.1, reviews: 764, category: "Hygiene", badge: "", material: "Polyethylene", sizes: ["S","M","L","XL"], images: [img1320, img0618, img5f3d, img85e2], videoUrl: "", features: ["Food safe","Ambidextrous","Ultra-thin","Disposable"], specs: { "Material": "LDPE", "Color": "Clear", "Sterility": "Non-sterile", "Usage": "Single use", "Standard": "FDA 21 CFR" }, inStock: true, moq: 200, packDiscounts: [0, 5, 12, 20] },
  { id: 8, name: "ShieldPro PPE Complete Kit", tagline: "Full protection. One order.", description: "The ShieldPro PPE Complete Kit bundles everything a healthcare worker needs: N95 mask, nitrile gloves, face shield, disposable gown, and shoe covers. Packaged individually for sterility and convenience.", price: 1249, mrp: 1599, rating: 4.6, reviews: 287, category: "PPE Kits", badge: "New", material: "Multi-material", sizes: ["M","L","XL","XXL"], images: [img2a17, img6f20, img5f3d, img85e2], videoUrl: "", features: ["5-in-1 kit","Individually packed","CE marked","Hospital grade"], specs: { "Contents": "5 items", "Gown Material": "SMS Non-woven", "Glove": "Nitrile", "Mask": "N95", "Standard": "Type 5/6" }, inStock: true, moq: 5, packDiscounts: [0, 5, 10, 18] },
];

const INIT_BANNERS: Banner[] = [
  { id: "b1", active: true, badge: "🚀 New Arrivals Weekly", headline: "Medical-Grade PPE.", subheadline: "Factory-Direct Prices.", subtext: "Trusted by 50,000+ hospitals, clinics & retailers across India. ISO 13485 certified.", ctaPrimary: "Shop Now", ctaPrimaryLink: "listing", ctaSecondary: "Download Catalogue", bg: "from-[#1741B0] to-[#0d3999]", imageUrl: img9c80 },
  { id: "b2", active: true, badge: "💰 Volume Savings", headline: "Save Up to 20%", subheadline: "On Bulk Orders.", subtext: "Tiered pricing automatically applied on every product — no codes, no registration needed.", ctaPrimary: "View Bulk Deals", ctaPrimaryLink: "listing", ctaSecondary: "Learn More", bg: "from-[#0D9488] to-[#0f766e]", imageUrl: img88a7 },
  { id: "b3", active: true, badge: "✅ ISO 13485 Certified", headline: "Quality You Can", subheadline: "Trust With Lives.", subtext: "Every product tested to AQL 1.5 standards. CE marked. FDA listed. FSSAI approved.", ctaPrimary: "Our Products", ctaPrimaryLink: "listing", ctaSecondary: "View Certifications", bg: "from-[#7C3AED] to-[#4F46E5]", imageUrl: img2a17 },
];

const INIT_USERS: AppUser[] = [
  { phone: "9876543210", name: "Rahul Sharma", email: "rahul@medcare.in", gstin: "27AABCC1234M1Z5", accountType: "business", joinedAt: "2024-03-15" },
  { phone: "8765432109", name: "Dr. Priya Nair", email: "priya.nair@apollo.com", gstin: "", accountType: "retail", joinedAt: "2024-05-22" },
  { phone: "7654321098", name: "SafeGuard Dist.", email: "buy@safeguard.in", gstin: "29AABCS1234C1ZK", accountType: "business", joinedAt: "2024-07-01" },
  { phone: "6543210987", name: "Meena Iyer", email: "meena@thyrocare.com", gstin: "", accountType: "retail", joinedAt: "2024-08-10" },
];

const CATEGORIES = ["All","Nitrile","Latex","Vinyl","Masks","Face Protection","Hygiene","PPE Kits","Lab Coats"];
const PACK_LABELS = ["Single Unit", "Box · 100 units", "Box · 500 units", "Pallet · 1000+"];
const PACK_QTY = [1, 100, 500, 1000];
const PACK_TAGS = ["", "Popular", "Best Value", "Wholesale"];
const BG_PRESETS = [
  { label: "Royal Blue", value: "from-[#1741B0] to-[#0d3999]" },
  { label: "Medical Teal", value: "from-[#0D9488] to-[#0f766e]" },
  { label: "Premium Purple", value: "from-[#7C3AED] to-[#4F46E5]" },
  { label: "Warm Orange", value: "from-[#EA580C] to-[#DC2626]" },
  { label: "Dark Navy", value: "from-[#0f172a] to-[#1e293b]" },
];
const MOCK_REVIEWS = [
  { id: 1, name: "Dr. Priya Nair", role: "Surgeon, Apollo Hospitals", rating: 5, date: "12 Jun 2025", text: "These nitrile gloves are consistently the best we've used. No tearing, excellent grip even when wet, and the sizing is accurate. We order in pallets for our operation theatres.", helpful: 142 },
  { id: 2, name: "Rajesh Kumar", role: "Procurement, Max Healthcare", rating: 5, date: "3 Jun 2025", text: "CareKart's bulk pricing is genuinely the best I've found. Ordered 5,000 units and got the 20% discount automatically. Delivery was in 2 days.", helpful: 89 },
  { id: 3, name: "Meena Iyer", role: "Lab Manager, Thyrocare", rating: 4, date: "25 May 2025", text: "Good quality gloves. Slightly thicker than what I'm used to which is actually a plus for our chemistry lab. Only minor feedback would be that the packaging could be more compact.", helpful: 56 },
  { id: 4, name: "Suresh Patel", role: "Store Owner, MedPlus Franchise", rating: 5, date: "18 May 2025", text: "Buying for resale and my customers love these. The Bestseller tag is well deserved. Getting repeat orders from hospitals in our area.", helpful: 34 },
];
const MOCK_ORDERS = [
  { id: "CK20250701", date: "1 Jul 2025", items: [{ name: "NitroShield Pro Nitrile Gloves", qty: 2, img: img9c80, price: 998 }], total: 998, status: "Delivered", steps: [{ label: "Order Placed", time: "1 Jul, 9:00 AM", done: true }, { label: "Packed & Dispatched", time: "1 Jul, 2:30 PM", done: true }, { label: "Out for Delivery", time: "3 Jul, 10:15 AM", done: true }, { label: "Delivered", time: "3 Jul, 3:45 PM", done: true }] },
  { id: "CK20250615", date: "15 Jun 2025", items: [{ name: "N95 PureMask Respirator", qty: 5, img: img88a7, price: 1245 }], total: 1245, status: "In Transit", steps: [{ label: "Order Placed", time: "15 Jun, 11:20 AM", done: true }, { label: "Packed & Dispatched", time: "15 Jun, 4:00 PM", done: true }, { label: "Out for Delivery", time: "17 Jun, 9:30 AM", done: true }, { label: "Delivered", time: "Expected today", done: false }] },
  { id: "CK20250520", date: "20 May 2025", items: [{ name: "VinylFlex Economy Gloves", qty: 3, img: imgcf1a, price: 597 }], total: 915, status: "Delivered", steps: [{ label: "Order Placed", time: "20 May, 8:45 AM", done: true }, { label: "Packed & Dispatched", time: "20 May, 1:00 PM", done: true }, { label: "Out for Delivery", time: "22 May, 11:00 AM", done: true }, { label: "Delivered", time: "22 May, 2:10 PM", done: true }] },
];

const INIT_ORDERS: AdminOrder[] = [
  { id: "CK-2025-1001", customer: "Rahul Sharma", phone: "9876543210", email: "rahul@medcare.in", date: "2025-06-28", total: 12490, payStatus: "paid", status: "delivered", items: [{ name: "NitroShield Pro Nitrile Gloves", qty: 25, price: 499, img: img9c80 }], address: "12, MG Road, Andheri East, Mumbai 400069", payMethod: "UPI", notes: [], trackingId: "CKT982341" },
  { id: "CK-2025-1002", customer: "Dr. Priya Nair", phone: "8765432109", email: "priya.nair@apollo.com", date: "2025-06-30", total: 3249, payStatus: "paid", status: "shipped", items: [{ name: "N95 PureMask Respirator", qty: 13, price: 249, img: img88a7 }], address: "Apollo Hospital, Greams Road, Chennai 600006", payMethod: "Credit Card", notes: [], trackingId: "CKT982342" },
  { id: "CK-2025-1003", customer: "SafeGuard Dist.", phone: "7654321098", email: "buy@safeguard.in", date: "2025-07-01", total: 62450, payStatus: "paid", status: "processing", items: [{ name: "NitroShield Pro Nitrile Gloves", qty: 100, price: 499, img: img9c80 }, { name: "ShieldPro PPE Complete Kit", qty: 25, price: 1249, img: img2a17 }], address: "45, Industrial Area, Yeshwantpur, Bengaluru 560022", payMethod: "Bank Transfer", notes: ["Priority dispatch requested"], trackingId: "" },
  { id: "CK-2025-1004", customer: "Meena Iyer", phone: "6543210987", email: "meena@thyrocare.com", date: "2025-07-02", total: 795, payStatus: "pending", status: "pending", items: [{ name: "SaniSpritz Hand Sanitizer 500ml", qty: 5, price: 159, img: img8dbf }], address: "Thyrocare Technologies, Turbhe, Navi Mumbai 400703", payMethod: "UPI", notes: [], trackingId: "" },
  { id: "CK-2025-1005", customer: "Apollo Pharmacy", phone: "9111222333", email: "procurement@apollo.com", date: "2025-07-03", total: 32400, payStatus: "paid", status: "delivered", items: [{ name: "LatexGuard Classic Surgical Gloves", qty: 100, price: 329, img: img8b83 }], address: "Apollo Pharmacy HQ, Jubilee Hills, Hyderabad 500033", payMethod: "NEFT", notes: ["Bulk order — recurring monthly"], trackingId: "CKT982399" },
  { id: "CK-2025-1006", customer: "City Medical Store", phone: "9444555666", email: "orders@citymed.in", date: "2025-07-04", total: 1298, payStatus: "failed", status: "cancelled", items: [{ name: "ClearView Face Shields", qty: 2, price: 649, img: img695d }], address: "23, Linking Road, Bandra West, Mumbai 400050", payMethod: "Credit Card", notes: ["Payment failed — customer to retry"], trackingId: "" },
  { id: "CK-2025-1007", customer: "HealthFirst Clinics", phone: "9777888999", email: "supply@healthfirst.in", date: "2025-07-05", total: 24990, payStatus: "paid", status: "shipped", items: [{ name: "NitroShield Pro Nitrile Gloves", qty: 50, price: 499, img: img9c80 }], address: "HealthFirst, Koregaon Park, Pune 411001", payMethod: "UPI", notes: [], trackingId: "CKT982401" },
  { id: "CK-2025-1008", customer: "MedLine Distributors", phone: "9000111222", email: "orders@medline.co.in", date: "2025-07-06", total: 5950, payStatus: "refunded", status: "returned", items: [{ name: "VinylFlex Economy Gloves", qty: 30, price: 199, img: imgcf1a }, { name: "FoodGuard Poly Gloves", qty: 20, price: 89, img: img1320 }], address: "Plot 7, Sector 5, Salt Lake, Kolkata 700091", payMethod: "Credit Card", notes: ["Returned — wrong size ordered"], trackingId: "CKT982380" },
];

const INIT_COUPONS: Coupon[] = [
  { id: "c1", code: "NEWBIZ20", type: "percent", value: 20, minOrder: 5000, maxUses: 100, usedCount: 34, active: true, expiry: "2025-12-31" },
  { id: "c2", code: "FLAT500", type: "flat", value: 500, minOrder: 3000, maxUses: 200, usedCount: 87, active: true, expiry: "2025-09-30" },
  { id: "c3", code: "MEDPLUS10", type: "percent", value: 10, minOrder: 1000, maxUses: 500, usedCount: 223, active: false, expiry: "2025-06-30" },
  { id: "c4", code: "BULK15", type: "percent", value: 15, minOrder: 10000, maxUses: 50, usedCount: 12, active: true, expiry: "2025-12-31" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function Stars({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} className={`${small ? "w-3 h-3" : "w-4 h-4"} ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />)}
    </div>
  );
}

function validateGSTIN(g: string) { return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g.trim().toUpperCase()); }

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────────────
function MobileBottomNav({ page, setPage, cartCount, isLoggedIn }: { page: Page; setPage: (p: Page) => void; cartCount: number; isLoggedIn: boolean }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {([{ id: "home", icon: Home, label: "Home" }, { id: "listing", icon: Search, label: "Search" }, { id: "cart", icon: ShoppingCart, label: "Cart", count: cartCount }, { id: isLoggedIn ? "account" : "login", icon: User, label: "Account" }] as { id: Page; icon: React.FC<{ className?: string }>; label: string; count?: number }[]).map(item => {
          const isActive = page === item.id || (item.id === "account" && page === "account-order");
          return (
            <button key={String(item.id)} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {(item.count ?? 0) > 0 && <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{item.count}</span>}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────────
function Header({ cartCount, setPage, isLoggedIn, page }: { cartCount: number; setPage: (p: Page) => void; isLoggedIn: boolean; page: Page }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="bg-primary text-white text-center py-1.5 text-xs font-medium hidden sm:block">
        🚚 Free shipping above ₹2,000 &nbsp;|&nbsp; ISO 13485 Certified &nbsp;|&nbsp; Same-day dispatch before 3 PM
      </div>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <button onClick={() => setPage("home")} className="flex items-center flex-shrink-0">
          <Logo className="h-8" />
        </button>
        <div className="flex-1 mx-3 hidden md:block">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search gloves, masks, PPE kits…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-primary/30 focus:outline-none" /></div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setPage("cart")} className="relative p-2 hover:bg-muted rounded-xl hidden md:flex"><ShoppingCart className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</button>
          <button onClick={() => setPage(isLoggedIn ? "account" : "login")} className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"><User className="w-4 h-4" />{isLoggedIn ? "Account" : "Login"}</button>
          <button onClick={() => setPage("admin")} className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-border transition-colors"><LayoutDashboard className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="hidden md:block border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 overflow-x-auto py-2">
          {CATEGORIES.slice(1).map(c => <button key={c} onClick={() => setPage("listing")} className="text-muted-foreground hover:text-primary whitespace-nowrap font-medium transition-colors text-xs">{c}</button>)}
        </div>
      </div>
    </header>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, setPage, setDetailId, addToCart }: { product: Product; setPage: (p: Page) => void; setDetailId: (id: number) => void; addToCart: (p: Product, size: string) => void }) {
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  return (
    <div className="bg-white rounded-2xl border border-border hover:shadow-md transition-all cursor-pointer group overflow-hidden" onClick={() => { setDetailId(product.id); setPage("detail"); }}>
      <div className="relative overflow-hidden">
        <ImageWithFallback src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.badge && <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">{product.badge}</span>}
        {product.videoUrl && <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center"><Play className="w-3 h-3 text-primary fill-primary" /></div>}
        <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center" onClick={e => e.stopPropagation()}><Heart className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm leading-tight mb-1 truncate">{product.name}</p>
        <div className="flex items-center gap-1 mb-2"><Stars rating={product.rating} small /><span className="text-[10px] text-muted-foreground">({product.reviews.toLocaleString()})</span></div>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="font-extrabold text-base">₹{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{discount}% off</span>
        </div>
        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors" onClick={e => { e.stopPropagation(); addToCart(product, product.sizes[0]); }}>Add to Cart</button>
      </div>
    </div>
  );
}

// ─── Login Page (Phone → OTP → Registration) ──────────────────────────────────
function LoginPage({ onLogin, setPage, existingUsers, addUser }: {
  onLogin: (user: AppUser) => void; setPage: (p: Page) => void; existingUsers: AppUser[]; addUser: (u: AppUser) => void;
}) {
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(["","","","","",""]);
  const [timer, setTimer] = useState(0); const [name, setName] = useState("");
  const [email, setEmail] = useState(""); const [isRetailer, setIsRetailer] = useState(false);
  const [gstin, setGstin] = useState(""); const [gstinError, setGstinError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { if (timer > 0) { const t = setTimeout(() => setTimer(v => v - 1), 1000); return () => clearTimeout(t); } }, [timer]);

  const sendOtp = () => { if (phone.length !== 10) return; setStep("otp"); setTimer(30); setTimeout(() => otpRefs.current[0]?.focus(), 100); };

  const verifyOtp = () => {
    const existing = existingUsers.find(u => u.phone === phone);
    if (existing) { onLogin(existing); return; }
    setStep("register");
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) setTimeout(verifyOtp, 300);
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); };

  const handleRegister = () => {
    if (!name.trim()) return;
    if (isRetailer && gstin) {
      if (!validateGSTIN(gstin)) { setGstinError("Invalid GSTIN format. Please check and try again."); return; }
    }
    const user: AppUser = { phone, name: name.trim(), email: email.trim(), gstin: isRetailer && gstin ? gstin.toUpperCase() : "", accountType: isRetailer && gstin && validateGSTIN(gstin) ? "business" : "retail", joinedAt: new Date().toISOString().split("T")[0] };
    addUser(user); onLogin(user);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-20 md:pb-0">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Welcome to CareKart</h1>
          <p className="text-sm text-muted-foreground">India's trusted PPE marketplace</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          {step === "phone" && <>
            <h2 className="font-bold text-lg mb-1">Login / Sign Up</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter your mobile number to continue</p>
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-1 px-3 py-2.5 bg-muted rounded-xl border border-border text-sm font-semibold text-muted-foreground flex-shrink-0"><span>🇮🇳</span><span>+91</span></div>
              <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && sendOtp()} placeholder="98765 43210" className="flex-1 px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <button onClick={sendOtp} disabled={phone.length !== 10} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">Send OTP</button>
          </>}

          {step === "otp" && <>
            <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Change number</button>
            <h2 className="font-bold text-lg mb-1">Verify OTP</h2>
            <p className="text-sm text-muted-foreground mb-4">Sent to <span className="font-semibold text-foreground">+91 {phone}</span></p>
            <div className="flex gap-2 justify-between mb-4">
              {otp.map((d, i) => <input key={i} ref={el => { otpRefs.current[i] = el; }} type="tel" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(i, e)} className="w-11 h-12 text-center text-lg font-bold bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:outline-none transition-colors" />)}
            </div>
            <button onClick={verifyOtp} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90">Verify & Continue</button>
            <div className="text-center mt-3">{timer > 0 ? <p className="text-xs text-muted-foreground">Resend in <span className="font-bold">{timer}s</span></p> : <button onClick={() => { setOtp(["","","","","",""]); setTimer(30); }} className="text-xs text-primary font-semibold">Resend OTP</button>}</div>
          </>}

          {step === "register" && <>
            <h2 className="font-bold text-lg mb-1">Complete Your Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">Tell us a bit about yourself</p>
            <div className="space-y-3 mb-4">
              <div><label className="block text-xs font-semibold mb-1">Full Name <span className="text-destructive">*</span></label><input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Email (optional)</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isRetailer ? "border-primary bg-primary/5" : "border-border"}`}>
                <input type="checkbox" checked={isRetailer} onChange={e => setIsRetailer(e.target.checked)} className="w-4 h-4 accent-primary" />
                <div><p className="font-semibold text-sm">I'm purchasing for a registered business</p><p className="text-xs text-muted-foreground">Get GST invoices &amp; B2B bulk pricing</p></div>
              </label>
              {isRetailer && <div>
                <label className="block text-xs font-semibold mb-1">GSTIN</label>
                <input value={gstin} onChange={e => { setGstin(e.target.value.toUpperCase()); setGstinError(""); }} placeholder="27AABCC1234M1Z5" maxLength={15} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
                {gstinError && <p className="text-xs text-destructive mt-1">{gstinError}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">15-character GST identification number. Leave blank if unavailable.</p>
              </div>}
            </div>
            <button onClick={handleRegister} disabled={!name.trim()} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40">Create Account &amp; Continue</button>
          </>}
        </div>
        <div className="flex justify-center gap-8 mt-5">
          {[{ icon: ShieldCheck, label: "ISO Certified" }, { icon: Truck, label: "Pan-India" }, { icon: Award, label: "FSSAI" }].map(t => <div key={t.label} className="flex flex-col items-center gap-1"><t.icon className="w-5 h-5 text-primary" /><span className="text-[10px] text-muted-foreground font-medium">{t.label}</span></div>)}
        </div>
      </div>
    </div>
  );
}

// ─── Banner Carousel ───────────────────────────────────────────────────────────
function BannerCarousel({ banners, setPage }: { banners: Banner[]; setPage: (p: Page) => void }) {
  const active = banners.filter(b => b.active);
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (active.length < 2) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % active.length), 4500);
  }, [active.length]);

  useEffect(() => { start(); return () => { if (timer.current) clearInterval(timer.current); }; }, [start]);

  const go = (n: number) => { setIdx(n); if (timer.current) clearInterval(timer.current); start(); };

  if (active.length === 0) return null;
  const b = active[idx];

  return (
    <div className="relative rounded-3xl overflow-hidden my-4 md:my-6 min-h-[260px] md:min-h-[320px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${b.bg} transition-all duration-700`} />
      <div className="relative z-10 flex items-center min-h-[260px] md:min-h-[320px]">
        <div className="flex-1 px-6 py-8 md:py-10 md:px-12">
          {b.badge && <span className="inline-flex items-center px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs font-semibold text-white mb-4">{b.badge}</span>}
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] text-white mb-1">
            {b.headline}
          </h1>
          {b.subheadline && <h2 className="text-2xl md:text-4xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] text-white/80 mb-3">{b.subheadline}</h2>}
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">{b.subtext}</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setPage(b.ctaPrimaryLink as Page)} className="px-5 py-2.5 bg-white text-primary font-bold rounded-xl text-sm hover:bg-opacity-90 transition-colors">{b.ctaPrimary}</button>
            {b.ctaSecondary && <button className="px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl text-sm hover:bg-white/20 transition-colors">{b.ctaSecondary}</button>}
          </div>
        </div>
        {b.imageUrl && <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-64 md:w-96"><img src={b.imageUrl as string} alt="" className="w-full h-full object-cover opacity-25 md:opacity-35" /></div>}
      </div>

      {/* Dots */}
      {active.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {active.map((_, i) => <button key={i} onClick={() => go(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white w-5" : "bg-white/40"}`} />)}
        </div>
      )}

      {/* Arrows */}
      {active.length > 1 && <>
        <button onClick={() => go((idx - 1 + active.length) % active.length)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => go((idx + 1) % active.length)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"><ChevronRight className="w-4 h-4" /></button>
      </>}
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ products, setPage, setDetailId, addToCart, banners }: {
  products: Product[]; setPage: (p: Page) => void; setDetailId: (id: number) => void; addToCart: (p: Product, size: string) => void; banners: Banner[];
}) {
  const cats = [
    { name: "Medical Gloves", img: img0618 }, { name: "Surgical Gloves", img: img85e2 },
    { name: "Face Masks", img: img695d }, { name: "PPE Kits", img: img6f20 },
    { name: "Sanitizers", img: img55bf }, { name: "Lab Coats", img: img637b },
    { name: "Safety Boots", img: img7e22 }, { name: "Face Shields", img: img5f3d },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 md:pb-8">
      {/* Banner carousel */}
      <BannerCarousel banners={banners} setPage={setPage} />

      {/* Mobile search */}
      <div className="mb-5 md:hidden">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search gloves, masks, PPE…" className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-border rounded-xl focus:border-primary/40 focus:outline-none" /></div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border border-border rounded-2xl mb-6 md:mb-8 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {[{ value: "50,000+", label: "Healthcare Clients", icon: Users }, { value: "200+", label: "Products Listed", icon: Package }, { value: "99.8%", label: "On-time Delivery", icon: Truck }, { value: "Same Day", label: "Order Dispatch", icon: Zap }].map(s => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><s.icon className="w-5 h-5 text-primary" /></div>
              <div><p className="text-lg font-extrabold text-primary leading-tight">{s.value}</p><p className="text-[11px] text-muted-foreground font-medium">{s.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans']">Shop by Category</h2>
          <button onClick={() => setPage("listing")} className="text-xs text-primary font-semibold flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cats.map(cat => (
            <button key={cat.name} onClick={() => setPage("listing")} className="group flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative">
                <ImageWithFallback src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <span className="text-[9px] md:text-[10px] font-semibold text-center leading-tight text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bestsellers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans']">Today's Bestsellers</h2>
          <button onClick={() => setPage("listing")} className="text-xs text-primary font-semibold flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {products.filter(p => p.badge === "Bestseller").slice(0, 4).concat(products.filter(p => p.badge !== "Bestseller")).slice(0, 4).map(p => <ProductCard key={p.id} product={p} setPage={setPage} setDetailId={setDetailId} addToCart={addToCart} />)}
        </div>
      </div>

      {/* Bulk pricing banner */}
      <div className="bg-gradient-to-br from-accent to-teal-700 rounded-3xl p-6 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-[11px] font-bold mb-3">VOLUME PRICING</span>
            <h2 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Scale Your Business with CareKart B2B</h2>
            <p className="text-teal-100 text-sm">Tiered discounts applied automatically on every product — no codes, no registration required.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {PACK_LABELS.slice(1).map((l, i) => (
              <div key={l} className="bg-white/15 rounded-xl p-3 text-center border border-white/20">
                <p className="text-xl font-extrabold">{[5, 12, 20][i]}%</p>
                <p className="text-[10px] text-teal-100 mt-0.5 leading-tight">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Built on Trust — redesigned */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Built on Trust. Backed by Science.</h2>
          <p className="text-sm text-muted-foreground">Every product we supply is tested, certified, and proven in India's leading healthcare institutions.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: ShieldCheck, title: "ISO 13485:2016 Certified", desc: "Our quality management system meets the highest international standard for medical device manufacturing, ensuring every product is safe and effective.", color: "bg-blue-50 text-blue-700" },
            { icon: Truck, title: "Same-Day Dispatch Guarantee", desc: "Orders placed before 3 PM are dispatched the same day. Real-time tracking provided for every shipment, pan-India.", color: "bg-emerald-50 text-emerald-700" },
            { icon: BadgeCheck, title: "Factory-Direct Supply Chain", desc: "We manufacture and supply directly — no middlemen. This means you get better prices, consistent quality, and direct accountability.", color: "bg-purple-50 text-purple-700" },
            { icon: Users, title: "50,000+ Verified Clients", desc: "From AIIMS to local clinics, from Fortune 500 companies to independent pharmacies — CareKart serves the full spectrum of Indian healthcare.", color: "bg-orange-50 text-orange-700" },
          ].map(t => (
            <div key={t.title} className="bg-white border border-border rounded-2xl p-5 flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${t.color}`}><t.icon className="w-6 h-6" /></div>
              <div><p className="font-bold text-sm mb-1">{t.title}</p><p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p></div>
            </div>
          ))}
        </div>

        {/* Certification strip */}
        <div className="mt-4 bg-muted rounded-2xl px-5 py-3 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {["ISO 13485:2016", "CE Marked", "FDA Listed", "FSSAI Approved", "BIS Certified", "NABL Lab Tested"].map(c => (
            <div key={c} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Check className="w-3.5 h-3.5 text-emerald-500" />{c}</div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-8">
        <div className="text-center mb-5">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground">Trusted by healthcare professionals, procurement teams, and retailers across India.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Apollo Pharmacy", role: "Chain of 500+ stores", text: "CareKart's bulk pricing and consistent quality have made them our primary PPE supplier. The GST invoicing is seamless for our procurement team.", rating: 5, avatar: "A" },
            { name: "Dr. Sunita Mehta", role: "Director, Mehta Clinics", text: "We've tried many suppliers but CareKart delivers exactly what they promise. The nitrile gloves are excellent and same-day dispatch has saved us multiple times.", rating: 5, avatar: "S" },
            { name: "SafeGuard Distributors", role: "Regional PPE Distributor", text: "The 20% pallet discount is real and quality is consistent box to box. We've scaled from 500 to 50,000 units/month with CareKart in 8 months.", rating: 5, avatar: "G" },
          ].map(t => (
            <div key={t.name} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-extrabold flex-shrink-0">{t.avatar}</div>
                <div><p className="font-bold text-sm">{t.name}</p><p className="text-[11px] text-muted-foreground">{t.role}</p></div>
              </div>
              <Stars rating={t.rating} small />
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <Logo className="h-7" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">India's trusted B2B PPE marketplace. Factory-direct pricing for hospitals, clinics &amp; retailers.</p>
            <div className="flex items-center gap-3 mb-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => <button key={i} className="w-8 h-8 bg-muted hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors"><Icon className="w-4 h-4 text-muted-foreground" /></button>)}
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />+91 80 4567 8900</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" />support@carekart.in</p>
              <p className="flex items-center gap-1.5"><Globe className="w-3 h-3" />www.carekart.in</p>
            </div>
          </div>
          {[
            { title: "Products", links: ["Nitrile Gloves", "Latex Gloves", "Vinyl Gloves", "N95 Masks", "Face Shields", "PPE Kits", "Sanitizers", "Lab Coats"] },
            { title: "Company", links: ["About Us", "Careers", "Press / Media", "Certifications", "CSR Initiatives", "Partner with Us"] },
            { title: "Support", links: ["Help Centre", "Track My Order", "Returns & Refunds", "Bulk Enquiry", "GST Invoice Help", "Contact Us"] },
          ].map(col => (
            <div key={col.title}>
              <p className="font-bold text-sm mb-3">{col.title}</p>
              <div className="space-y-2">{col.links.map(l => <p key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</p>)}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="border-t border-border py-4 flex flex-wrap items-center justify-center gap-4">
          {["ISO 13485", "CE Mark", "FDA Listed", "FSSAI", "BIS"].map(c => <span key={c} className="px-3 py-1 bg-muted rounded-lg text-[11px] font-semibold text-muted-foreground">{c}</span>)}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2025 CareKart Pvt. Ltd. All rights reserved. GST: 27AABCC1234M1Z5</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" />256-bit SSL</span>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Listing Page ──────────────────────────────────────────────────────────────
function ListingPage({ products, setPage, setDetailId, addToCart }: { products: Product[]; setPage: (p: Page) => void; setDetailId: (id: number) => void; addToCart: (p: Product, size: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const filtered = products.filter(p => activeCategory === "All" || p.category === activeCategory);
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <div className="mb-4 md:hidden"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:border-primary/40 focus:outline-none" /></div></div>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white border border-border rounded-2xl p-4 sticky top-20">
            <p className="font-bold text-sm mb-3 flex items-center gap-2"><Filter className="w-4 h-4" />Filters</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
            {CATEGORIES.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`block w-full text-left px-2 py-1.5 rounded-lg text-xs mb-0.5 transition-colors ${activeCategory === cat ? "bg-secondary text-primary font-semibold" : "hover:bg-muted text-foreground"}`}>{cat}</button>)}
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 md:hidden">{CATEGORIES.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${activeCategory === cat ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>{cat}</button>)}</div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs bg-muted border-none rounded-lg px-2 py-1.5 focus:outline-none"><option value="popular">Most Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{filtered.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setDetailId={setDetailId} addToCart={addToCart} />)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Page ───────────────────────────────────────────────────────
function ProductDetailPage({ product, setPage, addToCart }: { product: Product; setPage: (p: Page) => void; addToCart: (p: Product, size: string, packSize: number, packPrice: number) => void }) {
  const [mediaIdx, setMediaIdx] = useState(0); // 0..images.length-1 = images, images.length = video
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedPack, setSelectedPack] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const hasVideo = !!product.videoUrl;
  const totalMedia = product.images.length + (hasVideo ? 1 : 0);
  const isVideoSelected = hasVideo && mediaIdx === product.images.length;

  const pack = { qty: PACK_QTY[selectedPack], discount: product.packDiscounts[selectedPack] };
  const uPrice = product.price;
  const tPrice = Math.round(uPrice * (1 - pack.discount / 100));
  const totalUnits = pack.qty * qty;
  const totalPrice = tPrice * pack.qty * qty;
  const discount = Math.round((1 - uPrice / product.mrp) * 100);

  const isYouTube = product.videoUrl.includes("youtube.com") || product.videoUrl.includes("youtu.be");
  const ytId = product.videoUrl.includes("youtu.be") ? product.videoUrl.split("/").pop()?.split("?")[0] : new URLSearchParams(new URL(product.videoUrl || "https://a.com").search).get("v");

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <button onClick={() => setPage("listing")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Media column */}
        <div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-shrink-0">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMediaIdx(i)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${mediaIdx === i && !isVideoSelected ? "border-primary shadow-sm" : "border-transparent hover:border-border"}`}>
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {hasVideo && (
                <button onClick={() => setMediaIdx(product.images.length)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-900 ${isVideoSelected ? "border-primary" : "border-transparent hover:border-border"}`}>
                  <Play className="w-5 h-5 text-white fill-white" />
                </button>
              )}
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: "1/1" }}>
              {isVideoSelected ? (
                isYouTube ? (
                  <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title="Product video" />
                ) : (
                  <video src={product.videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" />
                )
              ) : (
                <>
                  <ImageWithFallback src={product.images[mediaIdx] ?? product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  {product.badge && <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-full">{product.badge}</span>}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-5">
                    <p className="text-white font-extrabold text-base md:text-xl leading-tight font-['Plus_Jakarta_Sans']">{product.tagline}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.features.map(f => <div key={f} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1"><CheckCircle className="w-3 h-3 flex-shrink-0" /><span className="text-[11px] font-semibold">{f}</span></div>)}
          </div>
        </div>

        {/* Info column */}
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3"><Stars rating={product.rating} /><span className="text-sm font-bold">{product.rating}</span><span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span></div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-extrabold">₹{uPrice}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{discount}% off</span>
          </div>
          {product.sizes.length > 1 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground">Size / Variant</p>
              <div className="flex gap-2 flex-wrap">{product.sizes.map(s => <button key={s} onClick={() => setSelectedSize(s)} className={`px-3.5 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all ${selectedSize === s ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}>{s}</button>)}</div>
            </div>
          )}

          {/* Pack selector — full row per pack */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Choose Quantity Pack</p>
              <span className="text-[10px] text-accent font-semibold flex items-center gap-1"><Zap className="w-3 h-3" />Bulk savings</span>
            </div>
            <div className="flex flex-col gap-2">
              {PACK_LABELS.map((label, i) => {
                const isActive = i === selectedPack;
                const packUnitPrice = Math.round(uPrice * (1 - product.packDiscounts[i] / 100));
                const saving = uPrice - packUnitPrice;
                const tagColors = ["", "bg-primary text-white", "bg-accent text-white", "bg-orange-500 text-white"];
                return (
                  <button key={label} onClick={() => setSelectedPack(i)} className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 bg-white"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isActive ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>{isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{label}</p>
                        {PACK_TAGS[i] && <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${tagColors[i]}`}>{PACK_TAGS[i]}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{PACK_QTY[i] === 1 ? "Per unit price" : `${PACK_QTY[i].toLocaleString()} units minimum`}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base font-extrabold ${isActive ? "text-primary" : "text-foreground"}`}>₹{packUnitPrice}<span className="text-[10px] font-normal text-muted-foreground">/unit</span></p>
                      {saving > 0 && <p className="text-[10px] text-emerald-600 font-semibold">Save ₹{saving}/unit</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPack > 0 && (
            <div className="flex items-center gap-3 mb-4 bg-muted rounded-xl px-4 py-2">
              <p className="text-xs font-semibold flex-1">No. of boxes</p>
              <div className="flex items-center gap-2"><button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus className="w-3.5 h-3.5" /></button><span className="w-8 text-center font-bold text-sm">{qty}</span><button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus className="w-3.5 h-3.5" /></button></div>
              <p className="text-xs text-muted-foreground">{totalUnits.toLocaleString()} units</p>
            </div>
          )}

          <div className="bg-muted rounded-2xl p-4 mb-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Total payable</p>
                <p className="text-2xl font-extrabold">₹{selectedPack === 0 ? uPrice : totalPrice.toLocaleString()}</p>
                {pack.discount > 0 && <p className="text-xs text-emerald-600 font-semibold mt-0.5">You save ₹{(Math.round(uPrice * pack.qty * qty) - totalPrice).toLocaleString()} ({pack.discount}% bulk discount)</p>}
              </div>
              {pack.discount > 0 && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{pack.discount}% OFF</span>}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={() => { addToCart(product, selectedSize, pack.qty, tPrice); setPage("cart"); }} className="flex-1 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"><ShoppingCart className="w-4 h-4" />Add to Cart</button>
            <button className="px-4 py-3.5 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-secondary transition-colors"><Heart className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-wrap gap-4">
            {[{ icon: Truck, text: "Ships in 24h" }, { icon: Shield, text: "Genuine product" }, { icon: RefreshCw, text: "7-day returns" }].map(t => <div key={t.text} className="flex items-center gap-1.5 text-xs text-muted-foreground"><t.icon className="w-3.5 h-3.5 text-accent" />{t.text}</div>)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border">
          {(["description","specs","reviews"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary bg-secondary/40" : "text-muted-foreground hover:text-foreground"}`}>
              {tab === "reviews" ? `Reviews (${product.reviews.toLocaleString()})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="p-5 md:p-6">
          {activeTab === "description" && (
            <div><p className="text-sm leading-relaxed mb-5">{product.description}</p><h3 className="font-bold text-sm mb-3">Key Highlights</h3><ul className="space-y-2">{product.features.map(f => <li key={f} className="flex items-start gap-2.5 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{f}</span></li>)}</ul></div>
          )}
          {activeTab === "specs" && (
            <table className="w-full text-sm"><tbody>{Object.entries(product.specs).map(([k, v], i) => <tr key={k} className={i % 2 === 0 ? "bg-muted/50" : ""}><td className="px-4 py-2.5 font-semibold text-muted-foreground w-1/3">{k}</td><td className="px-4 py-2.5">{v}</td></tr>)}<tr className="bg-muted/50"><td className="px-4 py-2.5 font-semibold text-muted-foreground">Material</td><td className="px-4 py-2.5">{product.material}</td></tr><tr><td className="px-4 py-2.5 font-semibold text-muted-foreground">Min. Order</td><td className="px-4 py-2.5">{product.moq} unit{product.moq > 1 ? "s" : ""}</td></tr></tbody></table>
          )}
          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-border">
                <div className="text-center"><p className="text-5xl font-extrabold">{product.rating}</p><Stars rating={product.rating} /><p className="text-xs text-muted-foreground mt-1">{product.reviews.toLocaleString()} ratings</p></div>
                <div className="flex-1 space-y-1.5">{[5,4,3,2,1].map((s, i) => { const pcts = [72,18,6,2,2]; return <div key={s} className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-8 text-right">{s}★</span><div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[i]}%` }} /></div><span className="text-xs text-muted-foreground w-6">{pcts[i]}%</span></div>; })}</div>
              </div>
              <div className="space-y-5">{MOCK_REVIEWS.map(r => <div key={r.id} className="pb-5 border-b border-border last:border-0 last:pb-0"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{r.name[0]}</div><div><p className="font-bold text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.role}</p></div></div><p className="text-xs text-muted-foreground">{r.date}</p></div><Stars rating={r.rating} small /><p className="text-sm text-foreground mt-2 leading-relaxed">{r.text}</p><div className="flex items-center gap-3 mt-3"><span className="text-xs text-muted-foreground">Helpful?</span><button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ThumbsUp className="w-3 h-3" />{r.helpful}</button><button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ThumbsDown className="w-3 h-3" /></button></div></div>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cart / Checkout / Confirmation (compact) ──────────────────────────────────
function CartPage({ cart, setPage, updateQty, removeFromCart }: { cart: CartItem[]; setPage: (p: Page) => void; updateQty: (id: number, qty: number) => void; removeFromCart: (id: number) => void }) {
  const subtotal = cart.reduce((s, i) => s + i.packPrice * i.packSize * i.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  if (cart.length === 0) return <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24"><div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4"><ShoppingCart className="w-10 h-10 text-muted-foreground" /></div><h2 className="text-xl font-bold mb-2">Your cart is empty</h2><p className="text-muted-foreground text-sm mb-6">Add products to get started</p><button onClick={() => setPage("listing")} className="px-6 py-3 bg-primary text-white font-bold rounded-2xl">Browse Products</button></div>;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Cart ({cart.length})</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex gap-3">
              <ImageWithFallback src={item.images[0]} alt={item.name} className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Size: {item.selectedSize} · {item.packSize > 1 ? `Pack of ${item.packSize}` : "1 unit"}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1.5 bg-muted rounded-xl p-1"><button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white"><Minus className="w-3 h-3" /></button><span className="w-6 text-center text-sm font-bold">{item.qty}</span><button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white"><Plus className="w-3 h-3" /></button></div>
                  <p className="font-extrabold text-sm">₹{(item.packPrice * item.packSize * item.qty).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="self-start p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 sticky top-20 self-start">
          <h2 className="font-bold text-base mb-4">Order Summary</h2>
          <div className="space-y-2.5 text-sm mb-4"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${shipping}`}</span></div><div className="h-px bg-border" /><div className="flex justify-between font-extrabold text-base"><span>Total</span><span>₹{total.toLocaleString()}</span></div></div>
          <button onClick={() => setPage("checkout")} className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90">Proceed to Checkout</button>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground"><Lock className="w-3 h-3" />Secure checkout</div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, setPage, userPhone }: { cart: CartItem[]; setPage: (p: Page) => void; userPhone: string }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", phone: userPhone, line1: "", city: "", state: "", pin: "" });
  const [payMethod, setPayMethod] = useState("upi");
  const [isGstBuyer, setIsGstBuyer] = useState(false);
  const [company, setCompany] = useState(""); const [gstin, setGstin] = useState("");
  const subtotal = cart.reduce((s, i) => s + i.packPrice * i.packSize * i.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99; const total = subtotal + shipping;
  const steps = ["Address", "Payment", "Review"];
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => <div key={s} className="flex items-center"><div className="flex flex-col items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}</div><span className="text-[10px] mt-1 font-medium text-muted-foreground">{s}</span></div>{i < steps.length - 1 && <div className={`w-16 h-0.5 mx-1 mb-4 ${i + 1 < step ? "bg-emerald-500" : "bg-border"}`} />}</div>)}
      </div>
      {step === 1 && <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Delivery Address</h2><div className="space-y-3">{[{ key: "name", label: "Full Name", p: "Your name" },{ key: "phone", label: "Phone", p: "Mobile" },{ key: "line1", label: "Address", p: "House/street" },{ key: "city", label: "City", p: "City" },{ key: "state", label: "State", p: "State" },{ key: "pin", label: "PIN", p: "6-digit PIN" }].map(f => <div key={f.key}><label className="block text-xs font-semibold mb-1">{f.label}</label><input type="text" placeholder={f.p} value={(address as Record<string,string>)[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>)}</div><button onClick={() => setStep(2)} className="w-full mt-5 py-3 bg-primary text-white font-bold rounded-2xl">Continue</button></div>}
      {step === 2 && <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" />Payment Method</h2><div className="space-y-2 mb-5">{[{ id: "upi", label: "UPI", sub: "PhonePe, GPay, Paytm", icon: Zap },{ id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },{ id: "netbanking", label: "Net Banking", sub: "All major banks", icon: Building2 },{ id: "cod", label: "Cash on Delivery", sub: "≤₹5000", icon: IndianRupee }].map(m => <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${payMethod === m.id ? "border-primary bg-secondary" : "border-border"}`}><input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="accent-primary" /><m.icon className={`w-5 h-5 ${payMethod === m.id ? "text-primary" : "text-muted-foreground"}`} /><div><p className="font-semibold text-sm">{m.label}</p><p className="text-[11px] text-muted-foreground">{m.sub}</p></div></label>)}</div><div className="flex gap-3"><button onClick={() => setStep(1)} className="px-4 py-3 border-2 border-border rounded-2xl text-sm font-semibold">Back</button><button onClick={() => setStep(3)} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">Continue</button></div></div>}
      {step === 3 && <div className="space-y-4"><div className={`border-2 rounded-2xl p-4 ${isGstBuyer ? "border-primary bg-primary/5" : "border-border bg-white"}`}><label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={isGstBuyer} onChange={e => setIsGstBuyer(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" /><div className="flex-1"><p className="font-semibold text-sm">Purchasing for a registered business?</p><p className="text-xs text-muted-foreground mt-0.5">Enter GSTIN to receive a GST invoice for ITC claims.</p></div><span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex-shrink-0">GST Invoice</span></label>{isGstBuyer && <div className="mt-4 pt-4 border-t border-border space-y-3"><div><label className="block text-xs font-semibold mb-1">Company Name</label><input value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3 py-2.5 bg-white rounded-xl border border-border focus:outline-none text-sm" /></div><div><label className="block text-xs font-semibold mb-1">GSTIN</label><input value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} maxLength={15} className="w-full px-3 py-2.5 bg-white rounded-xl border border-border focus:outline-none text-sm font-mono" /></div></div>}</div><div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold text-base mb-4">Order Summary</h2><div className="space-y-3 mb-4">{cart.map(item => <div key={item.id} className="flex items-center gap-3"><ImageWithFallback src={item.images[0]} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" /><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{item.name}</p><p className="text-xs text-muted-foreground">{item.packSize > 1 ? `Pack of ${item.packSize}` : "1 unit"}</p></div><p className="font-bold text-sm">₹{(item.packPrice * item.packSize * item.qty).toLocaleString()}</p></div>)}</div><div className="border-t border-border pt-3 space-y-2 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div><div className="flex justify-between font-extrabold text-base border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div></div></div><div className="flex gap-3"><button onClick={() => setStep(2)} className="px-4 py-3 border-2 border-border rounded-2xl text-sm font-semibold">Back</button><button onClick={() => setTimeout(() => setPage("confirmation"), 600)} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">Place Order · ₹{total.toLocaleString()}</button></div></div>}
    </div>
  );
}

function ConfirmationPage({ cart, setPage }: { cart: CartItem[]; setPage: (p: Page) => void }) {
  const orderId = `CK${Date.now().toString().slice(-8)}`;
  const total = cart.reduce((s, i) => s + i.packPrice * i.packSize * i.qty, 0);
  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center pb-24 md:pb-12">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-10 h-10 text-emerald-500" /></div>
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Order Placed!</h1>
      <p className="text-muted-foreground text-sm mb-1">Order ID: <span className="font-mono font-bold text-foreground">{orderId}</span></p>
      <p className="text-muted-foreground text-sm mb-6">Estimated delivery: <span className="font-semibold text-foreground">2–4 business days</span></p>
      <div className="bg-white border border-border rounded-2xl p-5 mb-6 text-left">{cart.slice(0, 3).map(item => <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0"><ImageWithFallback src={item.images[0]} className="w-12 h-12 rounded-xl object-cover" alt="" /><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{item.name}</p><p className="text-xs text-muted-foreground">{item.packSize > 1 ? `Pack of ${item.packSize}` : "1 unit"}</p></div><p className="font-bold text-sm">₹{(item.packPrice * item.packSize * item.qty).toLocaleString()}</p></div>)}<div className="border-t border-border mt-3 pt-3 flex justify-between font-extrabold"><span>Total Paid</span><span>₹{total.toLocaleString()}</span></div></div>
      <div className="flex gap-3"><button onClick={() => setPage("account")} className="flex-1 py-3 border-2 border-primary text-primary font-bold rounded-2xl">Track Order</button><button onClick={() => setPage("home")} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">Continue Shopping</button></div>
    </div>
  );
}

// ─── Account ────────────────────────────────────────────────────────────────────
function AccountDashboardPage({ currentUser, setPage, isLoggedIn, setOrderId }: { currentUser: AppUser | null; setPage: (p: Page) => void; isLoggedIn: boolean; setOrderId: (id: string) => void }) {
  if (!isLoggedIn || !currentUser) return <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24"><h2 className="text-xl font-bold mb-3">Please login to view your account</h2><button onClick={() => setPage("login")} className="px-6 py-3 bg-primary text-white font-bold rounded-2xl">Login / Sign Up</button></div>;
  const STATUS_COLORS: Record<string, string> = { Delivered: "text-emerald-600 bg-emerald-50", "In Transit": "text-blue-600 bg-blue-50", Cancelled: "text-red-600 bg-red-50" };
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <div className="bg-primary rounded-2xl p-5 text-white mb-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0">{currentUser.name[0]?.toUpperCase()}</div>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{currentUser.name}</h1>
          <p className="text-sm text-blue-200">+91 {currentUser.phone}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentUser.accountType === "business" ? "bg-yellow-400/20 text-yellow-300" : "bg-white/10 text-white/70"}`}>{currentUser.accountType === "business" ? "🏢 Business Account" : "👤 Retail Account"}</span>
            {currentUser.gstin && <BadgeCheck className="w-4 h-4 text-blue-300" />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{ icon: Package, label: "Your Orders", sub: "Track & manage" },{ icon: MapPin, label: "Addresses", sub: "Delivery addresses" },{ icon: Building2, label: "Business Info", sub: "GST & company" },{ icon: LogOut, label: "Sign Out", sub: "Log out" }].map(item => (
          <button key={item.label} className="bg-white border border-border rounded-2xl p-4 text-left hover:shadow-md transition-all group">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/15"><item.icon className="w-5 h-5 text-primary" /></div>
            <p className="font-bold text-sm">{item.label}</p><p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-extrabold font-['Plus_Jakarta_Sans'] mb-4">Your Orders</h2>
        <div className="space-y-3">{MOCK_ORDERS.map(order => (
          <div key={order.id} className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-4 text-xs"><div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Order ID</p><p className="font-mono font-bold text-foreground">{order.id}</p></div><div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Date</p><p className="font-semibold">{order.date}</p></div><div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Total</p><p className="font-extrabold">₹{order.total.toLocaleString()}</p></div></div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}>{order.status}</span>
            </div>
            <div className="p-4">{order.items.map((item, idx) => <div key={idx} className="flex items-center gap-3 mb-3 last:mb-0"><ImageWithFallback src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" /><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.qty}</p><p className="text-sm font-bold">₹{item.price.toLocaleString()}</p></div></div>)}</div>
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              <button onClick={() => { setOrderId(order.id); setPage("account-order"); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Eye className="w-3.5 h-3.5" />View Details</button>
              {order.status === "Delivered" && <><button className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl"><Download className="w-3.5 h-3.5" />Invoice</button><button className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl"><RefreshCw className="w-3.5 h-3.5" />Reorder</button></>}
            </div>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

function OrderDetailPage({ orderId, setPage }: { orderId: string; setPage: (p: Page) => void }) {
  const order = MOCK_ORDERS.find(o => o.id === orderId) ?? MOCK_ORDERS[0];
  const STATUS_COLORS: Record<string, string> = { Delivered: "text-emerald-600 bg-emerald-50", "In Transit": "text-blue-600 bg-blue-50", Cancelled: "text-red-600 bg-red-50" };
  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <button onClick={() => setPage("account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Orders</button>
      <div className="flex items-start justify-between mb-5"><div><h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Order #{order.id}</h1><p className="text-sm text-muted-foreground">{order.date}</p></div><span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] ?? "bg-muted"}`}>{order.status}</span></div>
      <div className="bg-white border border-border rounded-2xl p-5 mb-4"><h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Shipment Tracking</h2><div className="space-y-0">{order.steps.map((s, i) => <div key={s.label} className="flex gap-4"><div className="flex flex-col items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${s.done ? "bg-emerald-500" : "bg-muted border-2 border-border"}`}>{s.done ? <Check className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-muted-foreground" />}</div>{i < order.steps.length - 1 && <div className={`w-0.5 h-10 ${s.done ? "bg-emerald-200" : "bg-border"}`} />}</div><div className="pt-1 pb-8 last:pb-0"><p className={`text-sm font-semibold ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>{s.time && <p className="text-xs text-muted-foreground mt-0.5">{s.time}</p>}</div></div>)}</div></div>
      <div className="bg-white border border-border rounded-2xl p-5 mb-4"><h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" />Items Ordered</h2>{order.items.map((item, i) => <div key={i} className="flex items-center gap-4 mb-4 last:mb-0"><ImageWithFallback src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" /><div className="flex-1"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.qty}</p></div><p className="font-extrabold">₹{item.price.toLocaleString()}</p></div>)}<div className="border-t border-border mt-4 pt-4 flex justify-between font-extrabold"><span>Order Total</span><span>₹{order.total.toLocaleString()}</span></div></div>
      <div className="flex flex-wrap gap-3">{order.status === "Delivered" && <><button className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl"><Download className="w-4 h-4" />Invoice</button><button className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-sm font-semibold rounded-xl"><RefreshCw className="w-4 h-4" />Reorder</button></>}<button className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-sm font-semibold rounded-xl"><Phone className="w-4 h-4" />Support</button></div>
    </div>
  );
}

// ─── Admin Badge Helpers ────────────────────────────────────────────────────────
function OrderStatusBadge({ s }: { s: string }) {
  const c: Record<string, string> = { pending: "bg-yellow-50 text-yellow-700", processing: "bg-blue-50 text-blue-700", shipped: "bg-indigo-50 text-indigo-700", delivered: "bg-emerald-50 text-emerald-700", cancelled: "bg-red-50 text-red-700", returned: "bg-orange-50 text-orange-700" };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${c[s] ?? "bg-gray-100 text-gray-600"}`}>{s}</span>;
}
function PayBadge({ s }: { s: string }) {
  const c: Record<string, string> = { paid: "bg-emerald-50 text-emerald-700", pending: "bg-yellow-50 text-yellow-700", failed: "bg-red-50 text-red-700", refunded: "bg-gray-100 text-gray-600" };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${c[s] ?? "bg-gray-100 text-gray-600"}`}>{s}</span>;
}

// ─── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ products, setProducts, users, banners, setBanners, setPage }: {
  products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: AppUser[]; banners: Banner[]; setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  setPage: (p: Page) => void;
}) {
  const [view, setView] = useState<AdminView>("dashboard");
  const [orders, setOrders] = useState<AdminOrder[]>(INIT_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INIT_COUPONS);

  // Product state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Order state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderNoteInput, setOrderNoteInput] = useState("");

  // Customer state
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState<"all" | "retail" | "business">("all");

  // Banner / coupon state
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Tab state
  const [contentTab, setContentTab] = useState<"banners" | "pages">("banners");
  const [settingsTab, setSettingsTab] = useState<"store" | "payment" | "shipping" | "roles">("store");
  const [reportPeriod, setReportPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  type NavId = "dashboard" | "products" | "orders" | "customers" | "marketing" | "content" | "reports" | "settings";
  const navItems: { id: NavId; icon: React.FC<{ className?: string }>; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "marketing", icon: Tag, label: "Marketing" },
    { id: "content", icon: ImageIcon, label: "Content" },
    { id: "reports", icon: BarChart3, label: "Reports" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const emptyProduct = (): Product => ({ id: Date.now(), name: "", tagline: "", description: "", price: 0, mrp: 0, rating: 4.5, reviews: 0, category: "Nitrile", badge: "", material: "", sizes: ["M"], images: [img9c80], videoUrl: "", features: [], specs: {}, inStock: true, moq: 1, packDiscounts: [0, 5, 12, 20] });
  const saveProduct = (p: Product) => { setProducts(prev => prev.find(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]); setShowProductForm(false); setEditProduct(null); };
  const emptyBanner = (): Banner => ({ id: `b${Date.now()}`, active: true, badge: "", headline: "", subheadline: "", subtext: "", ctaPrimary: "Shop Now", ctaPrimaryLink: "listing", ctaSecondary: "", bg: BG_PRESETS[0].value, imageUrl: "" });
  const saveBanner = (b: Banner) => { setBanners(prev => prev.find(x => x.id === b.id) ? prev.map(x => x.id === b.id ? b : x) : [...prev, b]); setShowBannerForm(false); setEditBanner(null); };
  const emptyCoupon = (): Coupon => ({ id: `c${Date.now()}`, code: "", type: "percent", value: 10, minOrder: 0, maxUses: 100, usedCount: 0, active: true, expiry: "2025-12-31" });
  const saveCoupon = (c: Coupon) => { setCoupons(prev => prev.find(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]); setShowCouponForm(false); setEditCoupon(null); };

  const navTo = (v: AdminView) => { setView(v); setSelectedOrderId(null); setSelectedCustomerPhone(null); setShowProductForm(false); setShowBannerForm(false); setShowCouponForm(false); };

  const filteredProducts = products.filter(p => productCategory === "All" || p.category === productCategory).filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => orderStatusFilter === "all" || o.status === orderStatusFilter).filter(o => !orderSearch || o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer.toLowerCase().includes(orderSearch.toLowerCase()));
  const filteredUsers = users.filter(u => customerFilter === "all" || u.accountType === customerFilter).filter(u => !customerSearch || u.name.toLowerCase().includes(customerSearch.toLowerCase()) || u.phone.includes(customerSearch));
  const lowStockProducts = products.filter(p => !p.inStock);
  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedCustomer = users.find(u => u.phone === selectedCustomerPhone);
  const customerOrders = orders.filter(o => o.phone === selectedCustomerPhone);

  const salesData = [{ month: "Jan", revenue: 420000, orders: 1240 }, { month: "Feb", revenue: 580000, orders: 1680 }, { month: "Mar", revenue: 490000, orders: 1420 }, { month: "Apr", revenue: 720000, orders: 2100 }, { month: "May", revenue: 640000, orders: 1870 }, { month: "Jun", revenue: 890000, orders: 2580 }];

  const isOrdersSection = view === "orders" || view === "order-detail";
  const isCustomersSection = view === "customers" || view === "customer-detail";

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-border flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-4 border-b border-border flex flex-col gap-1">
          <Logo className="h-6" />
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navTo(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${(view === item.id || (item.id === "orders" && isOrdersSection) || (item.id === "customers" && isCustomersSection)) ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => setPage("home")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted"><Home className="w-4 h-4" />View Store</button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 h-12">
          <span className="font-extrabold text-primary">Admin</span>
          <button onClick={() => setPage("home")} className="text-xs text-primary font-semibold flex items-center gap-1"><Home className="w-3.5 h-3.5" />Store</button>
        </div>
        <div className="flex border-t border-border overflow-x-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navTo(item.id as AdminView)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap flex-shrink-0 ${(view === item.id || (item.id === "orders" && isOrdersSection) || (item.id === "customers" && isCustomersSection)) ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              <item.icon className="w-3.5 h-3.5" />{item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 mt-24 md:mt-0 pb-8 overflow-auto">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] capitalize">
              {view === "order-detail" ? "Order Detail" : view === "customer-detail" ? "Customer Detail" : view}
            </h1>
            <p className="text-xs text-muted-foreground">CareKart Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search…" className="pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-xl w-48 focus:outline-none focus:border-primary/40" /></div>
            <button className="relative p-2 bg-white border border-border rounded-xl hover:bg-muted"><Bell className="w-4 h-4 text-muted-foreground" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span></button>
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-sm">A</div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {view === "dashboard" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Revenue (Jun)", value: "₹8.9L", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50", trend: "+18%" },
                { label: "Total Orders", value: orders.length.toString(), icon: ShoppingCart, color: "text-blue-600 bg-blue-50", trend: "+12%" },
                { label: "Customers", value: users.length.toString(), icon: Users, color: "text-purple-600 bg-purple-50", trend: "+5%" },
                { label: "Low Stock", value: lowStockProducts.length.toString(), icon: AlertTriangle, color: lowStockProducts.length > 0 ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50", trend: lowStockProducts.length > 0 ? "Needs action" : "All good" },
              ].map(s => (
                <div key={s.label} className="bg-white border border-border rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
                    <span className="text-[10px] font-semibold text-muted-foreground">{s.trend}</span>
                  </div>
                  <p className="text-xl font-extrabold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="font-bold text-sm mb-4">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart key="revenue-chart" data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#1741B0" strokeWidth={2.5} dot={{ fill: "#1741B0", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="font-bold text-sm mb-4">Monthly Orders</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart key="orders-chart" data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [v.toLocaleString(), "Orders"]} />
                    <Bar dataKey="orders" fill="#1741B0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-bold text-sm">Recent Orders</h2>
                  <button onClick={() => navTo("orders")} className="text-xs text-primary font-semibold">View all</button>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted"><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Order</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Customer</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Total</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} onClick={() => { setSelectedOrderId(o.id); setView("order-detail"); }} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                        <td className="px-4 py-2.5 font-mono text-xs font-bold">{o.id}</td>
                        <td className="px-4 py-2.5 text-xs truncate max-w-[100px]">{o.customer}</td>
                        <td className="px-4 py-2.5 font-semibold text-xs">₹{o.total.toLocaleString()}</td>
                        <td className="px-4 py-2.5"><OrderStatusBadge s={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-bold text-sm">Top Selling Products</h2>
                  <button onClick={() => navTo("products")} className="text-xs text-primary font-semibold">Manage</button>
                </div>
                <div className="divide-y divide-border">
                  {products.slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-xs font-extrabold text-muted-foreground w-4">{i + 1}</span>
                      <ImageWithFallback src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.category}</p>
                      </div>
                      <span className="text-xs font-bold">₹{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-600" /><h2 className="font-bold text-sm text-red-800">Low Stock / Out of Stock Alert</h2></div>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-red-100">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {view === "products" && !showProductForm && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Products ({filteredProducts.length})</h1>
              <button onClick={() => { setEditProduct(emptyProduct()); setShowProductForm(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl"><Plus className="w-4 h-4" />Add Product</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-primary/40" /></div>
              <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none font-medium">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
              {selectedProducts.length > 0 && <>
                <span className="flex items-center text-xs text-muted-foreground px-2">{selectedProducts.length} selected</span>
                <button onClick={() => { setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id))); setSelectedProducts([]); }} className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100">Delete Selected</button>
                <button onClick={() => setSelectedProducts([])} className="px-3 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-xl">Clear</button>
              </>}
            </div>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 w-8"><input type="checkbox" checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} onChange={e => setSelectedProducts(e.target.checked ? filteredProducts.map(p => p.id) : [])} className="w-4 h-4 accent-primary" /></th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">MOQ</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                        <td className="px-4 py-3"><input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={e => setSelectedProducts(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} className="w-4 h-4 accent-primary" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{p.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">SKU-{p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-sm">₹{p.price}<span className="text-[10px] text-muted-foreground line-through ml-1">₹{p.mrp}</span></td>
                        <td className="px-4 py-3 text-xs">{p.moq}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{p.inStock ? "In Stock" : "Out of Stock"}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setEditProduct(p); setShowProductForm(true); }} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive"><TrashIcon className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        )}
        {view === "products" && showProductForm && editProduct && (
          <ProductForm product={editProduct} onSave={saveProduct} onCancel={() => { setShowProductForm(false); setEditProduct(null); }} />
        )}

        {/* ── ORDERS ── */}
        {view === "orders" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Orders ({filteredOrders.length})</h1>
              <button onClick={() => downloadCSV([["Order ID", "Customer", "Date", "Total", "Pay Status", "Order Status"], ...filteredOrders.map(o => [o.id, o.customer, o.date, o.total.toString(), o.payStatus, o.status])], "carekart_orders.csv")} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border text-xs font-bold rounded-xl hover:bg-muted"><Download className="w-3.5 h-3.5" />Export CSV</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search by order ID or customer…" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-primary/40" /></div>
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} className="text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none font-medium">
                <option value="all">All Statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="returned">Returned</option>
              </select>
            </div>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Order ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Total</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Payment</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id} onClick={() => { setSelectedOrderId(o.id); setView("order-detail"); }} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                        <td className="px-4 py-3 font-mono text-xs font-bold">{o.id}</td>
                        <td className="px-4 py-3"><p className="font-semibold text-sm">{o.customer}</p><p className="text-[10px] text-muted-foreground">{o.email}</p></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                        <td className="px-4 py-3 font-extrabold text-sm">₹{o.total.toLocaleString()}</td>
                        <td className="px-4 py-3"><PayBadge s={o.payStatus} /></td>
                        <td className="px-4 py-3"><OrderStatusBadge s={o.status} /></td>
                        <td className="px-4 py-3"><button onClick={e => { e.stopPropagation(); setSelectedOrderId(o.id); setView("order-detail"); }} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDER DETAIL ── */}
        {view === "order-detail" && selectedOrder && (
          <div>
            <button onClick={() => setView("orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Orders</button>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{selectedOrder.id}</h1>
                <p className="text-sm text-muted-foreground">{selectedOrder.date} · via {selectedOrder.payMethod}</p>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge s={selectedOrder.status} />
                <select value={selectedOrder.status} onChange={e => setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: e.target.value as AdminOrder["status"] } : o))}
                  className="text-xs bg-white border border-border rounded-xl px-3 py-2 focus:outline-none font-semibold">
                  {["pending", "processing", "shipped", "delivered", "cancelled", "returned"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" />Items Ordered</h2>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                      <ImageWithFallback src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.qty}</p></div>
                      <p className="font-extrabold text-sm">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="border-t border-border mt-4 pt-4 flex justify-between font-extrabold"><span>Order Total</span><span>₹{selectedOrder.total.toLocaleString()}</span></div>
                </div>
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />Internal Notes</h2>
                  <div className="space-y-2 mb-3">
                    {selectedOrder.notes.length === 0 && <p className="text-xs text-muted-foreground">No notes yet.</p>}
                    {selectedOrder.notes.map((n, i) => <div key={i} className="text-xs bg-muted rounded-xl px-3 py-2">{n}</div>)}
                  </div>
                  <div className="flex gap-2">
                    <input value={orderNoteInput} onChange={e => setOrderNoteInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && orderNoteInput.trim()) { setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, notes: [...o.notes, orderNoteInput.trim()] } : o)); setOrderNoteInput(""); } }} placeholder="Add a note and press Enter…" className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs border border-transparent focus:outline-none focus:border-primary/40" />
                    <button onClick={() => { if (orderNoteInput.trim()) { setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, notes: [...o.notes, orderNoteInput.trim()] } : o)); setOrderNoteInput(""); } }} className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">Add</button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><User className="w-4 h-4 text-primary" />Customer</h2>
                  <p className="font-semibold text-sm">{selectedOrder.customer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedOrder.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.phone}</p>
                </div>
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />Shipping Address</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" />Payment</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Method</span><span className="font-semibold">{selectedOrder.payMethod}</span></div>
                    <div className="flex justify-between text-xs items-center"><span className="text-muted-foreground">Status</span><PayBadge s={selectedOrder.payStatus} /></div>
                    <div className="flex justify-between text-xs border-t border-border pt-2"><span className="font-bold">Total</span><span className="font-extrabold">₹{selectedOrder.total.toLocaleString()}</span></div>
                  </div>
                </div>
                {selectedOrder.trackingId && (
                  <div className="bg-white border border-border rounded-2xl p-5">
                    <h2 className="font-bold text-sm mb-2 flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Tracking ID</h2>
                    <p className="text-sm font-mono font-bold text-primary">{selectedOrder.trackingId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {view === "customers" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Customers ({filteredUsers.length})</h1>
              <button onClick={() => downloadCSV([["Name", "Phone", "Email", "Type", "GSTIN", "Joined"], ...filteredUsers.map(u => [u.name, u.phone, u.email, u.accountType, u.gstin, u.joinedAt])], "carekart_customers.csv")} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border text-xs font-bold rounded-xl hover:bg-muted"><Download className="w-3.5 h-3.5" />Export CSV</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Search by name or phone…" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-primary/40" /></div>
              <select value={customerFilter} onChange={e => setCustomerFilter(e.target.value as "all" | "retail" | "business")} className="text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none font-medium"><option value="all">All Types</option><option value="retail">Retail</option><option value="business">Business</option></select>
            </div>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Phone</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Orders</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const orderCount = orders.filter(o => o.phone === u.phone).length;
                      return (
                        <tr key={u.phone} onClick={() => { setSelectedCustomerPhone(u.phone); setView("customer-detail"); }} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">{u.name[0]?.toUpperCase()}</div>
                              <span className="font-semibold text-sm">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">+91 {u.phone}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{u.email || "—"}</td>
                          <td className="px-4 py-3 text-sm font-semibold">{orderCount}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.accountType === "business" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{u.accountType === "business" ? "Business" : "Retail"}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{u.joinedAt}</td>
                          <td className="px-4 py-3"><button onClick={e => { e.stopPropagation(); setSelectedCustomerPhone(u.phone); setView("customer-detail"); }} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMER DETAIL ── */}
        {view === "customer-detail" && selectedCustomer && (
          <div>
            <button onClick={() => setView("customers")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Customers</button>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-extrabold mb-3">{selectedCustomer.name[0]?.toUpperCase()}</div>
                    <h2 className="font-extrabold text-lg font-['Plus_Jakarta_Sans']">{selectedCustomer.name}</h2>
                    <span className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedCustomer.accountType === "business" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{selectedCustomer.accountType === "business" ? "Business Account" : "Retail Account"}</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Phone", value: `+91 ${selectedCustomer.phone}` },
                      { label: "Email", value: selectedCustomer.email || "Not provided" },
                      { label: "GSTIN", value: selectedCustomer.gstin || "Not provided" },
                      { label: "Member Since", value: selectedCustomer.joinedAt },
                      { label: "Total Orders", value: customerOrders.length.toString() },
                      { label: "Total Spent", value: `₹${customerOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="text-xs font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-white border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border"><h2 className="font-bold text-sm">Order History</h2></div>
                  {customerOrders.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground"><Package className="w-10 h-10 mx-auto mb-2 text-border" /><p className="text-sm">No orders yet</p></div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead><tr className="bg-muted"><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Order ID</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Total</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th></tr></thead>
                      <tbody>
                        {customerOrders.map(o => (
                          <tr key={o.id} onClick={() => { setSelectedOrderId(o.id); setView("order-detail"); }} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                            <td className="px-4 py-3 font-mono text-xs font-bold">{o.id}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                            <td className="px-4 py-3 font-semibold text-sm">₹{o.total.toLocaleString()}</td>
                            <td className="px-4 py-3"><OrderStatusBadge s={o.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MARKETING ── */}
        {view === "marketing" && !showCouponForm && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Marketing</h1>
              <button onClick={() => { setEditCoupon(emptyCoupon()); setShowCouponForm(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl"><Plus className="w-4 h-4" />New Coupon</button>
            </div>
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><Percent className="w-4 h-4" />Coupons &amp; Discounts</h2>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Value</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Min Order</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Usage</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Expiry</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono font-bold text-primary text-sm">{c.code}</td>
                        <td className="px-4 py-3 text-xs">{c.type === "percent" ? "% Off" : "Flat ₹"}</td>
                        <td className="px-4 py-3 font-semibold text-sm">{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                        <td className="px-4 py-3 text-xs">₹{c.minOrder.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs">{c.usedCount} / {c.maxUses}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.expiry}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{c.active ? "Active" : "Inactive"}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setEditCoupon(c); setShowCouponForm(true); }} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setCoupons(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive"><TrashIcon className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {view === "marketing" && showCouponForm && editCoupon && (
          <CouponForm coupon={editCoupon} onSave={saveCoupon} onCancel={() => { setShowCouponForm(false); setEditCoupon(null); }} />
        )}

        {/* ── CONTENT ── */}
        {view === "content" && !showBannerForm && (
          <div>
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Content Management</h1>
            <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5 w-fit">
              {(["banners", "pages"] as const).map(t => (
                <button key={t} onClick={() => setContentTab(t)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${contentTab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>{t === "banners" ? "Banners" : "Static Pages"}</button>
              ))}
            </div>
            {contentTab === "banners" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{banners.length} banners · {banners.filter(b => b.active).length} active</p>
                  <button onClick={() => { setEditBanner(emptyBanner()); setShowBannerForm(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl"><Plus className="w-4 h-4" />New Banner</button>
                </div>
                <div className="space-y-3">
                  {banners.map(b => (
                    <div key={b.id} className={`rounded-2xl p-4 bg-gradient-to-r ${b.bg} text-white`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {b.badge && <p className="text-xs text-white/70 mb-1">{b.badge}</p>}
                          <p className="font-extrabold text-base">{b.headline} {b.subheadline}</p>
                          <p className="text-white/70 text-xs mt-1 line-clamp-1">{b.subtext}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">CTA: {b.ctaPrimary}</span>
                            <span className={`text-[10px] font-bold ${b.active ? "text-emerald-300" : "text-red-300"}`}>{b.active ? "● Active" : "○ Hidden"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => setBanners(prev => prev.map(x => x.id === b.id ? { ...x, active: !x.active } : x))} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold">{b.active ? "Hide" : "Show"}</button>
                          <button onClick={() => { setEditBanner(b); setShowBannerForm(true); }} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setBanners(prev => prev.filter(x => x.id !== b.id))} className="p-2 bg-white/20 hover:bg-red-500/40 rounded-xl"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {banners.length === 0 && <div className="text-center py-10 text-muted-foreground bg-white border border-border rounded-2xl"><p className="font-medium">No banners yet</p></div>}
                </div>
              </div>
            )}
            {contentTab === "pages" && (
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted"><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Page</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Slug</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Last Updated</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th></tr></thead>
                  <tbody>
                    {[{ title: "About Us", slug: "/about", status: "published", updated: "2025-06-01" }, { title: "FAQ", slug: "/faq", status: "published", updated: "2025-06-15" }, { title: "Terms & Conditions", slug: "/terms", status: "published", updated: "2025-05-20" }, { title: "Privacy Policy", slug: "/privacy", status: "published", updated: "2025-05-20" }, { title: "Refund Policy", slug: "/refunds", status: "draft", updated: "2025-07-01" }].map(pg => (
                      <tr key={pg.slug} className="border-t border-border hover:bg-muted/30">
                        <td className="px-4 py-3 font-semibold text-sm">{pg.title}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{pg.slug}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pg.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"}`}>{pg.status}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{pg.updated}</td>
                        <td className="px-4 py-3"><button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {view === "content" && showBannerForm && editBanner && (
          <BannerForm banner={editBanner} onSave={saveBanner} onCancel={() => { setShowBannerForm(false); setEditBanner(null); }} />
        )}

        {/* ── REPORTS ── */}
        {view === "reports" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Reports</h1>
              <div className="flex items-center gap-2">
                <select value={reportPeriod} onChange={e => setReportPeriod(e.target.value as "weekly" | "monthly" | "yearly")} className="text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none font-medium"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
                <button onClick={() => downloadCSV([["Month", "Revenue", "Orders", "Avg Order"], ...salesData.map(d => [d.month, d.revenue.toString(), d.orders.toString(), Math.round(d.revenue / d.orders).toString()])], "carekart_report.csv")} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Download className="w-3.5 h-3.5" />Export CSV</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[{ label: "Total Revenue", value: "₹38.4L" }, { label: "Total Orders", value: "10,890" }, { label: "Avg Order Value", value: "₹3,527" }, { label: "Return Rate", value: "2.1%" }].map(s => (
                <div key={s.label} className="bg-white border border-border rounded-2xl p-4 text-center">
                  <p className="text-xl font-extrabold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-border rounded-2xl p-5 mb-5">
              <h2 className="font-bold text-sm mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart key="report-chart" data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#1741B0" strokeWidth={2.5} dot={{ fill: "#1741B0", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border"><h2 className="font-bold text-sm">Monthly Breakdown</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted"><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Month</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Revenue</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Orders</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Avg Order</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Growth</th></tr></thead>
                  <tbody>
                    {salesData.map((d, i) => {
                      const prev = salesData[i - 1];
                      const growth = prev ? Math.round((d.revenue - prev.revenue) / prev.revenue * 100) : null;
                      return (
                        <tr key={d.month} className="border-t border-border hover:bg-muted/30">
                          <td className="px-4 py-3 font-semibold">{d.month}</td>
                          <td className="px-4 py-3 font-bold">₹{d.revenue.toLocaleString()}</td>
                          <td className="px-4 py-3">{d.orders.toLocaleString()}</td>
                          <td className="px-4 py-3 text-muted-foreground">₹{Math.round(d.revenue / d.orders).toLocaleString()}</td>
                          <td className="px-4 py-3">{growth !== null ? <span className={`text-xs font-bold ${growth >= 0 ? "text-emerald-600" : "text-red-600"}`}>{growth >= 0 ? "+" : ""}{growth}%</span> : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {view === "settings" && (
          <div>
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Settings</h1>
            <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5 flex-wrap">
              {(["store", "payment", "shipping", "roles"] as const).map(t => (
                <button key={t} onClick={() => setSettingsTab(t)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${settingsTab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>
                  {t === "roles" ? "Admin Users" : t === "store" ? "Store Info" : t === "payment" ? "Payment" : "Shipping"}
                </button>
              ))}
            </div>
            {settingsTab === "store" && (
              <div className="bg-white border border-border rounded-2xl p-5 max-w-2xl space-y-4">
                <h2 className="font-bold text-sm">Store Information</h2>
                {[{ label: "Store Name", val: "CareKart Pvt. Ltd." }, { label: "GST Number", val: "27AABCC1234M1Z5" }, { label: "Support Email", val: "support@carekart.in" }, { label: "Support Phone", val: "+91 80 4567 8900" }, { label: "Website", val: "https://www.carekart.in" }].map(f => (
                  <div key={f.label}><label className="block text-xs font-semibold mb-1">{f.label}</label><input defaultValue={f.val} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
                ))}
                <div><label className="block text-xs font-semibold mb-1">Address</label><textarea rows={2} defaultValue="Andheri East, Mumbai, Maharashtra 400069, India" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" /></div>
                <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90">Save Changes</button>
              </div>
            )}
            {settingsTab === "payment" && (
              <div className="bg-white border border-border rounded-2xl p-5 max-w-2xl space-y-4">
                <h2 className="font-bold text-sm">Payment Configuration</h2>
                {[{ label: "Razorpay Key ID", val: "rzp_live_••••••••••••" }, { label: "Razorpay Key Secret", val: "••••••••••••••••••••" }, { label: "UPI ID", val: "carekart@ybl" }].map(f => (
                  <div key={f.label}><label className="block text-xs font-semibold mb-1">{f.label}</label><input defaultValue={f.val} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" /></div>
                ))}
                <div>
                  <p className="text-xs font-semibold mb-2">Accepted Payment Methods</p>
                  <div className="space-y-2">
                    {["UPI / QR Code", "Credit / Debit Card", "Net Banking", "EMI", "Cash on Delivery"].map(m => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" /><span className="text-sm">{m}</span></label>
                    ))}
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90">Save Changes</button>
              </div>
            )}
            {settingsTab === "shipping" && (
              <div className="bg-white border border-border rounded-2xl p-5 max-w-2xl space-y-4">
                <h2 className="font-bold text-sm">Shipping Configuration</h2>
                {[{ label: "Free Shipping Above (₹)", val: "2000" }, { label: "Default Shipping Charge (₹)", val: "99" }, { label: "Express Shipping Charge (₹)", val: "199" }, { label: "Dispatch Cutoff Time", val: "15:00" }].map(f => (
                  <div key={f.label}><label className="block text-xs font-semibold mb-1">{f.label}</label><input defaultValue={f.val} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
                ))}
                <div>
                  <p className="text-xs font-semibold mb-2">Shipping Zones</p>
                  <div className="space-y-2">
                    {[{ zone: "Metro Cities", rate: "₹49", days: "1–2 days" }, { zone: "Tier 2 Cities", rate: "₹79", days: "2–3 days" }, { zone: "Rest of India", rate: "₹99", days: "3–5 days" }].map(z => (
                      <div key={z.zone} className="flex items-center justify-between px-4 py-3 bg-muted rounded-xl text-sm">
                        <span className="font-semibold">{z.zone}</span>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground"><span>{z.days}</span><span className="font-bold text-foreground">{z.rate}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90">Save Changes</button>
              </div>
            )}
            {settingsTab === "roles" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">3 admin users</p>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl"><Plus className="w-4 h-4" />Add Admin</button>
                </div>
                <div className="bg-white border border-border rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-muted"><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th></tr></thead>
                    <tbody>
                      {[{ name: "Super Admin", email: "admin@carekart.in", role: "Super Admin", active: true }, { name: "Priya Ops", email: "priya.ops@carekart.in", role: "Manager", active: true }, { name: "Support Team", email: "support@carekart.in", role: "Support", active: false }].map(u => (
                        <tr key={u.email} className="border-t border-border hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-extrabold">{u.name[0]}</div><span className="font-semibold text-sm">{u.name}</span></div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === "Super Admin" ? "bg-primary/10 text-primary" : u.role === "Manager" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{u.role}</span></td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{u.active ? "Active" : "Inactive"}</span></td>
                          <td className="px-4 py-3"><button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Product Form ──────────────────────────────────────────────────────────────
function ProductForm({ product: initProduct, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const [p, setP] = useState<Product>({ ...initProduct });
  const update = (key: keyof Product, val: unknown) => setP(prev => ({ ...prev, [key]: val }));

  const addImageUrl = () => update("images", [...p.images, ""]);
  const setImageUrl = (i: number, val: string) => { const imgs = [...p.images]; imgs[i] = val; update("images", imgs); };
  const removeImage = (i: number) => update("images", p.images.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-xl"><ArrowLeft className="w-4 h-4" /></button>
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{initProduct.name ? "Edit Product" : "New Product"}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4">Basic Info</h2>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1">Product Name</label><input value={p.name} onChange={e => update("name", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Tagline</label><input value={p.tagline} onChange={e => update("tagline", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Description</label><textarea value={p.description} onChange={e => update("description", e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold mb-1">Category</label><select value={p.category} onChange={e => update("category", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">{CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="block text-xs font-semibold mb-1">Badge</label><input value={p.badge} onChange={e => update("badge", e.target.value)} placeholder="Bestseller, New…" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
              </div>
              <div><label className="block text-xs font-semibold mb-1">Material</label><input value={p.material} onChange={e => update("material", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Sizes (comma-separated)</label><input value={p.sizes.join(", ")} onChange={e => update("sizes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Features (one per line)</label><textarea value={p.features.join("\n")} onChange={e => update("features", e.target.value.split("\n").filter(Boolean))} rows={3} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm resize-none" /></div>
              <div className="flex items-center gap-3"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={p.inStock} onChange={e => update("inStock", e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm font-semibold">In Stock</span></label></div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="block text-xs font-semibold mb-1">Selling Price (₹)</label><input type="number" value={p.price} onChange={e => update("price", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">MRP (₹)</label><input type="number" value={p.mrp} onChange={e => update("mrp", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1">Min. Order Qty</label><input type="number" value={p.moq} onChange={e => update("moq", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
            </div>
            <h3 className="font-bold text-xs mb-2 text-muted-foreground uppercase tracking-wide">Bulk Pack Discounts (%)</h3>
            <div className="space-y-2">
              {PACK_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex-1">{label}</span>
                  {i === 0 ? <span className="text-xs font-bold text-muted-foreground w-20 text-center">0% (base)</span> : <div className="relative w-20"><input type="number" min={0} max={50} value={p.packDiscounts[i]} onChange={e => { const d = [...p.packDiscounts]; d[i] = Number(e.target.value); update("packDiscounts", d); }} className="w-full px-3 py-1.5 bg-muted rounded-lg border border-transparent focus:outline-none text-sm text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" />Product Images</h2>
            <div className="space-y-2 mb-3">
              {p.images.map((img, i) => (
                <div key={i} className="flex gap-2 items-center">
                  {typeof img === "string" && img.startsWith("http") ? <img src={img} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" /> : <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>}
                  <input value={typeof img === "string" && img.startsWith("http") ? img : ""} onChange={e => setImageUrl(i, e.target.value)} placeholder={`Image ${i+1} URL (https://...)`} className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs border border-transparent focus:outline-none" />
                  <button onClick={() => removeImage(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <button onClick={addImageUrl} className="w-full py-2 border-2 border-dashed border-border rounded-xl text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5" />Add Image URL</button>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Film className="w-4 h-4" />Product Video</h2>
            <input value={p.videoUrl} onChange={e => update("videoUrl", e.target.value)} placeholder="YouTube URL or direct video URL" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            <p className="text-[10px] text-muted-foreground mt-1.5">Supports YouTube (https://youtube.com/watch?v=...) or direct .mp4 links.</p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4">Specifications</h2>
            <div className="space-y-2">
              {Object.entries(p.specs).map(([k, v], i) => (
                <div key={i} className="flex gap-2">
                  <input defaultValue={k} className="w-1/3 px-2 py-1.5 bg-muted rounded-lg text-xs border border-transparent focus:outline-none" placeholder="Key" />
                  <input defaultValue={v} className="flex-1 px-2 py-1.5 bg-muted rounded-lg text-xs border border-transparent focus:outline-none" placeholder="Value" />
                  <button onClick={() => { const s = { ...p.specs }; delete s[k]; update("specs", s); }} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <button onClick={() => update("specs", { ...p.specs, "": "" })} className="w-full py-1.5 border border-dashed border-border rounded-lg text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5" />Add Spec</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={onCancel} className="px-6 py-3 border-2 border-border rounded-2xl text-sm font-semibold hover:bg-muted">Cancel</button>
        <button onClick={() => onSave(p)} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90">Save Product</button>
      </div>
    </div>
  );
}

// ─── Banner Form ───────────────────────────────────────────────────────────────
function BannerForm({ banner: initBanner, onSave, onCancel }: { banner: Banner; onSave: (b: Banner) => void; onCancel: () => void }) {
  const [b, setB] = useState<Banner>({ ...initBanner });
  const set = (key: keyof Banner, val: unknown) => setB(prev => ({ ...prev, [key]: val }));

  const pages: Page[] = ["home","listing","detail","cart","login"];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-xl"><ArrowLeft className="w-4 h-4" /></button>
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{initBanner.headline ? "Edit Banner" : "New Banner"}</h1>
      </div>

      {/* Live preview */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${b.bg} text-white p-6 mb-5 min-h-[140px] flex items-center`}>
        <div className="flex-1">
          {b.badge && <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold mb-2">{b.badge}</span>}
          <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">{b.headline || "Banner Headline"}</h2>
          {b.subheadline && <h3 className="text-lg font-extrabold text-white/80">{b.subheadline}</h3>}
          <p className="text-white/70 text-sm mt-1 max-w-sm">{b.subtext || "Banner subtext will appear here."}</p>
          <div className="flex gap-3 mt-4">
            {b.ctaPrimary && <span className="px-4 py-2 bg-white text-primary font-bold rounded-lg text-xs">{b.ctaPrimary}</span>}
            {b.ctaSecondary && <span className="px-4 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-lg text-xs">{b.ctaSecondary}</span>}
          </div>
        </div>
        <div className="absolute top-2 right-3 text-[10px] text-white/50 font-semibold">PREVIEW</div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-sm">Text Content</h2>
          <div><label className="block text-xs font-semibold mb-1">Badge Text</label><input value={b.badge} onChange={e => set("badge", e.target.value)} placeholder="🔥 Bulk orders ship same day" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Headline (Line 1)</label><input value={b.headline} onChange={e => set("headline", e.target.value)} placeholder="Medical-Grade PPE." className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Headline (Line 2, optional)</label><input value={b.subheadline} onChange={e => set("subheadline", e.target.value)} placeholder="Factory-Direct Prices." className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Subtext / Description</label><textarea value={b.subtext} onChange={e => set("subtext", e.target.value)} rows={2} placeholder="Short supporting text below the headline…" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:outline-none text-sm resize-none" /></div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-sm">Buttons &amp; Style</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold mb-1">Primary Button Text</label><input value={b.ctaPrimary} onChange={e => set("ctaPrimary", e.target.value)} placeholder="Shop Now" className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-transparent focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold mb-1">Primary Button Link</label><select value={b.ctaPrimaryLink} onChange={e => set("ctaPrimaryLink", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-transparent focus:outline-none">{pages.map(pg => <option key={pg} value={pg}>{pg}</option>)}</select></div>
          </div>
          <div><label className="block text-xs font-semibold mb-1">Secondary Button Text (optional)</label><input value={b.ctaSecondary} onChange={e => set("ctaSecondary", e.target.value)} placeholder="Learn More" className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-transparent focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold mb-1">Background Style</label><select value={b.bg} onChange={e => set("bg", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-transparent focus:outline-none">{BG_PRESETS.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}</select></div>
          <div><label className="block text-xs font-semibold mb-1">Image URL (optional, right side)</label><input value={b.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-transparent focus:outline-none" /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={b.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm font-semibold">Active (visible on home page)</span></label>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={onCancel} className="px-6 py-3 border-2 border-border rounded-2xl text-sm font-semibold hover:bg-muted">Cancel</button>
        <button onClick={() => onSave(b)} disabled={!b.headline} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-40">Save Banner</button>
      </div>
    </div>
  );
}

// ─── Coupon Form ───────────────────────────────────────────────────────────────
function CouponForm({ coupon: initCoupon, onSave, onCancel }: { coupon: Coupon; onSave: (c: Coupon) => void; onCancel: () => void }) {
  const [c, setC] = useState<Coupon>(initCoupon);
  const set = (k: keyof Coupon, v: unknown) => setC(prev => ({ ...prev, [k]: v }));
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back</button>
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{initCoupon.code ? "Edit Coupon" : "New Coupon"}</h1>
      </div>
      <div className="bg-white border border-border rounded-2xl p-6 max-w-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Coupon Code *</label>
          <input value={c.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="e.g. SAVE20" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono font-bold tracking-wider" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Discount Type</label>
            <select value={c.type} onChange={e => set("type", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm">
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">{c.type === "percent" ? "Discount %" : "Discount ₹"}</label>
            <input type="number" value={c.value} onChange={e => set("value", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Min Order Value (₹)</label>
            <input type="number" value={c.minOrder} onChange={e => set("minOrder", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Max Uses</label>
            <input type="number" value={c.maxUses} onChange={e => set("maxUses", Number(e.target.value))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Expiry Date</label>
          <input type="date" value={c.expiry} onChange={e => set("expiry", e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={c.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-primary" />
          <span className="text-sm font-semibold">Active</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button onClick={() => onSave(c)} disabled={!c.code.trim()} className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-50">Save Coupon</button>
          <button onClick={onCancel} className="px-6 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [detailId, setDetailId] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeOrderId, setActiveOrderId] = useState("");
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(INIT_BANNERS);
  const [users, setUsers] = useState<AppUser[]>(INIT_USERS);

  const handleLogin = (user: AppUser) => { setIsLoggedIn(true); setCurrentUser(user); setPage("account"); };
  const addUser = (user: AppUser) => setUsers(prev => [...prev.filter(u => u.phone !== user.phone), user]);

  const addToCart = (product: Product, size: string, packSize = 1, packPrice = product.price) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id && i.selectedSize === size && i.packSize === packSize);
      if (ex) return prev.map(i => i.id === product.id && i.selectedSize === size && i.packSize === packSize ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, selectedSize: size, packSize, packPrice }];
    });
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, qty: number) => { if (qty <= 0) return removeFromCart(id); setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const product = products.find(p => p.id === detailId) ?? products[0];
  const showHeader = page !== "login" && page !== "admin";
  const showBottomNav = page !== "login" && page !== "admin";

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      {showHeader && <Header cartCount={cartCount} setPage={setPage} isLoggedIn={isLoggedIn} page={page} />}

      {page === "home" && <HomePage products={products} setPage={setPage} setDetailId={setDetailId} addToCart={addToCart} banners={banners} />}
      {page === "listing" && <ListingPage products={products} setPage={setPage} setDetailId={setDetailId} addToCart={addToCart} />}
      {page === "detail" && <ProductDetailPage product={product} setPage={setPage} addToCart={addToCart} />}
      {page === "cart" && <CartPage cart={cart} setPage={setPage} updateQty={updateQty} removeFromCart={removeFromCart} />}
      {page === "checkout" && <CheckoutPage cart={cart} setPage={setPage} userPhone={currentUser?.phone ?? ""} />}
      {page === "confirmation" && <ConfirmationPage cart={cart} setPage={setPage} />}
      {page === "account" && <AccountDashboardPage currentUser={currentUser} setPage={setPage} isLoggedIn={isLoggedIn} setOrderId={setActiveOrderId} />}
      {page === "account-order" && <OrderDetailPage orderId={activeOrderId} setPage={setPage} />}
      {page === "admin" && <AdminPanel products={products} setProducts={setProducts} users={users} banners={banners} setBanners={setBanners} setPage={setPage} />}
      {page === "login" && <LoginPage onLogin={handleLogin} setPage={setPage} existingUsers={users} addUser={addUser} />}

      {showBottomNav && <MobileBottomNav page={page} setPage={setPage} cartCount={cartCount} isLoggedIn={isLoggedIn} />}
    </div>
  );
}
