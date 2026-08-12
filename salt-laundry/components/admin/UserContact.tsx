interface Props {
  email: string;
  phoneNumber: string | null;
}

// Both arrive from SOA and neither is editable here. Phone sits under the
// email rather than in a column of its own- it is often blank, and an empty
// column reads as a missing feature.
export function UserContact({ email, phoneNumber }: Props) {
  return (
    <div className="min-w-0">
      <div className="text-sm text-salt-text-sec truncate">{email}</div>
      {phoneNumber && (
        <div className="text-xs text-salt-text-muted truncate">
          {phoneNumber}
        </div>
      )}
    </div>
  );
}
