import { computed, type FunctionalComponent, type ExtractPropTypes } from "vue";
import type { RouteRecordRaw } from "vue-router";
import {
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import TopNavHeader from "./TopNavHeader";
import { clearMenuItem } from "../../utils/getMenuData";

import "./index.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";

import type { PropType } from "vue";
import type { MenuDataItem } from "../../typings";
import { defaultSettingProps } from "../../defaultSettings";
import PropTypes from "ant-design-vue/es/_util/vue-types";
import type { CustomRenderProps, MenuContentRender } from "../../RenderTypings";

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
  menuSubItemRender: siderMenuProps.menuSubItemRender,
  headerContentRightRender: {
    type: [Object, Function] as PropType<CustomRenderProps>,
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

export type GlobalHeaderProps = Partial<
  ExtractPropTypes<typeof globalHeaderProps>
>;

const GlobalHeader: FunctionalComponent<GlobalHeaderProps> = (
  props,
  { slots, emit }
) => {
  const {
    isMobile,
    headerContentRightRender,
    onMenuHeaderClick,
    layout,
    splitMenus,
    menuData,
  } = props;
  const baseClassName = `${props.prefixCls}-global-header`;

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

  const onCollapse = () => {
    emit("collapse", !props.collapsed);
  };

  return (
    <div class={baseClassName}>
      {isMobile && (
        <span onClick={onCollapse}>
          {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      )}
      {layout === "mix" && !isMobile && (
        <>
          <div class={`${baseClassName}-logo`} onClick={onMenuHeaderClick}>
            {defaultRenderLogoAndTitle(
              { ...props, collapsed: false },
              "headerTitleRender"
            )}
          </div>
        </>
      )}
      <div class={`${baseClassName}-flex`}>{slots.default?.()}</div>
      {headerContentRightRender && typeof headerContentRightRender === "function"
        ? headerContentRightRender(props)
        : headerContentRightRender}
    </div>
  );
};
GlobalHeader.inheritAttrs = false;
GlobalHeader.emits = ["menuHeaderClick", "collapse", "openKeys", "select"];

export default GlobalHeader;
