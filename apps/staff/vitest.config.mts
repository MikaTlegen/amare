import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Тесты читают модули приложения по алиасу @/ из tsconfig — vitest о нём не знает
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
