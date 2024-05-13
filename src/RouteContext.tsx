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
  prefixCls?: string;
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

export interface MenuState {
  selectedKeys: string[];
  openKeys: string[];
}

export interface RouteContextProps extends Partial<PureSettings>, MenuState {
  menuData: MenuDataItem[];
  flatMenuData: MenuDataItem[];

  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  locale?: FormatLocale;
  breadcrumb?: BreadcrumbListReturn | ComputedRef<BreadcrumbListReturn>;
  isMobile?: boolean;
  prefixCls?: string;
  collapsed?: boolean;
  hasSideMenu?: boolean;
  hasHeader?: boolean;
  siderWidth?: number;
  headerHeight?: number;
  hasSide?: boolean;
  /* 附加属性 */
  [key: string]: any;
}

export const defaultPrefixCls = "ant-pro";

export const getPrefixCls = (
  suffixCls?: string,
  customizePrefixCls?: string
) => {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};

// set default context
export const defaultRouteContext = reactive<RouteContextProps>({
  getPrefixCls,
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
    "RouteContext.Provider"
  );

export const useRouteContext = () =>
  useContext<RouteContextProps>(routeContextInjectKey, defaultRouteContext);

const Provider = createRouteContext();

export default {
  Provider,
};
