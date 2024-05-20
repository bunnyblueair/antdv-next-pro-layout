<template>
  <!-- component-size="middle" -->
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { usePrimaryColor, themeConfig } from "@/hooks/useTheme";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn"); // 默认中文
usePrimaryColor(); // 载入用户自定义主题色
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

::view-transition-old(root),
::view-transition-new(root) {
  /* 关闭默认的淡入淡出的效果 */
  animation: none;
  mix-blend-mode: normal;
}

[data-theme="dark"]::view-transition-old(root) {
  z-index: 1;
}
[data-theme="dark"]::view-transition-new(root) {
  z-index: 999;
}

::view-transition-old(root) {
  z-index: 999;
}
::view-transition-new(root) {
  z-index: 1;
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
