import Link from "next/link";
import { Home, Search } from "lucide-react";
import {
  StatusScreen,
  STATUS_PRIMARY_ACTION,
  STATUS_SECONDARY_ACTION,
} from "@/components/ui/StatusScreen";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Page not found"
      message="The page you're looking for doesn't exist, or it may have moved. Let's get you back on track."
    >
      <Link href="/" className={STATUS_PRIMARY_ACTION}>
        <Home className="w-4 h-4" />
        Back to home
      </Link>
      <Link href="/track" className={STATUS_SECONDARY_ACTION}>
        <Search className="w-4 h-4" />
        Track an order
      </Link>
    </StatusScreen>
  );
}
