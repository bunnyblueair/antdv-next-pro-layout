import {
  reactive,
  type InjectionKey,
  type VNodeChild,
  type ComputedRef,
} from "vue";
import { createContext, useContext } from "./hooks/useContext";
import type { MenuDataItem, FormatLocale } from "./typings";
import type { PureSettings } from "./defaultSettings";

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, "children">[];
}

export interface BreadcrumbProps {
  routes?: Route[];
  params?: any;
  separator?: VNodeChild;
  itemRender?: (opts: {
    route: Route;
    params: any;
    routes: Array<Route>;
    paths: Array<string>;
  }) => VNodeChild;
}

export type BreadcrumbListReturn = Pick<
  BreadcrumbProps,
  Extract<keyof BreadcrumbProps, "routes" | "itemRender">
>;

export interface RouteContextProps extends Partial<PureSettings> {
  menuData: MenuDataItem[];
  flatMenuData: MenuDataItem[];
  selectedKeys: string[];
  openKeys: string[];

  locale?: FormatLocale;
  breadcrumb?: BreadcrumbListReturn | ComputedRef<BreadcrumbListReturn>;
  isMobile?: boolean;
  collapsed?: boolean;
  hasHeader?: boolean;
  siderWidth?: number;
  headerHeight?: number;
  hasSide?: boolean;
  /* 附加属性 */
  [key: string]: any;
}

// set default context
export const defaultRouteContext = reactive<RouteContextProps>({
  menuData: [],
  flatMenuData: [],
  selectedKeys: [],
  openKeys: [],
});

export const routeContextInjectKey: InjectionKey<RouteContextProps> =
  Symbol("route-context");

export const createRouteContext = () =>
  createContext<RouteContextProps>(
    routeContextInjectKey,
    "RouteContext.Provider",
  );

export const useRouteContext = () =>
  useContext<RouteContextProps>(routeContextInjectKey, defaultRouteContext);
