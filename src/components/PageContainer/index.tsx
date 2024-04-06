import {
  computed,
  defineComponent,
  unref,
  type FunctionalComponent,
  type PropType,
  type ExtractPropTypes,
  VNodeChild,
} from "vue";
/* replace antd ts define */
import PageHeader, { pageHeaderProps } from "ant-design-vue/es/page-header";
import { Tabs, Affix, AffixProps, TabPaneProps } from "ant-design-vue";
import { TabBarExtraContent } from "ant-design-vue/es/tabs/src/interface";
import { withInstall } from "ant-design-vue/es/_util/type";
/* replace antd ts define end */
import { useRouteContext } from "../../RouteContext";
import { getSlotVNode } from "../../utils";
import PageLoading from "../PageLoading";
import GridContent from "../GridContent";
import type { CustomRender, VueNode } from "../../typings";
import type { DefaultPropRender } from "../../RenderTypings";
import "./index.css";

export const pageHeaderTabConfig = {
  /**
   * @name tabs 的列表
   */
  tabList: {
    type: [Object, Function, Array] as PropType<
      (Omit<TabPaneProps, "id"> & { key?: string; tab?: any })[]
    >,
    default: () => undefined,
  },
  /**
   * @name 当前选中 tab 的 key
   */
  tabActiveKey: String, //PropTypes.string,
  /**
   * @name tab 上多余的区域
   */
  tabBarExtraContent: {
    type: [Object, Function] as PropType<TabBarExtraContent>,
    default: () => undefined,
  },
  /**
   * @name tabs 的其他配置
   */
  tabProps: {
    type: Object, //as PropType<TabsProps>,
    default: () => undefined,
  },
  /**
   * @name 固定 PageHeader 到页面顶部
   */
  fixedHeader: Boolean, //PropTypes.looseBool,
  // events
  onTabChange: Function, //PropTypes.func,
};

export const pageContainerProps = {
  ...pageHeaderTabConfig,
  ...pageHeaderProps(),
  prefixCls: {
    type: String,
    default: "ant-pro",
  },
  content: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  contentExtra: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  affixProps: {
    type: [Object, Function] as PropType<AffixProps>,
  },
  loading: {
    type: Boolean,
    default: () => null,
  },
};

export type PageContainerProps = Partial<
  ExtractPropTypes<typeof pageContainerProps>
>;

const renderFooter = (
  props: Omit<
    PageContainerProps & {
      prefixedClassName: string;
    },
    "title"
  >
): VNodeChild | any => {
  const {
    tabList,
    tabActiveKey,
    onTabChange,
    tabBarExtraContent,
    tabProps,
    prefixedClassName,
  } = props;
  if (tabList && tabList.length) {
    return (
      <Tabs
        class={`${prefixedClassName}-tabs`}
        activeKey={tabActiveKey}
        onChange={(key: string | number) => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList.map((item) => (
          <Tabs.TabPane {...item} tab={item.tab} key={item.key} />
        ))}
      </Tabs>
    );
  }
  return null;
};

// PageHeader 页头 https://www.antdv.com/components/page-header-cn/#api
const ProPageHeader: FunctionalComponent<
  PageContainerProps & { prefixedClassName: string }
> = (props) => {
  const {
    title,
    tabList,
    tabActiveKey,
    breadcrumb,
    content,
    tags,
    extra,
    contentExtra,
    prefixedClassName,
    prefixCls,
    fixedHeader,
    footer,
    ...restProps
  } = props;

  const pageHeaderTitle: any = title !== false ? title : undefined;

  //面包屑的配置
  let pageHeaderBreadcrumb = breadcrumb;
  if (breadcrumb === undefined) {
    const value = useRouteContext();
    const unrefBreadcrumb = unref(value.breadcrumb || {});
    pageHeaderBreadcrumb = {
      ...unrefBreadcrumb,
      routes: unrefBreadcrumb.routes,
      itemRender: unrefBreadcrumb.itemRender,
    };
  }

  return (
    <div class={`${prefixedClassName}-warp`}>
      <PageHeader
        {...restProps}
        title={pageHeaderTitle}
        breadcrumb={pageHeaderBreadcrumb}
        footer={
          footer ||
          renderFooter({
            ...restProps,
            tabList,
            tabActiveKey,
            prefixedClassName,
          })
        }
        prefixCls={prefixCls}
        tags={tags}
        extra={extra}
      >
        {renderPageHeader(content, contentExtra, prefixedClassName)}
      </PageHeader>
    </div>
  );
};

// 页头默认插槽内容渲染
const renderPageHeader = (
  content: CustomRender,
  contentExtra: CustomRender,
  prefixedClassName: string
): VueNode => {
  if (!content && !contentExtra) {
    return null;
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && (
            <div class={`${prefixedClassName}-content`}>
              {(typeof content === "function" && content()) || content}
            </div>
          )}
          {contentExtra && (
            <div class={`${prefixedClassName}-contentExtra`}>
              {(typeof contentExtra === "function" && contentExtra()) ||
                contentExtra}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PageContainer = defineComponent({
  name: "PageContainer",
  inheritAttrs: false,
  props: pageContainerProps,
  setup(props, { slots }) {
    const value = useRouteContext();
    const { getPrefixCls } = value;
    const prefixCls = props.prefixCls || getPrefixCls();
    const prefixedClassName = computed(() => `${prefixCls}-page-container`);
    const classNames = computed(() => {
      return {
        [prefixedClassName.value]: true,
        [`${prefixCls}-page-container-ghost`]: Boolean(props.ghost),
      };
    });
    const headerDom = computed(() => {
      // 渲染页头
      if (slots.pageHeader) {
        return slots.pageHeader({ ...props });
      }

      const tags = getSlotVNode<DefaultPropRender>(slots, props, "tags");
      const extra = getSlotVNode<DefaultPropRender>(slots, props, "extra");
      const footer = getSlotVNode<DefaultPropRender>(slots, props, "footer");
      const content = getSlotVNode<DefaultPropRender>(slots, props, "content");
      const contentExtra = getSlotVNode<DefaultPropRender>(
        slots,
        props,
        "contentExtra"
      );
      return (
        <ProPageHeader
          {...props}
          prefixedClassName={prefixedClassName.value}
          content={content}
          tags={tags}
          footer={footer}
          extra={extra}
          contentExtra={contentExtra}
        />
      );
    });

    return () => {
      const { fixedHeader, affixProps, loading } = props;
      return (
        <div class={classNames.value}>
          {fixedHeader && headerDom.value ? (
            <Affix
              {...(affixProps as any)}
              offsetTop={
                value.hasHeader && value.fixedHeader ? value.headerHeight : 0
              }
            >
              {headerDom.value}
            </Affix>
          ) : (
            headerDom.value
          )}
          <GridContent>
            {
              // 加载状态
              loading ? (
                <PageLoading />
              ) : // 默认插槽
              slots.default ? (
                <div>
                  <div class={`${prefixedClassName.value}-children-content`}>
                    {slots.default()}
                  </div>
                </div>
              ) : null
            }
          </GridContent>
          {
            /* 渲染页脚 */
            slots.pageFooter && slots.pageFooter({ ...props })
          }
        </div>
      );
    };
  },
});

export default withInstall(PageContainer);
