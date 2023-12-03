import { type PropType } from "vue";

export const DefaultProps = {
  /**样式前缀 */
  // prefixCls: {
  //   type: String,
  //   default: "antdv-pro",
  // },
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
  fixHeaderBar: {
    type: Boolean,
    default: true,
  },
  // 固定侧边
  fixSiderBar: {
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
};
