"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/lib/hooks/usePermissions";
import type { Permission } from "@/lib/constants/permissions";

interface Props {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

// Renders children only when the session carries the permission. Nothing shows
// while the session is still loading, so a control never appears and then
// vanishes. Hiding a control is not access control- the route behind it
// carries its own requirePermission() guard.
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: Props) {
  const { can, isLoading } = usePermissions();
  if (isLoading) return null;
  return <>{can(permission) ? children : fallback}</>;
}
