"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { safeRedirectTarget } from "@/lib/utils/redirectTarget";
import {
  EXPIRES_AT_PARAM,
  REDIRECT_PARAM,
  SOA_PROVIDER_ID,
  TOKEN_PARAM,
} from "@/lib/constants/soa";

const NO_TOKEN =
  "This link arrived without a sign-in token. Start again from SOA.";
const REFUSED =
  "That sign-in could not be completed. It may have expired- start again.";

// Trades the token SOA sent back for a laundry session, then leaves for the
// page the user actually asked for. Every exit from here is a replace, never
// a push- the token must not survive in the address bar or in history.
export function useSoaSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get(TOKEN_PARAM);
  const expiresAt = params.get(EXPIRES_AT_PARAM) ?? "";
  const target = safeRedirectTarget(params.get(REDIRECT_PARAM));
  const [hasFailed, setHasFailed] = useState(false);

  const exchange = useCallback(async () => {
    if (!token) return;
    try {
      const result = await signIn(SOA_PROVIDER_ID, {
        token,
        expiresAt,
        redirect: false,
      });
      if (result?.error) {
        console.log("SOA sign-in failed:", result);
        return setHasFailed(true);
      }
      router.replace(target);
      router.refresh();
    } catch (error) {
      console.log("Error occurred while signing in with SOA:", error);
      setHasFailed(true);
    }
  }, [token, expiresAt, target, router]);

  // Deferred to a microtask: the exchange is a round trip to two servers and
  // only settles state once it answers, never during the render that starts it.
  useEffect(() => {
    Promise.resolve().then(exchange);
  }, [exchange]);

  let error: string | null = null;
  if (!token) error = NO_TOKEN;
  else if (hasFailed) error = REFUSED;

  return {
    error,
    retry: () => {
      setHasFailed(false);
      void exchange();
    },
  };
}
