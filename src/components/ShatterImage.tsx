import type { CSSProperties } from "react";

const COLS = 12;
const ROWS = 12;

// Deterministic pseudo-random (same on server + client -> no hydration mismatch)
function rand(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Renders `src` as a grid of tiles that blast apart and reassemble (CSS only).
export default function ShatterImage({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const tiles = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;

      // Direction: outward from the centre, plus a little jitter
      const dx = c - (COLS - 1) / 2;
      const dy = r - (ROWS - 1) / 2;
      const dist = Math.hypot(dx, dy) || 1;
      const spread = 190;
      const tx = (dx / dist) * spread * (0.5 + rand(i + 1) * 1.1) + (rand(i + 7) - 0.5) * 60;
      const ty = (dy / dist) * spread * (0.5 + rand(i + 2) * 1.1) + (rand(i + 9) - 0.5) * 60;
      const rot = (rand(i + 3) - 0.5) * 180;

      const style: CSSProperties = {
        position: "absolute",
        left: `${(c / COLS) * 100}%`,
        top: `${(r / ROWS) * 100}%`,
        width: `calc(${100 / COLS}% + 1px)`,
        height: `calc(${100 / ROWS}% + 1px)`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
        backgroundRepeat: "no-repeat",
        mixBlendMode: "screen",
        animationDelay: `${(rand(i + 5) * 0.3).toFixed(2)}s`,
      };
      const custom = style as Record<string, string>;
      custom["--tx"] = `${tx.toFixed(1)}px`;
      custom["--ty"] = `${ty.toFixed(1)}px`;
      custom["--rot"] = `${rot.toFixed(1)}deg`;

      tiles.push(<span key={i} className="shatter-tile" style={style} />);
    }
  }

  return (
    <div className={`relative w-full max-w-[420px] ${className}`}>
      {/* Invisible copy of the image — gives the container its real size so the
          absolutely-positioned tiles have something to fill. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="block w-full opacity-0" />
      {tiles}
    </div>
  );
}
