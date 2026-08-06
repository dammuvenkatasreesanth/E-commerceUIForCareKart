// Shared avatar: shows the user's Google/Facebook profile photo when set
// (synced on every OAuth login), falling back to a colored initial otherwise
// (e.g. password-only accounts, which have no photo to show).
export function UserAvatar({ avatarUrl, name, className }: { avatarUrl?: string | null; name?: string | null; className: string }) {
  if (avatarUrl) {
    // referrerPolicy avoids Google's profile-photo CDN occasionally rejecting
    // requests that leak the referring page's URL.
    return <img src={avatarUrl} alt={name ?? "Profile"} referrerPolicy="no-referrer" className={`${className} object-cover`} />;
  }
  return <div className={className}>{name?.[0]?.toUpperCase() ?? "?"}</div>;
}
