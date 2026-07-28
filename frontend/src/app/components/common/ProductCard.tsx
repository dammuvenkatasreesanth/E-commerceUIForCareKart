import { Heart, Play } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Stars } from "./Stars";
import { useAddToCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { useIsWishlisted, useAddToWishlist, useRemoveFromWishlist } from "../../hooks/useWishlist";
import type { ProductSummary } from "../../types/catalog";

export function ProductCard({ product }: { product: ProductSummary }) {
  const navigate = useNavigate();
  const { status } = useAuth();
  const addToCartMutation = useAddToCart();
  const isWishlisted = useIsWishlisted(product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const price = Number(product.price);
  const mrp = Number(product.mrp);
  const discount = mrp > 0 ? Math.round((1 - price / mrp) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? null,
        sizeLabel: product.sizes[0]?.size ?? "",
        tierIndex: 0,
        quantity: 1,
      },
      {
        onSuccess: () => toast.success("Added to cart"),
        onError: () => toast.error("Couldn't add to cart"),
      },
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-border hover:shadow-md transition-all cursor-pointer group overflow-hidden" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="relative overflow-hidden">
        <ImageWithFallback src={product.images[0]?.url} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.badge && <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">{product.badge}</span>}
        {product.videoUrl && <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center"><Play className="w-3 h-3 text-primary fill-primary" /></div>}
        <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center" onClick={handleToggleWishlist}><Heart className={`w-3.5 h-3.5 ${isWishlisted ? "text-destructive fill-destructive" : "text-muted-foreground"}`} /></button>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm leading-tight mb-1 truncate">{product.name}</p>
        <div className="flex items-center gap-1 mb-2"><Stars rating={Number(product.ratingAvg)} small /><span className="text-[10px] text-muted-foreground">({product.ratingCount.toLocaleString()})</span></div>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="font-extrabold text-base">₹{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{discount}% off</span>
        </div>
        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
