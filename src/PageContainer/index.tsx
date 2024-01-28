import PageHeader, { pageHeaderProps } from "ant-design-vue/es/page-header";
import { defineComponent, type App } from "vue";
import "./index.less";

const PageContainer = defineComponent({
  name: "PageContainer",
  props: pageHeaderProps(),
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    return () => {
      return (
        <div class="ant-pro-page-container">
          <div class="ant-pro-page-container__header">
            <PageHeader
              {...Object.assign({}, props, {
                extra: props.extra ?? slots.extra?.(),
                backIcon: props.backIcon ?? slots.backIcon?.(),
                footer: props.footer ?? slots.footer?.(),
                subTitle: props.subTitle ?? slots.subTitle?.(),
                title: props.title ?? slots.title?.(),
                tags: props.tags ?? slots.tags?.(),
              })}
            >
              {slots.content?.()}
            </PageHeader>
          </div>

          <div class="antv-pro-page-container__content">{slots.default?.()}</div>
        </div>
      );
    };
  },
});

PageContainer.install = (app: App) => {
  app.component(PageContainer.name, PageContainer);
  return app;
};

export default PageContainer;
