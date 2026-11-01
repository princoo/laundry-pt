// A staff record as the laundry holds it. Everything on it is mirrored from
// the person's Netiiv Account (Keycloak) and read-only here- except
// isHousekeeper and isAvailable, the two laundry-owned flags that decide who
// appears in the assignment picker.
export interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  roleNames: string[];
  isHousekeeper: boolean;
  isActive: boolean;
  isAvailable: boolean;
}

// The signed-in user's own record. Same source, without the staffing flags-
// nothing on the profile page is editable in the laundry, it is all managed
// in the Netiiv Account console.
export type OwnProfile = Pick<
  StaffUser,
  "id" | "name" | "email" | "phoneNumber" | "roleNames"
>;
