import type { NextConfig } from "next";

// Сборка для файлового хостинга (FTP, отдача статики): STATIC_EXPORT=1 pnpm build
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Общие пакеты монорепо поставляются исходниками TS
  transpilePackages: ["@amare/ui", "@amare/i18n"],
  poweredByHeader: false,
  reactStrictMode: true,

  // На хостинге приложение лежит в подпапке /staff, поэтому basePath —
  // иначе ссылки и стили собирались бы от корня домена и не нашлись бы
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: "/staff",
      }
    : {}),
};

export default nextConfig;
