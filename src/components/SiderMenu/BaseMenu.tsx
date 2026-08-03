import {
  defineComponent,
  resolveComponent,
  computed,
  watch,
  withCtx,
  getCurrentInstance,
  isVNode,
  createVNode,
  shallowRef,
  type ComputedRef,
  type VNodeChild,
  type VNode,
  type PropType,
  type ExtractPropTypes,
  type ConcreteComponent,
  type FunctionalComponent,
  type ComponentInternalInstance,
} from "vue";

import type { MenuProps as AntdvMenuProps } from "antdv-next";
import { Menu, MenuItem, MenuItemGroup, SubMenu } from "antdv-next";
import { createFromIconfontCN } from "@antdv-next/icons";

type MenuMode = NonNullable<AntdvMenuProps["mode"]>;
type MenuInfo = Parameters<NonNullable<AntdvMenuProps["onClick"]>>[0];
type SelectInfo = Parameters<NonNullable<AntdvMenuProps["onSelect"]>>[0];
type SelectEventHandler = (info: SelectInfo) => void;
type MenuClickEventHandler = (info: MenuInfo) => void;

import type {
  MenuDataItem,
  LayoutType,
  SiderMenuType,
  MenuRender,
  FormatLocale,
} from "../../typings";
import { defaultSettingProps, defaultSettings } from "../../defaultSettings";
import { isImg, isUrl } from "../../utils";
import "./BaseMenu.css";

export function useRootSubmenuKeys(
  menus: MenuDataItem[],
): ComputedRef<string[]> {
  return computed(() => menus.map((it) => it.path));
}

/**
 * IconFont 组件实例，使用 shallowRef 包裹以支持 `iconfontUrl` 变更后触发重渲染。
 *
 * 早期实现使用模块级 `let IconFont`，watchEffect 重新赋值后已渲染的 LazyIcon 闭包
 * 仍指向旧实例，导致切换 iconfontUrl 不会真正刷新图标。这里改为响应式引用解决该问题。
 */
const IconFontRef = shallowRef(
  createFromIconfontCN({ scriptUrl: defaultSettings.iconfontUrl }),
);

/**
 * 顶部多级菜单的弹层不能挂在布局内部，否则布局的 overflow 或 transform
 * 会影响弹层的可视区域和锚点计算。使用触发节点所属文档的 body，兼容 iframe。
 */
const getMenuPopupContainer = (triggerNode: HTMLElement): HTMLElement =>
  triggerNode.ownerDocument.body;

const LazyIcon: FunctionalComponent<{
  icon: VNodeChild | string;
}> = ({ icon }) => {
  if (!icon) {
    return null;
  }
  if (typeof icon === "string" && icon !== "") {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <img src={icon} alt="icon" role="img" class="ant-pro-menu-item-icon" />
      );
    }
    if (icon.startsWith("icon-")) {
      const IconFont = IconFontRef.value;
      return <IconFont type={icon} />;
    }
  }
  if (isVNode(icon)) {
    return icon;
  }
  // 兜底：把字符串当作已注册的全局组件名解析。
  const DynamicIcon = resolveComponent(icon as string);
  if (typeof DynamicIcon === "string") {
    return null;
  }
  // createVNode 接受 ConcreteComponent 类型；直接用 <DynamicIcon /> 会因
  // resolveComponent 的返回类型联合体（含 {}）触发 TSX 类型错误。
  return createVNode(DynamicIcon);
};

class MenuUtil {
  props: BaseMenuProps;

  ctx: ComponentInternalInstance | null;

  RouterLink: ConcreteComponent;

  constructor(props: BaseMenuProps, ctx: ComponentInternalInstance | null) {
    this.props = props;
    this.ctx = ctx;
    this.RouterLink = resolveComponent("router-link") as ConcreteComponent;
  }

  getNavMenuItems = (menusData: MenuDataItem[] = [], level = 0): VNode[] => {
    return menusData
      .flatMap((item) => this.getSubMenuOrItem(item, level))
      .filter((item) => item) as VNode[];
  };

  getSubMenuOrItem = (item: MenuDataItem, level = 0): VNode | VNode[] => {
    // siderMenuType="group": side/mix layouts only, top level only (React parity: menu.type==='group')
    const isGroup =
      this.props.siderMenuType === "group" && this.props.layout !== "top";
    const menuType = isGroup && level === 0 ? "group" : undefined;
    const hasGroup = menuType === "group" || item.meta?.type === "group";

    if (
      Array.isArray(item.children) &&
      item.children.length > 0 &&
      !item?.meta?.hideInMenu &&
      !item?.meta?.hideChildrenInMenu
    ) {
      // collapsed sider + group: groups cannot collapse, so flatten children
      if (menuType === "group" && this.props.collapsed) {
        return this.getNavMenuItems(item.children, level + 1);
      }

      // menuSubItemRender is a full-render override (Vue slot). When siderMenuType
      // is "group" at the top level, the group decision takes precedence over the
      // custom slot so groups render as MenuItemGroup (aligns with React, where
      // subMenuItemRender only customizes the title and menu.type decides grouping).
      if (this.props.menuSubItemRender && menuType !== "group") {
        const menuSubItemRender = withCtx(
          this.props.menuSubItemRender,
          this.ctx,
        );
        return menuSubItemRender(item) as VNode;
      }

      const locale = this.props.locale;
      const menuTitle = (locale && locale(item)) || item.meta?.title;
      const defaultTitle = item.meta?.icon ? (
        <span class="ant-pro-menu-item">
          <span class="ant-pro-menu-item-title">{menuTitle}</span>
        </span>
      ) : (
        <span class="ant-pro-menu-item-title-no-icon">{menuTitle}</span>
      );

      if (hasGroup) {
        return (
          <MenuItemGroup title={defaultTitle} key={item.path}>
            {this.getNavMenuItems(item.children, level + 1)}
          </MenuItemGroup>
        );
      }

      return (
        <SubMenu
          title={defaultTitle}
          key={item.path}
          popupClassName={`ant-pro-menu-popup`}
          icon={<LazyIcon icon={item.meta?.icon} />}
        >
          {this.getNavMenuItems(item.children, level + 1)}
        </SubMenu>
      );
    }

    const menuItemRender =
      this.props.menuItemRender && withCtx(this.props.menuItemRender, this.ctx);

    const titleDom = this.getMenuItem(item);

    return (
      (menuItemRender && (menuItemRender(item) as VNode)) || (
        <MenuItem
          disabled={item.meta?.disabled}
          danger={item.meta?.danger}
          key={item.path}
        >
          {titleDom}
        </MenuItem>
      )
    );
  };
  getMenuItem = (item: MenuDataItem) => {
    const meta = { ...item.meta };
    const target = (meta.target || null) as string | null;
    const hasUrl = isUrl(item.path);
    let attrs = {};
    if (hasUrl || target) {
      attrs = { ...item.meta, href: item.path, target };
    }
    // 自定义标签
    let CustomTag: any = (target && "a") || this.RouterLink;
    let props: any = { to: { name: item.name, ...item.meta } };
    if (meta.disabled) {
      CustomTag = "span";
      props = null;
    }
    const locale = this.props.locale;
    const menuTitle = (locale && locale(item)) || item.meta?.title;
    const titleDom = item.meta?.icon ? (
      <CustomTag {...attrs} {...props} class="ant-pro-menu-item">
        {item.meta?.icon && <LazyIcon icon={item.meta.icon} />}
        <span class="ant-pro-menu-item-title">{menuTitle}</span>
      </CustomTag>
    ) : (
      <CustomTag {...attrs} {...props} class="ant-pro-menu-item">
        <span class="ant-pro-menu-item-title-no-icon">{menuTitle}</span>
      </CustomTag>
    );

    return titleDom;
  };
}

export type MenuOnSelect = {
  key: string | number;
  keyPath: string[] | number[];
  item: VNodeChild | any;
  domEvent: MouseEvent;
  selectedKeys: string[];
};

export type MenuOnClick = {
  item: VNodeChild;
  key: string | number;
  keyPath: string | string[] | number | number[];
};

export const baseMenuProps = {
  ...defaultSettingProps,
  locale: {
    type: [Function, Boolean] as PropType<FormatLocale>,
    default: false,
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  // top-nav-header: horizontal
  mode: {
    type: String as PropType<MenuMode>,
    default: "inline",
  },
  layout: {
    type: String as PropType<LayoutType>,
    default: "side",
  },
  siderMenuType: {
    type: String as PropType<SiderMenuType>,
    default: "sub",
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  openKeys: {
    type: Array as PropType<string[]>,
    default: () => undefined,
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => undefined,
  },
  menuItemRender: {
    type: [Function, Boolean] as PropType<MenuRender>,
    default: () => undefined,
  },
  menuSubItemRender: {
    type: [Function, Boolean] as PropType<MenuRender>,
    default: () => undefined,
  },

  onClick: [Function, Object] as PropType<(...args: any) => void>,
};

export type BaseMenuProps = ExtractPropTypes<typeof baseMenuProps>;

const BaseMenu = defineComponent({
  inheritAttrs: true,
  name: "BaseMenu",
  props: baseMenuProps,
  emits: ["update:openKeys", "update:selectedKeys", "click"],
  setup(props, { emit }) {
    const ctx = getCurrentInstance();
    const menuUtil = new MenuUtil(props, ctx);

    // iconfontUrl 变更时重建 IconFont 实例；shallowRef 赋值会触发 LazyIcon 重渲染。
    watch(
      () => props.iconfontUrl,
      (url) => {
        if (url) {
          IconFontRef.value = createFromIconfontCN({ scriptUrl: url });
        }
      },
      { immediate: true },
    );

    const handleOpenChange = (openKeys: string[]): void => {
      emit("update:openKeys", openKeys);
    };
    const handleSelect: SelectEventHandler = (args: SelectInfo): void => {
      // ignore https? link handle selectkeys
      if (isUrl(args.key as string)) {
        return;
      }
      emit("update:selectedKeys", args.selectedKeys);
    };
    const handleClick: MenuClickEventHandler = (args: MenuInfo) => {
      emit("click", args);
    };

    // menu items rebuilt on each render; reads props.menuData, siderMenuType and
    // layout reactively, so toggling siderMenuType or switching layout updates the menu.
    return () => {
      return (
        <Menu
          key="Menu"
          inlineIndent={16}
          mode={props.mode}
          theme={props.theme}
          getPopupContainer={getMenuPopupContainer}
          forceSubMenuRender={props.mode === "horizontal"}
          openKeys={props.openKeys || []}
          selectedKeys={props.selectedKeys || []}
          onOpenChange={handleOpenChange}
          onSelect={handleSelect}
          onClick={handleClick}
        >
          {menuUtil.getNavMenuItems(props.menuData)}
        </Menu>
      );
    };
  },
});

export default BaseMenu;
