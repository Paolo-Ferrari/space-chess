import Logo from "../../brand/Logo/Logo";

import "./BrandMark.css";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
}

/** @deprecated Prefer `Logo` from ui/brand — kept as thin alias. */
function BrandMark({ size = "md" }: BrandMarkProps) {
  return <Logo variant="mark" size={size} />;
}

export default BrandMark;
