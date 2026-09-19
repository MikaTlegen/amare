import type { NextConfig } from "next";

// Кабинеты живут в приложении care. Адрес публичный, не секрет
const CARE_URL = (process.env.NEXT_PUBLIC_CARE_URL ?? "http://localhost:3002").replace(/\/+$/, "");

// Сборка для файлового хостинга (FTP, отдача статики): STATIC_EXPORT=1 pnpm build
const isStaticExport = process.env.STATIC_EXPORT === "1";

// Кабинетные пути ведут в care в обеих локалях: /vhod и /kk/vhod — один и тот же кабинет
const cabinetRedirects = (prefix: string) => [
  { source: `${prefix}/vhod`, destination: `${CARE_URL}/vhod`, permanent: false },
  { source: `${prefix}/kabinet`, destination: `${CARE_URL}/kabinet`, permanent: false },
  { source: `${prefix}/kabinet/:path*`, destination: `${CARE_URL}/kabinet/:path*`, permanent: false },
];

const nextConfig: NextConfig = {
  // Общие пакеты монорепо поставляются исходниками TS
  transpilePackages: ["@amare/ui", "@amare/i18n"],
  poweredByHeader: false,
  reactStrictMode: true,

  // Хостинг умеет только отдавать файлы: страницы раскладываются папками с index.html,
  // картинки отдаются как есть — сжимать их на лету некому
  ...(isStaticExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {}),

  // Старые пути входа и кабинетов из набросков ведут в care, чтобы ссылки не ломались
  async redirects() {
    return [...cabinetRedirects(""), ...cabinetRedirects("/kk")];
  },
};

export default nextConfig;
