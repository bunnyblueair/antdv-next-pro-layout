import { CSSProperties, ExtractPropTypes, type PropType } from "vue";
import { MenuDataItem } from "./menu";
// import { menuProps } from "ant-design-vue/es/menu/src/Menu";
// import { siderProps } from "ant-design-vue/es/layout/Sider";

export const confProps = () => ({
  /**样式前缀 */
  prefixCls: {
    type: String,
    default: "antdv-pro",
  },
  /**布局 side mix top */
  layout: {
    type: String as PropType<"side" | "mix" | "top">,
    default: "side",
  },
  /**主题 light dark */
  theme: {
    type: String as PropType<"light" | "dark">,
    default: "light",
  },

  // 固定顶栏
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  // 固定侧边
  fixedSider: {
    type: Boolean,
    default: true,
  },
  /**侧边收起 */
  collapsed: {
    type: Boolean,
    default: false,
  },
  /**侧边收起宽度 */
  collapsedWidth: {
    type: [String, Number],
    default: 48,
  },
  /**侧边展开宽度 */
  width: {
    type: [String, Number],
    default: 200,
  },

  /**菜单数据 */
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  /**菜单本地化 */
  locale: {
    type: Function as PropType<(menuDataItem: MenuDataItem) => string>,
    default: (menuDataItem: MenuDataItem) => menuDataItem.meta?.title,
  },
  /**菜单字体图标引用 */
  iconfontUrl: {
    type: String,
    default: "",
  },
  /**菜单字体图标前缀 */
  iconPrefixes: {
    type: String,
    default: "icon-",
  },
});
export type ConfProps = Partial<ExtractPropTypes<ReturnType<typeof confProps>>>;
