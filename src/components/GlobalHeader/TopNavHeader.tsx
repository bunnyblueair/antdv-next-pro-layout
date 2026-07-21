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
import type { CustomRenderProps } from "../../typings";

export const topNavHeaderProps = {
  ...siderMenuProps,
  headerContentRightRender: {
    type: [Object, Function] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
};

export type TopNavHeaderProps = Partial<
  ExtractPropTypes<typeof topNavHeaderProps>
>;

// 重构说明（4.x 内部优化，不改变对外 API）：
//  - 原实现是 FunctionalComponent，每次重渲染都重新执行 useRouteContext()
//    和 defaultRenderLogoAndTitle()。改为 defineComponent 后：
//    * useRouteContext() 在 setup 中只调用一次
//    * logo+title 的渲染结果用 computed 缓存
const TopNavHeader = defineComponent({
  name: "TopNavHeader",
  inheritAttrs: false,
  props: topNavHeaderProps,
  setup(props) {
    const context = useRouteContext();
    const baseClassName = "ant-pro-top-nav-header";

    // logo + title 渲染缓存；仅 logo/title/layout/collapsed 等变化时重算。
    const headerDom = computed(() =>
      defaultRenderLogoAndTitle(
        { ...props, collapsed: false },
        // REMARK:: Any time render header title
        // layout === 'mix' ? 'headerTitleRender' : undefined,
        props.layout !== "side" ? "headerTitleRender" : undefined,
      ),
    );

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

          <div class={`${baseClassName}-main-menu`}>
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
          </div>

          {props.headerContentRightRender &&
            typeof props.headerContentRightRender === "function" &&
            props.headerContentRightRender(props)}
        </div>
      </div>
    );
  },
});

export default TopNavHeader;
