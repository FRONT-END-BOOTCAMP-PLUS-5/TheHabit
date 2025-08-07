"use client";

import Link from "next/link";

const customLink = ({
  href,
  className,
  LinkLabel,
}: {
  href: string;
  className?: string;
  LinkLabel: string;
}) => {
  return (
    <Link href={href} className={className}>
      <p>{LinkLabel}</p>
    </Link>
  );
};

export default customLink;
