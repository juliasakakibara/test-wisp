import Link from "next/link";
import type { ComponentProps } from "react";

type SiteLinkProps = ComponentProps<typeof Link> & {
  /** Marks current page (nav); adds `.is-current` for the selected style. */
  current?: boolean;
};

/**
 * Text link primitive — regular at rest, italic + bold on hover and when `current`.
 * `data-text` lets CSS reserve the bold-italic width so neighbours don't shift.
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
      data-text={typeof props.children === "string" ? props.children : undefined}
      {...props}
    />
  );
}
