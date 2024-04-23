import { onBeforeMount, reactive, ref, watch, watchEffect } from "vue";
import { ConfigProvider, theme } from "ant-design-vue";
import { ThemeConfig } from "ant-design-vue/lib/config-provider/context";

const CACHE_LOCAL_PRIMARY_COLOR = "cache:local:primaryColor";

export type ConfigType = {
  /**导航布局 */
  layout: "side" | "top" | "mix";
  /**全局主题色*/
  theme: "dark" | "light";
  /**菜单导航主题色 */
  menuTheme: "dark" | "light";
  /**固定顶部栏 */
  fixedHeader: boolean;
  /**固定菜单栏 */
  fixSiderbar: boolean;
  /**自动分割菜单 */
  splitMenus: boolean;
  /**内容区域-顶栏 */
  headerRender?: any | boolean | undefined;
  /**内容区域-页脚 */
  footerRender?: any | boolean | undefined;
  /**内容区域-菜单头 */
  menuHeaderRender?: any | boolean | undefined;
  /**内容区域-导航标签项 */
  tabRender?: any | boolean | undefined;
};

export const proConfig = ref<ConfigType>({
  layout: "side",
  theme: "light", // "light",
  menuTheme: "light", // "light",
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: true,
});

const themeColor = {
  light: theme.defaultAlgorithm,
  compact: theme.compactAlgorithm,
  dark: theme.darkAlgorithm,
};

export const themeConfig = reactive<ThemeConfig>({
  algorithm: [],
  // algorithm: themeColor["dark"],
  token: {
    // colorBgContainer: "#fff",
    colorPrimary: "#1668dc", // "#722ED1",
    borderRadius: 6,
  },
});

/**
 * 初始主题色
 */
export const usePrimaryColor = () => {
  watch(
    () => proConfig.value.theme,
    (v) => {
      themeConfig.algorithm = [themeColor[v]];
    }
  );
  onBeforeMount(() => {
    changePrimaryColor(getLocalColor());
  });
};

/**
 * 改变主题色
 * @param color 颜色
 */
export function changePrimaryColor(color?: string) {
  if (!color) {
    color = getRandomColor();
  }
  if (themeConfig && themeConfig.token) {
    themeConfig.token.colorPrimary = color;
  }
  ConfigProvider.config({
    theme: {
      primaryColor: color,
    },
  });
  localStorage.setItem(CACHE_LOCAL_PRIMARY_COLOR, color);
}

/**
 * 获取主题色-本地缓存
 * @returns 颜色
 */
export function getLocalColor() {
  return localStorage.getItem(CACHE_LOCAL_PRIMARY_COLOR) || "#1890ff";
}

/**
 * 获取随机颜色范围
 * @returns 颜色
 */
function getRandomColor(): string {
  const colors: string[] = [
    "#f5222d",
    "#fa541c",
    "#fa8c16",
    "#a0d911",
    "#13c2c2",
    "#1890ff",
    "#722ed1",
    "#eb2f96",
    "#faad14",
    "#52c41a",
  ];
  const i = Math.floor(Math.random() * 10);
  return colors[i];
}
