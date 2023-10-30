import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import typescript from "@rollup/plugin-typescript";
import lessCopy from "./vite-plugin-less-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), lessCopy()],
  resolve: {
    alias: {
      "antdv-pro-layout": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./playground", import.meta.url)),
    },
  },
  css: {
    postcss: {},
    preprocessorOptions: {
      less: {
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
        // modifyVars: {
        //   hack: `true; @import 'ant-design-vue/es/style/themes/default.less'`,
        // }
      },
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "AntDesignVueLayout",
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "@ant-design/icons-vue",
        "@ant-design/icons-svg",
        "ant-design-vue",
        "vue-types",
        "lodash-es",
        "moment",
        "dayjs",
      ],
      output: {
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps`
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          "ant-design-vue": "Antdv",
          "@ant-design/icons-vue": "AntdIconsVue",
          "@ant-design/icons-svg": "AntdIconsSvg",
          "vue-types": "vueTypes",
          "lodash-es": "Lodash",
          dayjs: "dayjs",
        },
      },
      plugins: [
        typescript({
          tsconfig: "./tsconfig.build.json",
          target: "es2020",
          emitDeclarationOnly: true,
          // outDir: 'dist',
          // declaration: true,
          // declarationDir: '.',
          exclude: "node_modules/**",
          // allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
});
