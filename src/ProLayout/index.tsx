import { defineComponent, type App, computed } from "vue";

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
} from "ant-design-vue";
import "./index.less"; // 导入样式文件
import ProMenu, { ProMenuProps } from "../components/ProMenu";
import ProHeader from "../components/ProHeader";
import { useRouter } from "vue-router";

const ProLayout = defineComponent({
  name: "ProLayout",
  props: { ...ProMenuProps },
  emits: ["update:collapsed", "menuSelect"],
  setup(props, { emit, attrs, slots }) {
    // const mediaScreenSize = useMediaQuery();
    // const isMobile = computed(
    //   () =>
    //     (mediaScreenSize.value === "sm" || mediaScreenSize.value === "xs") &&
    //     props.mobile
    // );
    const router = useRouter();

    return () => {
      const hasSider = !(props.layout === "top");

      return (
        <Layout
          class="ant-pro-layout"
          hasSider={hasSider}
          data-theme={props.theme}
        >
          {hasSider && (
            <ProMenu
              {...Object.assign({}, props, {
                onCollapse: (collapsed: boolean) => {
                  emit("update:collapsed", collapsed);
                },
                onSelect: (e: any) => {
                  emit("menuSelect", e);
                  // 跳转路由地址
                  router.push({
                    path: e.key,
                  });
                },
              })}
            ></ProMenu>
          )}

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
