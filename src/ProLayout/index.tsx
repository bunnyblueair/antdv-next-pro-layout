import { defineComponent, PropType, ExtractPropTypes } from "vue";
import { Layout, LayoutContent, LayoutFooter } from "ant-design-vue/lib";
import "./index.less"; // 导入样式文件
import { menuProps, MenuProps } from "ant-design-vue/lib/menu/src/Menu";
import { siderProps, SiderProps } from "ant-design-vue/es/layout/Sider";
import HeaderDefault from "../components/HeaderDefault";
import { MenuDataItem } from "src/types/menu";
import { withInstall } from "ant-design-vue/lib/_util/type";
import { ConfProps, confProps } from "../types/props";
import MenuSider from "../components/MenuSider";
import MenuBasic from "../components/MenuBasic";
import HeaderLogo from "../components/HeaderLogo";

// export const layoutProps = () => ({
//   /**样式前缀 */
//   prefixCls: {
//     type: String,
//     default: "antdv-pro",
//   },
//   /**布局 side mix top */
//   layout: {
//     type: String as PropType<"side" | "mix" | "top">,
//     default: "side",
//   },
//   /**主题 light dark */
//   theme: {
//     type: String as PropType<"light" | "dark">,
//     default: "light",
//   },
//   // 固定顶栏
//   fixHeaderBar: {
//     type: Boolean,
//     default: true,
//   },
//   // 固定侧边
//   fixSiderBar: {
//     type: Boolean,
//     default: true,
//   },
//   /**侧边收起 */
//   collapsed: {
//     type: Boolean,
//     default: false,
//   },
//   /**侧边收起宽度 */
//   collapsedWidth: {
//     type: [String, Number],
//     default: 48,
//   },
//   /**侧边展开宽度 */
//   width: {
//     type: [String, Number],
//     default: 200,
//   },

//   /**菜单数据 */
//   menuData: {
//     type: Array as PropType<MenuDataItem[]>,
//     default: () => [],
//   },
//   /**菜单本地化 */
//   locale: {
//     type: Function as PropType<(menuDataItem: MenuDataItem) => string>,
//     default: (menuDataItem: MenuDataItem) => menuDataItem.meta?.title,
//   },
//   /**菜单字体图标引用 */
//   iconfontUrl: {
//     type: String,
//     default: "",
//   },
//   /**菜单字体图标前缀 */
//   iconPrefixes: {
//     type: String,
//     default: "icon-",
//   },
// });
// export type LayoutProps = Partial<
//   ExtractPropTypes<ReturnType<typeof layoutProps>>
// >;

const ProLayout = defineComponent({
  name: "ProLayout",
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
  emits: ["update:collapsed", "menuSelect"],
  setup(props, { emit, attrs, slots }) {
    // const mediaScreenSize = useMediaQuery();
    // const isMobile = computed(
    //   () =>
    //     (mediaScreenSize.value === "sm" || mediaScreenSize.value === "xs") &&
    //     props.mobile
    // );

    return () => {
      const hasSider = !(props.layout === "top");

      return (
        <Layout
          class="antv-pro-layout"
          hasSider={hasSider}
          data-theme={props.theme}
        >
          {hasSider && (
            <MenuSider {...props}>
              {{
                menuHeader: () => <HeaderLogo {...props} />,
                default: () => (
                  <MenuBasic {...props} mode="vertical"></MenuBasic>
                ),
              }}
            </MenuSider>
          )}

          <Layout>
            <HeaderDefault hasSider={hasSider} {...props}>
              {{
                headerLeft: () => {
                  if (slots.headerLeft) {
                    return slots.headerLeft?.(props);
                  }
                  return <HeaderLogo {...props} />;
                },
                default: () => {
                  if (slots.header) {
                    return slots.header?.(props);
                  }
                  if (props.layout === "top") {
                    return <MenuBasic {...props} mode="horizontal"></MenuBasic>;
                  }
                  return null;
                },
                headerRight: () => slots.headerRight?.(),
              }}
            </HeaderDefault>

            <LayoutContent class="antv-pro-layout-content">
              {slots.default?.()}
            </LayoutContent>

            <LayoutFooter hasSider={hasSider}>
              {slots.footer?.(props)}
            </LayoutFooter>
          </Layout>
        </Layout>
      );
    };
  },
});

export default withInstall(ProLayout);
