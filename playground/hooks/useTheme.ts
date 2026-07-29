import { onBeforeMount, reactive, ref, watch, type CSSProperties } from "vue";
import { theme } from "ant-design-vue";
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import type { ProSettings } from "antdv-pro-layout";

const CACHE_LOCAL_PRIMARY_COLOR = "cache:local:primaryColor";

/**
 * 布局配置：复用库内置的 ProSettings（theme/menuTheme/layout/fixedHeader/
 * fixSiderbar/splitMenus/siderMenuType，以及 5 个 *Render 显隐开关），
 * 仅追加 playground 需要的 navTheme / contentWidth / contentStyle。
 */
export type ConfigType = Omit<
  ProSettings,
  "title" | "iconfontUrl" | "headerHeight"
> & {
  /** 整体风格：light | realDark（联动 menuTheme 与全局 theme 算法） */
  navTheme: "light" | "realDark";
  /** 内容区域宽度：Fluid 流式 | Fixed 定宽居中 */
  contentWidth: "Fluid" | "Fixed";
  /** 内容区域样式（由 layout + contentWidth 派生） */
  contentStyle?: CSSProperties;
};

/** compute content area style from layout + contentWidth */
export function getContentStyle(
  layout: ConfigType["layout"],
  contentWidth: ConfigType["contentWidth"],
): CSSProperties {
  return layout !== "side" && contentWidth === "Fixed"
    ? { maxWidth: "1200px", margin: "0 auto" }
    : {};
}

export const proConfig = ref<ConfigType>({
  navTheme: "light",
  layout: "side", // "side" | "top" | "mix"
  contentWidth: "Fluid",
  contentStyle: getContentStyle("side", "Fluid"),
  theme: "light",
  menuTheme: "light",
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: true,
  siderMenuType: "sub",
});

const themeColor = {
  light: theme.defaultAlgorithm,
  compact: theme.compactAlgorithm,
  dark: theme.darkAlgorithm,
};

export const themeConfig = reactive<ThemeConfig>({
  algorithm: [themeColor["light"]],
  // algorithm: themeColor["compact"],
  token: {
    // colorBgContainer: "#fff",
    colorPrimary: localStorage.getItem(CACHE_LOCAL_PRIMARY_COLOR) || "#1890ff", // "#722ED1",
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
    },
    {
      immediate: true,
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
    localStorage.setItem(CACHE_LOCAL_PRIMARY_COLOR, color);
  }
}

/**
 * 获取主题色-本地缓存
 * @returns 颜色
 */
export function getLocalColor() {
  let color = "#1890ff";
  if (themeConfig && themeConfig.token) {
    color = themeConfig.token.colorPrimary || color;
  }
  return color;
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
