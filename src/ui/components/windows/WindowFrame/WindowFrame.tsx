import type { ReactNode } from "react";

import "./WindowFrame.css";

interface WindowFrameProps {
  children: ReactNode;
  className?: string;
}

function WindowFrame({ children, className = "" }: WindowFrameProps) {
  return <div className={`window-frame ${className}`.trim()}>{children}</div>;
}

export default WindowFrame;
