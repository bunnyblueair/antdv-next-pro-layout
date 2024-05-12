import type { RouteRecord } from "vue-router";
import type { MenuDataItem } from "../typings";
import { getSlot, getSlotVNode } from "./getSlot";

export { default as isUrl } from "./isUrl";
export { default as isImg } from "./isImg";

export { getSlot, getSlotVNode };

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

export const PropRenderType = {
  type: [Function, Boolean],
  default: () => undefined,
};

export interface Attrs {
  [key: string]: string;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type Fn = () => void;

export type EventHandlers<E> = {
  [K in StringKeyOf<E>]?: E[K] extends Fn ? E[K] : (payload: E[K]) => void;
};

/**
 * Creates an object composed of the picked object properties.
 * @param obj The source object
 * @param paths The property paths to pick
 */
export function pick<T, K extends keyof T>(obj: T, paths: K[]): Pick<T, K> {
  return {
    ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}),
  } as Pick<T, K>;
}
