import { defineComponent } from "vue";
import { Drawer } from "ant-design-vue";
import SiderMenu, { siderMenuProps, type SiderMenuProps } from "./SiderMenu";

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
