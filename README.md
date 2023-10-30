# Ant Design Vue Pro Layout

Ant Design Pro布局Vue，易于使用专业脚手架。

Ant Design Pro Layout of Vue, easy to use pro scaffolding.

[![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json)
[![NPM version](https://img.shields.io/npm/v/antdv-pro-layout/latest?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
[![NPM downloads](https://img.shields.io/npm/dm/antdv-pro-layout.svg?style=flat)](https://www.npmjs.com/package/antdv-pro-layout)
![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## 安装 Install

```bash
npm i antdv-pro-layout
```

## 简单使用 Simple Usage

首先，您应该将所需的“antdv-pro布局”添加到库中。

First, you should add the `antdv-pro-layout` that you need into the library.

```js
// main.[js|ts]
import "antdv-pro-layout/dist/style.css"; // pro-layout css or style.less

import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import ProLayout, { PageContainer } from "antdv-pro-layout";

const app = createApp(App);

app.use(Antd).use(ProLayout).use(PageContainer).mount("#app");
```

之后，您可以在Vue组件中使用专业布局，如下所示：

After that, you can use pro-layout in your Vue components as simply as this:

```vue
<template>
  <pro-layout
    :locale="locale"
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
  openKeys: ["/dashboard"],
  selectedKeys: ["/welcome"],
});
const layoutConf = reactive({
  navTheme: "dark",
  layout: "mix",
  splitMenus: false,
  menuData,
});
</script>
```

## 当前可用功能 API

### 布局 ProLayout

| Property                | Description                                                           | Type                                                                   | Default Value      |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------ |
| title                   | layout in the upper left corner title                                 | VNode \| String                                                        | `'Ant Design Pro'` |
| logo                    | layout top left logo url                                              | VNode \| render                                                        | -                  |
| loading                 | layout loading status                                                 | boolean                                                                | -                  |
| layout                  | layout menu mode, sidemenu: right navigation, topmenu: top navigation | 'side' \| 'top' \| 'mix'                                               | `'side'`           |
| contentWidth            | content mode of layout, Fluid: adaptive, Fixed: fixed width 1200px    | 'Fixed' \| 'Fluid'                                                     | `Fluid`            |
| navTheme                | Navigation theme                                                      | 'light' \|'dark'                                                       | `'light'`          |
| headerTheme             | Header Bar theme                                                      | 'light' \|'dark'                                                       | `'light'`          |
| menuData                | Vue-router `routes` prop                                              | Object                                                                 | `[{}]`             |
| collapsed               | control menu's collapse and expansion                                 | boolean                                                                | true               |
| selectedKeys            | menu selected keys                                                    | string[]                                                               | `[]`               |
| openKeys                | menu openKeys                                                         | string[]                                                               | `[]`               |
| isMobile                | is mobile                                                             | boolean                                                                | false              |
| onCollapse \| @collapse | folding collapse event of menu                                        | (collapsed: boolean) => void                                           | -                  |
| menuHeaderRender        | render header logo and title                                          | v-slot \| VNode \| (logo,title)=>VNode \| false                        | -                  |
| menuExtraRender         | render extra menu item                                                | v-slot \| VNode \| (props)=>VNode \| false                             | -                  |
| menuFooterRender        | render footer menu item                                               | v-slot \| VNode \| (props)=>VNode \| false                             | -                  |
| menuItemRender          | custom render Menu.Item                                               | v-slot#menuItemRender="{ item, icon }" \| ({ item, icon }) => VNode    | null               |
| subMenuItemRender       | custom render Menu.SubItem                                            | v-slot#subMenuItemRender="{ item, icon }" \| ({ item, icon }) => VNode | null               |
| collapsedButtonRender   | custom collapsed button method                                        | `slot` \| (collapsed: boolean) => VNode                                | -                  |
| headerRender            | custom header render method                                           | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| headerContentRender     | header content render method only layout side                         | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| rightContentRender      | header right content render method                                    | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| footerRender            | custom footer render method                                           | `slot` \| ({ width, ...BasicLayoutProps }) => VNode                           | `false`            |
| tabRender               | custom tab render method                                              | `slot` \| ({ width, ...BasicLayoutProps }) => VNode                    | `false`            |
| breadcrumbRender        | custom breadcrumb render method                                       | `slot` \| ({ route, params, routes, paths, h }) => VNode[]             | -                  |
| locale                  | i18n                                                                  | Function(menuDataItem?: MenuDataItem) => string \| `false`                            | `false`            |

> Menu generation requires `getMenuData` and `clearMenuItem` function
> e.g. `const { menuData } = getMenuData(clearMenuItem(routes))`

#### 自定义渲染 Custom Render

##### Custom rightContentRender

```vue
<template #rightContentRender>
  <div style="margin-right: 12px">
    <a-avatar shape="square" size="small">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
  </div>
</template>
```

##### Custom menu.item

```vue
<template #menuItemRender="{ item, icon }">
  <a-menu-item
    :key="item.path"
    :disabled="item.meta?.disabled"
    :danger="item.meta?.danger"
    :icon="icon"
  >
    <router-link :to="{ path: item.path }">
      <span class="ant-pro-menu-item">
        <a-badge count="5" dot>
          <span class="ant-pro-menu-item-title">{{ item.meta.title }}</span>
        </a-badge>
      </span>
    </router-link>
  </a-menu-item>
</template>
```

##### Custom menuExtraRender

```vue
<template #menuExtraRender="{ collapsed }">
  <a-input-search v-if="!collapsed" />
</template>
```

##### Custom menuFooterRender

```vue
<template #menuFooterRender>
  <div>menu footer</div>
</template>
```

##### Custom breadcrumbRender

```vue
<template #breadcrumbRender="{ route, params, routes }">
  <span v-if="routes.indexOf(route) === routes.length - 1">
    {{ route.breadcrumbName }}
  </span>
  <router-link v-else :to="{ path: route.path, params }">
    {{ route.breadcrumbName }}
  </router-link>
</template>
```

##### Custom collapsedButtonRender

```vue
<template #collapsedButtonRender="collapsed">
  <HeartOutlined v-if="collapsed" />
  <SmileOutlined v-else />
</template>
```

##### Custom tabRender

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
        zIndex: 14,
        padding: '4px 16px',
        width: width,
        background: '#fff',
        boxShadow: '0 1px 4px #0015291f',
        transition: 'background 0.3s, width 0.2s',
      }"
    >
      tabRender fixedHeader：{{fixedHeader}} width：{{ width }} 
    </div>
  </div>
</template>
```

##### Custom footer with slot

```vue
<template #footerRender="{ width, headerTheme }">
  <div>
    <footer class="ant-layout-footer" style="height: 36px; line-height: 36px; background: transparent"></footer>
    <div
      :style="{
        margin: '0',
        height: '36px',
        lineHeight: '36px',
        right: '0px',
        bottom: '0px',
        position: headerTheme == 'dark' ? 'fixed' : 'unset',
        zIndex: 14,
        padding: '4px 16px',
        width: width,
        background: '#fff',
        boxShadow: '0 1px 4px #0015291f',
        transition: 'background 0.3s, width 0.2s'
      }"
    >
      footerRender headerTheme：{{ headerTheme }} width：{{ width }}
    </div>
  </div>
</template>
```

##### Custom footer with props

```vue
<GlobalFooter
  :links="[
    { title: 'Link 1', href: '#' },
    { title: 'Link 2', href: '#' },
  ]"
  copyright="Pro Layout &copy; 2021 Sendya."
></GlobalFooter>
```

### 内容页 PageContainer

| Property       | Description                                      | Type                               | Default Value |
| -------------- | ------------------------------------------------ | ---------------------------------- | ------------- |
| content        | Content area                                     | VNode \| v-slot                    | -             |
| extra          | Extra content area, on the right side of content | VNode \| v-slot                    | -             |
| extraContent   | Extra content area, on the right side of content | VNode \| v-slot                    | -             |
| tabList        | Tabs title list                                  | `Array<{key: string, tab: sting}>` | -             |
| tab-change     | Switch panel callback                            | (key) => void                      | -             |
| tab-active-key | The currently highlighted tab item               | string                             | -             |
| breadcrumb     | Show Bread crumbs bar                            | Boolean                            | -             |

### 水印 WaterMark

| Property      | Description                           | Type             | Default Value          |
| ------------- | ------------------------------------- | ---------------- | ---------------------- |
| markStyle     | mark style                            | CSSProperties    | -                      |
| markClassName | mark class                            | string           | -                      |
| gapX          | Horizontal spacing between water-mark | number           | 212                    |
| gapY          | Vertical spacing between watermark    | number           | 222                    |
| offsetLeft    | Horizontal offset                     | number           | `offsetTop = gapX / 2` |
| offsetTop     | Vertical offset                       | number           | `offsetTop = gapY / 2` |
|               |                                       |                  |                        |
| width         |                                       | number           | 120                    |
| height        |                                       | number           | 64                     |
| rotate        | Angle of rotation, unit °             | number           | -22                    |
| image         | image src                             | string           | -                      |
| zIndex        | water-mark z-index                    | number           | 9                      |
| content       | water-mark Content                    | string           | -                      |
| fontColor     | font-color                            | string           | `rgba(0,0,0,.15)`      |
| fontSize      | font-size                             | string`\|`number | 16                     |

#### Use WaterMark

```vue
<router-view v-slot="{ Component }">
  <WaterMark content="Pro Layout">
    <component :is="Component" />
  </WaterMark>
</router-view>
```

## 基本使用 Basic Usage

项目目录下 [Playground](./playground/) or [Use Template](https://gitee.com/TsMask/mask_vue3_antd)

Recommend look [Examples](./playground/) or [Use Template](https://gitee.com/TsMask/mask_vue3_antd)

## 源项目仓库分支 Branch

来自 [@ant-design-vue/pro-layout](https://github.com/vueComponent/pro-components)

- next : Vue3 + <ant-design-vue@3.x> (latest)
- v3.1 : Vue3 + <ant-design-vue@2.2.x> (release LTS)
- v2 : Vue2 + <ant-design-vue@1.7.x>

计划升级V4版本++++++

## 持续维护 Continuous Maintenance

```bash
# 安装所需依赖
npm install

# 打包生成dist目录含d.ts文件
npm run build
```
