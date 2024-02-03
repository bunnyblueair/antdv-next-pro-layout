import type { VNode, VNodeChild, CSSProperties } from "vue";

export type ShapeType = "circle" | "square";

export type Size = "large" | "small" | "default";

export interface AvatarProps {
  icon?: VNode;
  shape?: ShapeType;
  size?: Size;
  src?: string;
  srcSet?: string;
  alt?: string;
  loadError?: () => boolean;
}

export interface PageHeaderProps {
  backIcon?: VNodeChild;
  prefixCls?: string;
  title: string | VNodeChild;
  subTitle?: string | VNodeChild;
  style?: CSSProperties;
  class?: string | string[];
  breadcrumb?: Record<string, any>;
  tags?: VNodeChild;
  footer?: VNodeChild;
  extra?: VNodeChild;
  avatar?: AvatarProps;
  onBack?: (e: MouseEvent) => void;
  ghost?: boolean;
}
