import type { BreadcrumbProps } from "./RouteContext";
import type { CustomRender, WithFalse, MenuDataItem } from "./typings";
export type ProProps = Record<never, never>;
// Custom render or slot
export type DefaultPropRender = WithFalse<CustomRender> | any;

export type BreadcrumbRender = BreadcrumbProps["itemRender"];
export type HeaderContentRender = WithFalse<() => CustomRender>;
export type HeaderRender = WithFalse<(props: ProProps) => CustomRender>;
export type FooterRender = WithFalse<(props: ProProps) => CustomRender>;
export type TabRender = WithFalse<(props: ProProps) => CustomRender>;
export type MenuContentRender = WithFalse<
(props: ProProps, defaultDom: CustomRender) => CustomRender
>;
export type MenuRender = WithFalse<(item: MenuDataItem) => CustomRender>; 
export type CustomRenderProps = WithFalse<(props?: ProProps) => CustomRender>;
export type LogoRender = WithFalse<CustomRender>;

export type CollapsedButtonRender = WithFalse<
  (collapsed?: boolean) => CustomRender
>;

export type PageHeaderRender = WithFalse<(props?: ProProps) => CustomRender>;
