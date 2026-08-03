# Ant Design Vue Pro Layout

Ant Design Pro Layout of Vue, easy to use pro scaffolding.

[![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json)
[![NPM version](https://img.shields.io/npm/v/antdv-pro-layout/latest?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
[![NPM downloads](https://img.shields.io/npm/dm/antdv-pro-layout.svg?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)

[中文](./README.md) | [English](./README.en.md)

## Install

```bash
npm i antdv-pro-layout antdv-next @antdv-next/icons
```

## Simple Usage

First, you should add the `antdv-pro-layout` that you need into the library.

```js
// main.[js|ts]
import { createApp } from "vue";
import App from "./App.vue";

import "antdv-next/dist/reset.css";
import Antd from "antdv-next";

import 'antdv-pro-layout/dist/style.css';
import { ProLayout, PageContainer } from "antdv-pro-layout";

const app = createApp(App);

app.use(Antd).use(ProLayout).use(PageContainer).mount("#app");
```

After that, you can use pro-layout in your Vue components as simply as this:

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

## API

### Function Layout - ProLayout

| Name | Description | Parameters | Return |
| --- | --- | --- | --- |
| `MediaQueryEnum` | Screen size media query enum object | - | enum xs/sm/md/lg/xl/xxl/xxxl |
| `getMediaScreen()` | Current screen size | - | `MediaQueryKey` |
| `useMediaScreen()` | Reactive screen size listener (auto cleanup) | - | `Ref<MediaQueryKey>` |
| `PrefersColorSchemeEnum` | Theme color mode enum object | - | enum light/dark |
| `getPrefersColorScheme()` | System theme color mode preference | - | `PrefersColorSchemeKey` |
| `usePrefersColorScheme()` | Reactive theme color mode preference | - | `Ref<PrefersColorSchemeKey>` |
| `viewTransitionTheme(listener, e?)` | Theme switching view transition animation | `listener: (isDark) => void`<br>`e?: { clientX, clientY }` | `void` |
| `getMenuData(routes)` | Convert route table to system menu, reads only the `/` subtree | `routes: readonly RouteRecordRaw[]` | `{ menuData, breadcrumb }` |
| `clearMenuItem(routes)` | Remove hidden / unnamed menu items | `routes: readonly RouteRecordRaw[] \| readonly RouteRecord[]` | `RouteRecordRaw[]` |

### Component Layout - ProLayout

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| title | Text to the right of the layout LOGO | string | `'Ant Design Vue Pro'` |
| logo | Layout LOGO, supports URL / VNode / render function | string \| VNode \| Function | - |
| logoStyle | Layout LOGO style | object | - |
| iconfontUrl | Iconfont Symbol script URL | string | `''` |
| loading | Loading state of the layout content area | boolean | `false` |
| pure | Pure mode, renders only the default slot (no layout shell) | boolean | `false` |
| isChildrenLayout | Whether it is a nested child layout | boolean | - |
| contentStyle | Custom style of the layout content area | object \| string | - |
| layout | Menu layout | 'side' \| 'top' \| 'mix' | `'side'` |
| theme | Global theme | 'light' \| 'dark' | `'light'` |
| menuTheme | Menu navigation theme | 'light' \| 'dark' | `'light'` |
| menuData | Menu item data [`MenuDataItem[]`](dist\types\typings\index.d.ts) | Array | `[]` |
| collapsed | Collapse/expand the left menu | boolean | `false` |
| collapsedWidth | Width when the left menu is collapsed | number | `48` |
| siderWidth | Width when the left menu is expanded | number | `200` |
| selectedKeys | Selected highlight keys of the menu | string[] | `[]` |
| openKeys | Open keys of the menu | string[] | `[]` |
| matchMenuKeys | Menu highlight match keys | string[] | `[]` |
| breakpoint | Responsive breakpoint of the sider, pass `''` to disable | string \| object | `'md'` |
| breadcrumb | Breadcrumbs in the upper left of the content area | object \| Function | - |
| fixSiderbar | Fix the left list of the menu | boolean | `false` |
| fixedHeader | Fix the top area | boolean | `false` |
| headerHeight | Top area height | number | `48` |
| splitMenus | The `mix` layout splits the secondary menu to the left | boolean | `false` |
| locale | Menu name i18n function, pass `false` to disable | (menuDataItem?: MenuDataItem) => string \| `false` | `false` |
| menuHeaderRender | Render the menu header logo and title area | v-slot \| VNode \| (props) => VNode \| false | - |
| menuHeaderExtraRender | Render the menu header extra area | v-slot \| VNode \| (props) => VNode \| false | - |
| menuContentRender | Render the whole menu content area | v-slot#menuContentRender="props" | - |
| menuFooterRender | Render the menu footer area | v-slot \| VNode \| (props) => VNode \| false | - |
| menuItemRender | Render menu items Menu.Item | v-slot#menuItemRender="menuItem" | - |
| menuSubItemRender | Render nested sub-items Menu.SubItem | v-slot#menuSubItemRender="menuItem" | - |
| collapsedButtonRender | Render the menu collapse button area | v-slot#collapsedButtonRender="collapsed" | - |
| headerRender | Render the top area, pass `false` to hide | v-slot \| VNode \| (props) => VNode \| false | - |
| headerContentRender | Render the top content area, only `side` layout works | v-slot \| (props) => VNode | - |
| headerContentRightRender | Render the right area of the top content | v-slot \| (props) => VNode | - |
| footerRender | Render the bottom area, pass `false` to hide | v-slot \| ({ width, ...props }) => VNode | - |
| tabRender | Render the top tab area, pass `false` to hide | v-slot \| ({ width, ...props }) => VNode | - |
| breadcrumbRender | Render the breadcrumb area | v-slot \| ({ route, params, routes, paths }) => VNode[] | - |
| collapse | Collapse/expand trigger event of the left menu | (collapsed: boolean) => void | - |

> Menu generation requires `getMenuData` and `clearMenuItem` function transformations
> For example: `const { menuData } = getMenuData(clearMenuItem(routes))`

#### Custom Render

##### headerContentRender

```vue
<template #headerContentRender>
  <div style="background-color: #ff7875">headerContentRender</div>
</template>
<template #headerContentRightRender>
  <a-avatar shape="square" size="small"> Avatar </a-avatar>
</template>
```

##### menuItemRender Menu.Item

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

##### breadcrumbRender

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

##### tabRender

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

##### footerRender

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

### Component Footer - GlobalFooter

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| links | Required, link jump | Array<{ key?: string; title: string; href: string; blankTarget?: boolean; }> | - |
| copyright | Copyright notice area | string \| VNode \| v-slot | undefined |

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

### Component content page - PageContainer

Uses the antdv-next [Affix](https://antdv-next.com/docs/vue/components/affix-cn#api) API; PageContainer provides its own compatible page-header implementation.

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| loading | Load status | boolean | false |
| disableMargin | Disable the content outer margin `24px` | boolean | false |
| flex | Whether the content fills the width | boolean | true |
| fixed-header | Fix the PageHeader to the top | boolean | false |
| affixProps | Affix configuration | [affix](https://antdv-next.com/docs/vue/components/affix-cn#api) | - |
| pageHeader | Render slot to replace the PageHeader component | VNode \| v-slot | - |
| pageFooter | Render footer slot | VNode \| v-slot | - |
| content | PageHeader default slot | VNode \| v-slot | - |
| contentExtra | Right space of the PageHeader default slot | VNode \| v-slot | - |
| breadcrumb | PageHeader breadcrumb configuration, `{}` to hide | [breadcrumb](https://antdv-next.com/docs/vue/components/breadcrumb-cn/) | - |
| tab-list | Display the tab list when the PageHeader footer slot is absent | `Array<{ key: string; tab: any }>` | - |
| tab-active-key | Currently active key of the tab list | string | - |
| tab-change | Callback when a tab is clicked | (key) => void | - |
| tab-props | Tab list Tabs properties | [tabs](https://antdv-next.com/docs/vue/components/tabs-cn) | - |
| ... | PageContainer page-header compatibility properties | - | - |

## Basic Usage

Recommend look [Examples](./playground/) or [Use Template](https://gitee.com/TsMask/mask_vue3_antd)

## Source Project Repository Branch

From [@ant-design-vue/pro-layout](https://github.com/vueComponent/pro-components)

- next : Vue3 + `ant-design-vue@3.x` (latest)
- v3.1 : Vue3 + `ant-design-vue@2.2.x` (release LTS)
- v2 : Vue2 + `ant-design-vue@1.7.x`

The current version uses Vue3 + `antdv-next@1.4.5` ([migration guide](https://antdv-next.com/docs/vue/migration-antdv-next-cn))

## Continuous Maintenance

```bash
# Required dependencies for installation
npm install

# The packaged build dist directory contains the d.ts file
npm run build
```
