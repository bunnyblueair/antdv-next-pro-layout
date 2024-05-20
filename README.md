# Ant Design Vue Pro Layout

Ant Design Pro Vue 布局，易于使用专业脚手架。

[![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json)
[![NPM version](https://img.shields.io/npm/v/antdv-pro-layout/latest?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
[![NPM downloads](https://img.shields.io/npm/dm/antdv-pro-layout.svg?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)

[中文](./README.md) | [English](./README.en.md)

## 安装 Install

```bash
npm i antdv-pro-layout
```

## 简单使用 Simple Usage

首先，您应该将所需的 `antdv-pro-layout` 添加到库中。

```js
// main.[js|ts]
import { createApp } from "vue";
import App from "./App.vue";

import "ant-design-vue/dist/reset.css";
import Antd from "ant-design-vue";

import 'antdv-pro-layout/dist/style.css';
import { ProLayout, PageContainer } from "antdv-pro-layout";

const app = createApp(App);

app.use(Antd).use(ProLayout).use(PageContainer).mount("#app");
```

之后，您可以在Vue组件中使用专业布局，如下所示：

```vue
<template>
  <pro-layout
    :locale="locale"
    :menu-data="menuData"
    v-bind="layoutConf"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
  >
    <router-view />
  </pro-layout>
</template>

<script setup lang="ts">
import { reactive, useRouter } from "vue";
import { getMenuData, clearMenuItem, type MenuDataItem } from "antdv-pro-layout";

const locale = (menuData: MenuDataItem) => menuData.meta?.title;
const router = useRouter();

const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const state = reactive({
  collapsed: false, // default value
  openKeys: ["/dashboard"], // defualt openKeys
  selectedKeys: ["/welcome"], // default selectedKeys
});

const layoutConf = reactive({
  layout: "side",
  theme: "light", // "dark" | "light",
  menuTheme: "light", // "dark" | "light",
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: true,
});
</script>
```

## 库功能支持 API

### 函数布局 ProLayout

- `MediaQueryEnum` 屏幕尺寸媒体查询枚举对象
- `getMediaScreen` 屏幕尺寸
- `useMediaScreen` 屏幕尺寸 ref响应监听
- `PrefersColorSchemeEnum` 媒体主题颜色模式枚举对象
- `getPrefersColorScheme` 媒体主题颜色模式偏好
- `usePrefersColorScheme` 媒体主题颜色模式偏好 ref响应监听
- `viewTransitionTheme` 主题切换视图过渡
- `getMenuData` 路由表转出系统菜单
- `clearMenuItem` 清除菜单项，属性排除!name和meta隐藏标记

### 组件布局 ProLayout

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| title                   | 布局LOGO右侧文本               | string       | `'Ant Design Pro'` |
| logo                    | 布局LOGO图链接                 | string      | -                |
| logoStyle               | 布局LOGO图样式                 | object      | -                  |
| loading                 | 布局内容区加载等待状态          | boolean      | false                  |
| layout                  | 菜单布局                       | 'side' \| 'top' \| 'mix'                     | `'side'`           |
| breadcrumb              | 布局内容左上角面包屑            | Object                                       | -         |
| theme                   | 全局主题色                     | 'light' \|'dark'                              | `'light'`          |
| menuTheme               | 菜单导航主题色                 | 'light' \|'dark'                             | `'light'`          |
| menuData                | 菜单数据根据Vue-router `routes` 根路径'/'生成       | Object                   | `[{}]`             |
| collapsed               | 菜单左侧时收起展开             | boolean                                       | `true`               |
| collapsedWidth          | 菜单左侧时收起宽度大小          | number                                       |  48                 |
| siderWidth              | 菜单左侧时展开宽度大小          | number                                       |  200                |
| selectedKeys            | 菜单选择高亮keys               | string[]                                     | `[]`               |
| openKeys                | 菜单选择打开展开keys           | string[]                                      | `[]`               |
| fixSiderbar             | 菜单左侧列表固定                   | boolean                                      | `false`         |
| splitMenus              | 菜单布局`mix`分割二级菜单到左侧 | boolean                                      | `false`         |
| menuHeaderRender        | 渲染菜单头logo和标题区域       | v-slot \| VNode \| (props: BasicLayoutProps) => VNode \| false           | -                  |
| menuHeaderExtraRender   | 渲染菜单头拓展区域             | v-slot \| VNode \| (props: BasicLayoutProps) => VNode  \| false             | -                  |
| menuFooterRender        | 渲染菜单底脚区域               | v-slot \| VNode \| (props: BasicLayoutProps) => VNode  \| false               | -                  |
| menuItemRender          | 渲染菜单项 Menu.Item            | v-slot#menuItemRender="menuItem"          | -               |
| menuSubItemRender       | 渲染菜单嵌套子项 Menu.SubItem    | v-slot#menuSubItemRender="menuItem"       | -               |
| collapsedButtonRender   | 渲染菜单收起按钮区域             | v-slot#collapsedButtonRender="collapsed"   | -               |
| fixedHeader             | 顶部区域固定                    | boolean                                      | `false`         |
| headerHeight            | 顶部区域高度                    | number                                       | 48         |
| headerRender            | 渲染顶部区域                    | v-slot \| VNode \| (props: BasicLayoutProps) => VNode         | -                  |
| headerContentRender     | 渲染顶部内容区域，仅布局`side`有效                | v-slot \| (props: BasicLayoutProps) => VNode                 | -                  |
| headerContentRightRender| 渲染顶部内容右端区域             | v-slot \| (props: BasicLayoutProps) => VNode                  | -                  |
| footerRender            | 渲染底部区域                    | v-slot \| ({ width, ...props }) => VNode                       | `false`            |
| tabRender               | 渲染顶部标签页区域               | v-slot \| ({ width, ...props }) => VNode                        | `false`            |
| breadcrumbRender        | 渲染面包屑导航区域               | v-slot \| ({ route, params, routes, paths, h }) => VNode[]         | -                  |
| locale                  | 菜单名国际化函数处理             | Function(menuDataItem?: MenuDataItem) => string \| `false`              | `false`            |
| collapse                | 菜单左侧收起展开触发函数处理      | Function(collapsed: boolean) => void            | -                  |

> 菜单生成需要 `getMenuData` 和 `clearMenuItem` 函数转换  
> 例如 `const { menuData } = getMenuData(clearMenuItem(routes))`

#### 插槽渲染 Custom Render

##### 渲染顶部内容区域 headerContentRender

```vue
<template #headerContentRender>
  <div style="background-color: #ff7875">headerContentRender</div>
</template>
<template #headerContentRightRender>
  <a-avatar shape="square" size="small"> Avatar </a-avatar>
</template>
```

##### 渲染菜单项 menuItemRender Menu.Item

```vue
<template #menuItemRender="{ path, meta }">
  <a-menu-item
    :key="path"
    :disabled="meta?.disabled"
    :danger="meta?.danger"
    :icon="meta?.icon"
  >
    <router-link :to="path">
      <span class="ant-pro-menu-item">
        <a-badge count="5" dot>
          <span class="ant-pro-menu-item-title">{{ meta?.title }}</span>
        </a-badge>
      </span>
    </router-link>
  </a-menu-item>
</template>
```

##### 渲染顶部头区域 breadcrumbRender

```vue
<template #breadcrumbRender="{ route, params, routes }">
  <span v-if="routes.indexOf(route) === routes.length - 1">
    {{ route.breadcrumbName }}
  </span>
  <RouterLink v-else :to="{ path: route.path, params }">
    {{ route.breadcrumbName }}
  </RouterLink>
</template>
```

##### 渲染顶部标签页区域 tabRender

```vue
<template #tabRender="{ width, fixedHeader }">
  <div>
    <header
      class="ant-layout-header"
      style="height: 36px; line-height: 36px; background: transparent"
      v-if="fixedHeader"
    ></header>
    <div
      :style="{
        margin: '0',
        height: '36px',
        lineHeight: '36px',
        right: '0px',
        top: '48px',
        position: fixedHeader ? 'fixed' : 'unset',
        width: fixedHeader ? width : '100%',
        overflow: 'hidden',
        zIndex: 14,
        padding: '4px 16px',
        background: '#fff',
        boxShadow: '0 1px 4px #0015291f',
        transition: 'background 0.3s, width 0.2s',
      }"
    >
      tabRender fixedHeader：{{ fixedHeader }} width：{{ width }}
    </div>
  </div>
</template>
```

##### 渲染底部区域 footerRender

```vue
<template #footerRender="{ width, fixedHeader }">
  <div>
    <footer
      class="ant-layout-footer"
      style="height: 48px; line-height: 48px; background: transparent"
      v-if="fixedHeader"
    ></footer>
    <GlobalFooter
      :style="{
        margin: '0',
        height: '48px',
        lineHeight: '48px',
        right: '0px',
        bottom: '0px',
        position: fixedHeader ? 'fixed' : 'unset',
        width: fixedHeader ? width : '100%',
        overflow: 'hidden',
        zIndex: 14,
        background: '#fff',
        boxShadow: '0 1px 4px #0015291f',
        transition: 'background 0.3s, width 0.2s',
      }"
      :links="[
        {
          blankTarget: true,
          title: 'Link 1',
          href: '#',
        },
        {
          blankTarget: false,
          title: 'Link 2',
          href: 'https://gitee.com/TsMask/',
        },
        {
          blankTarget: true,
          title: 'Link 3',
          href: '#',
        },
      ]"
      copyright="Copyright &copy; 2023 Gitee For TsMask"
    >
    </GlobalFooter>
  </div>
</template>
```

### 组件页脚 GlobalFooter

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| links     | 必填，链接跳转    | Array<{ key?: string; title: string; href: string; blankTarget?: boolean; }> | - |
| copyright | 版权声明区域      | v-slot \| VNode \| (props: BasicLayoutProps) => VNode \| false               | undefined |

```vue
<GlobalFooter
  :links="[
    {
      blankTarget: true,
      title: 'Link 1',
      href: '#',
    },
    {
      blankTarget: false,
      title: 'Link 2',
      href: 'https://gitee.com/TsMask/',
    },
    {
      blankTarget: true,
      title: 'Link 3',
      href: '#',
    },
  ]"
  copyright="Copyright &copy; 2023 Gitee For TsMask"
></GlobalFooter>
```

### 组件内容页 PageContainer

包含antdv组件API属性: [PageHeader 页头](https://www.antdv.com/components/page-header-cn#api)、[Affix 固钉](https://www.antdv.com/components/affix-cn#api)

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| loading        | 加载状态                          | boolean      | false |
| disableMargin  | 布局内容禁用外边距 `24px`          | boolean      | false |
| flex           | 内容布局充满，默认固定宽度1200px    | boolean      | false  |
| fixed-header   | 固定 PageHeader 到顶部            | boolean       | false  |
| affixProps     | 固钉的配置                      | [affix](https://www.antdv.com/components/affix-cn#api) | {offsetTop: 48} |
| pageFooter     | 渲染页脚插槽                    | VNode \| v-slot | -    |
| pageHeader     | 渲染页头替换PageHeader组件插槽   | VNode \| v-slot | -    |
| ...            | PageHeader属性                  | [PageHeader 页头API](https://www.antdv.com/components/page-header-cn#api) | - |
| breadcrumb     | PageHeader面包屑的配置,{}配置不显示       | [breadcrumb](https://www.antdv.com/components/breadcrumb-cn/)  | -       |
| content        | PageHeader默认插槽                       | VNode \| v-slot | -    |
| contentExtra   | PageHeader默认插槽右侧空间                | VNode \| v-slot | -   |
| tab-list       | PageHeader插槽footer无时，显示标签列表     | `Array<{key: string, tab: any}>` | -             |
| tab-active-key | 标签列表当前激活key                       | string      | -  |
| tab-change     | 标签列表tab被点击的回调                   | (key) => void          | -      |
| tab-props      | 标签列表标签页属性                        | [tabs](https://www.antdv.com/components/tabs-cn)         | -      |

## 基本使用示例 Basic Usage

项目目录下 [演示测试](./playground/) or [项目引用示例](https://gitee.com/TsMask/mask_vue3_antd)

## 源项目仓库分支 Branch

来自 [@ant-design-vue/pro-layout](https://github.com/vueComponent/pro-components)

- next : Vue3 + `ant-design-vue@3.x` (latest)
- v3.1 : Vue3 + `ant-design-vue@2.2.x` (release LTS)
- v2 : Vue2 + `ant-design-vue@1.7.x`

当前版本，还在持续更新 [v4](https://gitee.com/TsMask/antdv-pro-layout)

## 持续维护 Continuous Maintenance

```bash
# 安装所需依赖
npm install

# 打包生成dist目录含d.ts文件
npm run build
```
