import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft, Play, CheckCircle, Zap, Minus, Plus,
  ShoppingCart, Heart, Truck, Shield, RefreshCw, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Stars } from "../../components/common/Stars";
import { useProduct } from "../../hooks/useCatalog";
import { useAddToCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { useIsWishlisted, useAddToWishlist, useRemoveFromWishlist } from "../../hooks/useWishlist";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { status } = useAuth();
  const { data: product, isLoading } = useProduct(slug);
  const addToCartMutation = useAddToCart();
  const isWishlisted = useIsWishlisted(product?.id ?? -1);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [mediaIdx, setMediaIdx] = useState(0); // 0..images.length-1 = images, images.length = video
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPack, setSelectedPack] = useState(0); // index into product.packTiers
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  // Reset selectors whenever a (new) product loads.
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]?.size ?? "");
      setSelectedPack(0);
      setQty(1);
      setMediaIdx(0);
    }
  }, [product]);

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center pb-24">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <button onClick={() => navigate("/products")} className="px-6 py-3 bg-primary text-white font-bold rounded-2xl">Browse Products</button>
      </div>
    );
  }

  const packTiers = product.packTiers;
  const hasVideo = !!product.videoUrl;
  const videoUrl = product.videoUrl ?? "";
  const totalMedia = product.images.length + (hasVideo ? 1 : 0);
  const isVideoSelected = hasVideo && mediaIdx === product.images.length;

  const activeTier = packTiers[selectedPack] ?? packTiers[0];
  const uPrice = Number(product.price);
  const mrp = Number(product.mrp);
  const tierDiscount = activeTier ? Number(activeTier.discountPct) : 0;
  const tierQty = activeTier?.packQty ?? 1;
  const tPrice = Math.round(uPrice * (1 - tierDiscount / 100));
  const totalUnits = tierQty * qty;
  const totalPrice = tPrice * tierQty * qty;
  const discount = mrp > 0 ? Math.round((1 - uPrice / mrp) * 100) : 0;

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const ytId = videoUrl.includes("youtu.be") ? videoUrl.split("/").pop()?.split("?")[0] : new URLSearchParams(new URL(videoUrl || "https://a.com").search).get("v");

  const features = product.features ?? [];
  const specs = product.specs ?? {};

  const handleToggleWishlist = () => {
    if (status !== "authenticated") {
      toast.info("Please log in to save items to your wishlist");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist.mutate(product.id, { onError: () => toast.error("Couldn't update wishlist") });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => toast.success("Saved to wishlist"),
        onError: () => toast.error("Couldn't update wishlist"),
      });
    }
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? null,
        sizeLabel: selectedSize,
        tierIndex: activeTier?.tierIndex ?? 0,
        quantity: qty,
      },
      {
        onSuccess: () => toast.success("Added to cart"),
        onError: () => toast.error("Couldn't add to cart"),
      },
    );
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        buyNow: {
          productId: product.id,
          sizeLabel: selectedSize,
          tierIndex: activeTier?.tierIndex ?? 0,
          quantity: qty,
        },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <button onClick={() => navigate("/products")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Media column */}
        <div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-shrink-0">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setMediaIdx(i)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${mediaIdx === i && !isVideoSelected ? "border-primary shadow-sm" : "border-transparent hover:border-border"}`}>
                  <ImageWithFallback src={img.url} alt="" className="w-full h-full object-cover" />
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
                  <video src={videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" />
                )
              ) : (
                <>
                  <ImageWithFallback src={product.images[mediaIdx]?.url ?? product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                  {product.badge && <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-full">{product.badge}</span>}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-5">
                    <p className="text-white font-extrabold text-base md:text-xl leading-tight font-['Plus_Jakarta_Sans']">{product.tagline}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {features.map(f => <div key={f} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1"><CheckCircle className="w-3 h-3 flex-shrink-0" /><span className="text-[11px] font-semibold">{f}</span></div>)}
          </div>
        </div>

        {/* Info column */}
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3"><Stars rating={Number(product.ratingAvg)} /><span className="text-sm font-bold">{product.ratingAvg}</span><span className="text-sm text-muted-foreground">({product.ratingCount.toLocaleString()} reviews)</span></div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-extrabold">₹{uPrice}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{discount}% off</span>
          </div>
          {product.sizes.length > 1 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground">Size / Variant</p>
              <div className="flex gap-2 flex-wrap">{product.sizes.map(s => <button key={s.id} onClick={() => setSelectedSize(s.size)} className={`px-3.5 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all ${selectedSize === s.size ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}>{s.size}</button>)}</div>
            </div>
          )}

          {/* Pack selector — full row per pack */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Choose Quantity Pack</p>
              <span className="text-[10px] text-accent font-semibold flex items-center gap-1"><Zap className="w-3 h-3" />Bulk savings</span>
            </div>
            <div className="flex flex-col gap-2">
              {packTiers.map((tier, i) => {
                const isActive = i === selectedPack;
                const tierPct = Number(tier.discountPct);
                const packUnitPrice = Math.round(uPrice * (1 - tierPct / 100));
                const saving = uPrice - packUnitPrice;
                const tagColors = ["", "bg-primary text-white", "bg-accent text-white", "bg-orange-500 text-white"];
                return (
                  <button key={tier.id} onClick={() => setSelectedPack(i)} className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 bg-white"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isActive ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>{isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{tier.label}</p>
                        {tier.tag && <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${tagColors[i % tagColors.length]}`}>{tier.tag}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{tier.packQty === 1 ? "Per unit price" : `${tier.packQty.toLocaleString()} units minimum`}</p>
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
                {tierDiscount > 0 && <p className="text-xs text-emerald-600 font-semibold mt-0.5">You save ₹{(Math.round(uPrice * tierQty * qty) - totalPrice).toLocaleString()} ({tierDiscount}% bulk discount)</p>}
              </div>
              {tierDiscount > 0 && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{tierDiscount}% OFF</span>}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={handleAddToCart} className="flex-1 py-3.5 bg-white border-2 border-primary text-primary font-bold rounded-2xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"><ShoppingCart className="w-4 h-4" />Add to Cart</button>
            <button onClick={handleBuyNow} className="flex-1 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"><Zap className="w-4 h-4" />Buy Now</button>
            <button onClick={handleToggleWishlist} className="px-4 py-3.5 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-secondary transition-colors"><Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary" : ""}`} /></button>
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
              {tab === "reviews" ? `Reviews (${product.ratingCount.toLocaleString()})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="p-5 md:p-6">
          {activeTab === "description" && (
            <div><p className="text-sm leading-relaxed mb-5">{product.description}</p><h3 className="font-bold text-sm mb-3">Key Highlights</h3><ul className="space-y-2">{features.map(f => <li key={f} className="flex items-start gap-2.5 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{f}</span></li>)}</ul></div>
          )}
          {activeTab === "specs" && (
            <table className="w-full text-sm"><tbody>{Object.entries(specs).map(([k, v], i) => <tr key={k} className={i % 2 === 0 ? "bg-muted/50" : ""}><td className="px-4 py-2.5 font-semibold text-muted-foreground w-1/3">{k}</td><td className="px-4 py-2.5">{v}</td></tr>)}<tr className="bg-muted/50"><td className="px-4 py-2.5 font-semibold text-muted-foreground">Material</td><td className="px-4 py-2.5">{product.material}</td></tr><tr><td className="px-4 py-2.5 font-semibold text-muted-foreground">Min. Order</td><td className="px-4 py-2.5">{product.moq} unit{product.moq > 1 ? "s" : ""}</td></tr></tbody></table>
          )}
          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-border">
                <div className="text-center"><p className="text-5xl font-extrabold">{product.ratingAvg}</p><Stars rating={Number(product.ratingAvg)} /><p className="text-xs text-muted-foreground mt-1">{product.ratingCount.toLocaleString()} ratings</p></div>
                <div className="flex-1 space-y-1.5">{[5,4,3,2,1].map((s, i) => { const pcts = [72,18,6,2,2]; return <div key={s} className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-8 text-right">{s}★</span><div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[i]}%` }} /></div><span className="text-xs text-muted-foreground w-6">{pcts[i]}%</span></div>; })}</div>
              </div>
              {product.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-5">{product.reviews.map(r => <div key={r.id} className="pb-5 border-b border-border last:border-0 last:pb-0"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{(r.user.name ?? "?")[0]}</div><div><p className="font-bold text-sm">{r.user.name ?? "Anonymous"}</p>{r.isVerifiedPurchase && <p className="text-xs text-muted-foreground">Verified Purchase</p>}</div></div><p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p></div><Stars rating={r.rating} small />{r.title && <p className="text-sm font-semibold mt-2">{r.title}</p>}<p className="text-sm text-foreground mt-1 leading-relaxed">{r.body}</p><div className="flex items-center gap-3 mt-3"><span className="text-xs text-muted-foreground">Helpful?</span><button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ThumbsUp className="w-3 h-3" />{r.helpfulCount}</button><button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ThumbsDown className="w-3 h-3" /></button></div></div>)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
