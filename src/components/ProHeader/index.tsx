import { defineComponent } from "vue";
import { LayoutHeader } from "ant-design-vue";
import { DefaultProps } from "../../types/props";
import "./index.less"; // 导入样式文件

export const ProHeaderProps = {
  hasSider: {
    type: Boolean,
    default: false,
  },
  ...DefaultProps,
};

const ProHeader = defineComponent({
  name: "ProHeader",
  props: ProHeaderProps,
  emits: [],
  inheritAttrs: false,
  setup(props, { emit, attrs, slots }) {
    /**
     * 固定侧边栏-占位
     */
    const fixHeaderBarStyle = (props: any) => {
      const { collapsed, collapsedWidth, width } = props;
      const collapsedWidthStr =
        typeof collapsedWidth === "number"
          ? `${collapsedWidth}px`
          : collapsedWidth;
      const widthStr = typeof width === "number" ? `${width}px` : width;
      const widthStyle = `${collapsed ? collapsedWidthStr : widthStr}`;
      return {
        padding: "0px",
        height: "48px",
        lineHeight: "48px",
        width: `calc(100% - ${widthStyle})`,
        zIndex: 19,
        right: "0px",
      };
    };

    return () => {
      return (
        <>
          {
            // 固定顶栏占位
            props.fixHeaderBar && (
              <LayoutHeader
                hasSider={props.hasSider}
                class="ant-pro-layout-header"
              ></LayoutHeader>
            )
          }

          <LayoutHeader
            hasSider={props.hasSider}
            class={{
              "ant-pro-layout-header": true,
              "ant-pro-layout-header-fixed": props.fixHeaderBar,
              [`ant-pro-layout-header-${props.theme}`]: true,
            }}
            style={fixHeaderBarStyle(props)}
          >
            <div style="flex: 1 1 0%;"></div>
            {slots.rightContentRender?.(props)}
          </LayoutHeader>
        </>
      );
    };
  },
});

export default ProHeader;
