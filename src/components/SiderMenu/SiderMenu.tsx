import {
  unref,
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType,
  type CSSProperties,
} from "vue";
import { LayoutSider, Menu, MenuItem } from "antdv-next";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@antdv-next/icons";
import BaseMenu, { baseMenuProps } from "./BaseMenu";
import { defaultSettingProps } from "../../defaultSettings";
import { useRouteContext } from "../../RouteContext";
import "./SiderMenu.css";

type SiderBreakpoint = InstanceType<typeof LayoutSider>["$props"]["breakpoint"];
import type {
  MenuContentRender,
  CollapsedButtonRender,
  CustomRenderFalse,
  CustomRenderProps,
  WithFalse,
  CustomRender,
} from "../../typings";

export const defaultRenderLogo = (
  logo?: CustomRender,
  logoStyle?: CSSProperties,
): CustomRender => {
  if (!logo) {
    return null;
  }
  if (typeof logo === "string") {
    return <img src={logo} alt="logo" style={logoStyle} />;
  }
  if (typeof logo === "function") {
    return logo();
  }
  return logo;
};

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  renderKey:
    | "headerTitleRender"
    | "menuHeaderRender"
    | undefined = "menuHeaderRender",
): CustomRender | null => {
  const { logo, logoStyle, title } = props;
  const renderFunction = (props as Record<string, CustomRender>)[
    renderKey || ""
  ];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo, logoStyle);
  const titleDom = <h1>{title}</h1>;
  if (typeof renderFunction === "function") {
    // when collapsed, no render title
    return renderFunction(props);
  }
  if (Array.isArray(renderFunction)) {
    return <>{renderFunction}</>;
  }

  return (
    <a>
      {logoDom}
      {props.collapsed ? null : titleDom}
    </a>
  );
};

export const siderMenuProps = {
  ...defaultSettingProps,
  ...baseMenuProps,
  logo: {
    type: [Object, String, Function] as PropType<CustomRenderFalse>,
    default: () => undefined,
  },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined,
  },
  siderWidth: {
    type: Number,
    default: 200,
  },
  headerHeight: {
    type: Number,
    default: 48,
  },
  collapsedWidth: {
    type: Number,
    default: 48,
  },
  menuHeaderRender: {
    type: [Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  menuFooterRender: {
    type: [Function, Object, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  menuContentRender: {
    type: [Function, Object, Boolean] as PropType<MenuContentRender>,
    default: () => undefined,
  },
  menuHeaderExtraRender: {
    type: [Function, Object, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<CollapsedButtonRender>,
    default: () => undefined,
  },
  breakpoint: {
    type: [String, Object] as PropType<SiderBreakpoint>,
    default: () => "md",
  },
  isMobile: Boolean,
  splitMenus: Boolean,
  fixed: Boolean,
  hide: Boolean,
  matchMenuKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  // mix 布局下用于判断顶栏是否被禁用（headerRender === false），
  // 实际由父级 BasicLayout 透传。原实现用 Reflect.get(props, "headerRender")
  // 绕过类型检查，这里显式声明以获得类型安全。
  headerRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },

  // events
  onMenuHeaderClick: {
    type: Function as PropType<(...args: any[]) => any>,
  },
  onMenuClick: {
    type: Function as PropType<(...args: any[]) => any>,
  },
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>,
  },
  onOpenKeys: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>,
  },
  onSelect: {
    type: Function as PropType<(selectedKeys: WithFalse<string[]>) => void>,
  },
};

export type SiderMenuProps = Partial<ExtractPropTypes<typeof siderMenuProps>>;

// 改为 defineComponent 后 computed 在 setup 中只创建一次。
const SiderMenu = defineComponent({
  name: "SiderMenu",
  inheritAttrs: false,
  props: siderMenuProps,
  setup(props) {
    const context = useRouteContext();
    const baseClassName = "ant-pro-sider";
    const hasSplitMenu = computed(
      () => props.layout === "mix" && props.splitMenus,
    );
    const sSideWidth = computed(() =>
      props.collapsed ? props.collapsedWidth : props.siderWidth,
    );
    // mix layout: render the sider below the global header so they never overlap
    // (aligns with React, which offsets the fixed mix sider via top/height, not paddingTop).
    // - fixSiderbar: sider is fixed-positioned, place it under the header with top + height.
    // - otherwise: the header still floats full-width (mix forces fixedHeader), so pad the
    //   sider content down to keep the menu from being hidden behind it.
    const mixOffsetStyle = computed<CSSProperties>(() => {
      if (
        props.layout !== "mix" ||
        props.isMobile ||
        props.headerRender === false
      ) {
        return {};
      }
      if (context.fixSiderbar) {
        return {
          top: `${props.headerHeight}px`,
          height: `calc(100% - ${props.headerHeight}px)`,
        };
      }
      return { paddingTop: `${props.headerHeight}px` };
    });
    const classNames = computed(() => {
      return {
        [baseClassName]: true,
        [`${baseClassName}-fixed`]: context.fixSiderbar,
        [`layout-${props.layout}`]: true,
        [`theme-${props.theme}`]: true,
        [`theme-menu-${props.menuTheme}`]: true,
      };
    });

    const handleSelect = ($event: string[]) => {
      if (props.onSelect) {
        if (hasSplitMenu.value) {
          props.onSelect([context.selectedKeys[0], ...$event]);
          return;
        }
        props.onSelect($event);
      }
    };

    // 菜单头：mix 布局下子菜单侧边栏不渲染 logo（logo 已在顶部导航）
    const menuHeaderRenderDom = computed(() =>
      props.layout === "mix" && !props.isMobile
        ? null
        : defaultRenderLogoAndTitle(props),
    );

    return () => {
      const {
        menuHeaderExtraRender = false,
        menuContentRender = false,
        menuFooterRender = false,
        collapsedButtonRender,
      } = props;

      // 混合布局拆分菜单
      if (hasSplitMenu.value && unref(context.flatMenuData).length === 0) {
        return null;
      }

      // 菜单
      const baseMenuDom = (
        <BaseMenu
          locale={props.locale || context.locale}
          theme={props.menuTheme}
          siderMenuType={props.siderMenuType}
          mode="inline"
          menuData={
            hasSplitMenu.value ? context.flatMenuData : context.menuData
          }
          collapsed={props.collapsed}
          openKeys={context.openKeys}
          selectedKeys={context.selectedKeys}
          menuItemRender={props.menuItemRender}
          menuSubItemRender={props.menuSubItemRender}
          iconfontUrl={props.iconfontUrl}
          onClick={props.onMenuClick}
          class={`${baseClassName}-content-menu`}
          {...{
            "onUpdate:openKeys": ($event: string[]) =>
              props.onOpenKeys && props.onOpenKeys($event),
            "onUpdate:selectedKeys": handleSelect,
          }}
        />
      );

      const headerDom = menuHeaderRenderDom.value;

      return (
        <>
          {context.fixSiderbar && (
            <div
              style={{
                width: `${sSideWidth.value}px`,
                overflow: "hidden",
                flex: `0 0 ${sSideWidth.value}px`,
                maxWidth: `${sSideWidth.value}px`,
                minWidth: `${sSideWidth.value}px`,
                transition: `background-color 0.3s, min-width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`,
              }}
            />
          )}
          <LayoutSider
            collapsible
            collapsed={props.collapsed}
            breakpoint={props.breakpoint || undefined}
            onCollapse={(collapse: boolean) => {
              if (props.isMobile) return;
              props.onCollapse?.(collapse);
            }}
            collapsedWidth={props.collapsedWidth || 48}
            style={{
              overflow: "hidden",
              ...mixOffsetStyle.value,
            }}
            width={sSideWidth.value}
            theme={props.menuTheme}
            class={classNames.value}
          >
            {headerDom && (
              <div
                class={`${baseClassName}-header`}
                onClick={
                  props.layout !== "mix" ? props.onMenuHeaderClick : undefined
                }
              >
                {headerDom}
              </div>
            )}

            {menuHeaderExtraRender &&
              typeof menuHeaderExtraRender === "function" && (
                <div
                  class={{
                    [`${baseClassName}-header-extra`]: true,
                    [`${baseClassName}-header-extra-no-header`]: !headerDom,
                  }}
                >
                  {menuHeaderExtraRender(props)}
                </div>
              )}

            <div class={`${baseClassName}-content`}>
              {(menuContentRender && menuContentRender(props, baseMenuDom)) ||
                baseMenuDom}
            </div>

            {(collapsedButtonRender &&
              collapsedButtonRender(props.collapsed)) || (
              <div class={`${baseClassName}-collapsed`}>
                <Menu
                  class={`${baseClassName}-collapsed-menu`}
                  inlineIndent={16}
                  theme={props.menuTheme}
                  selectedKeys={[]}
                  openKeys={[]}
                  mode="inline"
                  onClick={() => {
                    if (props.onCollapse) {
                      props.onCollapse(!props.collapsed);
                    }
                  }}
                >
                  <MenuItem key={"collapsed-button"} title={false}>
                    {props.collapsed ? (
                      <MenuUnfoldOutlined />
                    ) : (
                      <MenuFoldOutlined />
                    )}
                  </MenuItem>
                </Menu>
              </div>
            )}

            {menuFooterRender && (
              <div class={`${baseClassName}-footer`}>
                {menuFooterRender(props)}
              </div>
            )}
          </LayoutSider>
        </>
      );
    };
  },
});

SiderMenu.displayName = "SiderMenu";

export default SiderMenu;
