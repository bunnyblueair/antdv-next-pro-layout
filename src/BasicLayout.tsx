import {
  computed,
  reactive,
  unref,
  defineComponent,
  toRefs,
  provide,
  type CSSProperties,
  type PropType,
  type ExtractPropTypes,
  watchEffect,
} from "vue";

import { Layout, LayoutContent } from "ant-design-vue";
import { withInstall } from "ant-design-vue/es/_util/type";
// import useConfigInject from "ant-design-vue/es/config-provider/hooks/useConfigInject";
import useMediaQuery from "./hooks/useMediaQuery";

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
  BreadcrumbRender,
  HeaderContentRender,
  MenuRender,
  MenuContentRender,
  CustomRenderProps,
  CollapsedButtonRender,
} from "./RenderTypings";

import PageLoading from "./components/PageLoading";
import "./BasicLayout.css";
import { siderMenuProps } from "./components/SiderMenu/SiderMenu";
import { globalHeaderProps } from "./components/GlobalHeader";

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
  /**布局内容禁用外边距*/
  disableContentMargin: {
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
    type: [Object, Function, Boolean] as PropType<BreadcrumbRender>,
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
      () => props.layout === "mix" || props.layout === "side" || false
    );
    const hasSplitMenu = computed(
      () => props.layout === "mix" && props.splitMenus
    );
    const hasFlatMenu = computed(() => {
      return hasSide.value && hasSplitMenu.value;
    });

    const siderWidth = computed(() =>
      props.collapsed ? props.collapsedWidth : props.siderWidth
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

    const colSize = useMediaQuery();
    const isMobile = computed(
      () => colSize.value === "sm" || colSize.value === "xs"
    );
    const baseClassName = computed(() => `${props.prefixCls}-basicLayout`);
    // gen className
    const className = computed(() => {
      return {
        [baseClassName.value]: true,
        [`${baseClassName.value}-top-menu`]: isTop.value,
        [`${baseClassName.value}-is-children`]: props.isChildrenLayout,
        [`${baseClassName.value}-fix-siderbar`]: props.fixSiderbar,
        [`screen-${colSize.value}`]: colSize.value,
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

    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: CustomRenderProps;
        rightContentRender: CustomRenderProps;
      },
      matchMenuKeys?: string[]
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null;
      }
      return <HeaderView {...p} matchMenuKeys={matchMenuKeys || []} />;
    };

    const breadcrumb = computed<BreadcrumbProps>(() => ({
      ...props.breadcrumb,
      itemRender: getSlot<BreadcrumbRender>(
        slots,
        props,
        "breadcrumbRender"
      ) as BreadcrumbRender,
    }));

    const flatMenuData = computed(
      () =>
        (hasFlatMenu.value &&
          props.selectedKeys &&
          getMenuFirstChildren(props.menuData, props.selectedKeys[0])) ||
        []
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
      hasHeader: true,
      flatMenu: hasFlatMenu,
    });
    provide(routeContextInjectKey, routeContext);

    return () => {
      const {
        pure,
        onCollapse: propsOnCollapse,
        onOpenKeys: propsOnOpenKeys,
        onSelect: propsOnSelect,
        onMenuClick: propsOnMenuClick,
        ...restProps
      } = props;

      const collapsedButtonRender = getSlot<CollapsedButtonRender>(
        slots,
        props,
        "collapsedButtonRender"
      );
      const headerContentRender = getSlot<HeaderContentRender>(
        slots,
        props,
        "headerContentRender"
      );
      const rightContentRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "rightContentRender"
      );
      const customHeaderRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "headerRender"
      );
      const footerRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "footerRender"
      );
      const tabRender = getSlot<CustomRenderProps>(slots, props, "tabRender");

      // menu
      const menuHeaderRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "menuHeaderRender"
      );
      const menuHeaderExtraRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "menuHeaderExtraRender"
      );
      const menuContentRender = getSlot<MenuContentRender>(
        slots,
        props,
        "menuContentRender"
      );
      const menuFooterRender = getSlot<CustomRenderProps>(
        slots,
        props,
        "menuFooterRender"
      );
      const menuItemRender = getSlot<MenuRender>(
        slots,
        props,
        "menuItemRender"
      );
      const subMenuItemRender = getSlot<MenuRender>(
        slots,
        props,
        "subMenuItemRender"
      );

      const headerDom = computed(() =>
        headerRender(
          {
            ...props,
            menuItemRender,
            subMenuItemRender,
            hasSiderMenu: !isTop.value,
            menuData: props.menuData,
            isMobile: unref(isMobile),
            onCollapse,
            onOpenKeys,
            onSelect,
            onMenuHeaderClick,
            rightContentRender,
            collapsedButtonRender,
            headerTitleRender: menuHeaderRender,
            menuHeaderExtraRender,
            menuContentRender,
            headerContentRender,
            headerRender: customHeaderRender,
          },
          props.matchMenuKeys
        )
      );

      routeContext.hasHeader = !!headerDom.value;

      const contentClassName = computed(() => {
        return {
          [`${baseClassName.value}-content`]: true,
          [`${baseClassName.value}-has-header`]: headerDom,
          [`${baseClassName.value}-children-layout`]: props.isChildrenLayout,
          [`${baseClassName.value}-content-disable-margin`]:
            props.disableContentMargin,
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
        } else if (!isTop.value && !isMobile.value) {
          width = `calc(100% - ${siderWidth.value}px)`;
        }
        return width;
      });

      const tabDom = computed(() => {
        if (props.tabRender === false || !tabRender) {
          return null;
        }
        return tabRender({ width: contentWidth.value, ...props });
      });

      const footerDom = computed(() => {
        if (props.footerRender === false || !footerRender) {
          return null;
        }
        return footerRender({ width: contentWidth.value, ...props });
      });

      return (
        <>
          {pure ? (
            slots.default?.()
          ) : (
            <div class={className.value} data-theme={props.theme}>
              <Layout
                style={{
                  minHeight: "100%",
                  ...((attrs.style as CSSProperties) || {}),
                }}
              >
                {(!isTop.value || isMobile.value) && (
                  <SiderMenuWrapper
                    {...restProps}
                    isMobile={isMobile.value}
                    menuHeaderRender={menuHeaderRender}
                    menuHeaderExtraRender={menuHeaderExtraRender}
                    menuContentRender={menuContentRender}
                    menuFooterRender={menuFooterRender}
                    menuItemRender={menuItemRender}
                    subMenuItemRender={subMenuItemRender}
                    collapsedButtonRender={collapsedButtonRender}
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
                    style={props.contentStyle}
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
