import type { VNodeChild, CSSProperties } from 'vue';

export interface TabPaneProps {
  tab?: string | VNodeChild ;
  class?: string | string[];
  style?: CSSProperties;
  disabled?: boolean;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: VNodeChild ;

  prefixCls?: string;
  tabKey?: string;
  id: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}
