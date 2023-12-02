import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "antdv-pro-layout": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./playground", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
      outDir: "dist/types",
      exclude: [
        "playground/**/*.ts",
        "playground/**/*.tsx",
        "playground/**/*.vue",
      ],
    }),
    // {
    //   name: "vite:import-css",
    //   apply: "build",
    //   enforce: "post",
    //   renderChunk(code, chunk) {
    //     // 判断是不是组件入口js
    //     if (
    //       !chunk.isEntry &&
    //       chunk.type === "chunk" &&
    //       /\index.(js)$/i.test(chunk.fileName)
    //     ) {
    //       // 截取出组件名称
    //       let str = chunk.fileName.split("/")[0];
    //       return `import './${str}.css';\n${code}`;
    //     }
    //   },
    // },
  ],
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
    },
  },
});
