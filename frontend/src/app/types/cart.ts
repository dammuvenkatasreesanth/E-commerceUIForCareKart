export interface CartLineItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  sizeLabel: string;
  tierIndex: number;
  tierLabel: string;
  packQty: number;
  quantity: number;
  unitPrice: number;
  totalUnits: number;
  lineTotal: number;
  inStock: boolean;
}

export interface InvalidCartLine {
  productId: number;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
  reason: string;
}

export interface CartResponse {
  items: CartLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
  invalidItems?: InvalidCartLine[];
}

export interface CartQuoteLineItem {
  productId: number;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
}
