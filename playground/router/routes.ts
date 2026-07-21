import type { RouteRecordRaw } from "vue-router";
import { createVNode } from "vue";
import { AlipayOutlined } from "@ant-design/icons-vue";
import BasicLayout from "../layouts/BasicLayout.vue";
import BlankLayout from "../layouts/BlankLayout.vue";
import NestedLayout from "../layouts/NestedLayout.vue";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Root",
    meta: { title: "根节点" },
    component: BasicLayout,
    // component: NestedLayout,
    redirect: "/demo1",
    children: [
      {
        path: "/demo1",
        name: "Demo1",
        meta: { title: "示例一", icon: "icon-ios" },
        component: () => import("@/views/demo/demo1.vue"),
      },
      {
        path: "/demo2",
        name: "Demo2",
        meta: { title: "示例二", icon: "icon-anzhuo" },
        component: () => import("@/views/demo/demo2.vue"),
      },
      {
        path: "/demo3",
        name: "Demo3",
        meta: { title: "示例三", icon: createVNode(AlipayOutlined) },
        component: () => import("@/views/demo/demo3.vue"),
      },
      {
        path: "/demos",
        name: "Demos",
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
            component: () => import("@/views/demos/page-info.vue"),
          },
          {
            path: "page-typography",
            name: "PageTypography",
            meta: { title: "文本信息", icon: "icon-huizhiguize" },
            component: () => import("@/views/demos/page-typography.vue"),
          },
          {
            path: "dynamic-match/:id(\\d+)",
            name: "DynamicMatch",
            // 路由 path 默认参数再 meta.params 里
            meta: { title: "动态参数页面", params: { id: 1 }, cache: true },
            component: () => import("@/views/demos/dynamic-match.vue"),
          },
          {
            path: "disabled",
            name: "Disabled",
            meta: { title: "禁止点击", disabled: true },
            component: () => {},
          },
          {
            path: "danger",
            name: "Danger",
            meta: { title: "危险警告", danger: true },
            component: () => import("@/views/demo/demo3.vue"),
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
        path: "https://www.antdv.com/",
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
          icon: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
          hideInMenu: false,
        },
        component: () => import("../views/TestTab.vue"),
      },
      {
        path: "/to-nested",
        name: "ToNested",
        meta: { title: "嵌套布局", icon: "icon-morentouxiang" },
        redirect: "/nested",
      },
    ],
  },
  {
    path: "/nested",
    name: "Nested",
    meta: { title: "嵌套布局" },
    component: NestedLayout,
    redirect: "/nested/app1/dashboard",
    children: [
      {
        path: "/nested/app1",
        name: "NestedApp1",
        meta: { title: "应用一", icon: "icon-zhizuoliucheng" },
        component: BlankLayout,
        redirect: "/nested/app1/dashboard",
        children: [
          {
            path: "/nested/app1/dashboard",
            name: "NestedApp1Dashboard",
            meta: { title: "工作台", icon: "icon-ios" },
            component: () => import("@/views/demo/demo1.vue"),
          },
          {
            path: "/nested/app1/manage",
            name: "NestedApp1Manage",
            meta: { title: "管理", icon: "icon-anzhuo" },
            component: BlankLayout,
            redirect: "/nested/app1/manage/user",
            children: [
              {
                path: "/nested/app1/manage/user",
                name: "NestedApp1ManageUser",
                meta: { title: "用户", icon: "icon-huifu" },
                component: () => import("@/views/demo/demo2.vue"),
              },
              {
                path: "/nested/app1/manage/role",
                name: "NestedApp1ManageRole",
                meta: { title: "角色", icon: "icon-huizhiguize" },
                component: () => import("@/views/demo/demo3.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "/nested/app2",
        name: "NestedApp2",
        meta: { title: "应用二", icon: "icon-huifu" },
        component: BlankLayout,
        redirect: "/nested/app2/report",
        children: [
          {
            path: "/nested/app2/report",
            name: "NestedApp2Report",
            meta: { title: "报表", icon: "icon-huizhiguize" },
            component: () => import("@/views/demos/page-info.vue"),
          },
          {
            path: "/nested/app2/monitor",
            name: "NestedApp2Monitor",
            meta: { title: "监控", icon: "icon-morentouxiang" },
            component: () => import("@/views/demos/page-typography.vue"),
          },
        ],
      },
      {
        path: "/nested/app3",
        name: "NestedApp3",
        meta: { title: "应用三", icon: "icon-github" },
        component: BlankLayout,
        redirect: "/nested/app3/settings",
        children: [
          {
            path: "/nested/app3/settings",
            name: "NestedApp3Settings",
            meta: { title: "设置", icon: "icon-ios" },
            component: () => import("@/views/TestTab.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    meta: { title: "找不到匹配页面" },
    redirect: "/demo1", // 跳转
    // component: () => import("@/views/demo/demo1.vue"),
  },
];
