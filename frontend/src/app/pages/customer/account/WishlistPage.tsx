import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Heart, Trash2, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useWishlist, useRemoveFromWishlist } from "../../../hooks/useWishlist";

export function WishlistPage() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (productId: number) => {
    removeFromWishlist.mutate(productId, { onError: (err: Error) => toast.error(err.message) });
  };

  return (
    <div>
      <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </button>
      <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-4">Your Wishlist</h2>

      {isLoading && <div className="text-center py-10 text-muted-foreground bg-white border border-border rounded-2xl">Loading…</div>}

      {!isLoading && (items ?? []).length === 0 && (
        <div className="text-center py-10 text-muted-foreground bg-white border border-border rounded-2xl">
          <Heart className="w-10 h-10 mx-auto mb-2 text-border" />
          <p>Your wishlist is empty</p>
          <button onClick={() => navigate("/products")} className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">
            Browse Products
          </button>
        </div>
      )}

      {!isLoading && (items ?? []).length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {(items ?? []).map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex gap-3">
              <button onClick={() => navigate(`/products/${item.slug}`)} className="flex-shrink-0">
                <ImageWithFallback src={item.image ?? undefined} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/products/${item.slug}`)} className="text-left">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                </button>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-extrabold text-sm">₹{Number(item.price).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{Number(item.mrp).toLocaleString()}</span>
                </div>
                {!item.inStock && <p className="text-[11px] text-destructive font-semibold mt-0.5">Out of stock</p>}
                <div className="flex items-center gap-2 mt-2.5">
                  <button onClick={() => navigate(`/products/${item.slug}`)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl">
                    View Product
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleRemove(item.productId)} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
