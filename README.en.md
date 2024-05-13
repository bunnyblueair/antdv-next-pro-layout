# Ant Design Vue Pro Layout

Ant Design Pro Layout of Vue, easy to use pro scaffolding.

[![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json)
[![NPM version](https://img.shields.io/npm/v/antdv-pro-layout/latest?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
[![NPM downloads](https://img.shields.io/npm/dm/antdv-pro-layout.svg?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)

[中文](./README.md) | [English](./README.en.md)

## Install

```bash
npm i antdv-pro-layout
```

## Simple Usage

First, you should add the `antdv-pro-layout` that you need into the library.

```js
// main.[js|ts]
import { createApp } from "vue";
import App from "./App.vue";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
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

- `MediaQueryEnum` Screen size media query enumeration object
- `getMediaScreen` Screen size
- `useMediaScreen` Screen size ref responds to listening
- `prefersColorScheme` Media theme color mode preference listening
- `viewTransitionTheme` Theme switching view transitions
- `getMenuData` The routing table exits the system menu
- `clearMenuItem` Clear menu item, property excluded !name and meta

### Component Layout - ProLayout

| Property                | Description                   | Type                        | Default Value      |
| ----------------------- | ----------------------  | -------------------------------- | ------------------ |
| title                   | Text to the right of the layout LOGO               | string       | `'Ant Design Pro'` |
| logo                    | Link to layout LOGO diagram               | string      | `https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg`                |
| logoStyle               | Layout LOGO graphic style               | object      | -                  |
| loading                 | The layout content area loads a wait state       | boolean      | false                  |
| layout                  | Menu layout                     | 'side' \| 'top' \| 'mix'                     | `'side'`           |
| breadcrumb              | Layout content top left corner breadcrumbs          | Object                                       | -         |
| disableContentMargin    | Layout content disables margins             | boolean                                      | `false`         |
| theme                   | Global theme color                    | 'light' \|'dark'                              | `'light'`          |
| menuTheme               | Menu navigation theme color                 | 'light' \|'dark'                             | `'light'`          |
| menuData                | The menu data is generated from Vue-router routes is root path '/'        | Object                   | `[{}]`             |
| collapsed               | When the left side of the menu is closed and expanded             | boolean                                       | `true`               |
| selectedKeys            | Choose highlight keys from the menu               | string[]                                     | `[]`               |
| openKeys                | Menu select open expand keys           | string[]                                      | `[]`               |
| fixSiderbar             | Fixed list on left side of menu                   | boolean                                      | `false`         |
| splitMenus              | The menu layout 'mix' splits the secondary menu to the left | boolean                                      | `false`         |
| menuHeaderRender        | Renders the header logo and header area of the menu       | v-slot \| VNode \| (props: BasicLayoutProps) => VNode \| false           | -                  |
| menuHeaderExtraRender   | Render menu header expands area             | v-slot \| VNode \| (props: BasicLayoutProps) => VNode  \| false             | -                  |
| menuFooterRender        | Render the footer area of the menu               | v-slot \| VNode \| (props: BasicLayoutProps) => VNode  \| false               | -                  |
| menuItemRender          | Render menu items Menu.Item            | v-slot#menuItemRender="menuItem"          | -               |
| menuSubItemRender       | Nested subitems of the render menu Menu.SubItem    | v-slot#menuSubItemRender="menuItem"       | -               |
| collapsedButtonRender   | The render menu closes the button area             | v-slot#collapsedButtonRender="collapsed"   | -               |
| fixedHeader             | The top area is fixed                    | boolean                                      | `false`         |
| headerRender            | Render the top area                    | v-slot \| VNode \| (props: BasicLayoutProps) => VNode         | -                  |
| headerContentRender     | Render the top content area, only the `side` layout works                | v-slot \| (props: BasicLayoutProps) => VNode                 | -                  |
| headerContentRightRender| Renders the right area of the top content             | v-slot \| (props: BasicLayoutProps) => VNode                  | -                  |
| footerRender            | Render the bottom area                    | v-slot \| ({ width, ...props }) => VNode                       | `false`            |
| tabRender               | Renders the top tab area               | v-slot \| ({ width, ...props }) => VNode                        | `false`            |
| breadcrumbRender        | Render the BREADCRUMB area               | v-slot \| ({ route, params, routes, paths, h }) => VNode[]         | -                  |
| locale                  | Menu name internationalization function processing             | Function(menuDataItem?: MenuDataItem) => string \| `false`              | `false`            |
| collapse                | The left side of the menu folds up to expand the trigger function processing      | Function(collapsed: boolean) => void            | -                  |

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
| ---- | ---- | ---- | ---- |
| links     | Required, link jump    | Array<{ key?: string; title: string; href: string; blankTarget?: boolean; }> | - |
| copyright | Copyright notice area      | v-slot \| VNode \| (props: BasicLayoutProps) => VNode \| false               | undefined |
| prefixCls | Style prefix          | string                                                                       | `ant-pro-global-footer` |

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

Contains the ANTDV component API attributes: [PageHeader](https://www.antdv.com/components/page-header#api)、[Affix](https://www.antdv.com/components/affix#api)

| Property | Description | Type | Default Value |
| ---- | ---- | ---- | ---- |
| loading        | Load status                          | boolean      | false |
| flex           | The content layout is full, with a default fixed width of 1200px   | boolean      | false  |
| fixed-header   | Fix the page header to the top            | boolean       | false  |
| affixProps     | Configuration of fasteners                      | [affix](https://www.antdv.com/components/affix#api) | {offsetTop: 48} |
| pageFooter     | Render footer slot                    | VNode \| v-slot | -    |
| pageHeader     | The render header replaces the page header component slot   | VNode \| v-slot | -    |
| ...            | The PageHeader property                  | [PageHeader API](https://www.antdv.com/components/page-header#api) | - |
| breadcrumb     | Page header breadcrumb configuration, {} configuration is not displayed      | [breadcrumb](https://www.antdv.com/components/breadcrumb/)  | -       |
| content        | Page header default slot                       | VNode \| v-slot | -    |
| contentExtra   | The default slot space on the right side of the page header                | VNode \| v-slot | -   |
| tab-list       | Pageheader footer slot no time to display the tag list     | `Array<{key: string, tab: any}>` | -             |
| tab-active-key | The list of tags currently activates the key                       | string      | -  |
| tab-change     | Tab list tab is a callback for being clicked                   | (key) => void          | -      |
| tab-props      | Tab list tab properties                        | [tabs](https://www.antdv.com/components/tabs)         | -      |

## Basic Usage

Recommend look [Examples](./playground/) or [Use Template](https://gitee.com/TsMask/mask_vue3_antd)

## Source Project Repository Branch

From [@ant-design-vue/pro-layout](https://github.com/vueComponent/pro-components)

- next : Vue3 + `ant-design-vue@3.x` (latest)
- v3.1 : Vue3 + `ant-design-vue@2.2.x` (release LTS)
- v2 : Vue2 + `ant-design-vue@1.7.x`

The version is still being updated [v4](https://gitee.com/TsMask/antdv-pro-layout)

## Continuous Maintenance

```bash
# Required dependencies for installation
npm install

# The packaged build dist directory contains the d.ts file
npm run build
```
