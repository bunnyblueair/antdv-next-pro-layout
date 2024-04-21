import {
  ref,
  computed,
  type FunctionalComponent,
  type ExtractPropTypes,
  PropType,
} from "vue";
import { default as ResizeObserver } from "ant-design-vue/es/vc-resize-observer";
import { useRouteContext } from "../../RouteContext";

import "./index.css";
import {
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import BaseMenu from "../SiderMenu/BaseMenu";
import type { RightContentRender } from "../../RenderTypings";

export const topNavHeaderProps = {
  ...siderMenuProps,
  rightContentRender: {
    type: [Object, Function] as PropType<RightContentRender>,
    default: () => undefined,
  },
};

export type TopNavHeaderProps = Partial<
  ExtractPropTypes<typeof topNavHeaderProps>
>;

const RightContent: FunctionalComponent<TopNavHeaderProps> = ({
  rightContentRender,
  ...props
}) => {
  const rightSize = ref<number | string>("auto");

  return (
    <div
      style={{
        minWidth: rightSize.value,
      }}
    >
      <div
        style={{
          paddingRight: 8,
        }}
      >
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            rightSize.value = width;
          }}
        >
          {rightContentRender && typeof rightContentRender === "function" ? (
            <div>
              {rightContentRender({
                ...props,
              })}
            </div>
          ) : (
            rightContentRender
          )}
        </ResizeObserver>
      </div>
    </div>
  );
};

const TopNavHeader: FunctionalComponent<TopNavHeaderProps> = (props) => {
  const headerRef = ref();
  const {
    prefixCls: propPrefixCls,
    onMenuHeaderClick,
    onOpenKeys,
    onSelect,
    contentWidth,
    rightContentRender,
    layout,
    theme,
    menuData,
  } = props;
  const context = useRouteContext();
  const prefixCls = `${propPrefixCls || "ant-pro"}-top-nav-header`;
  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false },
    // REMARK:: Any time render header title
    // layout === 'mix' ? 'headerTitleRender' : undefined,
    layout !== "side" ? "headerTitleRender" : undefined
  );

  return (
    <div class={[prefixCls, theme]}>
      <div
        ref={headerRef}
        class={`${prefixCls}-main ${contentWidth === "Fixed" ? "wide" : ""}`}
      >
        {headerDom && (
          <div class={`${prefixCls}-main-left`} onClick={onMenuHeaderClick}>
            <div class={`${prefixCls}-logo`} key="logo" id="logo">
              {headerDom}
            </div>
          </div>
        )}
        <div style={{ flex: 1 }} class={`${prefixCls}-menu`}>
          <BaseMenu
            prefixCls={propPrefixCls}
            locale={props.locale || context.locale}
            theme={props.menuTheme}
            mode={props.mode}
            collapsed={props.collapsed}
            iconfontUrl={props.iconfontUrl}
            menuData={menuData}
            menuItemRender={props.menuItemRender}
            subMenuItemRender={props.subMenuItemRender}
            openKeys={context.openKeys}
            selectedKeys={context.selectedKeys}
            class={{ "top-nav-menu": props.mode === "horizontal" }}
            {...{
              "onUpdate:openKeys": ($event: string[]) =>
                onOpenKeys && onOpenKeys($event),
              "onUpdate:selectedKeys": ($event: string[]) =>
                onSelect && onSelect($event),
            }}
          />
        </div>
        {rightContentRender && (
          <RightContent rightContentRender={rightContentRender} {...props} />
        )}
      </div>
    </div>
  );
};

TopNavHeader.inheritAttrs = false;

export default TopNavHeader;
