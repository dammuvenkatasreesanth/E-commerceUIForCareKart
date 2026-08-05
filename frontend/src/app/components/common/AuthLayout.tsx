import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShieldCheck, Lock, Truck } from "lucide-react";
import carekartLogo from "@/imports/_Linked_File_.png";

// Shared two-panel shell for every customer auth page (login, signup, forgot
// password, reset password, verify email) — extracted from the original
// LoginPage so the branded hero panel isn't duplicated four times.
export function AuthLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT PANEL: image + branding (desktop only) */}
      <div className="hidden md:flex md:w-1/2 relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1666887360934-2cffb560ed66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtZWRpY2FsJTIwZ2xvdmVzJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbCUyMFBQRXxlbnwxfHx8fDE3ODM5MDUzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-auth-from/90 via-auth-via/75 to-auth-to/60" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <div>
            <img src={carekartLogo} alt="CareKart Gloves" className="h-9 w-auto object-contain object-left brightness-0 invert" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-3">India's #1 B2B PPE Marketplace</p>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] leading-tight mb-4">
              Trusted by 50,000+<br />Healthcare Professionals
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Factory-direct nitrile gloves, N95 masks, and PPE kits. Bulk discounts, same-day dispatch, and GST-compliant invoicing.
            </p>
            <div className="flex gap-6 mt-8">
              {[{ val: "₹2Cr+", label: "Monthly GMV" }, { val: "2-Day", label: "Avg Delivery" }, { val: "ISO", label: "Certified" }].map((s) => (
                <div key={s.label}>
                  <p className="text-white font-extrabold text-lg">{s.val}</p>
                  <p className="text-white/60 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ISO 13485", "CE Marked", "FDA Listed", "BIS Certified"].map((b) => (
              <span key={b} className="px-3 py-1 bg-white/15 border border-white/20 rounded-full text-white/90 text-[11px] font-semibold backdrop-blur-sm">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: form */}
      <div className="flex-1 md:w-1/2 flex flex-col min-h-screen md:min-h-0 bg-white">
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border">
          <img src={carekartLogo} alt="CareKart Gloves" className="h-7 w-auto object-contain" />
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground font-semibold flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Back to store</button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 xl:px-16 py-8 overflow-y-auto">
          <div className="hidden md:flex items-center justify-between mb-10">
            <div />
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 hover:text-foreground transition-colors"><ArrowLeft className="w-3.5 h-3.5" />Back to store</button>
          </div>

          <div className="w-full max-w-sm mx-auto">
            {children}

            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-border">
              {[{ icon: ShieldCheck, label: "ISO Certified" }, { icon: Lock, label: "Secure Checkout" }, { icon: Truck, label: "Pan-India" }].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  <t.icon className="w-4.5 h-4.5 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-6 text-center">
          <p className="text-[10px] text-muted-foreground">© 2025 CareKart Pvt. Ltd. · By continuing you agree to our <span className="underline cursor-pointer">Terms</span> &amp; <span className="underline cursor-pointer">Privacy Policy</span></p>
        </div>
      </div>
    </div>
  );
}
