import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Тесты читают реестр страниц и маршруты, а те импортируют компоненты по
// алиасу @/ из tsconfig — vitest о нём сам не знает
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
