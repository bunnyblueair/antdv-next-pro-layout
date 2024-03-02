import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJSX from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  // 访问基础路径
  base: "/",
  // 本地开发服务配置
  server: {
    port: 5173, // 端口
    host: false, // 暴露到网络地址
    open: false, // 完成后自动跳转浏览器打开
  },
  resolve: {
    alias: {
      "antdv-pro-layout": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./playground", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    vueJSX(),
    dts({
      // 输出目录
      outDir: "dist/types",
      // 排除目录
      exclude: [
        "playground/**/*.ts",
        "playground/**/*.tsx",
        "playground/**/*.vue",
      ],
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "AntdvProLayout",
      formats: ["es", "umd"],
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
    },
  },
});
