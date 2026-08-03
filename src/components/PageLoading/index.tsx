import { defineComponent, type PropType } from "vue";
import { Spin, type SpinProps } from "antdv-next";

const spinProps = {
  spinning: {
    type: Boolean,
    default: true,
  },
  size: String as PropType<SpinProps["size"]>,
  description: {
    type: [String, Object, Function] as PropType<SpinProps["description"]>,
  },
  delay: Number,
  indicator: {
    type: [Object, Function] as PropType<SpinProps["indicator"]>,
  },
};

const PageLoading = defineComponent({
  inheritAttrs: false,
  name: "PageLoading",
  props: spinProps,
  setup(props) {
    return () => (
      <div style={{ paddingTop: "100px", textAlign: "center" }}>
        <Spin {...props}></Spin>
      </div>
    );
  },
});

export default PageLoading;
