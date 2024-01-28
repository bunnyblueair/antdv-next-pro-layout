import { PropType, defineComponent } from "vue";
import { LayoutHeader } from "ant-design-vue";
import "./index.less"; // 导入样式文件
import { ConfProps, confProps } from "../../types/props";

export const ProHeaderProps = {
  hasSider: {
    type: Boolean,
    default: false,
  },
  // 布局设置
  ...confProps(),
  // conf: {
  //   type: Object as PropType<ConfProps>,
  //   default: confProps(),
  // },
};

const HeaderDefault = defineComponent({
  name: "HeaderDefault",
  props: ProHeaderProps,
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    /**
     * 固定顶部栏-占位
     */
    const fixedHeaderStyle = (conf: ConfProps) => {
      let { collapsed = false, collapsedWidth = 48, width = 200 } = conf;

      const collapsedWidthStr =
        typeof collapsedWidth === "number"
          ? `${collapsedWidth}px`
          : collapsedWidth;
      const widthStr = typeof width === "number" ? `${width}px` : width;
      const widthStyle = `${collapsed ? collapsedWidthStr : widthStr}`;
      const calcWidth = props.hasSider ? `calc(100% - ${widthStyle})` : "100%";
      return {
        padding: "0px",
        height: "48px",
        lineHeight: "48px",
        width: calcWidth,
        zIndex: 1000,
        right: "0px",
      };
    };

    return () => {
      return (
        <>
          {
            // 固定顶栏占位
            props.fixedHeader && (
              <LayoutHeader
                hasSider={props.hasSider}
                class="antv-pro-layout-header-seize"
                style={fixedHeaderStyle(props)}
              ></LayoutHeader>
            )
          }

          <LayoutHeader
            hasSider={props.hasSider}
            class={{
              "antv-pro-layout-header": true,
              "antv-pro-layout-header-fixed": props.fixedHeader,
              [`antv-pro-layout-header-${props.layout}`]: true,
              [`antv-pro-layout-header-${props.theme}`]: true,
            }}
            style={fixedHeaderStyle(props)}
          >
            {props.hasSider ? (
              <div class="antv-pro-layout-header-nav">
                <div style="flex: 1 1 0%;"></div>
                {slots.headerRight?.(props)}
              </div>
            ) : (
              <div class="antv-pro-layout-header-nav">
                <div style="min-width: 156px;">{slots.headerLeft?.(props)}</div>
                <div style="flex: 1 1 0%;min-width:375px">
                  {slots.default?.(props)}
                </div>
                <div style="min-width: 156px;">
                  {slots.headerRight?.(props)}
                </div>
              </div>
            )}
          </LayoutHeader>
        </>
      );
    };
  },
});

export default HeaderDefault;
