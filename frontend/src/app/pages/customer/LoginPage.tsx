import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Check, ShieldCheck, Lock, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { requestOtp, verifyOtp as verifyOtpApi } from "../../lib/api/endpoints/auth";
import carekartLogo from "@/imports/_Linked_File_.png";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

// ─── Login Page (Phone → OTP → Registration) ──────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(["","","","","",""]);
  const [timer, setTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { if (timer > 0) { const t = setTimeout(() => setTimer(v => v - 1), 1000); return () => clearTimeout(t); } }, [timer]);

  const from = (location.state as { from?: Location } | null)?.from;

  const goAfterLogin = () => {
    navigate(from ? `${from.pathname}${from.search ?? ""}` : "/account");
  };

  const sendOtp = async () => {
    if (phone.length !== 10 || isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      await requestOtp(`+91${phone}`);
      setStep("otp");
      setOtp(["","","","","",""]);
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const resendOtp = async () => {
    if (isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      await requestOtp(`+91${phone}`);
      setOtp(["","","","","",""]);
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    try {
      const result = await verifyOtpApi(`+91${phone}`, code);
      loginCustomer(result.accessToken, result.user);
      if (result.isNewUser) {
        // loginCustomer() just flipped AuthContext to "authenticated", which would
        // make RedirectIfAuthenticated bounce us away from /login on the next
        // render — navigate to the unguarded /complete-profile route instead of
        // using local step state, so the profile form actually gets to render.
        navigate("/complete-profile", { state: { from } });
      } else {
        goAfterLogin();
      }
    } catch (err) {
      toast.error(errorMessage(err));
      setOtp(["","","","","",""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) setTimeout(verifyOtp, 300);
  };

  const handleOtpKey = (i: number, e: KeyboardEvent) => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── LEFT PANEL: image + branding (desktop only) ── */}
      <div className="hidden md:flex md:w-1/2 relative flex-col overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1666887360934-2cffb560ed66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtZWRpY2FsJTIwZ2xvdmVzJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbCUyMFBQRXxlbnwxfHx8fDE3ODM5MDUzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-auth-from/90 via-auth-via/75 to-auth-to/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div>
            <img src={carekartLogo} alt="CareKart Gloves" className="h-9 w-auto object-contain object-left brightness-0 invert" />
          </div>

          {/* Middle tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-3">India's #1 B2B PPE Marketplace</p>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] leading-tight mb-4">
              Trusted by 50,000+<br />Healthcare Professionals
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Factory-direct nitrile gloves, N95 masks, and PPE kits. Bulk discounts, same-day dispatch, and GST-compliant invoicing.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mt-8">
              {[{ val: "₹2Cr+", label: "Monthly GMV" }, { val: "2-Day", label: "Avg Delivery" }, { val: "ISO", label: "Certified" }].map(s => (
                <div key={s.label}>
                  <p className="text-white font-extrabold text-lg">{s.val}</p>
                  <p className="text-white/60 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges bottom */}
          <div className="flex flex-wrap gap-2">
            {["ISO 13485", "CE Marked", "FDA Listed", "BIS Certified"].map(b => (
              <span key={b} className="px-3 py-1 bg-white/15 border border-white/20 rounded-full text-white/90 text-[11px] font-semibold backdrop-blur-sm">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: form ── */}
      <div className="flex-1 md:w-1/2 flex flex-col min-h-screen md:min-h-0 bg-white">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border">
          <img src={carekartLogo} alt="CareKart Gloves" className="h-7 w-auto object-contain" />
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground font-semibold flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Back to store</button>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 xl:px-16 py-8 overflow-y-auto">
          {/* Desktop logo + back link */}
          <div className="hidden md:flex items-center justify-between mb-10">
            <div />
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 hover:text-foreground transition-colors"><ArrowLeft className="w-3.5 h-3.5" />Back to store</button>
          </div>

          <div className="w-full max-w-sm mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-6">
              {(["phone", "otp"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all ${step === s ? "bg-primary text-white" : i < ["phone", "otp"].indexOf(step) ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {i < ["phone", "otp"].indexOf(step) ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  {i < 1 && <div className={`h-px w-6 transition-all ${i < ["phone", "otp"].indexOf(step) ? "bg-emerald-500" : "bg-border"}`} />}
                </div>
              ))}
              <span className="ml-1 text-xs text-muted-foreground font-medium capitalize">{step === "phone" ? "Phone" : "Verify"}</span>
            </div>

            {/* Phone step */}
            {step === "phone" && (
              <div>
                <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground mb-6">Enter your mobile number to login or sign up</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted rounded-xl border border-border text-sm font-semibold text-muted-foreground flex-shrink-0">
                        <span>🇮🇳</span><span>+91</span>
                      </div>
                      <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && sendOtp()} placeholder="98765 43210" className="flex-1 px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">We'll send a 6-digit OTP to verify your number</p>
                  </div>
                  <button onClick={sendOtp} disabled={phone.length !== 10 || isSendingOtp} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    {isSendingOtp ? "Sending…" : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* OTP step */}
            {step === "otp" && (
              <div>
                <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-sm text-muted-foreground mb-5 hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" />Change number</button>
                <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Verify OTP</h1>
                <p className="text-sm text-muted-foreground mb-6">Sent to <span className="font-semibold text-foreground">+91 {phone}</span></p>
                <div>
                  <label className="block text-xs font-semibold mb-2">Enter 6-digit OTP</label>
                  <div className="flex gap-2 justify-between mb-5">
                    {otp.map((d, i) => (
                      <input key={i} ref={el => { otpRefs.current[i] = el; }} type="tel" maxLength={1} value={d} disabled={isVerifying}
                        onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(i, e)}
                        className="w-11 h-13 text-center text-lg font-bold bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:outline-none transition-colors aspect-square disabled:opacity-60" />
                    ))}
                  </div>
                  <button onClick={verifyOtp} disabled={isVerifying || otp.join("").length !== 6} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">{isVerifying ? "Verifying…" : "Verify & Continue"}</button>
                  <div className="text-center mt-4">
                    {timer > 0
                      ? <p className="text-xs text-muted-foreground">Resend OTP in <span className="font-bold text-foreground">{timer}s</span></p>
                      : <button onClick={resendOtp} disabled={isSendingOtp} className="text-xs text-primary font-semibold hover:underline disabled:opacity-50">{isSendingOtp ? "Resending…" : "Resend OTP"}</button>}
                  </div>
                </div>
              </div>
            )}

            {/* Trust row */}
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-border">
              {[{ icon: ShieldCheck, label: "ISO Certified" }, { icon: Lock, label: "Secure OTP" }, { icon: Truck, label: "Pan-India" }].map(t => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  <t.icon className="w-4.5 h-4.5 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 md:px-10 pb-6 text-center">
          <p className="text-[10px] text-muted-foreground">© 2025 CareKart Pvt. Ltd. · By continuing you agree to our <span className="underline cursor-pointer">Terms</span> &amp; <span className="underline cursor-pointer">Privacy Policy</span></p>
        </div>
      </div>
    </div>
  );
}
