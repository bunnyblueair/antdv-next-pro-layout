import { computed, type FunctionalComponent, type ExtractPropTypes } from "vue";
import type { RouteRecordRaw } from "vue-router";
import type { CustomRender } from "../../typings";
import {
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import TopNavHeader from "../TopNavHeader";
import { clearMenuItem } from "../../utils";
import { useRouteContext } from "../../RouteContext";

import "./index.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";

import type { PropType } from "vue";
import type { MenuDataItem } from "../../typings";
import { defaultSettingProps } from "../../defaultSettings";
import PropTypes from "ant-design-vue/es/_util/vue-types";
import type {
  MenuContentRender,
  RightContentRender,
} from "../../RenderTypings";

export const globalHeaderProps = {
  ...defaultSettingProps,
  prefixCls: PropTypes.string.def("ant-pro"),
  collapsed: PropTypes.looseBool,
  isMobile: PropTypes.looseBool,
  logo: siderMenuProps.logo,
  logoStyle: siderMenuProps.logoStyle,
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  splitMenus: siderMenuProps.splitMenus,
  menuRender: {
    type: [Object, Function] as PropType<MenuContentRender>,
    default: () => undefined,
  },
  menuHeaderRender: siderMenuProps.menuHeaderRender,
  menuItemRender: siderMenuProps.menuItemRender,
  subMenuItemRender: siderMenuProps.subMenuItemRender,
  rightContentRender: {
    type: [Object, Function] as PropType<RightContentRender>,
    default: () => undefined,
  },
  collapsedButtonRender: siderMenuProps.collapsedButtonRender,
  matchMenuKeys: siderMenuProps.matchMenuKeys,

  // events
  onMenuHeaderClick: PropTypes.func,
  onCollapse: siderMenuProps.onCollapse,
  onOpenKeys: siderMenuProps.onOpenKeys,
  onSelect: siderMenuProps.onSelect,
};

const renderLogo = (
  menuHeaderRender: ExtractPropTypes<typeof siderMenuProps>["menuHeaderRender"],
  logoDom: CustomRender
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

export type GlobalHeaderProps = Partial<
  ExtractPropTypes<typeof globalHeaderProps>
>;

const GlobalHeader: FunctionalComponent<GlobalHeaderProps> = (
  props,
  { slots, emit }
) => {
  const {
    isMobile,
    logo,
    rightContentRender,
    menuHeaderRender,
    onMenuHeaderClick,
    layout,
    menuTheme,
    splitMenus,
    menuData,
    prefixCls: customPrefixCls,
  } = props;
  const { getPrefixCls } = useRouteContext();
  const prefixCls = customPrefixCls || getPrefixCls();
  const baseClassName = computed(() => `${prefixCls}-global-header`);
  const className = computed(() => {
    return {
      [baseClassName.value]: true,
      [`${baseClassName.value}-layout-${layout}`]:
        layout && menuTheme === "dark",
    };
  });
  if (layout === "mix" && !isMobile && splitMenus) {
    const noChildrenMenuData = (menuData || []).map((item: any) => ({
      ...item,
      children: undefined,
    })) as RouteRecordRaw[];
    const clearMenuData = clearMenuItem(noChildrenMenuData);
    return (
      <TopNavHeader
        {...props}
        mode="horizontal"
        splitMenus={false}
        menuData={clearMenuData}
      />
    );
  }

  const logoDom = (
    <span class={`${baseClassName.value}-logo`} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  );
  const onCollapse = () => {
    emit("collapse", !props.collapsed);
  };

  return (
    <div class={className.value}>
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {isMobile && (
        <span onClick={onCollapse}>
          {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}{" "}
        </span>
      )}
      {layout === "mix" && !isMobile && (
        <>
          <div
            class={`${baseClassName.value}-logo`}
            onClick={onMenuHeaderClick}
          >
            {defaultRenderLogoAndTitle(
              { ...props, collapsed: false },
              "headerTitleRender"
            )}
          </div>
        </>
      )}
      <div style={{ flex: 1 }}>{slots.default?.()}</div>
      {rightContentRender && typeof rightContentRender === "function"
        ? rightContentRender(props)
        : rightContentRender}
    </div>
  );
};
GlobalHeader.inheritAttrs = false;
GlobalHeader.emits = ["menuHeaderClick", "collapse", "openKeys", "select"];

export default GlobalHeader;
