"use client";

// Every hook fetches through here. A 401 means the session lapsed mid-visit-
// SOA's token has a hard hour on it- and a generic "failed to load" would
// leave someone re-clicking a dead page. Reloading the current URL as a
// document request puts it in front of proxy.ts, which owns the SOA redirect,
// so the sign-in URL never has to be handed to the browser.
//
// It is a fetch, so it cannot live in lib/utils/- that layer stays pure.
let redirecting = false;

export function redirectToSignIn() {
  if (redirecting) return;
  redirecting = true;
  window.location.assign(window.location.pathname + window.location.search);
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Your session ended. Signing you in again.");
  }
}

// Throws rather than returning the 401, so no caller can mistake it for data.
// The throw lands in the same catch every hook already has.
export async function apiFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    redirectToSignIn();
    throw new SessionExpiredError();
  }
  return response;
}
