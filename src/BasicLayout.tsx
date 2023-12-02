import {
  computed,
  reactive,
  unref,
  defineComponent,
  toRefs,
  provide,
  type App,
  type CSSProperties,
  type PropType,
  watchEffect,
} from "vue";

import { Layout } from "ant-design-vue";

const ProLayout = defineComponent({
  name: "ProLayout",
  inheritAttrs: false,
  props: {
    loading: Boolean,
    locale: {
      type: [Function, Boolean],
      default: false,
    },
    /**
     * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
     */
    disableMobile: {
      type: Boolean,
      required: false,
    },
    isChildrenLayout: {
      type: Boolean,
      required: false,
    },
    /**
     * 兼用 content 的 margin
     */
    disableContentMargin: {
      type: Boolean,
      required: false,
    },
    colSize: {
      type: Number,
      required: false,
    },
    contentStyle: {
      type: [String, Object] as PropType<CSSProperties>,
      default: () => {
        return null;
      },
    },
    breadcrumb: {
      type: [Object, Function],
      default: () => null,
    },
    collapsedButtonRender: {
      type: [Function, Object, Boolean],
      default: () => undefined,
    },
    breadcrumbRender: {
      type: [Object, Function, Boolean],
      default: () => null,
    },
    headerContentRender: {
      type: [Function, Object, Boolean],
      default: () => undefined,
    },
    headerRender: {
      type: [Object, Function, Boolean],
      default: () => undefined,
    },
    footerRender: {
      type: [Object, Function, Boolean],
      default: () => undefined,
    },
    tabRender: {
      type: [Object, Function, Boolean],
      default: () => undefined,
    },
  },
  emits: [
    "update:collapsed",
    "update:open-keys",
    "update:selected-keys",
    "collapse",
    "openKeys",
    "select",
    "menuHeaderClick",
    "menuClick",
  ],
  setup(props, { emit, attrs, slots }) {
    return () => {
      return (
        <>
          <div>
            <Layout
              style={{
                minHeight: "100%",
                ...((attrs.style as CSSProperties) || {}),
              }}
            >
              {JSON.stringify(props)}
            </Layout>
          </div>
        </>
      );
    };
  },
});

ProLayout.install = (app: App) => {
  app.component(ProLayout.name, ProLayout);
  return app;
};

export default ProLayout;
