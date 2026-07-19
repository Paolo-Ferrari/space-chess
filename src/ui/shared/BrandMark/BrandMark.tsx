import "./BrandMark.css";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
}

/** Neon chess-king mark for Space Chess. */
function BrandMark({ size = "md" }: BrandMarkProps) {
  return (
    <span
      className={`brand-mark brand-mark-${size}`}
      aria-hidden="true"
      title="Space Chess"
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="10" className="brand-mark-bg" />
        {/* Cross */}
        <path
          className="brand-mark-stroke"
          strokeWidth="2.4"
          strokeLinecap="round"
          d="M32 10v10M27 15h10"
        />
        {/* Crown ball */}
        <circle cx="32" cy="22" r="2.4" className="brand-mark-dot" />
        {/* King body */}
        <path
          className="brand-mark-fill"
          d="M22 28h20l-2.5 6H24.5L22 28zm3.5 8h13l1.5 10H24l1.5-10zM20 50h24v3H20v-3z"
        />
        <path
          className="brand-mark-accent"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M24 36.5h16M25.5 46h13"
        />
      </svg>
    </span>
  );
}

export default BrandMark;
