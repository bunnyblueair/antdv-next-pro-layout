import { TargetType } from "ant-design-vue/es/vc-align/interface";
import { VNode, VNodeChild } from "vue";

export interface MetaRecord {
  /**菜单的icon */
  icon?: string | VNodeChild;
  /**
   * @type 有 children 的菜单的组件类型 可选值 'group'
   */
  type?: 'group';
  /**菜单标题 */
  title?: string;
  /**
   * @name 内建授权信息
   */
  authority?: string | string[];
  /**全连接跳转模式 */
  target?: "_blank" | "_self" | "_parent";
  /**在菜单中隐藏子节点 */
  hideChildInMenu?: boolean;
  /**在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /**禁用菜单选项 */
  disabled?: boolean;
  /**
   * @name 隐藏自己，并且将子节点提升到与自己平级
   */
  flatMenu?: boolean;

  /**其他参数 */
  [key: string]: any;
}

export interface MenuDataItem {
  /**路由地址*/
  path: string;
  /**路由名称 */
  name?: string | symbol;
  /**路由元数据 */
  meta?: MetaRecord;
  /**子路由 */
  children?: MenuDataItem[];
}
