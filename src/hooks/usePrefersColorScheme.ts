import { onScopeDispose, ref } from "vue";

/**媒体主题颜色模式枚举对象 */
export const PrefersColorSchemeEnum = {
  light: "(prefers-color-scheme: light)",
  dark: "(prefers-color-scheme: dark)",
};

export type PrefersColorSchemeKey = keyof typeof PrefersColorSchemeEnum;

/**媒体主题颜色模式偏好 */
export const getPrefersColorScheme = (): PrefersColorSchemeKey => {
  // support ssr
  if (typeof window === "undefined") {
    return "light";
  }
  const mediaQueryKey = (
    Object.keys(PrefersColorSchemeEnum) as PrefersColorSchemeKey[]
  ).find((key) => window.matchMedia(PrefersColorSchemeEnum[key]).matches);
  return mediaQueryKey ?? "light";
};

/**
 * 媒体主题颜色模式偏好 ref 响应监听
 *
 * 监听器在所属 effect scope 销毁时自动清理（含组件卸载）。
 */
export const usePrefersColorScheme = () => {
  const colorScheme = ref<PrefersColorSchemeKey>(getPrefersColorScheme());

  // support ssr
  if (typeof window === "undefined") {
    return colorScheme;
  }

  const cleaners: Array<() => void> = [];
  (Object.keys(PrefersColorSchemeEnum) as PrefersColorSchemeKey[]).forEach(
    (key) => {
      const query = window.matchMedia(PrefersColorSchemeEnum[key]);
      const handler = (e: MediaQueryListEvent) => {
        if (e.matches) {
          colorScheme.value = key;
        }
      };
      if (query.matches) {
        colorScheme.value = key;
      }
      query.addEventListener("change", handler);
      cleaners.push(() => query.removeEventListener("change", handler));
    },
  );

  onScopeDispose(() => {
    cleaners.forEach((clean) => clean());
  });

  return colorScheme;
};

/**
 * 主题切换视图过渡
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transitions_API
 *
 * 请将以下样式到 `App.vue` ，如遇到style层级问题可以去除 `scoped`
 * @example
 * <style>
 * ::view-transition-old(root),
 * ::view-transition-new(root) {
 *   animation: none;
 *   mix-blend-mode: normal;
 * }
 *
 * [data-theme="dark"]::view-transition-old(root) {
 *   z-index: 1;
 * }
 * [data-theme="dark"]::view-transition-new(root) {
 *   z-index: 999;
 * }
 *
 * ::view-transition-old(root) {
 *   z-index: 999;
 * }
 * ::view-transition-new(root) {
 *   z-index: 1;
 * }
 * </style>
 */
export function viewTransitionTheme(
  listener: (isDark: boolean) => void,
  e?: { clientX: number; clientY: number },
) {
  const root = document.documentElement;
  /**主题data-theme 明light 暗dark */
  const _isDark = root.getAttribute("data-theme") === "dark";

  // 为不支持此 API 的浏览器提供回退方案：
  if (!(document as any).startViewTransition) {
    root.setAttribute("data-theme", _isDark ? "light" : "dark");
    listener(_isDark);
    return;
  }

  // 获取点击位置，或者 左上角0   // 屏幕中间
  const x = e?.clientX ?? 0; // innerWidth / 2;
  const y = e?.clientY ?? 0; // innerHeight / 2;
  // 获取到最远角的距离
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  // startViewTransition 调用的时候 会获取当前页面的状态 ::view-transition-old(root)
  // 通过 startViewTransition 的回调函数，获取最新的页面的状态 ::view-transition-new(root)
  // 旧视图的动画效果从 opacity: 1 到 opacity: 0，而新视图则从 opacity: 0 过渡到 opacity: 1，从而形成淡入淡出。
  const transition = (document as any).startViewTransition(() => {
    root.setAttribute("data-theme", _isDark ? "light" : "dark");
    listener(_isDark);
  });
  // 两者过渡的快照准备完成时，使用 Web Animations API 进行 动画过渡
  transition.ready.then(() => {
    const clipPath = [
      `circle(0% at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: _isDark ? clipPath.reverse() : clipPath,
      },
      {
        duration: 500,
        easing: "ease-in",
        pseudoElement: _isDark // 运用于伪元素的过渡
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      },
    );
  });
}
