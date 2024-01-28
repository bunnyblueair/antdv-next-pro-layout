import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { Menu, MenuItem } from "ant-design-vue";
import Sider, { siderProps } from "ant-design-vue/es/layout/Sider";
import { PropType, defineComponent } from "vue";
import "./index.less"; // 导入样式文件
import { ConfProps, confProps } from "../../types/props";
import { MenuProps, menuProps } from "ant-design-vue/lib/menu/src/Menu";
import { SiderProps } from "ant-design-vue/lib/layout/Sider";

const MenuSider = defineComponent({
  name: "MenuSider",
  props: {
    ...menuProps(),
    ...siderProps(),
    ...confProps(),
  },
  // props: {
  //   // 菜单栏
  //   menu: {
  //     type: Object as PropType<MenuProps>,
  //     default: menuProps(),
  //   },
  //   // 侧边栏
  //   sider: {
  //     type: Object as PropType<SiderProps>,
  //     default: siderProps(),
  //   },
  //   // 布局设置
  //   conf: {
  //     type: Object as PropType<ConfProps>,
  //     default: confProps(),
  //   },
  // },
  emits: ["update:collapsed"],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    /**
     * 固定侧边栏-占位
     */
    const fixSiderBarStyle = (conf: ConfProps) => {
      let { collapsed = false, collapsedWidth = 48, width = 200 } = conf;

      const collapsedWidthStr =
        typeof collapsedWidth === "number"
          ? `${collapsedWidth}px`
          : collapsedWidth;
      const widthStr = typeof width === "number" ? `${width}px` : width;
      const widthStyle = `${collapsed ? collapsedWidthStr : widthStr}`;
      return {
        width: widthStyle,
        overflow: "hidden",
        flex: `0 0 ${widthStyle}`,
        maxWidth: `${widthStyle}`,
        minWidth: `${widthStyle}`,
        transition:
          "background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s",
      };
    };

    /**
     * 菜单收起按钮渲染-默认
     */
    const collapsedButtonRenderDefault = (conf: ConfProps) => {
      let { collapsed = false, theme = "light" } = conf;

      return (
        <Menu
          theme={theme}
          mode="inline"
          selectable={false}
          onClick={() => {
            props.onCollapse?.(!collapsed, "clickTrigger");
            emit("update:collapsed", !collapsed);
          }}
        >
          <MenuItem key="collapsed" title={false}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </MenuItem>
        </Menu>
      );
    };

    return () => {
      return (
        <>
          {
            // 固定侧边栏占位
            props.fixedSider && <aside style={fixSiderBarStyle(props)}></aside>
          }

          <Sider
            collapsed={props.collapsed}
            breakpoint={props.breakpoint}
            class={{
              "ant-pro-sider": true,
              "ant-pro-sider-fixed": props.fixedSider,
            }}
            trigger={null}
          >
            {slots.menuHeader?.(props)}

            <div style="flex: 1 1 0%; overflow: hidden auto;">
              {slots.default?.(props)}
            </div>

            {
              // 菜单收起按钮渲染
              slots.collapsedButtonRender
                ? slots.collapsedButtonRender(props.collapsed)
                : collapsedButtonRenderDefault(props)
            }

            {
              // 菜单底部渲染
              slots.menuFooter?.(props)
            }
          </Sider>
        </>
      );
    };
  },
});

export default MenuSider;
