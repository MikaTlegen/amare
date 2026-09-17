import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Общие пакеты монорепо поставляются исходниками TS
  transpilePackages: ["@amare/ui", "@amare/i18n"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
