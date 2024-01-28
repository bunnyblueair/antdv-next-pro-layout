import {
  TeamOutlined,
  FileOutlined,
  UserOutlined,
  DesktopOutlined,
  PieChartOutlined,
  createFromIconfontCN,
} from "@ant-design/icons-vue";
import { Menu, MenuItem, MenuItemGroup, SubMenu } from "ant-design-vue";
import { PropType, VNodeChild, defineComponent, isVNode } from "vue";
import "./index.less"; // 导入样式文件
import { menuProps } from "ant-design-vue/es/menu/src/Menu";
import { MenuDataItem } from "../../types/menu";
import { isImg, isUrl } from "../../utils/is";
import { RouterLink } from "vue-router";
import { ConfProps, confProps } from "../../types/props";
import { MenuMode, MenuProps } from "ant-design-vue/lib/menu";

const HeaderLogo = defineComponent({
  name: "HeaderLogo",
  props: {
    // 布局设置
    ...confProps(),
  },
  // props: {
  //   // 布局设置
  //   conf: {
  //     type: Object as PropType<ConfProps>,
  //     default: confProps(),
  //   },
  // },
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    const { layout, collapsed, theme } = props;

    return () => {
      return (
        <div
          class={{
            "antv-pro-layout-header-logo": true,
            "antv-pro-layout-header-logo__collapsed": collapsed,
            [`antv-pro-layout-header-logo__${layout}`]: true,
            [`antv-pro-layout-header-logo__${theme}`]: true,
          }}
        >
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="logo"
          />
          <span>Ant Design Pro </span>
        </div>
      );
    };
  },
});

export default HeaderLogo;
