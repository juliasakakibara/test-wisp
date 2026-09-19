import Link from "next/link";
import type { ComponentProps } from "react";

type SiteLinkProps = ComponentProps<typeof Link> & {
  /** Marks current page (nav); adds `.is-current` for the active underline. */
  current?: boolean;
};

/**
 * Text link primitive — italic + discreet `--link` color.
 * Active nav: pass `current` (italic + foreground underline, no fill chip).
 */
export function SiteLink({
  className,
  current = false,
  ...props
}: SiteLinkProps) {
  const classes = ["link", current ? "is-current" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      className={classes}
      aria-current={current ? "page" : undefined}
      {...props}
    />
  );
}
