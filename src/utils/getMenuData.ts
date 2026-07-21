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
  routes: RouteRecord[] | RouteRecordRaw[],
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
              child && child.name && !child.meta?.hideInMenu,
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
 *
 * 重构说明（4.x 内部修复，不改变对外签名）：
 *  - 原实现直接写 `route.path = ...` 与 `route.children = ...`，
 *    会 mutate 传入的路由表，业务方再次把同一份 routes 传进来时
 *    path 已被改成绝对路径。
 *  - 这里对每一项做浅拷贝（`{ ...route }`）后再修改，保持入参不可变。
 *
 * @param routes
 * @param breadcrumb
 * @param parent
 * @returns
 */
const formatRelativePath = (
  routes: RouteRecordRaw[],
  breadcrumb: Record<string, RouteRecordRaw>,
  parent?: RouteRecordRaw,
): RouteRecordRaw[] => {
  return routes.map((route) => {
    // 浅拷贝，避免修改传入的路由表
    const next: RouteRecordRaw = { ...route };

    // startWith : http | https
    if (isUrl(next.path)) {
      breadcrumb[`${next.path}`] = next;
      return next;
    }

    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    // @ref https://router.vuejs.org/guide/essentials/nested-routes.html#nested-routes
    const hasRelativePath = next.path.startsWith("/");
    if (!hasRelativePath) {
      if (parent) {
        next.path = `${parent.path || ""}/${next.path}`;
      } else {
        next.path = `/${next.path}`;
      }
    }

    // reformat path
    next.path = next.path.replace("//", "/");
    // format children routes
    if (next.children && next.children.length > 0) {
      next.children = formatRelativePath(next.children, breadcrumb, next);
    }
    breadcrumb[`${next.path}`] = next;
    return next;
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
      breadcrumb,
    ),
    breadcrumb,
  };
};
