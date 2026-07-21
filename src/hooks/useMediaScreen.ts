import { onScopeDispose, ref } from "vue";

/**屏幕尺寸媒体查询枚举对象 */
export const MediaQueryEnum = {
  xs: {
    minWidth: 375,
    maxWidth: 575,
    matchMedia: "(max-width: 575px)",
  },
  sm: {
    minWidth: 576,
    maxWidth: 767,
    matchMedia: "(min-width: 576px) and (max-width: 767px)",
  },
  md: {
    minWidth: 768,
    maxWidth: 991,
    matchMedia: "(min-width: 768px) and (max-width: 991px)",
  },
  lg: {
    minWidth: 992,
    maxWidth: 1199,
    matchMedia: "(min-width: 992px) and (max-width: 1199px)",
  },
  xl: {
    minWidth: 1200,
    maxWidth: 1599,
    matchMedia: "(min-width: 1200px) and (max-width: 1599px)",
  },
  xxl: {
    minWidth: 1600,
    maxWidth: 1999,
    matchMedia: "(min-width: 1600px) and (max-width: 1999px)",
  },
  xxxl: {
    minWidth: 2000,
    matchMedia: "(min-width: 2000px)",
  },
};

export type MediaQueryKey = keyof typeof MediaQueryEnum;

/**
 * 屏幕尺寸
 * Screen Media Query
 * Array.find will throw a error
 * `Rendered more hooks than during the previous render.`
 * So should use Array.forEach
 */
export const getMediaScreen = (): MediaQueryKey => {
  // support ssr
  if (typeof window === "undefined") {
    return "md";
  }
  const mediaQueryKey = (Object.keys(MediaQueryEnum) as MediaQueryKey[]).find(
    (key) => window.matchMedia(MediaQueryEnum[key].matchMedia).matches,
  );
  return mediaQueryKey ?? "md";
};

/**
 * 屏幕尺寸 ref 响应监听
 *
 * 监听器在所属 effect scope 销毁时自动清理（含组件卸载）。
 */
export const useMediaScreen = () => {
  const colSpan = ref<MediaQueryKey>(getMediaScreen());

  // support ssr
  if (typeof window === "undefined") {
    return colSpan;
  }

  const cleaners: Array<() => void> = [];
  (Object.keys(MediaQueryEnum) as MediaQueryKey[]).forEach((key) => {
    const query = window.matchMedia(MediaQueryEnum[key].matchMedia);
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        colSpan.value = key;
      }
    };
    if (query.matches) {
      colSpan.value = key;
    }
    query.addEventListener("change", handler);
    cleaners.push(() => query.removeEventListener("change", handler));
  });

  onScopeDispose(() => {
    cleaners.forEach((clean) => clean());
  });

  return colSpan;
};
