// Indian mobile numbers: 10 digits, first digit 6-9 — matches the format
// every address form on the site asks for (e.g. placeholder "9876543210",
// displayed elsewhere with a separate "+91" prefix). Deliberately stricter
// than the backend's generic international PHONE_REGEX
// (/^\+?[1-9]\d{9,14}$/) — anything that passes this also passes that one,
// so tightening it here can't cause the backend to reject a submission.
export const PHONE_REGEX = /^[6-9]\d{9}$/;

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export const PINCODE_REGEX = /^\d{6}$/;

export function isValidPincode(pincode: string): boolean {
  return PINCODE_REGEX.test(pincode.trim());
}

export interface MappableAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export function mapsUrlForAddress(addr: MappableAddress): string {
  const query = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
