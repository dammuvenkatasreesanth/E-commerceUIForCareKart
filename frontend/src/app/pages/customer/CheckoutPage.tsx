import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, MapPin, CreditCard, Zap, Building2, IndianRupee, Plus, Mail, Tag, X } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import { useAddresses, useCreateAddress } from "../../hooks/useAddresses";
import { usePlaceOrder, useCancelOrder } from "../../hooks/useOrders";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";
import { usePollForVerification } from "../../hooks/usePollForVerification";
import { OAuthButtons } from "../../components/common/OAuthButtons";
import { customerLogin, customerSignup, resendVerification } from "../../lib/api/endpoints/auth";
import { initiatePayment } from "../../lib/api/endpoints/payments";
import { quoteCart } from "../../lib/api/endpoints/cart";
import { setPostVerifyRedirect } from "../../lib/postVerifyRedirect";
import type { Address } from "../../types/address";
import type { PaymentMethod } from "../../types/order";
import type { CartQuoteLineItem } from "../../types/cart";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

type NewAddressForm = { label: string; name: string; line1: string; city: string; state: string; pin: string; phone: string };

// Shared between the mobile step-wizard and the desktop single-page layout —
// same address list + add-new form, just placed differently by each caller.
function AddressList({ addresses, selectedAddressId, onSelect }: { addresses: Address[]; selectedAddressId: number | null; onSelect: (id: number) => void }) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="w-10 h-10 mx-auto mb-2 text-border" />
        <p className="text-sm">No saved addresses yet — add one to continue</p>
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {addresses.map((addr) => (
        <label key={addr.id} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
          <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => onSelect(addr.id)} className="mt-1 accent-primary" />
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
    </div>
  );
}

function AddressForm({ value, onChange, onSave, onCancel, isSaving }: { value: NewAddressForm; onChange: (v: NewAddressForm) => void; onSave: () => void; onCancel: () => void; isSaving: boolean }) {
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {["Home", "Office", "Other"].map((l) => (
          <button key={l} onClick={() => onChange({ ...value, label: l })} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${value.label === l ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
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
              value={(value as Record<string, string>)[f.k]}
              onChange={(e) => onChange({ ...value, [f.k]: e.target.value })}
              placeholder={f.ph}
              className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={onSave} disabled={isSaving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-40">
          {isSaving ? "Saving…" : "Save Address"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">
          Cancel
        </button>
      </div>
    </div>
  );
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; sub: string; icon: typeof Zap }[] = [
  { id: "UPI", label: "UPI", sub: "PhonePe, GPay, Paytm", icon: Zap },
  { id: "CARD", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "NETBANKING", label: "Net Banking", sub: "All major banks", icon: Building2 },
  { id: "COD", label: "Cash on Delivery", sub: "≤₹5000", icon: IndianRupee },
];

function PaymentMethodOptions({ payMethod, onSelect }: { payMethod: PaymentMethod; onSelect: (m: PaymentMethod) => void }) {
  return (
    <div className="space-y-2">
      {PAYMENT_OPTIONS.map((m) => (
        <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${payMethod === m.id ? "border-primary bg-secondary" : "border-border"}`}>
          <input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => onSelect(m.id)} className="accent-primary" />
          <m.icon className={`w-5 h-5 ${payMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="font-semibold text-sm">{m.label}</p>
            <p className="text-[11px] text-muted-foreground">{m.sub}</p>
          </div>
        </label>
      ))}
    </div>
  );
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

// ─── Auth gate: guests must sign in before an order can be placed (so every
// order stays trackable) — the cart itself was already built without an
// account. Authenticating here merges the local cart into the real server
// cart via the same shared hook LoginPage uses, and only then flips
// AuthContext, so CheckoutWizard mounts with the merge already complete.
function CheckoutAuthGate() {
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  // Covers the case where the emailed link gets opened somewhere other than
  // this tab (a different device, or the mail app's own browser). No explicit
  // navigation needed on completion — authenticateAndMergeCart flips
  // AuthContext, and CheckoutPage's status check swaps this gate out for
  // CheckoutWizard automatically, buyNow state intact (same page instance).
  usePollForVerification({ email: email.trim(), password, enabled: signupSent, onDone: () => {} });

  const handleLogin = async () => {
    if (!email.trim() || !password || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await customerLogin(email.trim(), password);
      await authenticateAndMergeCart(result.accessToken, result.user);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || isSubmitting) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsSubmitting(true);
    try {
      await customerSignup(name.trim(), email.trim(), password);
      // The emailed verification link is a fresh page load, not client-side
      // navigation, so this can't ride location.state — VerifyEmailPage reads
      // it back out of storage after it verifies.
      setPostVerifyRedirect("/checkout");
      setSignupSent(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      await resendVerification(email.trim());
      toast.success("Verification email sent again.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  if (signupSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 pb-24 md:pb-10">
        <div className="bg-white border border-border rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Click it to activate your account and come back here to finish your order.
          </p>
          <button onClick={handleResend} disabled={isResending} className="text-xs text-primary font-semibold hover:underline disabled:opacity-50">
            {isResending ? "Resending…" : "Didn't get it? Resend email"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 pb-24 md:pb-10">
      <div className="bg-white border border-border rounded-2xl p-6">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">
          {mode === "login" ? "Sign in to place your order" : "Create an account to place your order"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">Your cart is saved — sign in or sign up to continue.</p>

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus={mode === "login"} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && mode === "login" && handleLogin()}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
            />
          </div>
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder="Re-enter password"
                className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
          )}

          <button
            onClick={mode === "login" ? handleLogin : handleSignup}
            disabled={isSubmitting || !email.trim() || !password || (mode === "signup" && !name.trim())}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            {isSubmitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground font-medium">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <OAuthButtons onAuthenticated={() => { /* AuthContext flip triggers CheckoutWizard to mount */ }} />

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? (
            <>Don't have an account? <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Address → Payment → Review, for an already-authenticated user ──────────
function CheckoutWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  // "Buy Now" from the product detail page — a single ad-hoc item, priced the
  // same way a guest's local cart is (POST /cart/quote), that bypasses the
  // real server cart entirely rather than merging into it.
  const buyNow = (location.state as { buyNow?: CartQuoteLineItem } | null)?.buyNow;
  const realCart = useCart();
  const buyNowQuote = useQuery({
    queryKey: ["cart-quote", "buy-now", buyNow],
    queryFn: () => quoteCart([buyNow as CartQuoteLineItem]),
    enabled: !!buyNow,
  });
  const { data: cartData, isLoading: cartLoading } = buyNow ? buyNowQuote : realCart;
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<NewAddressForm>({ label: "Home", name: "", line1: "", city: "", state: "", pin: "", phone: "" });
  const [payMethod, setPayMethod] = useState<PaymentMethod>("COD");
  const [isPlacing, setIsPlacing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  // Order was placed and paid-online, but we hold off actually leaving for
  // PhonePe's hosted page for a few seconds — window.location.href is a real
  // navigation away from this app, so it's the last moment a "changed my
  // mind" cancel button can exist at all.
  const [pendingRedirect, setPendingRedirect] = useState<{ orderId: number; redirectUrl: string } | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const cancelPendingPayment = useCancelOrder(pendingRedirect?.orderId ?? -1);

  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    // pendingRedirect: the order was already placed (which clears the real
    // cart and invalidates this query) and we're showing the "redirecting to
    // payment" interstitial — an empty cart at that point is expected, not a
    // reason to bounce the user away from it.
    if (buyNow || cartLoading || pendingRedirect) return;
    if ((cartData?.items.length ?? 0) === 0) {
      navigate("/cart", { replace: true });
    }
  }, [buyNow, cartLoading, cartData, pendingRedirect, navigate]);

  useEffect(() => {
    // The item went out of stock or was removed between the PDP and here.
    if (buyNow && !cartLoading && (cartData?.items.length ?? 0) === 0) {
      toast.error(cartData?.invalidItems?.[0]?.reason ?? "This item is no longer available");
      navigate(-1);
    }
  }, [buyNow, cartLoading, cartData, navigate]);

  useEffect(() => {
    if (!pendingRedirect) return;
    if (redirectCountdown <= 0) {
      window.location.href = pendingRedirect.redirectUrl;
      return;
    }
    const t = setTimeout(() => setRedirectCountdown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [pendingRedirect, redirectCountdown]);

  const handleCancelPendingPayment = () => {
    if (!pendingRedirect) return;
    cancelPendingPayment.mutate("Cancelled by customer before completing payment", {
      onSuccess: () => {
        toast.success("Payment cancelled. Your order was not charged.");
        setPendingRedirect(null);
        if (buyNow) navigate(-1);
        else navigate("/cart");
      },
      onError: () => toast.error("Couldn't cancel in time — continuing to the payment page."),
    });
  };

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
      const order = await placeOrder.mutateAsync({
        addressId: selectedAddressId,
        paymentMethod: payMethod,
        couponCode: appliedCoupon ?? undefined,
        buyNow,
      });
      if (payMethod === "COD") {
        navigate(`/order-confirmation?orderId=${order.id}`);
        return;
      }
      try {
        const { redirectUrl } = await initiatePayment(order.id);
        setRedirectCountdown(5);
        setPendingRedirect({ orderId: order.id, redirectUrl });
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

  if (pendingRedirect) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center pb-24 md:pb-16">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CreditCard className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Redirecting to secure payment…</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You'll be taken to PhonePe to complete your payment in {redirectCountdown}s.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => { window.location.href = pendingRedirect.redirectUrl; }} className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors">
            Continue Now
          </button>
          <button
            onClick={handleCancelPendingPayment}
            disabled={cancelPendingPayment.isPending}
            className="w-full py-3 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelPendingPayment.isPending ? "Cancelling…" : "Cancel Payment"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="md:hidden max-w-2xl mx-auto px-4 py-6 pb-24">
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
            <AddressList addresses={addresses ?? []} selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
          )}

          {showAddForm && (
            <AddressForm value={newAddr} onChange={setNewAddr} onSave={handleSaveAddress} onCancel={() => setShowAddForm(false)} isSaving={createAddress.isPending} />
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
          <div className="mb-5">
            <PaymentMethodOptions payMethod={payMethod} onSelect={setPayMethod} />
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

    {/* ─── Desktop: single-page two-column layout (mobile keeps the step wizard above) ─── */}
    <div className="hidden md:block max-w-6xl mx-auto px-4 py-8 pb-16">
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-6">Checkout</h1>
      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Information
            </h2>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl text-sm">
              <span className="flex-1">{user?.email ?? "—"}</span>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

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
              <AddressList addresses={addresses ?? []} selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
            )}
            {showAddForm && (
              <AddressForm value={newAddr} onChange={setNewAddr} onSave={handleSaveAddress} onCancel={() => setShowAddForm(false)} isSaving={createAddress.isPending} />
            )}
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Method
            </h2>
            <PaymentMethodOptions payMethod={payMethod} onSelect={setPayMethod} />
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-6">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <ImageWithFallback src={item.image ?? undefined} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.packQty > 1 ? `Pack of ${item.packQty}` : "1 unit"}</p>
                  </div>
                  <p className="font-bold text-sm whitespace-nowrap">₹{item.lineTotal.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 bg-secondary rounded-xl text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <Tag className="w-3.5 h-3.5" />
                    {appliedCoupon} applied
                  </span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponInput(""); }} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                  />
                  <button
                    onClick={() => couponInput.trim() && setAppliedCoupon(couponInput.trim())}
                    disabled={!couponInput.trim()}
                    className="px-4 py-2 bg-foreground text-white text-sm font-bold rounded-xl disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
              )}
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

            <button onClick={handlePlaceOrder} disabled={isPlacing || !selectedAddressId} className="w-full mt-5 py-3 bg-primary text-white font-bold rounded-2xl disabled:opacity-60">
              {isPlacing ? "Placing Order…" : `Place Order — ₹${total.toLocaleString()}`}
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-3">🔒 Secure checkout · encrypted payment</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
