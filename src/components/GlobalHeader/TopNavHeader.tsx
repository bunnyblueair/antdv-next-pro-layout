import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType,
} from "vue";
import { useRouteContext } from "../../RouteContext";

import "./TopNavHeader.css";
import {
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import BaseMenu from "../SiderMenu/BaseMenu";
import type {
  CustomRenderProps,
  MenuContentRender,
} from "../../typings";

export const topNavHeaderProps = {
  ...siderMenuProps,
  menuRender: {
    type: [Object, Function, Boolean] as PropType<MenuContentRender>,
    default: () => undefined,
  },
  headerContentRightRender: {
    type: [Object, Function] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
};

export type TopNavHeaderProps = Partial<
  ExtractPropTypes<typeof topNavHeaderProps>
>;

const TopNavHeader = defineComponent({
  name: "TopNavHeader",
  inheritAttrs: false,
  props: topNavHeaderProps,
  setup(props) {
    const context = useRouteContext();
    const baseClassName = "ant-pro-top-nav-header";

    // logo + title 渲染缓存；仅 logo/title/layout/collapsed 等变化时重算。
    const headerDom = computed(() => {
      // 与 React 对齐：提供 menuHeaderRender 时优先使用，否则 top/mix 走默认渲染
      let renderKey: "headerTitleRender" | "menuHeaderRender" | undefined =
        undefined;
      if (props.menuHeaderRender !== undefined) {
        renderKey = "menuHeaderRender";
      } else if (props.layout === "mix" || props.layout === "top") {
        renderKey = "headerTitleRender";
      }
      return defaultRenderLogoAndTitle(
        { ...props, collapsed: false },
        renderKey,
      );
    });

    const contentDom = computed(() => {
      const defaultDom = (
        <BaseMenu
          locale={props.locale || context.locale}
          theme={props.menuTheme}
          mode={props.mode}
          collapsed={props.collapsed}
          iconfontUrl={props.iconfontUrl}
          menuData={props.menuData}
          menuItemRender={props.menuItemRender}
          menuSubItemRender={props.menuSubItemRender}
          openKeys={context.openKeys}
          selectedKeys={context.selectedKeys}
          class={`${baseClassName}-menu`}
          {...{
            "onUpdate:openKeys": ($event: string[]) =>
              props.onOpenKeys && props.onOpenKeys($event),
            "onUpdate:selectedKeys": ($event: string[]) =>
              props.onSelect && props.onSelect($event),
          }}
        />
      );
      // headerContentRender 仅属于 side 布局的 GlobalHeader；顶栏必须保留业务菜单。
      return defaultDom;
    });

    return () => (
      <div class={baseClassName}>
        <div class={`${baseClassName}-main`}>
          {headerDom.value && (
            <div
              class={`${baseClassName}-main-left`}
              onClick={props.onMenuHeaderClick}
            >
              <div class={`${baseClassName}-logo`} key="logo" id="logo">
                {headerDom.value}
              </div>
            </div>
          )}

          <div class={`${baseClassName}-main-menu`}>{contentDom.value}</div>

          {props.headerContentRightRender &&
            typeof props.headerContentRightRender === "function" &&
            props.headerContentRightRender(props)}
        </div>
      </div>
    );
  },
});

export default TopNavHeader;
