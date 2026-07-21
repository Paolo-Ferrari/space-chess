import type { ReactNode, SVGProps } from "react";

import { ICON_VIEWBOX } from "./constants";

type Props = SVGProps<SVGSVGElement> & { children: ReactNode };

/** Shared SVG shell for faction board icons — color via currentColor only. */
export function FactionIconSvg({ children, className = "", ...rest }: Props) {
  return (
    <svg
      viewBox={ICON_VIEWBOX}
      width="48"
      height="48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`faction-icon-svg ${className}`.trim()}
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "visible",
        color: "inherit",
      }}
      {...rest}
    >
      {children}
    </svg>
  );
}
