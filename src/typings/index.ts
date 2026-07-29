import type { Slot, VNode, VNodeChild } from "vue";

// Node
export type VueNode =
  | Slot
  | VNodeChild
  | VNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...props: any[]) => Slot)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...props: any[]) => VNode)
  | VNode[]
  | string
  | null
  | undefined;

export type WithFalse<T> = T | false;

export type CustomRender = VueNode;

/**本地化格式函数类型 */
export type FormatLocale = WithFalse<(menuDataItem?: MenuDataItem) => string>;

export type ProProps = Record<never, never>;
// Custom render or slot
export type DefaultPropRender = WithFalse<CustomRender> | any;

export type HeaderContentRender = WithFalse<() => CustomRender>;
export type MenuContentRender = WithFalse<
  (props: ProProps, defaultDom: CustomRender) => CustomRender
>;

/**渲染菜单函数类型（插槽） */
export type MenuRender = WithFalse<(item: MenuDataItem) => CustomRender>;

export type CustomRenderProps = WithFalse<(props?: ProProps) => CustomRender>;
export type CustomRenderFalse = WithFalse<CustomRender>;

export type CollapsedButtonRender = WithFalse<
  (collapsed?: boolean) => CustomRender
>;

/**明暗主题 */
export type Theme = "dark" | "light";

/**菜单布局 */
export type LayoutType = "side" | "top" | "mix";

/**侧边菜单类型：sub 折叠子菜单 / group 分组展开 */
export type SiderMenuType = "sub" | "group";

/**链接跳转类型 */
export type TargetType = "_blank" | "_self" | undefined;

/**菜单数据项元数据 */
export interface MetaRecord {
  /**菜单图标，例如 "icon-github" 或 createVNode(AlipayOutlined) */
  icon?: string | VNode;
  /**禁用菜单选项*/
  disabled?: boolean;
  /**展示错误状态样式 */
  danger?: boolean;
  /**自定义菜单的国际化 key，如果没有则返回自身 */
  title?: string;
  /**链接href打开目标跳转类型 '_blank' | '_self' | undefined */
  target?: TargetType;
  /**有 children 的菜单的组件类型 可选值 'group' */
  type?: string;
  /**在菜单中隐藏子节点 */
  hideChildInMenu?: boolean;
  /**在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;

  // 任意值
  [key: string]: any;
}

/**菜单数据项 */
export interface MenuDataItem {
  /**路由路径，用于菜单项唯一标志标定选中的值 */
  path: string;
  /**路由名称 */
  name?: string | symbol;
  /**路由元数据 */
  meta?: MetaRecord;
  /**子菜单 */
  children?: MenuDataItem[];
}
