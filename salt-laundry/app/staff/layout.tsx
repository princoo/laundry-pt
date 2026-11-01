import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { StaffNav } from "@/components/staff/StaffNav";
import { StaffFooter } from "@/components/staff/StaffFooter";
import { NotificationToasts } from "@/components/staff/NotificationToasts";
import { NoAccessYet } from "@/components/staff/NoAccessYet";
import { hasPermission } from "@/lib/utils/permissions";
import { getBrand } from "@/lib/brand";

// Base for all /staff/* pages- individual pages override the title only.
// No Open Graph: staff pages require login and should never be shared.
export function generateMetadata(): Metadata {
  const { orgName, shortName } = getBrand();
  return {
    title: {
      template: `%s | ${shortName} Staff`,
      // Resolved through the root template, so this renders as
      // "Staff Dashboard | <organization>"- do not repeat the suffix here.
      default: "Staff Dashboard",
    },
    description: `${orgName} internal laundry management dashboard.`,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return (
      <div className="min-h-screen bg-salt-cream print:bg-white">
        {children}
      </div>
    );
  }

  const userName = session.user?.name || session.user?.email || undefined;
  const user = session.user as { permissions?: string[]; roleNames?: string[] };

  // LAUNDRY_REQUEST_VIEW is the baseline for the whole dashboard- there is no
  // general "may use the laundry" permission, so this one doubles as it. A
  // Netiiv Account without it has signed in but holds no laundry role yet: the
  // state every new registration is in until a reviewer assigns one.
  if (!hasPermission(user?.permissions, "LAUNDRY_REQUEST_VIEW")) {
    return (
      <div className="min-h-screen bg-salt-cream">
        <NoAccessYet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-salt-cream print:bg-white">
      <StaffNav userName={userName} roleNames={user?.roleNames ?? []} />
      <NotificationToasts />
      <main className="flex-1">{children}</main>
      <StaffFooter />
    </div>
  );
}
