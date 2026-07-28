import { useNavigate } from "react-router";
import { ShoppingCart, Minus, Plus, Trash2, Lock, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "../../hooks/useCart";
import { removeLocalCartItem } from "../../lib/localCart";

export function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24 text-sm text-muted-foreground">Loading…</div>;
  }

  const cart = data?.items ?? [];
  const invalidItems = data?.invalidItems ?? [];
  const subtotal = data?.subtotal ?? 0;
  const shipping = data?.shipping ?? 0;
  const total = data?.total ?? 0;

  if (cart.length === 0 && invalidItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24">
        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4"><ShoppingCart className="w-10 h-10 text-muted-foreground" /></div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">Add products to get started</p>
        <button onClick={() => navigate("/products")} className="px-6 py-3 bg-primary text-white font-bold rounded-2xl">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Cart ({cart.length})</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex gap-3">
              <ImageWithFallback src={item.image ?? undefined} alt={item.name} className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Size: {item.sizeLabel} · {item.packQty > 1 ? `Pack of ${item.packQty}` : "1 unit"}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1.5 bg-muted rounded-xl p-1"><button onClick={() => updateCartItem.mutate({ item, quantity: item.quantity - 1 })} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white"><Minus className="w-3 h-3" /></button><span className="w-6 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateCartItem.mutate({ item, quantity: item.quantity + 1 })} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white"><Plus className="w-3 h-3" /></button></div>
                  <p className="font-extrabold text-sm">₹{item.lineTotal.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => removeCartItem.mutate(item)} className="self-start p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {invalidItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-2"><AlertTriangle className="w-3.5 h-3.5" />Some items in your cart are no longer available</p>
              <ul className="space-y-1.5">
                {invalidItems.map((i, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs text-amber-700">
                    <span>{i.reason}</span>
                    <button
                      onClick={() => removeLocalCartItem({ productId: i.productId, sizeLabel: i.sizeLabel, tierIndex: i.tierIndex })}
                      className="font-semibold underline hover:no-underline flex-shrink-0 ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 sticky top-20 self-start">
          <h2 className="font-bold text-base mb-4">Order Summary</h2>
          <div className="space-y-2.5 text-sm mb-4"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${shipping}`}</span></div><div className="h-px bg-border" /><div className="flex justify-between font-extrabold text-base"><span>Total</span><span>₹{total.toLocaleString()}</span></div></div>
          <button onClick={() => navigate("/checkout")} disabled={cart.length === 0} className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">Proceed to Checkout</button>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground"><Lock className="w-3 h-3" />Secure checkout</div>
        </div>
      </div>
    </div>
  );
}
