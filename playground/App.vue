<template>
  <!-- component-size="middle" -->
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ConfigProvider, theme } from "ant-design-vue/lib";
import { ThemeConfig } from "ant-design-vue/lib/config-provider/context";
import { usePrimaryColor, getRandomColor } from "@/hooks/useTheme";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { ref } from "vue";
dayjs.locale("zh-cn"); // 默认中文
usePrimaryColor(); // 载入用户自定义主题色

const themeColor = {
  light: theme.defaultAlgorithm,
  compact: theme.compactAlgorithm,
  dark: theme.darkAlgorithm,
};

const themeConfig = ref<ThemeConfig>({
  // algorithm: themeColor["light"],
  algorithm: themeColor["dark"],

  token: {
    // colorBgContainer: "#fff",
    colorPrimary: "#1668dc",// "#722ED1",
    borderRadius: 6,
  },
});

// setInterval(() => {
//   const color = getRandomColor();
//   ConfigProvider.config({
//     theme: {
//       primaryColor: color,
//     },
//   });
//   if (themeConfig.value && themeConfig.value.token) {
//     themeConfig.value.token.colorPrimary = color;
//     const theme = Math.random() > 0.5 ? "light" : "dark";
//     themeConfig.value.algorithm = themeColor[theme];
//   }
// }, 10000);
</script>

<style>
#app {
  height: 100%;
}

body .ant-pro-basicLayout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.ant-pro-sider {
  z-index: 20;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }

  100% {
    opacity: 1;
  }
}
@keyframes zoomOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }
}
</style>
