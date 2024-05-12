import {
  defineComponent,
  computed,
  toRefs,
  PropType,
  ExtractPropTypes,
} from "vue";
import type { RouteRecordRaw } from "vue-router";
import GlobalHeader, { GlobalHeaderProps, globalHeaderProps } from ".";
import { useRouteContext } from "../../RouteContext";
import { CustomRenderProps } from "../../RenderTypings";
import { clearMenuItem } from "../../utils/getMenuData";
import { LayoutHeader } from "ant-design-vue";
import PropTypes from "ant-design-vue/es/_util/vue-types";
import TopNavHeader from "./TopNavHeader";
import "./HeaderView.css";

export const headerViewProps = {
  ...globalHeaderProps,
  headerRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  headerTitleRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  headerContentRender: {
    type: [Object, Function, Boolean] as PropType<CustomRenderProps>,
    default: () => undefined,
  },
  hasSiderMenu: PropTypes.looseBool,
  siderWidth: PropTypes.number.def(208),
};

export type HeaderViewProps = Partial<
  ExtractPropTypes<typeof headerViewProps> & GlobalHeaderProps
>;

const HeaderView = defineComponent({
  name: "HeaderView",
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
    const { isMobile, fixedHeader, hasSiderMenu, headerHeight, layout } =
      toRefs(props);
    const context = useRouteContext();
    const baseClassName = `${props.prefixCls}-header`;
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader || layout.value === "mix"
    );
    const isMix = computed(() => layout.value === "mix");
    const isTop = computed(() => layout.value === "top");
    const needSettingWidth = computed(
      () =>
        needFixedHeader.value &&
        hasSiderMenu.value &&
        !isTop.value &&
        !isMobile.value
    );
    // cache menu
    const clearMenuData = computed(
      () =>
        (context.menuData &&
          clearMenuItem(context.menuData as RouteRecordRaw[])) ||
        []
    );

    const className = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${baseClassName}-${layout.value}`]: true,
        [`${baseClassName}-fixed`]: needFixedHeader.value,
      };
    });
    const renderContent = () => {
      let defaultDom = (
        <GlobalHeader
          {...props}
          onCollapse={props.onCollapse}
          menuData={clearMenuData.value}
        >
          {!isMix.value
            ? props.headerContentRender &&
              typeof props.headerContentRender === "function"
              ? props.headerContentRender(props)
              : props.headerContentRender
            : null}
        </GlobalHeader>
      );
      if (isTop.value && !isMobile.value) {
        defaultDom = (
          <TopNavHeader
            {...props}
            mode="horizontal"
            onCollapse={props.onCollapse}
            menuData={clearMenuData.value}
          />
        );
      }
      if (props.headerRender) {
        return props.headerRender(props);
      }
      return defaultDom;
    };

    /**
     * 计算侧边栏的宽度，不然导致左边的样式会出问题
     */
    const width = computed(() => {
      return layout.value !== "mix" && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
        : "100%";
    });
    const right = computed(() => (needFixedHeader.value ? 0 : undefined));
    return () => {
      return (
        <>
          {needFixedHeader.value && (
            <LayoutHeader
              style={{
                height: `${headerHeight.value}px`,
                lineHeight: `${headerHeight.value}px`,
                background: "transparent",
              }}
            />
          )}
          <LayoutHeader
            style={{
              padding: 0,
              height: `${headerHeight.value}px`,
              lineHeight: `${headerHeight.value}px`,
              width: width.value,
              zIndex: layout.value === "mix" ? 100 : 19,
              right: right.value,
            }}
            class={className.value}
          >
            {renderContent()}
          </LayoutHeader>
        </>
      );
    };
  },
});

export default HeaderView;
