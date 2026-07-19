import type { ReactNode } from "react";

import BrandMark from "../../shared/BrandMark/BrandMark";

import "./AppShell.css";

interface AppShellProps {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

function AppShell({ title, onBack, children, actions }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <div className="app-shell-header-left">
          <BrandMark size="sm" />
          <span className="app-shell-brand">Space Chess</span>
          {onBack && (
            <button
              type="button"
              className="app-shell-back"
              onClick={onBack}
            >
              ← Меню
            </button>
          )}
          <h1 className="app-shell-title">{title}</h1>
        </div>
        {actions && <div className="app-shell-actions">{actions}</div>}
      </header>
      <div className="app-shell-body">{children}</div>
    </div>
  );
}

export default AppShell;
