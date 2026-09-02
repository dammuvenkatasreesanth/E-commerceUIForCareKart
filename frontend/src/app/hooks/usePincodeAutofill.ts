import { useEffect, useRef, useState } from "react";
import { lookupPincode } from "../lib/api/endpoints/catalog";
import { isValidPincode } from "../lib/addressValidation";

// Debounced pincode -> city/state lookup for address forms. Fires once per
// fully-typed 6-digit pincode; a lookup miss or network error just leaves
// city/state alone so the customer can still type them by hand.
export function usePincodeAutofill(pincode: string, onResolved: (city: string, state: string) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const lastLookedUp = useRef<string | null>(null);
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    if (!isValidPincode(pincode) || pincode === lastLookedUp.current) return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      lastLookedUp.current = pincode;
      setIsLoading(true);
      try {
        const result = await lookupPincode(pincode);
        if (!cancelled && result) onResolvedRef.current(result.city, result.state);
      } catch {
        // Best-effort — leave city/state fields for manual entry.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [pincode]);

  return { isLoading };
}
