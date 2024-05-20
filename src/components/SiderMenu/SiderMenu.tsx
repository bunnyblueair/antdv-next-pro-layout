import {
  unref,
  computed,
  type FunctionalComponent,
  type ExtractPropTypes,
  type PropType,
  type CSSProperties,
} from "vue";
import { LayoutSider, Menu, MenuItem, SiderProps } from "ant-design-vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import PropTypes from "ant-design-vue/es/_util/vue-types";
import BaseMenu, { baseMenuProps } from "./BaseMenu";
import { defaultSettingProps } from "../../defaultSettings";
import { useRouteContext } from "../../RouteContext";
import "./SiderMenu.css";
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
  logoStyle?: CSSProperties
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
    | undefined = "menuHeaderRender"
): CustomRender | null => {
  const { logo, logoStyle, title, layout, isMobile } = props;
  const renderFunction = (props as Record<string, CustomRender>)[
    renderKey || ""
  ];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo, logoStyle);
  const titleDom = <h1>{title}</h1>;
  if (layout === "mix" && !isMobile && renderKey === "menuHeaderRender") {
    return null;
  }
  // call menuHeaderRender
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
    type: [String, Object] as PropType<SiderProps["breakpoint"]>,
    default: () => "md",
  },
  isMobile: PropTypes.looseBool,
  splitMenus: PropTypes.looseBool,
  fixed: PropTypes.looseBool,
  hide: PropTypes.looseBool,
  matchMenuKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  // events
  onMenuHeaderClick: PropTypes.func,
  onMenuClick: PropTypes.func,
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

const SiderMenu: FunctionalComponent<SiderMenuProps> = (props, { attrs }) => {
  const {
    menuHeaderExtraRender = false,
    menuContentRender = false,
    menuFooterRender = false,
    collapsedButtonRender,
  } = props;
  const context = useRouteContext();
  const baseClassName = "ant-pro-sider";
  const hasSplitMenu = computed(
    () => props.layout === "mix" && props.splitMenus
  );
  const sSideWidth = computed(() =>
    props.collapsed ? props.collapsedWidth : props.siderWidth
  );
  const sSideHeaderTop = computed(() => {
    if (props.layout === "mix") {
      // 混合菜单布局去除顶栏
      if (Reflect.get(props, "headerRender") === false) {
        return undefined;
      }
      if (!props.isMobile) {
        return `${props.headerHeight}px`;
      }
    }
    return undefined;
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
      if (unref(hasSplitMenu)) {
        props.onSelect([context.selectedKeys[0], ...$event]);
        return;
      }
      props.onSelect($event);
    }
  };
  // 菜单头
  const menuHeaderRenderDom = defaultRenderLogoAndTitle(props);

  // 混合布局拆分菜单
  if (hasSplitMenu.value && unref(context.flatMenuData).length === 0) {
    return null;
  }

  // 菜单
  const baseMenuDom = (
    <BaseMenu
      locale={props.locale || context.locale}
      theme={props.menuTheme}
      mode="inline"
      menuData={hasSplitMenu.value ? context.flatMenuData : context.menuData}
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
        trigger={null}
        collapsed={props.collapsed}
        breakpoint={props.breakpoint || undefined}
        onCollapse={(collapse: boolean) => {
          if (props.isMobile) return;
          props.onCollapse?.(collapse);
        }}
        collapsedWidth={props.collapsedWidth || 48}
        style={{
          overflow: "hidden",
          paddingTop: sSideHeaderTop.value,
        }}
        width={sSideWidth.value}
        theme={props.menuTheme}
        class={classNames.value}
      >
        {menuHeaderRenderDom && (
          <div
            class={`${baseClassName}-header`}
            onClick={
              props.layout !== "mix" ? props.onMenuHeaderClick : undefined
            }
          >
            {menuHeaderRenderDom}
          </div>
        )}

        {menuHeaderExtraRender &&
          typeof menuHeaderExtraRender === "function" && (
            <div
              class={{
                [`${baseClassName}-header-extra`]: true,
                [`${baseClassName}-header-extra-no-header`]:
                  !menuHeaderRenderDom,
              }}
            >
              {menuHeaderExtraRender(props)}
            </div>
          )}

        <div class={`${baseClassName}-content`}>
          {(menuContentRender &&
            menuContentRender(props, unref(baseMenuDom))) ||
            unref(baseMenuDom)}
        </div>

        {(collapsedButtonRender && collapsedButtonRender(props.collapsed)) || (
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
          <div class={`${baseClassName}-footer`}>{menuFooterRender(props)}</div>
        )}
      </LayoutSider>
    </>
  );
};
SiderMenu.displayName = "SiderMenu";
SiderMenu.inheritAttrs = false;

export default SiderMenu;
