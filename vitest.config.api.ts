import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // eslint-disable-next-line
  // @ts-ignore
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["src/**/*.test.ts", "src/utils/test/**"],
    fileParallelism: false,
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["src/**/*.ts"],
      reportsDirectory: "./coverage/api",
    },
  },
});
