<script setup lang="ts">
import { useRouter, RouterView, RouterLink } from "vue-router";
import {
  ProLayout,
  GlobalFooter,
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
  layout: "mix",
  /**全局主题色*/
  theme: "dark", // "light",
  /**菜单导航主题色*/
  menuTheme: "dark", // "light",
  /**固定顶部栏 */
  fixedHeader: true,
  /**固定菜单栏 */
  fixSiderbar: true,
  /**自动分割菜单 mix */
  splitMenus: true,
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
      :disable-content-margin="true"
      v-bind="proConfig"
      iconfont-url="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
    >
      <template #menuHeaderRender>
        <router-link :to="{ path: '/' }">
          <img src="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg" />
          <h1>Preview Pro</h1>
        </router-link>
      </template>
      <template #menuHeaderExtraRender2>
        <div style="height: 100px; background-color: red">
          menuHeaderExtraRender
        </div>
      </template>
      <template #collapsedButtonRender2="collapsed">
        <div style="height: 100px; background-color: green">
          collapsedButtonRender
          <button @click="() => (state.collapsed = !state.collapsed)">
            {{ String(collapsed) }}
          </button>
        </div>
      </template>
      <template #menuFooterRender2>
        <div style="height: 100px; background-color: blue">
          menuFooterRender
        </div>
      </template>
      <template #menuItemRender2="menuItem">
        <a-menu-item
          :disabled="menuItem.meta?.disabled"
          :danger="menuItem.meta?.danger"
          :key="menuItem.path"
        >
          {{ menuItem.name }}
        </a-menu-item>
      </template>
      <template #subMenuItemRender2="menuItem">
        <template v-if="menuItem.meta?.type === 'group'">
          <a-menu-item-group :title="menuItem.meta?.title" :key="menuItem.path">
            {{ menuItem.children.length }}
          </a-menu-item-group>
        </template>
        <template v-else>
          <a-sub-menu :title="menuItem.meta?.title" :key="menuItem.path">
            {{ menuItem.children.length }}
          </a-sub-menu>
        </template>
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

      <!--插槽-内容底部-->
      <template #footerRender>
        <GlobalFooter
          :links="[
            {
              blankTarget: true,
              title: '开发手册',
              href: 'https://juejin.cn/column/7188761626017792056',
            },
            {
              blankTarget: true,
              title: '开源仓库',
              href: 'https://gitee.com/TsMask/',
            },
            {
              blankTarget: true,
              title: '接口文档',
              href: 'https://mask-api-midwayjs.apifox.cn/',
            },
          ]"
          copyright="Copyright © 2023 Gitee For TsMask"
        >
        </GlobalFooter>
      </template>
    </ProLayout>
  </a-watermark>
</template>

<style scoped></style>
