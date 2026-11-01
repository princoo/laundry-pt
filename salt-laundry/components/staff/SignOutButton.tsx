import { signOutEverywhere } from "@/lib/actions/auth";

// Ends the laundry session and the Netiiv Account session together, then
// lands on the guest form. A form, so the sign-out is a POST and never
// happens from a link someone was handed.
export function SignOutButton() {
  return (
    <form action={signOutEverywhere} className="w-full">
      <button
        type="submit"
        className="w-full text-left text-salt-text-sec hover:text-salt-text text-sm px-3 py-1.5"
      >
        Sign out
      </button>
    </form>
  );
}
