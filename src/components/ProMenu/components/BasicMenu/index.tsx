import {
  TeamOutlined,
  FileOutlined,
  UserOutlined,
  DesktopOutlined,
  PieChartOutlined,
  createFromIconfontCN,
} from "@ant-design/icons-vue";
import { Menu, MenuItem, MenuItemGroup, SubMenu } from "ant-design-vue";
import { VNodeChild, defineComponent, isVNode } from "vue";
import "./index.less"; // 导入样式文件
import { DefaultProps } from "../../../../types/props";
import { menuProps } from "ant-design-vue/es/menu/src/Menu";
import { MenuDataItem } from "../../../../types/menu";
import { isImg, isUrl } from "../../../../utils/is";

const BasicMenu = defineComponent({
  name: "BasicMenu",
  props: {
    // 菜单栏
    ...menuProps(),
    // 默认
    ...DefaultProps,
  },
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    const { iconfontUrl, iconPrefixes, locale } = props;

    /**字体图标组件 */
    let IconFont = createFromIconfontCN();
    if (iconfontUrl) {
      createFromIconfontCN({
        scriptUrl: iconfontUrl,
      });
    }

    /**
     * 菜单图标渲染
     * @param icon 图标组件或字符
     * @param iconPrefixes 字体图标前缀
     * @returns
     */
    const menuIconRender = (icon: VNodeChild, iconPrefixes: string) => {
      if (!icon) {
        return null;
      }
      if (isVNode(icon)) {
        return icon;
      }
      if (typeof icon === "string" && icon !== "") {
        if (isUrl(icon) || isImg(icon)) {
          return <img src={icon} alt="icon" class={`ant-pro-menu-icon`} />;
        }
        if (icon.startsWith(iconPrefixes)) {
          return <IconFont type={icon} />;
        }
      }
      return icon;
    };

    /**
     * 菜单项渲染
     */
    const menuItemRender = (menusData: MenuDataItem[] = []) => {
      return menusData.map((item) => {
        const menuTitle = locale(item);

        // 有子菜单
        if (Array.isArray(item.children)) {
          const titleRender = item.meta?.icon ? (
            <span class="ant-pro-menu-item">
              <span class="ant-pro-menu-item__title">{menuTitle}</span>
            </span>
          ) : (
            <span class="ant-pro-menu-item">{menuTitle}</span>
          );

          return item.meta?.type === "group" ? (
            <MenuItemGroup title={titleRender} key={item.path}>
              {menuItemRender(item.children)}
            </MenuItemGroup>
          ) : (
            <SubMenu
              title={titleRender}
              key={item.path}
              popupClassName="ant-pro-menu-popup"
              icon={menuIconRender(item.meta?.icon, iconPrefixes)}
            >
              {menuItemRender(item.children)}
            </SubMenu>
          );
        }

        // 默认
        const icon = item.meta?.icon;
        const target = item.meta?.target;
        const hasUrl = isUrl(item.path);
        const attrs =
          hasUrl || target ? { ...item.meta, href: item.path, target } : {};
        const titleRender = icon ? (
          <a {...attrs} class="ant-pro-menu-item">
            {menuIconRender(icon, iconPrefixes)}
            <span class="ant-pro-menu-item__title">{menuTitle}</span>
          </a>
        ) : (
          <a {...attrs} class="ant-pro-menu-item">
            {menuTitle}
          </a>
        );
        return (
          <MenuItem
            disabled={item.meta?.disabled}
            danger={item.meta?.danger}
            key={item.path}
            title={menuTitle}
          >
            {titleRender}
          </MenuItem>
        );
      });
    };

    return () => {
      return (
        <Menu
          class="ant-pro-menu"
          {...Object.assign({}, props, {
            mode: props.layout === "top" ? "horizontal" : "inline",
          })}
        >
          {Array.isArray(props.menuData) && menuItemRender(props.menuData)}

          <MenuItem key="1">
            <PieChartOutlined />
            <span>Option 1{props.collapsed}</span>
          </MenuItem>
          <MenuItem key="2">
            <DesktopOutlined />
            <span>Option 2{JSON.stringify(props.menuData)}</span>
          </MenuItem>
          <SubMenu
            key="sub1"
            title={
              <span>
                <UserOutlined />
                <span>User</span>
              </span>
            }
          >
            <MenuItem key="3">Tom</MenuItem>
            <MenuItem key="4">Bill</MenuItem>
            <MenuItem key="5">Alex</MenuItem>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <TeamOutlined />
                <span>Team</span>
              </span>
            }
          >
            <MenuItem key="6">Team 1</MenuItem>
            <MenuItem key="8">Team 2</MenuItem>
          </SubMenu>
          {Array.from({ length: 50 }, (_, i) => i + 10).map((i) => (
            <MenuItem key={i}>
              i
              <FileOutlined />
              <span>File</span>
            </MenuItem>
          ))}
        </Menu>
      );
    };
  },
});

export default BasicMenu;
