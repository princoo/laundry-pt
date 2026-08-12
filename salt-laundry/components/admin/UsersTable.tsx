import { UserRow } from "@/components/admin/UserRow";
import { UserCard } from "@/components/admin/UserCard";
import type { StaffUser } from "@/lib/types/staffUser";

interface Props {
  users: StaffUser[];
  currentUserId: string;
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void;
  onToggleHousekeeper: (id: string, nextIsHousekeeper: boolean) => void;
}

const HEADERS = [
  "Name",
  "Contact",
  "Department",
  "Roles",
  "Status",
  "Housekeeper",
  "On shift",
];

export function UsersTable({
  users,
  currentUserId,
  onToggleAvailability,
  onToggleHousekeeper,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center text-sm text-salt-text-sec">
        No staff accounts yet.
      </div>
    );
  }

  // The row and the card take the same props- one source for both so a new
  // column cannot land on the desktop table and be forgotten on mobile.
  const rowProps = (user: StaffUser) => ({
    user,
    isCurrentUser: user.id === currentUserId,
    onToggleAvailability,
    onToggleHousekeeper,
  });

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="py-3 px-5 text-left font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} {...rowProps(user)} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {users.map((user) => (
          <UserCard key={user.id} {...rowProps(user)} />
        ))}
      </div>
    </>
  );
}
