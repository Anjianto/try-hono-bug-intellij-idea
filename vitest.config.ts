import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // eslint-disable-next-line
  // @ts-ignore
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: "./src/utils/test/prisma-singleton.ts",
    include: ["src/**/*.test.ts"],
    exclude: ["src/test/**"],
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["src"],
      reportsDirectory: "./coverage/unit",
    },
  },
});
