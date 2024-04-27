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
import { proConfig } from "@/hooks/useTheme";

const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
const loading = ref(false);
const locale = (menuData: MenuDataItem) => menuData.meta?.title;

/**菜单面板 */
const state = reactive<Omit<RouteContextProps, "menuData">>({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
});

/**面包屑数据对象，排除根节点和首页不显示 */
const breadcrumb = computed(() => {
  const matched = router.currentRoute.value.matched.concat();
  return matched
    .filter((r) => !["Root", "Index"].includes(r.name as string))
    .map((item) => {
      return {
        path: item.path,
        breadcrumbName: item.meta.title || "-",
      };
    });
});

/**监听路由变化改变菜单面板选项 */
watch(
  router.currentRoute,
  (v) => {
    const matched = v.matched.concat();
    state.openKeys = matched
      .filter((r) => r.path !== v.path)
      .map((r) => r.path);
    state.selectedKeys = matched
      .filter((r) => r.name !== "Root")
      .map((r) => r.path);
  },
  { immediate: true }
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
      title="Preview Pro"
      logo="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg"
      :logoStyle="{ borderRadius: '6px' }"
      @collapse="(v) => console.log(v)"
    >
      <!-- 渲染菜单头logo和标题区域 -->
      <template #menuHeaderRender2>
        <router-link :to="{ path: '/' }">
          <img src="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg" />
          <h1>Header Render</h1>
        </router-link>
      </template>
      <!-- 渲染菜单头拓展区域 -->
      <template #menuHeaderExtraRender2>
        <div style="height: 100px; background-color: red">
          menuHeaderExtraRender
        </div>
      </template>
      <!-- 渲染菜单收起按钮区域 -->
      <template #collapsedButtonRender2="collapsed">
        <div style="height: 100px; background-color: green">
          collapsedButtonRender
          <button @click="() => (state.collapsed = !state.collapsed)">
            {{ String(collapsed) }}
          </button>
        </div>
      </template>
      <!-- 渲染菜单底脚区域 -->
      <template #menuFooterRender2>
        <div style="height: 100px; background-color: blue">
          menuFooterRender
        </div>
      </template>
      <!-- 渲染菜单项 Menu.Item -->
      <template #menuItemRender2="menuItem">
        <a-menu-item
          :disabled="menuItem.meta?.disabled"
          :danger="menuItem.meta?.danger"
          :key="menuItem.path"
        >
          {{ menuItem.name }}
        </a-menu-item>
      </template>
      <!-- 渲染菜嵌套子项 Menu.SubItem -->
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

      <!-- 渲染顶部头区域 -->
      <template #headerRender2>
        <div style="background-color: #1677ff">headerRender</div>
      </template>
      <template #rightContentRender>
        <RightContent @drawer="settingDrawer" />
      </template>

      <!-- 渲染面包屑导航区域  -->
      <template #breadcrumbRender="{ route, params, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          <HeartOutlined />
          {{ route.breadcrumbName }}
        </span>
        <RouterLink v-else :to="{ path: route.path, params }">
          <SmileOutlined />
          {{ route.breadcrumbName }}
        </RouterLink>
      </template>

      <!--默认插槽-->
      <RouterView v-slot="{ Component, route }">
        <transition name="slide-left" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>

      <!--渲染底部区域-->
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

    <!-- 布局设置抽屉 -->
    <SettingDrawer
      v-model:config="proConfig"
      :open="settingDrawerOpen"
      @close="settingDrawer"
    ></SettingDrawer>
  </a-watermark>
</template>

<style scoped></style>
