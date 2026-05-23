/**
 * Admin shell — styling via --admin-* + shared --space-*, --type-*, --font-*.
 * Public site theme/content preview lives in the iframe only (ephemeral until Save).
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-app">{children}</div>;
}
