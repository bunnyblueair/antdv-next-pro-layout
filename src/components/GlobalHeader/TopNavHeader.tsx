import { FunctionalComponent, ExtractPropTypes, PropType } from "vue";
import { useRouteContext } from "../../RouteContext";

import "./TopNavHeader.css";
import {
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import BaseMenu from "../SiderMenu/BaseMenu";
import type { CustomRenderProps } from "../../RenderTypings";

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

const TopNavHeader: FunctionalComponent<TopNavHeaderProps> = (props) => {
  const {
    prefixCls,
    onMenuHeaderClick,
    onOpenKeys,
    onSelect,
    headerContentRightRender,
    layout,
    menuData,
  } = props;
  const context = useRouteContext();
  const baseClassName = `${prefixCls || "ant-pro"}-top-nav-header`;
  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false },
    // REMARK:: Any time render header title
    // layout === 'mix' ? 'headerTitleRender' : undefined,
    layout !== "side" ? "headerTitleRender" : undefined
  );
  return (
    <div class={baseClassName}>
      <div class={`${baseClassName}-main`}>
        {headerDom && (
          <div class={`${baseClassName}-main-left`} onClick={onMenuHeaderClick}>
            <div class={`${baseClassName}-logo`} key="logo" id="logo">
              {headerDom}
            </div>
          </div>
        )}

        <div class={`${baseClassName}-main-menu`}>
          <BaseMenu
            prefixCls={prefixCls}
            locale={props.locale || context.locale}
            theme={props.menuTheme}
            mode={props.mode}
            collapsed={props.collapsed}
            iconfontUrl={props.iconfontUrl}
            menuData={menuData}
            menuItemRender={props.menuItemRender}
            menuSubItemRender={props.menuSubItemRender}
            openKeys={context.openKeys}
            selectedKeys={context.selectedKeys}
            class={`${baseClassName}-menu`}
            {...{
              "onUpdate:openKeys": ($event: string[]) =>
                onOpenKeys && onOpenKeys($event),
              "onUpdate:selectedKeys": ($event: string[]) =>
                onSelect && onSelect($event),
            }}
          />
        </div>

        {headerContentRightRender &&
          typeof headerContentRightRender === "function" &&
          headerContentRightRender(props)}
      </div>
    </div>
  );
};

TopNavHeader.inheritAttrs = false;

export default TopNavHeader;
