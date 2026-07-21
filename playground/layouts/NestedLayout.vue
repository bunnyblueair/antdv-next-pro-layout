<template>
  <pro-layout
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-model:collapsed="outerCollapsed"
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
    :header-render="false"
    :fix-siderbar="true"
    :breakpoint="''"
    :menu-data="routes"
    disable-content-margin
    style="min-height: 100vh"
    iconfont-url="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
  >
    <template #menuHeaderRender>
      <a>
        <img src="//www.antdv.com/assets/logo.1ef800a8.svg" />
        <h1>Pro Layout Nested</h1>
      </a>
    </template>

    <a-watermark :content="watermarkContent">
      <pro-layout
        v-model:collapsed="baseState.collapsed"
        v-model:selectedKeys="baseState.childrenSelectedKeys"
        v-model:openKeys="baseState.childrenOpenKeys"
        nav-theme="light"
        :menu-header-render="false"
        :menu-data="innerMenuData"
        :fix-siderbar="true"
        :breakpoint="''"
        :is-children-layout="true"
        disable-content-margin
      >
        <!-- custom right-content -->
        <template #headerContentRightRender>
          <div style="margin-right: 12px">
            <a-avatar shape="square" size="small">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>
        </template>

        <template #headerContentRender>
          <div style="height: 100%; display: flex; align-items: center">
            <a-breadcrumb>
              <a-breadcrumb-item v-for="item of breadcrumb" :key="item.path">
                <router-link :to="{ path: item.path }">
                  {{ item.breadcrumbName }}
                </router-link>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </template>

        <!-- content begin -->
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </pro-layout>
    </a-watermark>
  </pro-layout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ProLayout,
  clearMenuItem,
  type RouteContextProps,
} from "antdv-pro-layout";
const loading = ref(false);
const watermarkContent = ref("Pro Layout");
const router = useRouter();
// /nested 嵌套布局专用：取 /nested 路由子树作为菜单数据
// 外层 sider 显示一级（应用），内层 sider 显示二级/多级（应用内页面）
const nestedRoot = router.getRoutes().find((r) => r.path === "/nested");
const menuData = clearMenuItem(nestedRoot?.children || []);
import { UserOutlined } from "@ant-design/icons-vue";

const routes = menuData.map((item) => {
  return {
    ...item,
    children: undefined,
  };
});

const baseState = reactive<Omit<RouteContextProps, "menuData">>({
  selectedKeys: [],
  openKeys: [],

  childrenSelectedKeys: [],
  childrenOpenKeys: [],
  collapsed: false,
});

// 外层 sider 折叠状态（初始收起，点击底部按钮可展开看应用名）
const outerCollapsed = ref(true);

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().map((item) => {
    return {
      path: item.path,
      icon: item.meta.icon,
      params: item.meta?.params,
      breadcrumbName: item.meta.title || "",
    };
  })
);

// 当前选中的应用（matched[0] 为布局层，matched[1] 为应用层）
const currentApp = computed(() => {
  const matched = router.currentRoute.value.matched;
  return matched.length > 1 ? matched[1] : null;
});

// 内层：只显示当前应用的菜单树（不包含其他应用）
const innerMenuData = computed(() => {
  const app = currentApp.value;
  if (!app) return [];
  return menuData.find((item) => item.path === app.path)?.children || [];
});

watchEffect(() => {
  const matched = router.currentRoute.value.matched.concat();
  // 应用内路径：布局层与应用层之后的匹配项
  const innerMatched = matched.slice(2);
  // 外层：选中当前应用
  baseState.selectedKeys = currentApp.value ? [currentApp.value.path] : [];
  baseState.openKeys = [];
  // 内层：选中当前叶子，展开应用内父级
  baseState.childrenSelectedKeys = [router.currentRoute.value.path];
  baseState.childrenOpenKeys = innerMatched
    .filter((r) => r.path !== router.currentRoute.value.path)
    .map((r) => r.path);
});

onMounted(() => {
  setTimeout(() => {
    watermarkContent.value = "Nested Layout";
  }, 2000);
});
</script>
