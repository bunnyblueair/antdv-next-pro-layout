import type { PropType, ExtractPropTypes } from "vue";
import type { LayoutType, Theme } from "./typings";
import { MenuTheme } from "ant-design-vue";

export interface RenderSetting {
  headerRender?: false;
  footerRender?: false;
  menuRender?: false;
  menuHeaderRender?: false;
}
export interface PureSettings {
  /**全局主题色*/
  theme: Theme;
  /**菜单导航主题色*/
  menuTheme: MenuTheme;
  /**customize header height */
  headerHeight?: number;
  /**菜单布局 */
  layout: LayoutType;
  /**
   * sticky header
   */
  fixedHeader: boolean;
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean;
  menu: { locale?: boolean; defaultOpenAll?: boolean };
  title: string;
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  primaryColor: string;
  colorWeak?: boolean;
  splitMenus?: boolean;
}

export type ProSettings = PureSettings & RenderSetting;

export const defaultSettings = {
  theme: "light",
  menuTheme: "light",
  layout: "side",
  fixedHeader: false,
  fixSiderbar: false,
  menu: {
    locale: true,
  },
  headerHeight: 48,
  title: "Ant Design Vue Pro",
  iconfontUrl: "",
  primaryColor: "#1890ff",
};

export const defaultSettingProps = {
  theme: {
    type: String as PropType<PureSettings["theme"]>,
    default: defaultSettings.theme,
  },
  menuTheme: {
    type: String as PropType<PureSettings["menuTheme"]>,
    default: defaultSettings.menuTheme,
  },
  layout: {
    type: String as PropType<PureSettings["layout"]>,
    default: defaultSettings.layout,
  },
  fixedHeader: {
    type: Boolean as PropType<PureSettings["fixedHeader"]>,
    default: defaultSettings.fixedHeader,
  },
  fixSiderbar: {
    type: Boolean as PropType<PureSettings["fixSiderbar"]>,
    default: defaultSettings.fixSiderbar,
  },
  menu: {
    type: Object as PropType<PureSettings["menu"]>,
    default: () => {
      return {
        locale: true,
      };
    },
  },
  headerHeight: {
    type: Number as PropType<PureSettings["headerHeight"]>,
    default: defaultSettings.headerHeight,
  },
  title: {
    type: String as PropType<PureSettings["title"]>,
    default: () => defaultSettings.title,
  },
  iconfontUrl: {
    type: String as PropType<PureSettings["iconfontUrl"]>,
    default: () => defaultSettings.iconfontUrl,
  },
  primaryColor: {
    type: String as PropType<PureSettings["primaryColor"]>,
    default: () => defaultSettings.primaryColor,
  },
  /**
   * 只在 mix 模式下生效
   */
  splitMenus: {
    type: Boolean,
    default: false,
  },
};

export type ProSettingsProps = ExtractPropTypes<typeof defaultSettingProps>;
