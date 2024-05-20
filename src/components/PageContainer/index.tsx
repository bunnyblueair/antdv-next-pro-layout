import {
  computed,
  defineComponent,
  unref,
  type FunctionalComponent,
  type PropType,
  type ExtractPropTypes,
  type VNodeChild,
} from "vue";
/* antd ts define */
import {
  Tabs,
  TabPane,
  TabPaneProps,
  TabsProps,
  Affix,
  AffixProps,
  PageHeader,
} from "ant-design-vue";
import { pageHeaderProps } from "ant-design-vue/es/page-header";
import { withInstall } from "ant-design-vue/es/_util/type";
import type { TabBarExtraContent } from "ant-design-vue/es/tabs/src/interface";
/* antd ts define end */
import { useRouteContext } from "../../RouteContext";
import { getSlotVNode } from "../../utils";
import PageLoading from "../PageLoading";
import type { DefaultPropRender } from "../../typings";
import "./index.css";

export const pageHeaderTabProps = {
  /**tabs 的列表 */
  tabList: {
    type: [Object, Function, Array] as PropType<
      (Omit<TabPaneProps, "id"> & { key?: string; tab?: any })[]
    >,
    default: () => undefined,
  },
  /**当前选中 tab 的 key */
  tabActiveKey: String,
  /**tabs 的其他配置 */
  tabProps: {
    type: Object as PropType<TabsProps>,
    default: () => undefined,
  },
  // events
  onTabChange: Function,
};

export const pageContainerProps = {
  ...pageHeaderTabProps,
  ...pageHeaderProps(),
  content: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  contentExtra: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  /**固钉的配置 */
  affixProps: {
    type: [Object, Function] as PropType<AffixProps>,
  },
  /**内容布局充满，默认固定宽度1200px */
  flex: {
    type: Boolean,
    default: true,
  },
  /**加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /**布局内容禁用外边距*/
  disableMargin: {
    type: Boolean,
    default: false,
  },
  /**固定 PageHeader 到页面顶部*/
  fixedHeader: {
    type: Boolean,
    default: false,
  },
};

export type PageContainerProps = Partial<
  ExtractPropTypes<typeof pageContainerProps>
>;

const renderFooter = (props: PageContainerProps): VNodeChild | any => {
  const { tabList, tabActiveKey, onTabChange, tabProps } = props;
  if (!Array.isArray(tabList) || tabList.length <= 0) {
    return null;
  }
  return (
    <Tabs
      activeKey={tabActiveKey}
      onChange={(key: string | number) => {
        if (onTabChange) onTabChange(key);
      }}
      {...tabProps}
    >
      {tabList.map((item) => (
        <TabPane {...item} tab={item.tab} key={item.key} />
      ))}
    </Tabs>
  );
};

// PageHeader 页头 https://www.antdv.com/components/page-header-cn/#api
const ProPageHeader: FunctionalComponent<
  PageContainerProps & { baseClassName: string }
> = (props) => {
  const {
    baseClassName,
    title,
    tabList,
    tabActiveKey,
    breadcrumb,
    content,
    tags,
    extra,
    contentExtra,
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
        })
      }
      tags={tags}
      extra={extra}
    >
      {(content || contentExtra) && (
        <div class={`${baseClassName}-header`}>
          {content && (
            <div class="content">
              {(typeof content === "function" && content()) || content}
            </div>
          )}
          {contentExtra && (
            <div class="content-extra">
              {(typeof contentExtra === "function" && contentExtra()) ||
                contentExtra}
            </div>
          )}
        </div>
      )}
    </PageHeader>
  );
};

const PageContainer = defineComponent({
  name: "PageContainer",
  inheritAttrs: false,
  props: pageContainerProps,
  setup(props, { slots }) {
    const context = useRouteContext();
    const baseClassName = "ant-pro-page-container";
    const pageHeaderDom = computed(() => {
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
          baseClassName={baseClassName}
          ghost={Boolean(props.ghost)}
          content={content}
          tags={tags}
          footer={footer}
          extra={extra}
          contentExtra={contentExtra}
        />
      );
    });

    return () => (
      <div class={baseClassName}>
        {props.fixedHeader && pageHeaderDom.value ? (
          <Affix
            offsetTop={
              context.hasHeader && context.fixedHeader
                ? context.headerHeight
                : 0
            }
            {...(props.affixProps as any)}
          >
            {pageHeaderDom.value}
          </Affix>
        ) : (
          pageHeaderDom.value
        )}

        <div
          class={{
            [`${baseClassName}-content`]: true,
            [`${baseClassName}-flex`]: props.flex,
          }}
        >
          {props.loading ? (
            // 加载状态
            <PageLoading />
          ) : (
            // 默认插槽
            slots.default && (
              <div
                class={{
                  [`${baseClassName}-main`]: !props.disableMargin,
                }}
              >
                {slots.default()}
              </div>
            )
          )}
        </div>

        {
          /* 渲染页脚 */
          slots.pageFooter && slots.pageFooter({ ...props })
        }
      </div>
    );
  },
});

export default withInstall(PageContainer);
