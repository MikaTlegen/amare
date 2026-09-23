import type { ReactNode } from "react";

export { AccessibilityMenu } from "./accessibility-menu";
export { AttachmentChip, KIND_ICON, KIND_KEY, useKindLabel } from "./attachment-chip";
export { BarthelChart } from "./barthel-chart";
export { Button } from "./button";
export { CabinetLocaleProvider, useSetCabinetLocale } from "./cabinet-locale";
export { CabinetShell, DemoNotice, type Tab } from "./cabinet-shell";
export { ChatPanel, type ChatApi } from "./chat-panel";
export { cn } from "./cn";
export { LanguageSwitch } from "./language-switch";
export { Logo, LogoMark, type LogoMarkProps, type LogoProps } from "./logo";
export { ParallaxBand } from "./parallax-band";
export { formatKzPhone } from "./phone";
export { InstallPwaBadge, InstallPwaButton, RegisterServiceWorker } from "./pwa-install";
export { Reveal } from "./reveal";
export { SectionHeading } from "./section-heading";
export { SpinningFavicon } from "./spinning-favicon";
export { StatBarChart } from "./stat-bar-chart";
export {
  COLOR_TOKENS,
  contrastRatio,
  PALETTE,
  toCssRgb,
  type ColorToken,
  type Palette,
  type Rgb,
  type ThemeName,
} from "./tokens/palette";

export interface PageShellProps {
  title: string;
  children?: ReactNode;
}

// Общая оболочка страницы для site, care и staff
export function PageShell({ title, children }: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-8 lg:px-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <div className="mt-6 text-muted">{children}</div>
    </main>
  );
}
