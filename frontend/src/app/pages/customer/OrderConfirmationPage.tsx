import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useOrder } from "../../hooks/useOrders";

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("orderId"));
  const paymentStatus = searchParams.get("status");
  const { data: order, isLoading } = useOrder(Number.isFinite(orderId) && orderId > 0 ? orderId : undefined);

  if (isLoading) {
    return <div className="max-w-xl mx-auto px-4 py-16 text-center pb-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!order) {
    // A bare "?status=error" with no orderId at all means the payment
    // provider's redirect itself was malformed or reconciliation failed —
    // there's no order to show, but the cart (untouched, since only a
    // successful payment ever clears it) still has the customer's items,
    // so a plain "couldn't find that order" dead-end isn't the honest
    // message here; offer the same retry path as a known failed payment.
    const noOrderId = !searchParams.get("orderId");
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center pb-24 md:pb-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">{noOrderId ? "Something went wrong" : "We couldn't find that order"}</h1>
        {noOrderId && <p className="text-muted-foreground text-sm mb-6">We couldn't confirm your payment status. Your cart is untouched — try again, or check your orders to see if it went through.</p>}
        <div className="flex gap-3">
          {noOrderId && <button onClick={() => navigate("/checkout")} className="flex-1 py-3 border-2 border-primary text-primary font-bold rounded-2xl">Try Again</button>}
          <button onClick={() => navigate("/account/orders")} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">View My Orders</button>
        </div>
      </div>
    );
  }

  const total = Number(order.totalAmount);
  const failedPayment = paymentStatus === "failed" || paymentStatus === "error";

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center pb-24 md:pb-12">
      {failedPayment ? (
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
      ) : (
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
      )}
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">{failedPayment ? "Payment Failed" : "Order Placed!"}</h1>
      <p className="text-muted-foreground text-sm mb-1">
        Order ID: <span className="font-mono font-bold text-foreground">{order.orderNumber}</span>
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        {failedPayment ? "Your order is saved but payment didn't go through — retry from your order details." : "Estimated delivery: "}
        {!failedPayment && <span className="font-semibold text-foreground">2–4 business days</span>}
      </p>
      <div className="bg-white border border-border rounded-2xl p-5 mb-6 text-left">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
            <ImageWithFallback src={item.imageUrl ?? undefined} className="w-12 h-12 rounded-xl object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.productName}</p>
              <p className="text-xs text-muted-foreground">{item.packQty > 1 ? `Pack of ${item.packQty}` : "1 unit"}</p>
            </div>
            <p className="font-bold text-sm">₹{Number(item.lineTotal).toLocaleString()}</p>
          </div>
        ))}
        <div className="border-t border-border mt-3 pt-3 flex justify-between font-extrabold">
          <span>Order Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
      {failedPayment ? (
        <div className="flex gap-3">
          {/* The cart survives a failed/cancelled payment (only a successful
              one clears it — see payments.service.ts), so the same items
              are still there to check out again. */}
          <button onClick={() => navigate("/checkout")} className="flex-1 py-3 border-2 border-primary text-primary font-bold rounded-2xl">Try Again</button>
          <button onClick={() => navigate("/cart")} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">Continue Shopping</button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => navigate(`/account/orders/${order.id}`)} className="flex-1 py-3 border-2 border-primary text-primary font-bold rounded-2xl">Track Order</button>
          {/* Cart is empty at this point (a successful payment is what
              clears it) — back to the shop, not to an empty cart page. */}
          <button onClick={() => navigate("/")} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl">Continue Shopping</button>
        </div>
      )}
    </div>
  );
}
