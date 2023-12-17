import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";
import { Menu, MenuItem, SubMenu } from "ant-design-vue";
import SiderMenu from "./components/SiderMenu/index";
import { defineComponent } from "vue";
import { DefaultProps } from "../../types/props";
import "./index.less"; // 导入样式文件
import { menuProps } from "ant-design-vue/es/menu/src/Menu";
import { siderProps } from "ant-design-vue/es/layout/Sider";
import BasicMenu from "./components/BasicMenu";

export const ProMenuProps = {
  // 菜单栏
  ...menuProps(),
  // 侧边栏
  ...siderProps(),
  // 默认
  ...DefaultProps,
};

const ProMenu = defineComponent({
  name: "ProMenu",
  props: ProMenuProps,
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    return () => {
      const hasSider = !(props.layout === "top");

      return (
        <>
          {hasSider ? ( // 侧边菜单
            <SiderMenu {...props}>
              <BasicMenu {...props}></BasicMenu>
            </SiderMenu>
          ) : (
            <Menu
              selectedKeys={props.selectedKeys}
              theme={props.theme}
              mode="inline"
            >
              <MenuItem key="1">
                <PieChartOutlined />
                <span>Option 1{props.collapsed}</span>
              </MenuItem>
              <MenuItem key="2">
                <DesktopOutlined />
                <span>Option 2</span>
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
          )}
        </>
      );
    };
  },
});

export default ProMenu;
