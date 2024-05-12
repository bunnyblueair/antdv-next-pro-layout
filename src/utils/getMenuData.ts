import type { RouteRecord, RouteRecordRaw } from "vue-router";
import isUrl from "./isUrl";

export { flatMap, getMenuFirstChildren } from "./index";

export type MenuData = {
  menuData: RouteRecordRaw[];
  breadcrumb: Record<string, RouteRecordRaw>;
};

/**
 * 清除菜单项，针对以下属性排除
 * {
 * name: "!name"
 * meta: {hideChildInMenu hideInMenu}
 * }
 * @param menusData 菜单数据
 * @returns
 */
export function clearMenuItem(
  routes: RouteRecord[] | RouteRecordRaw[]
): RouteRecordRaw[] {
  return routes
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

/**
 * 格式化路由路径地址
 * @param routes
 * @param breadcrumb
 * @param parent
 * @returns
 */
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

/**
 * 路由表转出系统菜单
 * @param routes 路由表取根路径"/"下节点数据
 * @returns 菜单数据和面包屑数据
 */
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
