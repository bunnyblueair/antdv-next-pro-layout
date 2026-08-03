import {
  defineComponent,
  computed,
  toRefs,
  PropType,
  ExtractPropTypes,
} from "vue";
import type { RouteRecordRaw } from "vue-router";
import { useRouteContext } from "../../RouteContext";
import { CustomRenderProps } from "../../typings";
import { clearMenuItem } from "../../utils/getMenuData";
import GlobalHeader, { GlobalHeaderProps, globalHeaderProps } from ".";
import { LayoutHeader } from "antdv-next";
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
  hasSiderMenu: Boolean,
  siderWidth: { type: Number, default: 200 },
  // collapsedWidth 用于在折叠态正确计算 Header 宽度
  collapsedWidth: { type: Number, default: 48 },
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
    const baseClassName = "ant-pro-header";
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader || layout.value === "mix",
    );
    const isTop = computed(() => layout.value === "top");
    const needSettingWidth = computed(
      () =>
        needFixedHeader.value &&
        hasSiderMenu.value &&
        !isTop.value &&
        !isMobile.value,
    );
    const clearMenuData = computed(
      () =>
        (context.menuData &&
          clearMenuItem(context.menuData as RouteRecordRaw[])) ||
        [],
    );
    const renderContent = () => {
      if (props.headerRender) {
        return props.headerRender(props);
      }
      if (isTop.value && !isMobile.value) {
        return (
          <TopNavHeader
            {...props}
            mode="horizontal"
            onCollapse={props.onCollapse}
            menuData={clearMenuData.value}
          />
        );
      }
      return (
        <GlobalHeader
          {...props}
          onCollapse={props.onCollapse}
          menuData={clearMenuData.value}
        >
          {props.headerContentRender &&
          typeof props.headerContentRender === "function"
            ? props.headerContentRender(props)
            : props.headerContentRender}
        </GlobalHeader>
      );
    };

    /**
     * 计算侧边栏的宽度，不然导致左边的样式会出问题
     */
    const width = computed(() => {
      return layout.value !== "mix" && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? props.collapsedWidth : props.siderWidth}px)`
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
            class={{
              [`${baseClassName}`]: true,
              [`${baseClassName}-${layout.value}`]: true,
              [`${baseClassName}-fixed`]: needFixedHeader.value,
            }}
          >
            {renderContent()}
          </LayoutHeader>
        </>
      );
    };
  },
});

export default HeaderView;
