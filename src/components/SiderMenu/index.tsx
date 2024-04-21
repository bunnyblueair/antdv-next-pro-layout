import type { FunctionalComponent } from "vue";
import { Drawer } from "ant-design-vue";
import SiderMenu, { type SiderMenuProps } from "./SiderMenu";

const SiderMenuWrapper: FunctionalComponent<SiderMenuProps> = (
  props,
  { attrs }
) => {
  if (props.isMobile) {
    return (
      <Drawer
        visible={!props.collapsed}
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

SiderMenuWrapper.inheritAttrs = false;
SiderMenuWrapper.displayName = "SiderMenuWrapper";

export default SiderMenuWrapper;
