import type { ReactNode } from "react";

// The signature move: a tiny, wide-tracked uppercase label above every
// major section headline. e.g. <Eyebrow>The Blog</Eyebrow>
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
