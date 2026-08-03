import {
  Affix,
  Tabs,
  type AffixProps,
  type TabPaneProps,
  type TabsProps,
} from "antdv-next";
import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType,
  type VNodeChild,
} from "vue";
import { withInstall } from "../../utils/withInstall";
import { useRouteContext } from "../../RouteContext";
import { getSlotVNode } from "../../utils";
import PageLoading from "../PageLoading";
import PageHeader, { pageHeaderProps } from "../PageHeader";
import type { DefaultPropRender } from "../../typings";
import "./index.css";

export const pageHeaderTabProps = {
  /** tabs 的列表 */
  tabList: {
    type: [Object, Function, Array] as PropType<
      (Omit<TabPaneProps, "id"> & { key?: string; tab?: any })[]
    >,
    default: () => undefined,
  },
  /** 当前选中 tab 的 key */
  tabActiveKey: String,
  /** tabs 的其他配置 */
  tabProps: {
    type: Object as PropType<TabsProps>,
    default: () => undefined,
  },
  onTabChange: Function as PropType<(key: string) => void>,
};

export const pageContainerProps = {
  ...pageHeaderTabProps,
  ...pageHeaderProps,
  content: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  contentExtra: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  /** 固钉的配置 */
  affixProps: {
    type: [Object, Function] as PropType<AffixProps>,
  },
  /** 内容布局充满，默认固定宽度 1200px */
  flex: {
    type: Boolean,
    default: true,
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 布局内容禁用外边距 */
  disableMargin: {
    type: Boolean,
    default: false,
  },
  /** 固定 PageHeader 到页面顶部 */
  fixedHeader: {
    type: Boolean,
    default: false,
  },
};

export type PageContainerProps = Partial<
  ExtractPropTypes<typeof pageContainerProps>
>;

const renderFooter = (props: PageContainerProps): VNodeChild | null => {
  const { tabList, tabActiveKey, onTabChange, tabProps } = props;
  if (!Array.isArray(tabList) || tabList.length === 0) {
    return null;
  }

  const items = tabList.map((item, index) => {
    const { tab, key, ...rest } = item;
    return {
      ...rest,
      key: String(key ?? index),
      label: tab,
    };
  });

  return (
    <Tabs
      {...tabProps}
      activeKey={tabActiveKey}
      items={items}
      onChange={(key: string) => {
        onTabChange?.(key);
      }}
    />
  );
};

const PageContainer = defineComponent({
  name: "PageContainer",
  inheritAttrs: false,
  props: pageContainerProps,
  setup(props, { slots }) {
    const context = useRouteContext();
    const baseClassName = "ant-pro-page-container";

    // 显式 breadcrumb 优先；否则兼容 ProLayout 原有的 routes 配置。
    const pageHeaderBreadcrumb = computed(() => {
      if (props.breadcrumb !== undefined) {
        return props.breadcrumb;
      }

      const ctxBreadcrumb = context.breadcrumb;
      const value = ctxBreadcrumb
        ? (ctxBreadcrumb as any).value || ctxBreadcrumb
        : {};
      return {
        ...value,
        routes: value.routes,
        itemRender: value.itemRender,
      };
    });

    const pageHeaderDom = computed(() => {
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
        "contentExtra",
      );
      const {
        tabList: _tabList,
        tabActiveKey: _tabActiveKey,
        tabProps: _tabProps,
        onTabChange: _onTabChange,
        content: _content,
        contentExtra: _contentExtra,
        affixProps: _affixProps,
        flex: _flex,
        loading: _loading,
        disableMargin: _disableMargin,
        fixedHeader: _fixedHeader,
        ...restProps
      } = props;

      return (
        <PageHeader
          {...restProps}
          title={props.title !== false ? props.title : undefined}
          breadcrumb={pageHeaderBreadcrumb.value}
          ghost={Boolean(props.ghost)}
          footer={footer || renderFooter(props)}
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
            <PageLoading />
          ) : (
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

        {slots.pageFooter && slots.pageFooter({ ...props })}
      </div>
    );
  },
});

export default withInstall(PageContainer);
