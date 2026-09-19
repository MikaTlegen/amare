import type { NextConfig } from "next";

// Кабинеты живут в приложении care. Адрес публичный, не секрет
const CARE_URL = (process.env.NEXT_PUBLIC_CARE_URL ?? "http://localhost:3002").replace(/\/+$/, "");

// Сборка для файлового хостинга (FTP, отдача статики): STATIC_EXPORT=1 pnpm build
const isStaticExport = process.env.STATIC_EXPORT === "1";

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
    return [
      { source: "/vhod", destination: `${CARE_URL}/vhod`, permanent: false },
      { source: "/kabinet", destination: `${CARE_URL}/kabinet`, permanent: false },
      { source: "/kabinet/:path*", destination: `${CARE_URL}/kabinet/:path*`, permanent: false },
    ];
  },
};

export default nextConfig;
