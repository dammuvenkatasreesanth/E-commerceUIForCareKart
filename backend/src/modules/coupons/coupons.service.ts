import { eq } from "drizzle-orm";
import { db } from "../../db";
import { coupons } from "../../db/schema";
import { BadRequestError } from "../../lib/errors";

export interface CouponResolution {
  coupon: typeof coupons.$inferSelect;
  discountAmount: number;
}

export async function resolveCoupon(code: string, subtotal: number): Promise<CouponResolution> {
  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.code, code.toUpperCase()) });

  if (!coupon || !coupon.isActive) throw new BadRequestError("Invalid coupon code");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestError("This coupon has expired");
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new BadRequestError("This coupon has reached its usage limit");
  }
  if (subtotal < Number(coupon.minOrderAmount)) {
    throw new BadRequestError(`This coupon requires a minimum order of ₹${coupon.minOrderAmount}`);
  }

  const discountAmount =
    coupon.type === "PERCENT"
      ? Math.round((subtotal * Number(coupon.value)) / 100)
      : Math.min(Math.round(Number(coupon.value)), subtotal);

  return { coupon, discountAmount };
}

export async function validateCoupon(code: string, subtotal: number) {
  const { coupon, discountAmount } = await resolveCoupon(code, subtotal);
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
  };
}
