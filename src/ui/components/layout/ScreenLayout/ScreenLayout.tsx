import type { ReactNode } from "react";

import "./ScreenLayout.css";

interface ScreenLayoutProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

function ScreenLayout({
  children,
  className = "",
  wide = false,
}: ScreenLayoutProps) {
  return (
    <div className={`screen-layout ${wide ? "screen-layout--wide" : ""} ${className}`.trim()}>
      <div className="screen-layout__frame">{children}</div>
    </div>
  );
}

export default ScreenLayout;
