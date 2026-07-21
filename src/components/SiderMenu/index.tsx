import { defineComponent } from "vue";
import { Drawer } from "ant-design-vue";
import SiderMenu, { siderMenuProps, type SiderMenuProps } from "./SiderMenu";

// 重构说明（4.x 内部优化，不改变对外 API）：
//  - 原实现是 FunctionalComponent，每次重渲染整个函数体重新执行。
//  - 改为 defineComponent 后渲染函数只负责返回 VNode。
const SiderMenuWrapper = defineComponent({
  name: "SiderMenuWrapper",
  inheritAttrs: false,
  props: siderMenuProps,
  setup(props, { attrs }) {
    return () => {
      if (props.isMobile) {
        return (
          <Drawer
            open={!props.collapsed}
            closable={false}
            placement={"left"}
            style={{
              padding: 0,
              height: "100vh",
            }}
            onClose={() => props.onCollapse && props.onCollapse(true)}
            width={props.siderWidth}
            bodyStyle={{
              height: "100vh",
              padding: 0,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SiderMenu
              {...attrs}
              {...props}
              collapsed={props.isMobile ? false : props.collapsed}
              splitMenus={false}
            />
          </Drawer>
        );
      }
      return <SiderMenu {...attrs} {...props} />;
    };
  },
});

SiderMenuWrapper.displayName = "SiderMenuWrapper";

export default SiderMenuWrapper;
