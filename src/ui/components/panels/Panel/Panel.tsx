import type { ReactNode } from "react";

import "./Panel.css";

interface PanelProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

function Panel({ title, eyebrow, children, className = "", footer }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(eyebrow || title) && (
        <header className="panel__header">
          {eyebrow ? <p className="panel__eyebrow">{eyebrow}</p> : null}
          {title ? <h2 className="panel__title">{title}</h2> : null}
        </header>
      )}
      <div className="panel__body">{children}</div>
      {footer ? <footer className="panel__footer">{footer}</footer> : null}
    </section>
  );
}

export default Panel;
