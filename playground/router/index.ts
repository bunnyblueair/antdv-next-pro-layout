import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "../layouts/BasicLayout.vue";
import BlankLayout from "../layouts/BlankLayout.vue";
import NestedLayout from "../layouts/NestedLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Root",
    meta: { title: "根节点" },
    component: BasicLayout,
    // component: NestedLayout,
    redirect: "/dome1",
    children: [
      {
        path: "/dome1",
        name: "Dome1",
        meta: { title: "示例一", icon: "icon-ios" },
        component: () => import("@/views/dome/dome1.vue"),
      },
      {
        path: "/dome2",
        name: "Dome2",
        meta: { title: "示例二", icon: "icon-anzhuo" },
        component: () => import("@/views/dome/dome2.vue"),
      },
      {
        path: "/dome3",
        name: "Dome3",
        meta: { title: "示例三", icon: "icon-qunzhu" },
        component: () => import("@/views/dome/dome3.vue"),
      },
      {
        path: "/domes",
        name: "Domes",
        meta: {
          title: "示例目录",
          icon: "icon-zhizuoliucheng",
        },
        component: BlankLayout,
        redirect: () => ({ name: "PageInfo" }),
        children: [
          {
            path: "page-info",
            name: "PageInfo",
            meta: { title: "页面信息", icon: "icon-huifu" },
            component: () => import("../views/domes/page-info.vue"),
          },
          {
            path: "page-typography",
            name: "PageTypography",
            meta: { title: "文本信息", icon: "icon-huizhiguize" },
            component: () => import("../views/domes/page-typography.vue"),
          },
          {
            path: "dynamic-match/:id(\\d+)",
            name: "DynamicMatch",
            // 路由 path 默认参数再 meta.params 里
            meta: { title: "动态参数页面", params: { id: 1 }, cache: true },
            component: () => import("../views/domes/dynamic-match.vue"),
          },
          {
            path: "disabled",
            name: "Disabled",
            meta: { title: "禁止点击", disabled: true },
            component: () => {},
          },
          {
            path: "https://github.com/TsMask",
            name: "BlankGithubTsMask",
            meta: {
              title: "TsMask-打开新窗",
              icon: "icon-github",
              target: "_blank",
            },
            component: () => {},
          },
        ],
      },
      {
        path: "https://github.com/",
        name: "BlankGithub",
        meta: {
          title: "Github-打开新窗",
          icon: "icon-github",
          target: "_blank",
        },
        component: () => {},
      },
      {
        path: "https://www.3x.antdv.com/components/comment-cn?sdf=12321&id=12&sdnf",
        name: "Ant Design Vue",
        meta: {
          title: "Antdv-当前窗口",
          icon: "icon-morentouxiang",
          target: "_self",
        },
        component: () => {},
      },
      {
        path: "/test-tab",
        name: "TestTab",
        meta: {
          title: "测试Tab标签",
          icon: "icon-huifu",
          hideInMenu: false,
        },
        component: () => import("../views/TestTab.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
