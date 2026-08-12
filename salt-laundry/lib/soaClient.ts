import { SOA_API_URL, SOA_ME_PATH } from "@/lib/constants/soa";
import {
  soaProfileSchema,
  type SoaProfile,
} from "@/lib/validations/soaProfile.schema";

// The one call the laundry makes into SOA. It is a fetch, so it cannot live
// in services/- that layer is Prisma only.
//
// Every failure answers null: a network error, a token SOA rejects, and a body
// that does not parse are all "no session", and telling them apart at the call
// site would only invite treating some of them as signed in. They are told
// apart in the server log instead- a sign-in that fails with no signal
// anywhere is the one thing that cannot be diagnosed from the outside.
//
// Nothing here logs the token or the profile body on success: the first is a
// live credential and the second is someone's personal details.
const TIMEOUT_MS = 8000;
const BODY_PREVIEW = 200;

export async function fetchSoaProfile(
  token: string,
): Promise<SoaProfile | null> {
  if (!SOA_API_URL) {
    console.error(
      "[soa] SOA_API_URL is not set- cannot verify a sign-in token",
    );
    return null;
  }
  if (!token) return null;

  try {
    const response = await fetch(`${SOA_API_URL}${SOA_ME_PATH}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[soa] ${SOA_ME_PATH} refused the token: ${response.status} ${response.statusText}`,
        body.slice(0, BODY_PREVIEW),
      );
      return null;
    }

    const parsed = soaProfileSchema.safeParse(await response.json());
    if (!parsed.success) {
      // Field paths and codes only- the values are the person's own details.
      console.error(
        `[soa] ${SOA_ME_PATH} answered a shape the laundry cannot read:`,
        parsed.error.issues
          .map((i) => `${i.path.join(".") || "(root)"}: ${i.code}`)
          .join(", "),
      );
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.error(
      `[soa] ${SOA_ME_PATH} did not answer:`,
      (error as Error)?.name ?? error,
    );
    return null;
  }
}
