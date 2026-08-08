import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkVerificationStatus, customerLogin } from "../lib/api/endpoints/auth";
import { useAuthenticateAndMergeCart } from "./useAuthenticateAndMergeCart";

// Polls whether an in-progress signup's email got verified — possibly from a
// different device/browser than the one that started signup (e.g. the user
// opened the verification link on their phone while signing up on desktop,
// or in their mail app's own in-app browser). Once verified, logs in with the
// same email/password already sitting in this tab's form and merges this
// device's local cart, so the original tab isn't stranded on "check your
// email" waiting for a manual return trip that may never come.
export function usePollForVerification(params: { email: string; password: string; enabled: boolean; onDone: () => void }) {
  const { email, password, enabled, onDone } = params;
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();
  const firedRef = useRef(false);

  const { data } = useQuery({
    queryKey: ["verification-status", email],
    queryFn: () => checkVerificationStatus(email),
    enabled,
    refetchInterval: 3000,
    // The whole point of this poll is to catch verification happening while
    // the user has tabbed away (e.g. to check their phone) — React Query
    // pauses refetchInterval in the background by default, which would
    // defeat that.
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!data?.verified || firedRef.current) return;
    firedRef.current = true;
    (async () => {
      try {
        const result = await customerLogin(email, password);
        await authenticateAndMergeCart(result.accessToken, result.user);
        onDone();
      } catch {
        firedRef.current = false; // let the next poll tick retry if login unexpectedly failed
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.verified]);
}
