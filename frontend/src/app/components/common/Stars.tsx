import { Star } from "lucide-react";

export function Stars({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${small ? "w-3 h-3" : "w-4 h-4"} ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}
