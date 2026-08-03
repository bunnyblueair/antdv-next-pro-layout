import { defineComponent } from "vue";
import { Drawer } from "antdv-next";
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
            size={props.siderWidth}
            styles={{
              body: {
                height: "100vh",
                padding: 0,
                display: "flex",
                flexDirection: "row",
              },
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
