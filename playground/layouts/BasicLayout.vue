<template>
  <a-watermark content="Pro Layout" :z-index="100">
    <pro-layout
      :locale="locale"
      v-model:collapsed="state.collapsed"
      v-model:selectedKeys="state.selectedKeys"
      v-model:openKeys="state.openKeys"
      :loading="loading"
      :breadcrumb="{ routes: breadcrumb }"
      disable-content-margin
      style="min-height: 100vh"
      iconfont-url="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
      layout="mix"
      navTheme="light"
      fixedHeader
      fixSiderbar
      splitMenus
    >
      <template #menuHeaderRender>
        <router-link :to="{ path: '/' }">
          <img src="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg" />
          <h1>Preview Pro</h1>
        </router-link>
      </template>

      <template #rightContentRender>
        <RightContent :current-user="currentUser" />
      </template>

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

      <SettingDrawer v-model="proConfig" />

      <RouterView v-slot="{ Component, route }">
        <transition name="slide-left" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </pro-layout>
  </a-watermark>
</template>

<script setup lang="ts">
import { useRouter, RouterView, RouterLink } from "vue-router";
import {
  ProLayout,
  // getMenuData,
  // clearMenuItem,
  // RouteContextProps,
  // MenuDataItem,
} from "antdv-pro-layout";
import { SmileOutlined, HeartOutlined } from "@ant-design/icons-vue";
import { reactive, ref, computed, watch } from "vue";
import RightContent from "@/components/RightContent/RightContent.vue";
import SettingDrawer from "@/components/SettingDrawer/SettingDrawer.vue";

const router = useRouter();
// const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const state = reactive<any>({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
});

const loading = ref(false);

const proConfig = ref({
  layout: "mix",
  navTheme: "light",
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: true,
});

const locale = (menuData: any) => menuData.meta?.title;

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().map((item) => {
    return {
      path: item.path,
      breadcrumbName: item.meta.title || "",
    };
  })
);

const currentUser = reactive({
  nickname: "Admin",
  avatar: "A",
});

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
</script>
