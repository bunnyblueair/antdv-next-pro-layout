import { defineComponent } from "vue";
import { Spin } from "ant-design-vue";
import { spinProps } from "ant-design-vue/es/spin";

const PageLoading = defineComponent({
  inheritAttrs: false,
  name: "PageLoading",
  props: spinProps(),
  setup(props) {
    return () => (
      <div style={{ paddingTop: "100px", textAlign: "center" }}>
        <Spin {...props}></Spin>
      </div>
    );
  },
});

export default PageLoading;
