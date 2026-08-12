interface Props {
  total: number;
  activeCount: number;
  showCount: boolean;
}

// Counts come from the server rather than the loaded rows- with pagination,
// users.length is only ever the current page. There is no "add" control:
// accounts arrive from SOA, they are not created here.
export function UsersPageHeader({ total, activeCount, showCount }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-black text-salt-text">Staff accounts</h1>
      {showCount && (
        <p className="text-sm text-salt-text-sec mt-1">
          {total} {total === 1 ? "account" : "accounts"} · {activeCount} active
        </p>
      )}
      <p className="text-sm text-salt-text-muted mt-1">
        Managed in SOA. Shift availability is set here.
      </p>
    </div>
  );
}
