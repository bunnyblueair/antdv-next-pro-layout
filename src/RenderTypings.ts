import type { BreadcrumbProps } from "./RouteContext";
import type {
  CustomRender,
  WithFalse,
  MenuDataItem,
} from "./typings";
export type ProProps = Record<never, never>;
// Custom render or slot
export type DefaultPropRender = WithFalse<CustomRender> | any;

export type BreadcrumbRender = BreadcrumbProps["itemRender"];
export type HeaderContentRender = WithFalse<() => CustomRender>;
export type HeaderRender = WithFalse<(props: ProProps) => CustomRender>;
export type FooterRender = WithFalse<(props: ProProps) => CustomRender>;
export type TabRender = WithFalse<(props: ProProps) => CustomRender>;
export type RightContentRender = WithFalse<(props: ProProps) => CustomRender>;
export type MenuItemRender = WithFalse<
  (args: { item: MenuDataItem; title?: string; icon?: string }) => CustomRender
>;
export type SubMenuItemRender = WithFalse<
  (args: { item: MenuDataItem; children?: CustomRender[] }) => CustomRender
>;
export type MenuHeaderRender = WithFalse<
  (logo: CustomRender, title: CustomRender, props?: ProProps) => CustomRender
>;
export type MenuContentRender = WithFalse<
  (props: ProProps, defaultDom: CustomRender) => CustomRender
>;
export type CustomRenderProps = WithFalse<(props?: ProProps) => CustomRender>;
export type LogoRender = WithFalse<CustomRender>;

export type CollapsedButtonRender = WithFalse<
  (collapsed?: boolean) => CustomRender
>;

export type PageHeaderRender = WithFalse<(props?: ProProps) => CustomRender>;
