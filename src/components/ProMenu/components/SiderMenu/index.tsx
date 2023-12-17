import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { Menu, MenuItem } from "ant-design-vue";
import Sider, { siderProps } from "ant-design-vue/es/layout/Sider";
import { defineComponent } from "vue";
import "./index.less"; // 导入样式文件
import { DefaultProps } from "../../../../types/props";

const SiderMenu = defineComponent({
  name: "SiderMenu",
  props: {
    // 左侧菜单栏
    ...siderProps(),
    // 默认
    ...DefaultProps,
  },
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    /**
     * 固定侧边栏-占位
     */
    const fixSiderBarStyle = (props: any) => {
      const { collapsed, collapsedWidth, width } = props;
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
     * 菜单头渲染-默认
     */
    const menuHeaderRenderDefault = (collapsed?: boolean) => {
      return (
        <div
          class={{
            "ant-pro-sider-logo": true,
            "ant-pro-sider-logo-collapsed": collapsed,
          }}
        >
          <a>
            <img
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              alt="logo"
            />
            {collapsed ? null : <h1>Ant Design Pro </h1>}
          </a>
        </div>
      );
    };

    /**
     * 菜单收起按钮渲染-默认
     */
    const collapsedButtonRenderDefault = (props: any) => {
      return (
        <Menu
          theme={props.theme}
          mode="inline"
          selectable={false}
          onClick={() => {
            props.onCollapse?.(!props.collapsed, "clickTrigger");
          }}
        >
          <MenuItem key="collapsed" title={false}>
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </MenuItem>
        </Menu>
      );
    };

    return () => {
      return (
        <>
          {
            // 固定侧边栏占位
            props.fixSiderBar && <aside style={fixSiderBarStyle(props)}></aside>
          }

          <Sider
            {...props}
            class={{
              "ant-pro-sider": true,
              "ant-pro-sider-fixed": props.fixSiderBar,
            }}
            trigger={null}
          >
            {
              // 菜单头渲染
              slots.menuHeaderRender
                ? slots.menuHeaderRender(props)
                : menuHeaderRenderDefault(props.collapsed)
            }

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
              slots.menuFooterRender?.(props)
            }
          </Sider>
        </>
      );
    };
  },
});

export default SiderMenu;
