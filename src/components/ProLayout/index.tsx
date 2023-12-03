import {
  defineComponent,
  type App,
  type CSSProperties,
  type PropType,
  computed,
} from "vue";

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
} from "ant-design-vue";
import "./index.less"; // 导入样式文件
import SiderMenu, { SiderMenuEmits, SiderMenuProps } from "../SiderMenu";
import { DefaultProps } from "../../types/props";
import ProHeader from "../ProHeader";

const ProLayout = defineComponent({
  name: "ProLayout",
  props: { ...SiderMenuProps },
  emits: [
    ...SiderMenuEmits,
    "update:open-keys",
    "update:selected-keys",
    "openKeys",
    "select",
    "menuHeaderClick",
    "menuClick",
  ],
  setup(props, { emit, attrs, slots }) {
    // const mediaScreenSize = useMediaQuery();
    // const isMobile = computed(
    //   () =>
    //     (mediaScreenSize.value === "sm" || mediaScreenSize.value === "xs") &&
    //     props.mobile
    // );

    const hasSider = !(props.layout === "top");

    return () => {
      return (
        <Layout
          class="ant-pro-layout"
          hasSider={hasSider}
          data-theme={props.theme}
        >
          {hasSider ? (
            <SiderMenu
              {...Object.assign({}, props, {
                onCollapse: (collapsed: boolean) => {
                  emit("update:collapsed", collapsed);
                },
              })}
            ></SiderMenu>
          ) : null}

          <Layout>
            <ProHeader hasSider={hasSider} {...props}>
              {slots.header?.(props)}
            </ProHeader>

            <LayoutContent class="ant-pro-layout-content">
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

ProLayout.install = (app: App) => {
  app.component(ProLayout.name, ProLayout);
  return app;
};

export default ProLayout;
