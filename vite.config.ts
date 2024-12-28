import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // Map the `src/` prefix to the actual path
      src: path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/index.ts",
      exportName: "viteNodeApp",

      // Optional, default: false
      // if you want to init your app on boot, set this to true
      initAppOnBoot: false,

      // Optional, default: 'esbuild'
      // The TypeScript compiler you want to use
      // by default this plugin is using vite default ts compiler which is esbuild
      // 'swc' compiler is supported to use as well for frameworks
      // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
      // you need to INSTALL `@swc/core` as dev dependency if you want to use swc
      tsCompiler: "esbuild",

      // Optional, default: {
      // jsc: {
      //   target: 'es2019',
      //   parser: {
      //     syntax: 'typescript',
      //     decorators: true
      //   },
      //  transform: {
      //     legacyDecorator: true,
      //     decoratorMetadata: true
      //   }
      // }
      // }
      // swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
      swcOptions: {},
    }),
  ],
});
