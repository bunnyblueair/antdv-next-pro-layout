import {
  computed,
  reactive,
  defineComponent,
  toRefs,
  provide,
  watchEffect,
  type CSSProperties,
  type PropType,
  type ExtractPropTypes,
} from "vue";

import { Layout, LayoutContent } from "antdv-next";
import { withInstall } from "./utils/withInstall";
import { useMediaScreen } from "./hooks/useMediaScreen";

import { defaultSettingProps } from "./defaultSettings";
import {
  routeContextInjectKey,
  defaultRouteContext,
  type RouteContextProps,
} from "./RouteContext";
import SiderMenuWrapper from "./components/SiderMenu";
import HeaderView, {
  headerViewProps,
} from "./components/GlobalHeader/HeaderView";
import { getSlot, getMenuFirstChildren, pick } from "./utils";

import type { BreadcrumbProps } from "./RouteContext";
import type { CustomRender } from "./typings";
import type {
  HeaderContentRender,
  MenuRender,
  MenuContentRender,
  CustomRenderProps,
  CollapsedButtonRender,
} from "./typings";

import PageLoading from "./components/PageLoading";
import { siderMenuProps } from "./components/SiderMenu/SiderMenu";
import { globalHeaderProps } from "./components/GlobalHeader";
import "./BasicLayout.css";

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...siderMenuProps,
  ...globalHeaderProps,
  ...headerViewProps,

  pure: Boolean,
  loading: Boolean,
  locale: {
    type: [Function, Boolean] as PropType<any>,
    default: false,
  },
  isChildrenLayout: {
    type: Boolean,
    required: false,
  },
  colSize: {
    type: Number,
    required: false,
  },
  contentStyle: {
    type: [String, Object] as PropType<CSSProperties>,
    default: () => {
      return null;
    },
  },
  breadcrumb: {
    type: [Object, Function] as PropType<BreadcrumbProps | any>,
    default: () => null,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<CollapsedButtonRender>,
    default: () => undefined,
  },
  breadcrumbRender: {
    type: [Object, Function, Boolean] as PropType<
      BreadcrumbProps["itemRender"]
    >,
    default: () => null,
  },
  headerContentRender: {
    type: [Function, Object, Boolean] as PropType<HeaderContentRender>,
    default: () => undefined,
  },
  headerRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  footerRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  tabRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
};

export type BasicLayoutProps = Partial<
  ExtractPropTypes<typeof basicLayoutProps>
>;

const ProLayout = defineComponent({
  name: "ProLayout",
  inheritAttrs: false,
  props: basicLayoutProps,
  emits: [
    "update:collapsed",
    "update:open-keys",
    "update:selected-keys",
    "collapse",
    "openKeys",
    "select",
    "menuHeaderClick",
    "menuClick",
  ],
  setup(props, { emit, attrs, slots }) {
    const isTop = computed(() => props.layout === "top");
    const hasSide = computed(
      () => props.layout === "mix" || props.layout === "side" || false,
    );
    const hasSplitMenu = computed(
      () => props.layout === "mix" && props.splitMenus,
    );
    const hasFlatMenu = computed(() => hasSide.value && hasSplitMenu.value);

    const siderWidth = computed(() =>
      props.collapsed ? props.collapsedWidth : props.siderWidth,
    );

    // if on event and @event
    const onCollapse = (collapsed: boolean) => {
      emit("update:collapsed", collapsed);
      emit("collapse", collapsed);
    };
    const onOpenKeys = (openKeys: string[] | false) => {
      emit("update:open-keys", openKeys);
      emit("openKeys", openKeys);
    };
    const onSelect = (selectedKeys: string[] | false) => {
      emit("update:selected-keys", selectedKeys);
      emit("select", selectedKeys);
    };
    const onMenuHeaderClick = (e: MouseEvent) => {
      emit("menuHeaderClick", e);
    };
    const onMenuClick = (args: any) => {
      emit("menuClick", args);
    };

    const screenSize = useMediaScreen();
    const isMobile = computed(
      () => screenSize.value === "sm" || screenSize.value === "xs",
    );
    // whether an inline sider actually takes layout space (used for header/tab/footer width)
    const hasSiderMenu = computed(
      () =>
        !isTop.value && !isMobile.value && (props as any).menuRender !== false,
    );
    const baseClassName = "ant-pro-basicLayout";
    // gen className
    const className = computed(() => {
      return {
        [baseClassName]: true,
        [`${baseClassName}-top-menu`]: isTop.value,
        [`${baseClassName}-is-children`]: props.isChildrenLayout,
        [`${baseClassName}-fix-siderbar`]: props.fixSiderbar,
        [`screen-${screenSize.value}`]: true,
        [`layout-${props.layout}`]: true,
        [`theme-${props.theme}`]: true,
        [`theme-menu-${props.menuTheme}`]: true,
      };
    });

    // siderMenuDom 为空的时候，不需要 padding
    const genLayoutStyle = reactive<CSSProperties>({
      position: "relative",
    });

    // if is some layout children, don't need min height
    watchEffect(() => {
      if (
        props.isChildrenLayout ||
        (props.contentStyle && props.contentStyle.minHeight)
      ) {
        genLayoutStyle.minHeight = 0;
      }
    });

    // slot/prop 提取
    // 统一上提到 setup 顶层，computed 只创建一次，副作用用  watchEffect 隔离，渲染函数保持纯函数。
    const collapsedButtonRender = computed(() =>
      getSlot<CollapsedButtonRender>(slots, props, "collapsedButtonRender"),
    );
    const headerContentRender = computed(() =>
      getSlot<HeaderContentRender>(slots, props, "headerContentRender"),
    );
    const headerContentRightRender = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "headerContentRightRender"),
    );
    const customHeaderRender = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "headerRender"),
    );
    const footerRenderSlot = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "footerRender"),
    );
    const tabRenderSlot = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "tabRender"),
    );
    const menuHeaderRender = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "menuHeaderRender"),
    );
    const menuHeaderExtraRender = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "menuHeaderExtraRender"),
    );
    const menuContentRender = computed(() =>
      getSlot<MenuContentRender>(slots, props, "menuContentRender"),
    );
    const menuFooterRender = computed(() =>
      getSlot<CustomRenderProps>(slots, props, "menuFooterRender"),
    );
    const menuItemRender = computed(() =>
      getSlot<MenuRender>(slots, props, "menuItemRender"),
    );
    const menuSubItemRender = computed(() =>
      getSlot<MenuRender>(slots, props, "menuSubItemRender"),
    );

    const renderHeader = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: CustomRenderProps;
        headerContentRightRender: CustomRenderProps;
      },
      matchMenuKeys?: string[],
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null;
      }
      return <HeaderView {...p} matchMenuKeys={matchMenuKeys || []} />;
    };

    const breadcrumb = computed<BreadcrumbProps>(() => ({
      ...props.breadcrumb,
      itemRender: getSlot<BreadcrumbProps["itemRender"]>(
        slots,
        props,
        "breadcrumbRender",
      ),
    }));

    const flatMenuData = computed(
      () =>
        (hasFlatMenu.value &&
          props.selectedKeys &&
          getMenuFirstChildren(props.menuData, props.selectedKeys[0])) ||
        [],
    );

    // 显式列出 HeaderView 真正需要的字段，收窄 computed 依赖范围。
    const headerDom = computed(() =>
      renderHeader(
        {
          // 基础设置
          theme: props.theme,
          menuTheme: props.menuTheme,
          layout: props.layout,
          headerHeight: props.headerHeight,
          fixedHeader: props.fixedHeader,
          title: props.title,
          iconfontUrl: props.iconfontUrl,
          splitMenus: props.splitMenus,
          locale: props.locale,
          // 状态
          collapsed: props.collapsed,
          isMobile: isMobile.value,
          // 宽度
          siderWidth: props.siderWidth,
          collapsedWidth: props.collapsedWidth,
          // 菜单数据
          menuData: props.menuData,
          logo: props.logo,
          logoStyle: props.logoStyle,
          matchMenuKeys: props.matchMenuKeys,
          menuRender: props.menuRender,
          // 渲染函数 / slot
          menuItemRender: menuItemRender.value,
          menuSubItemRender: menuSubItemRender.value,
          headerContentRightRender: headerContentRightRender.value,
          collapsedButtonRender: collapsedButtonRender.value,
          menuHeaderRender: menuHeaderRender.value,
          menuHeaderExtraRender: menuHeaderExtraRender.value,
          menuContentRender: menuContentRender.value,
          headerContentRender: headerContentRender.value,
          headerRender: customHeaderRender.value,
          // HeaderView 自身判断
          hasSiderMenu: hasSiderMenu.value,
          // 事件
          onCollapse,
          onOpenKeys,
          onSelect,
          onMenuHeaderClick,
        },
        props.matchMenuKeys,
      ),
    );

    const routeContext = reactive<RouteContextProps>({
      ...defaultRouteContext,
      ...(pick(toRefs(props), [
        "locale",
        "menuData",
        "openKeys",
        "selectedKeys",
        "fixSiderbar",
        "fixedHeader",
        "headerHeight",
        // 'hasSideMenu',
        // 'hasHeader',
      ]) as any),
      isMobile,
      siderWidth,
      breadcrumb,
      flatMenuData,
      hasSide,
      hasHeader: computed(() => !!headerDom.value),
      flatMenu: hasFlatMenu,
    });
    provide(routeContextInjectKey, routeContext);

    // 根元素设置明暗主题模式。
    // 修复：原代码在 setup 顶层直接执行副作用，未响应 theme 变化且 SSR 不安全。
    if (typeof document !== "undefined") {
      watchEffect(() => {
        document.documentElement.setAttribute("data-theme", props.theme);
      });
    }

    const contentClassName = computed(() => {
      return {
        [`${baseClassName}-content`]: true,
        [`${baseClassName}-has-header`]: headerDom.value,
        [`${baseClassName}-children-layout`]: props.isChildrenLayout,
      };
    });

    const contentWidth = computed(() => {
      // 计算侧边栏的宽度，不然导致左边的样式会出问题
      let width = "100%";
      if (
        props.layout === "mix" &&
        hasSplitMenu.value &&
        flatMenuData.value.length === 0
      ) {
        width = "100%";
      } else if (hasSiderMenu.value) {
        width = `calc(100% - ${siderWidth.value}px)`;
      }
      return width;
    });

    const tabDom = computed(() => {
      if (props.tabRender === false || !tabRenderSlot.value) {
        return null;
      }
      return tabRenderSlot.value({ width: contentWidth.value, ...props });
    });

    const footerDom = computed(() => {
      if (props.footerRender === false || !footerRenderSlot.value) {
        return null;
      }
      return footerRenderSlot.value({ width: contentWidth.value, ...props });
    });

    return () => {
      const {
        pure,
        onCollapse: propsOnCollapse,
        onOpenKeys: propsOnOpenKeys,
        onSelect: propsOnSelect,
        onMenuClick: propsOnMenuClick,
        ...restProps
      } = props;

      return (
        <>
          {pure ? (
            slots.default?.()
          ) : (
            <div class={className.value}>
              <Layout
                style={{
                  minHeight: "100%",
                  ...((attrs.style as CSSProperties) || {}),
                }}
              >
                {(!isTop.value || isMobile.value) &&
                  (props as any).menuRender !== false && (
                    <SiderMenuWrapper
                      {...restProps}
                      isMobile={isMobile.value}
                      menuHeaderRender={menuHeaderRender.value}
                      menuHeaderExtraRender={menuHeaderExtraRender.value}
                      menuContentRender={menuContentRender.value}
                      menuFooterRender={menuFooterRender.value}
                      menuItemRender={menuItemRender.value}
                      menuSubItemRender={menuSubItemRender.value}
                      collapsedButtonRender={collapsedButtonRender.value}
                      onCollapse={onCollapse}
                      onSelect={onSelect}
                      onOpenKeys={onOpenKeys}
                      onMenuClick={onMenuClick}
                    />
                  )}
                <Layout style={genLayoutStyle}>
                  {headerDom.value}
                  {tabDom.value}
                  <LayoutContent
                    class={contentClassName.value}
                    style={{
                      // antdv-next 的 LayoutContent 默认 width 为 0，列布局下需显式撑满。
                      width: "100%",
                      ...((props.contentStyle as any) || {}),
                    }}
                  >
                    {props.loading ? <PageLoading /> : slots.default?.()}
                  </LayoutContent>
                  {footerDom.value}
                </Layout>
              </Layout>
            </div>
          )}
        </>
      );
    };
  },
});

export default withInstall(ProLayout);
