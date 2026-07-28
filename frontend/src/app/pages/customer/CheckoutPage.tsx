import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, MapPin, CreditCard, Zap, Building2, IndianRupee, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import { useAddresses, useCreateAddress } from "../../hooks/useAddresses";
import { usePlaceOrder } from "../../hooks/useOrders";
import { requestOtp, verifyOtp as verifyOtpApi } from "../../lib/api/endpoints/auth";
import { updateProfile } from "../../lib/api/endpoints/users";
import { addCartItem } from "../../lib/api/endpoints/cart";
import { initiatePayment } from "../../lib/api/endpoints/payments";
import { setAccessToken } from "../../lib/api/tokenStore";
import { getLocalCart, clearLocalCart } from "../../lib/localCart";
import type { AuthUser } from "../../types/user";
import type { PaymentMethod } from "../../types/order";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function CheckoutPage() {
  const { status } = useAuth();

  if (status === "loading") {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24 text-sm text-muted-foreground">Loading…</div>;
  }
  if (status !== "authenticated") {
    return <CheckoutAuthGate />;
  }
  return <CheckoutWizard />;
}

// ─── Auth gate: guests must verify their phone before an order can be placed
// (so every order stays trackable) — the cart itself was already built without
// an account. Verifying here merges the local cart into the real server cart
// and only then flips AuthContext, so CheckoutWizard mounts with the merge
// already complete instead of racing it.
function CheckoutAuthGate() {
  const { loginCustomer } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<"phone" | "otp" | "name" | "merging">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [name, setName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pendingSession = useRef<{ accessToken: string; user: AuthUser } | null>(null);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const sendOtp = async () => {
    if (phone.length !== 10 || isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      await requestOtp(`+91${phone}`);
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
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
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const finishLogin = async (accessToken: string, user: AuthUser) => {
    setStep("merging");
    const localItems = getLocalCart();
    const skipped: string[] = [];
    for (const item of localItems) {
      try {
        await addCartItem({ productId: item.productId, sizeLabel: item.sizeLabel, tierIndex: item.tierIndex, quantity: item.quantity });
      } catch {
        skipped.push(item.name);
      }
    }
    clearLocalCart();
    await queryClient.invalidateQueries({ queryKey: ["cart"] });
    if (skipped.length > 0) {
      toast.warning(`Some items couldn't be added to your cart: ${skipped.join(", ")}`);
    }
    loginCustomer(accessToken, user);
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    try {
      const result = await verifyOtpApi(`+91${phone}`, code);
      // Token must be live before any authenticated call below, but we hold off
      // on loginCustomer() (which flips AuthContext) until the merge finishes.
      setAccessToken(result.accessToken, "customer");
      if (result.isNewUser) {
        pendingSession.current = { accessToken: result.accessToken, user: result.user };
        setStep("name");
      } else {
        await finishLogin(result.accessToken, result.user);
      }
    } catch (err) {
      toast.error(errorMessage(err));
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const submitName = async () => {
    if (!name.trim() || isSavingName || !pendingSession.current) return;
    setIsSavingName(true);
    try {
      const updatedUser = await updateProfile({ name: name.trim(), accountType: "RETAIL" });
      await finishLogin(pendingSession.current.accessToken, updatedUser);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSavingName(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) setTimeout(verifyOtp, 300);
  };

  const handleOtpKey = (i: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 pb-24 md:pb-10">
      <div className="bg-white border border-border rounded-2xl p-6">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">
          {step === "merging" ? "Setting up your account…" : "Sign in to place your order"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {step === "merging"
            ? "Hang tight, we're saving your cart."
            : "Your cart is saved. Verify your mobile number so you can track this order anytime."}
        </p>

        {step === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted rounded-xl border border-border text-sm font-semibold text-muted-foreground flex-shrink-0">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
            <button onClick={sendOtp} disabled={phone.length !== 10 || isSendingOtp} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
              {isSendingOtp ? "Sending…" : "Send OTP"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div>
            <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Change number
            </button>
            <p className="text-sm text-muted-foreground mb-4">
              Sent to <span className="font-semibold text-foreground">+91 {phone}</span>
            </p>
            <div className="flex gap-2 justify-between mb-5">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="tel"
                  maxLength={1}
                  value={d}
                  disabled={isVerifying}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  className="w-11 h-13 text-center text-lg font-bold bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:outline-none transition-colors aspect-square disabled:opacity-60"
                />
              ))}
            </div>
            <button onClick={verifyOtp} disabled={isVerifying || otp.join("").length !== 6} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
              {isVerifying ? "Verifying…" : "Verify & Continue"}
            </button>
            <div className="text-center mt-4">
              {timer > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Resend OTP in <span className="font-bold text-foreground">{timer}s</span>
                </p>
              ) : (
                <button onClick={resendOtp} disabled={isSendingOtp} className="text-xs text-primary font-semibold hover:underline disabled:opacity-50">
                  {isSendingOtp ? "Resending…" : "Resend OTP"}
                </button>
              )}
            </div>
          </div>
        )}

        {step === "name" && (
          <div>
            <label className="block text-xs font-semibold mb-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm mb-4"
              autoFocus
            />
            <button onClick={submitName} disabled={!name.trim() || isSavingName} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
              {isSavingName ? "Saving…" : "Continue"}
            </button>
          </div>
        )}

        {step === "merging" && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Address → Payment → Review, for an already-authenticated user ──────────
function CheckoutWizard() {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", name: "", line1: "", city: "", state: "", pin: "", phone: "" });
  const [payMethod, setPayMethod] = useState<PaymentMethod>("COD");
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!cartLoading && (cartData?.items.length ?? 0) === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartLoading, cartData, navigate]);

  const cartItems = cartData?.items ?? [];
  const subtotal = cartData?.subtotal ?? 0;
  const shipping = cartData?.shipping ?? 0;
  const total = cartData?.total ?? 0;
  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId) ?? null;
  const steps = ["Address", "Payment", "Review"];

  const handleSaveAddress = () => {
    if (!newAddr.name || !newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pin || !newAddr.phone) {
      toast.error("Please fill in all address fields");
      return;
    }
    createAddress.mutate(
      { label: newAddr.label, name: newAddr.name, line1: newAddr.line1, city: newAddr.city, state: newAddr.state, pincode: newAddr.pin, phone: newAddr.phone },
      {
        onSuccess: (addr) => {
          setSelectedAddressId(addr.id);
          setShowAddForm(false);
          setNewAddr({ label: "Home", name: "", line1: "", city: "", state: "", pin: "", phone: "" });
          toast.success("Address saved");
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || isPlacing) return;
    setIsPlacing(true);
    try {
      const order = await placeOrder.mutateAsync({ addressId: selectedAddressId, paymentMethod: payMethod });
      if (payMethod === "COD") {
        navigate(`/order-confirmation?orderId=${order.id}`);
        return;
      }
      try {
        const { redirectUrl } = await initiatePayment(order.id);
        window.location.href = redirectUrl;
      } catch {
        toast.error("Online payment isn't available right now. Your order was placed as unpaid — you can retry payment or switch to Cash on Delivery from your order.");
        navigate(`/order-confirmation?orderId=${order.id}`);
      }
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsPlacing(false);
    }
  };

  if (cartLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center pb-24 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[10px] mt-1 font-medium text-muted-foreground">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-16 h-0.5 mx-1 mb-4 ${i + 1 < step ? "bg-emerald-500" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Address
            </h2>
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl">
                <Plus className="w-3.5 h-3.5" />
                Add New
              </button>
            )}
          </div>

          {addressesLoading && <p className="text-sm text-muted-foreground py-6 text-center">Loading addresses…</p>}

          {!addressesLoading && !showAddForm && (
            <div className="space-y-2.5">
              {(addresses ?? []).map((addr) => (
                <label key={addr.id} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 accent-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold bg-muted px-2 py-0.5 rounded-lg">{addr.label ?? "Address"}</span>
                      {addr.isDefault && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="font-semibold text-sm">{addr.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{addr.line1}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">📞 {addr.phone}</p>
                  </div>
                </label>
              ))}
              {(addresses ?? []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-border" />
                  <p className="text-sm">No saved addresses yet — add one to continue</p>
                </div>
              )}
            </div>
          )}

          {showAddForm && (
            <div>
              <div className="flex gap-2 mb-3">
                {["Home", "Office", "Other"].map((l) => (
                  <button key={l} onClick={() => setNewAddr((a) => ({ ...a, label: l }))} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${newAddr.label === l ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { k: "name", label: "Full Name", ph: "Recipient name" },
                  { k: "line1", label: "Address", ph: "Flat, Street, Area" },
                  { k: "city", label: "City", ph: "Mumbai" },
                  { k: "state", label: "State", ph: "Maharashtra" },
                  { k: "pin", label: "PIN Code", ph: "400001" },
                  { k: "phone", label: "Phone", ph: "9876543210" },
                ].map((f) => (
                  <div key={f.k}>
                    <label className="block text-xs font-semibold mb-1">{f.label}</label>
                    <input
                      value={(newAddr as Record<string, string>)[f.k]}
                      onChange={(e) => setNewAddr((a) => ({ ...a, [f.k]: e.target.value }))}
                      placeholder={f.ph}
                      className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleSaveAddress} disabled={createAddress.isPending} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-40">
                  {createAddress.isPending ? "Saving…" : "Save Address"}
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showAddForm && (
            <button onClick={() => setStep(2)} disabled={!selectedAddressId} className="w-full mt-5 py-3 bg-primary text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed">
              Continue
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Method
          </h2>
          <div className="space-y-2 mb-5">
            {(
              [
                { id: "UPI", label: "UPI", sub: "PhonePe, GPay, Paytm", icon: Zap },
                { id: "CARD", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
                { id: "NETBANKING", label: "Net Banking", sub: "All major banks", icon: Building2 },
                { id: "COD", label: "Cash on Delivery", sub: "≤₹5000", icon: IndianRupee },
              ] as { id: PaymentMethod; label: string; sub: string; icon: typeof Zap }[]
            ).map((m) => (
              <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${payMethod === m.id ? "border-primary bg-secondary" : "border-border"}`}>
                <input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="accent-primary" />
                <m.icon className={`w-5 h-5 ${payMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-4 py-3 border-2 border-border rounded-2xl text-sm font-semibold">
              Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {selectedAddress && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivering to
              </h2>
              <p className="text-sm font-semibold">{selectedAddress.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">📞 {selectedAddress.phone}</p>
            </div>
          )}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-base mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <ImageWithFallback src={item.image ?? undefined} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.packQty > 1 ? `Pack of ${item.packQty}` : "1 unit"}</p>
                  </div>
                  <p className="font-bold text-sm">₹{item.lineTotal.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base border-t border-border pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} disabled={isPlacing} className="px-4 py-3 border-2 border-border rounded-2xl text-sm font-semibold disabled:opacity-40">
              Back
            </button>
            <button onClick={handlePlaceOrder} disabled={isPlacing} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl disabled:opacity-60">
              {isPlacing ? "Placing Order…" : `Place Order · ₹${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
