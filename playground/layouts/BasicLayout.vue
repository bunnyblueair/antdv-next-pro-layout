<script setup lang="ts">
import { useRouter, RouterView, RouterLink } from "vue-router";
import {
  ProLayout,
  getMenuData,
  clearMenuItem,
  type RouteContextProps,
  type MenuDataItem,
} from "antdv-pro-layout";
import { SmileOutlined, HeartOutlined } from "@ant-design/icons-vue";
import { reactive, ref, computed, watch } from "vue";
import RightContent from "./components/RightContent/RightContent.vue";
import SettingDrawer from "./components/SettingDrawer/SettingDrawer.vue";

const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const state = reactive<Omit<RouteContextProps, "menuData">>({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
});

const loading = ref(false);

const proConfig = ref<any>({
  /**导航布局 "side" | "top" | "mix" */
  layout: "side",
  /**导航菜单主题色 "dark" | "light" */
  navTheme: "light",
  /**顶部导航主题，仅导航布局为mix时生效 "dark" | "light" */
  headerTheme: "light",
  /**固定顶部栏 */
  fixedHeader: true,
  /**固定菜单栏 */
  fixSiderbar: true,
  /**自动分割菜单 */
  splitMenus: false,
});

const locale = (menuData: MenuDataItem) => menuData.meta?.title;

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().map((item) => {
    return {
      path: item.path,
      breadcrumbName: item.meta.title || "",
    };
  })
);

watch(
  router.currentRoute,
  () => {
    const matched = router.currentRoute.value.matched.concat();
    state.selectedKeys = matched
      .filter((r) => r.name !== "Root")
      .map((r) => r.path);
    state.openKeys = matched
      .filter((r) => r.path !== router.currentRoute.value.path)
      .map((r) => r.path);
  },
  {
    immediate: true,
  }
);

/**抽屉设置 */
const settingDrawerOpen = ref(false);
function settingDrawer(bool: boolean) {
  settingDrawerOpen.value = bool;
}
</script>

<template>
  <a-watermark content="Pro Layout" :z-index="100">
    <ProLayout
      :locale="locale"
      v-model:collapsed="state.collapsed"
      v-model:selectedKeys="state.selectedKeys"
      v-model:openKeys="state.openKeys"
      :loading="loading"
      :menu-data="menuData"
      :breadcrumb="{ routes: breadcrumb }"
      disable-content-margin
      v-bind="proConfig"
      iconfont-url="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
    >
      <template #menuHeaderRender>
        <router-link :to="{ path: '/' }">
          <img src="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg" />
          <h1>Preview Pro</h1>
        </router-link>
      </template>

      <template #rightContentRender>
        <RightContent @drawer="settingDrawer" />
      </template>
      <SettingDrawer
        v-model:config="proConfig"
        :open="settingDrawerOpen"
        @close="settingDrawer"
      ></SettingDrawer>

      <!-- custom breadcrumb itemRender  -->
      <template #breadcrumbRender="{ route, params, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          <HeartOutlined />
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="{ path: route.path, params }">
          <SmileOutlined />
          {{ route.breadcrumbName }}
        </router-link>
      </template>

      <RouterView v-slot="{ Component, route }">
        <transition name="slide-left" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </ProLayout>
  </a-watermark>
</template>
