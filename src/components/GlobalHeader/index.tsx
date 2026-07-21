import {
  computed,
  defineComponent,
  type PropType,
  type ExtractPropTypes,
} from "vue";
import type { RouteRecordRaw } from "vue-router";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import PropTypes from "ant-design-vue/es/_util/vue-types";
import type {
  CustomRenderProps,
  MenuContentRender,
  MenuDataItem,
} from "../../typings";
import {
  defaultRenderLogoAndTitle,
  siderMenuProps,
} from "../SiderMenu/SiderMenu";
import TopNavHeader from "./TopNavHeader";
import { defaultSettingProps } from "../../defaultSettings";
import { clearMenuItem } from "../../utils/getMenuData";
import "./index.css";

export const globalHeaderProps = {
  ...defaultSettingProps,
  collapsed: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
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

// 重构说明（4.x 内部优化，不改变对外 API）：
//  - 原实现是 FunctionalComponent，每次重渲染整个函数体重新执行，包括
//    mix 模式下的菜单数据 map + clearMenuItem（递归遍历整棵菜单树）。
//  - 改为 defineComponent 后，mix 模式的菜单数据计算放到 computed，
//    只有 menuData/layout/isMobile/splitMenus 变化时才重算。
const GlobalHeader = defineComponent({
  name: "GlobalHeader",
  inheritAttrs: false,
  props: globalHeaderProps,
  emits: ["menuHeaderClick", "collapse", "openKeys", "select"],
  setup(props, { slots, emit }) {
    const baseClassName = "ant-pro-global-header";

    // mix 布局 + splitMenus 时，把菜单 children 抹平后交给 TopNavHeader。
    // 用 computed 缓存，避免每次重渲染都重新 map + clearMenuItem。
    const topNavMenuData = computed<RouteRecordRaw[] | null>(() => {
      if (props.layout !== "mix" || props.isMobile || !props.splitMenus) {
        return null;
      }
      const noChildrenMenuData = (props.menuData || []).map((item: any) => ({
        ...item,
        children: undefined,
      })) as RouteRecordRaw[];
      return clearMenuItem(noChildrenMenuData);
    });

    const onCollapse = () => {
      emit("collapse", !props.collapsed);
    };

    return () => {
      const { isMobile, headerContentRightRender, onMenuHeaderClick, layout } =
        props;

      if (topNavMenuData.value) {
        return (
          <TopNavHeader
            {...props}
            mode="horizontal"
            splitMenus={false}
            menuData={topNavMenuData.value}
          />
        );
      }

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
                  "headerTitleRender",
                )}
              </div>
            </>
          )}
          <div class={`${baseClassName}-flex`}>{slots.default?.()}</div>
          {headerContentRightRender &&
          typeof headerContentRightRender === "function"
            ? headerContentRightRender(props)
            : headerContentRightRender}
        </div>
      );
    };
  },
});

export default GlobalHeader;
