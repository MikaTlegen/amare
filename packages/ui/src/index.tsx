import type { ReactNode } from "react";

export interface PageShellProps {
  title: string;
  children?: ReactNode;
}

// Общая оболочка страницы для site, care и staff
export function PageShell({ title, children }: PageShellProps) {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1>{title}</h1>
      {children}
    </main>
  );
}
