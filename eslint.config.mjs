import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import tseslint from "typescript-eslint";

// Общий конфиг линтера для всего монорепо
export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/.next/**", "**/out/**", "**/.turbo/**", "**/coverage/**", "**/next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Правила Next.js — только для фронтенд-приложений
    files: ["apps/site/**", "apps/care/**", "apps/staff/**"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);
