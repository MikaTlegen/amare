import type { NextConfig } from "next";

// Кабинеты живут в приложении care. Адрес публичный, не секрет
const CARE_URL = (process.env.NEXT_PUBLIC_CARE_URL ?? "http://localhost:3002").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Общие пакеты монорепо поставляются исходниками TS
  transpilePackages: ["@amare/ui", "@amare/i18n"],
  poweredByHeader: false,
  reactStrictMode: true,

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
