import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Phone, Mail, Globe, Lock } from "lucide-react";
import { Logo } from "../Logo";

// Footer link labels that have a real destination page behind them —
// everything else in the Company/Support columns is still placeholder copy
// with no page built for it, so it stays non-clickable.
const FOOTER_LINK_HREFS: Record<string, string> = {
  "About Us": "/about-us",
  "Returns & Refunds": "/cancellation-refund-policy",
  "Shipping Policy": "/shipping-delivery-policy",
};

// Rendered once by CustomerLayout so every customer-facing page gets it, not
// just the homepage.
export function Footer() {
  return (
    <footer className="border-t border-border pt-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
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
              <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /><a href="tel:+919035557875" className="hover:text-foreground transition-colors">+91 90355 57875</a></p>
              <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /><a href="mailto:care@mycarekart.com" className="hover:text-foreground transition-colors">care@mycarekart.com</a></p>
              <p className="flex items-center gap-1.5"><Globe className="w-3 h-3" />www.mycarekart.com</p>
            </div>
          </div>
          {[
            { title: "Products", links: ["Nitrile Gloves", "Latex Gloves", "Vinyl Gloves", "N95 Masks", "Face Shields", "PPE Kits", "Sanitizers", "Lab Coats"] },
            { title: "Company", links: ["About Us", "Careers", "Press / Media", "Certifications", "CSR Initiatives", "Partner with Us"] },
            { title: "Support", links: ["Help Centre", "Track My Order", "Shipping Policy", "Returns & Refunds", "Bulk Enquiry", "GST Invoice Help", "Contact Us"] },
          ].map(col => (
            <div key={col.title}>
              <p className="font-bold text-sm mb-3">{col.title}</p>
              <div className="space-y-2">
                {col.links.map(l => {
                  const href = FOOTER_LINK_HREFS[l];
                  return href ? (
                    <Link key={l} to={href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                  ) : (
                    <p key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="border-t border-border py-4 flex flex-wrap items-center justify-center gap-4">
          {["ISO 13485", "CE Mark", "FDA Listed", "FSSAI", "BIS"].map(c => <span key={c} className="px-3 py-1 bg-muted rounded-lg text-[11px] font-semibold text-muted-foreground">{c}</span>)}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center">
          <p>© 2025 Potent Brand Solutions Pvt. Ltd. All rights reserved. Carekart is our registered brand.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" />256-bit SSL</span>
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-foreground transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
