import type { RouteRecord, RouteRecordRaw } from "vue-router";
import { isUrl } from "./is";
import { MenuDataItem } from "src/types/menu";

export function clearMenuItem(
  menusData: RouteRecord[] | RouteRecordRaw[]
): RouteRecordRaw[] {
  return menusData
    .map((item: RouteRecord | RouteRecordRaw) => {
      const finalItem = { ...item };
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }

      if (finalItem && finalItem?.children) {
        if (
          !finalItem.meta?.hideChildInMenu &&
          finalItem.children.some(
            (child: RouteRecord | RouteRecordRaw) =>
              child && child.name && !child.meta?.hideInMenu
          )
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children),
          };
        }
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter((item) => item) as RouteRecordRaw[];
}

export function flatMap(menusData: RouteRecord[]): MenuDataItem[] {
  return menusData
    .map((item) => {
      const finalItem = { ...item } as MenuDataItem;
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }
      if (finalItem.children) {
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter((item) => item) as MenuDataItem[];
}

export function getMenuFirstChildren(menus: MenuDataItem[], key?: string) {
  return key === undefined
    ? []
    : (menus[menus.findIndex((menu) => menu.path === key)] || {}).children ||
        [];
}

export type MenuData = {
  menuData: RouteRecordRaw[];
  breadcrumb: Record<string, RouteRecordRaw>;
};

const formatRelativePath = (
  routes: RouteRecordRaw[],
  breadcrumb: Record<string, RouteRecordRaw>,
  parent?: RouteRecordRaw
): RouteRecordRaw[] => {
  // 计算路由绝对路径
  return routes.map((route) => {
    // startWith : http | https
    if (isUrl(route.path)) {
      return route;
    }

    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    // @ref https://router.vuejs.org/guide/essentials/nested-routes.html#nested-routes
    const hasRelativePath = route.path.startsWith("/");
    if (!hasRelativePath) {
      if (parent) {
        route.path = `${parent.path || ""}/${route.path}`;
      } else {
        route.path = `/${route.path}`;
      }
    }

    // reformat path
    route.path = route.path.replace("//", "/");
    // format children routes
    if (route.children && route.children.length > 0) {
      route.children = formatRelativePath(route.children, breadcrumb, route);
    }
    breadcrumb[`${route.path}`] = route;
    return route;
  });
};

export const getMenuData = (routes: RouteRecordRaw[]): MenuData => {
  const childrenRoute = routes.find((route) => route.path === "/");
  const breadcrumb: Record<string, RouteRecordRaw> = {};
  return {
    menuData: formatRelativePath(
      childrenRoute?.children || ([] as RouteRecordRaw[]),
      breadcrumb
    ),
    breadcrumb,
  };
};
