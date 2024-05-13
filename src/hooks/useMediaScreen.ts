import { ref } from "vue";

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
export const getMediaScreen = () => {
  let screen: MediaQueryKey = "md";
  // support ssr
  if (typeof window === "undefined") {
    return screen;
  }
  const mediaQueryKey = (Object.keys(MediaQueryEnum) as MediaQueryKey[]).find(
    (key) => {
      const { matchMedia } = MediaQueryEnum[key];
      if (window.matchMedia(matchMedia).matches) {
        return true;
      }
      return false;
    }
  );
  if (!mediaQueryKey) {
    return screen;
  }
  return mediaQueryKey;
};

/**屏幕尺寸 ref响应监听 */
export const useMediaScreen = () => {
  const colSpan = ref<string>(getMediaScreen());

  Object.keys(MediaQueryEnum).forEach((key) => {
    const { matchMedia } = MediaQueryEnum[key as MediaQueryKey];
    const query = window.matchMedia(matchMedia);
    if (query.matches) {
      colSpan.value = key;
    }
    query.onchange = (e) => {
      if (e.matches) {
        colSpan.value = key;
      }
    };
  });

  return colSpan;
};
