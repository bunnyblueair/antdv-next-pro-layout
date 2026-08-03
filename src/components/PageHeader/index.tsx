import { ArrowLeftOutlined } from "@antdv-next/icons";
import {
  Avatar,
  Breadcrumb,
  Space,
  type BreadcrumbProps,
} from "antdv-next";
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  type ExtractPropTypes,
  type PropType,
  type Slots,
  type VNodeChild,
} from "vue";
import { withInstall } from "../../utils/withInstall";
import "./index.css";

const vnodeProp = {
  type: [String, Number, Object, Function, Array, Boolean] as PropType<
    VNodeChild
  >,
  default: undefined,
};

/** ant-design-vue PageHeader 的公开属性。 */
export const pageHeaderProps = {
  backIcon: vnodeProp,
  prefixCls: String,
  title: vnodeProp,
  subTitle: vnodeProp,
  breadcrumb: {
    type: Object as PropType<BreadcrumbProps | Record<string, any>>,
    default: undefined,
  },
  tags: vnodeProp,
  footer: vnodeProp,
  extra: vnodeProp,
  avatar: {
    type: Object as PropType<Record<string, any>>,
    default: undefined,
  },
  ghost: {
    type: Boolean,
    default: undefined,
  },
  onBack: Function as PropType<(event: MouseEvent) => void>,
};

export type PageHeaderProps = Partial<
  ExtractPropTypes<typeof pageHeaderProps>
>;

const hasContent = (value: unknown): boolean => {
  if (value === undefined || value === null || value === false) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some((item) => hasContent(item));
  }
  return true;
};

const renderProp = (value: VNodeChild | (() => VNodeChild) | undefined) =>
  typeof value === "function" ? value() : value;

const renderBreadcrumb = (
  breadcrumb: BreadcrumbProps | Record<string, any> | undefined,
  slots: Slots | undefined,
) => {
  if (!breadcrumb) {
    return slots?.breadcrumb?.();
  }

  if (Array.isArray((breadcrumb as Record<string, any>).items)) {
    return <Breadcrumb {...breadcrumb} />;
  }

  const sourceRoutes = (breadcrumb as Record<string, any>).routes;
  if (!Array.isArray(sourceRoutes) || sourceRoutes.length === 0) {
    return slots?.breadcrumb?.();
  }

  const items = sourceRoutes.map((route: Record<string, any>, index: number) => ({
    key: route.path || String(index),
    path: route.path,
    title: route.breadcrumbName,
    sourceRoute: route,
  }));
  const { routes: _routes, itemRender, ...restBreadcrumb } = breadcrumb as Record<
    string,
    any
  >;
  const breadcrumbProps: Record<string, any> = {
    ...restBreadcrumb,
    items,
  };

  if (itemRender) {
    breadcrumbProps.itemRender = (
      route: Record<string, any>,
      params: Record<string, any>,
      renderedRoutes: Array<Record<string, any>>,
      paths: string[],
    ) =>
      itemRender({
        route: route.sourceRoute || route,
        params,
        routes: renderedRoutes.map((item) => item.sourceRoute || item),
        paths,
      });
  }

  return <Breadcrumb {...breadcrumbProps} />;
};

const PageHeader = defineComponent({
  name: "APageHeader",
  inheritAttrs: false,
  props: pageHeaderProps,
  setup(props, { attrs, slots }) {
    const rootRef = ref<HTMLElement>();
    const compact = ref(false);
    let resizeObserver:
      | {
          observe: (target: Element) => void;
          disconnect: () => void;
        }
      | undefined;

    onMounted(() => {
      const ResizeObserverConstructor = window.ResizeObserver;
      if (!ResizeObserverConstructor || !rootRef.value) {
        return;
      }

      resizeObserver = new ResizeObserverConstructor((entries) => {
        compact.value = (entries[0]?.contentRect.width || 0) < 768;
      });
      resizeObserver.observe(rootRef.value);
    });

    onBeforeUnmount(() => {
      resizeObserver?.disconnect();
    });

    const prefixCls = computed(() => props.prefixCls || "ant-page-header");
    const ghost = computed(() => props.ghost ?? true);

    return () => {
      const title = renderProp(
        props.title !== undefined ? props.title : slots.title?.(),
      );
      const subTitle = renderProp(
        props.subTitle !== undefined ? props.subTitle : slots.subTitle?.(),
      );
      const tags = renderProp(
        props.tags !== undefined ? props.tags : slots.tags?.(),
      );
      const extra = renderProp(
        props.extra !== undefined ? props.extra : slots.extra?.(),
      );
      const avatar = props.avatar
        ? <Avatar {...props.avatar} />
        : slots.avatar?.();
      const backIcon =
        props.backIcon !== undefined
          ? props.backIcon
          : slots.backIcon?.() || <ArrowLeftOutlined />;
      const backDom =
        props.onBack && hasContent(backIcon) ? (
          <div class={`${prefixCls.value}-back`}>
            <button
              type="button"
              class={`${prefixCls.value}-back-button`}
              onClick={props.onBack}
              aria-label="返回"
            >
              {backIcon}
            </button>
          </div>
        ) : null;
      const hasHeading =
        hasContent(title) ||
        hasContent(subTitle) ||
        hasContent(tags) ||
        hasContent(extra);
      const headingDom = hasHeading ? (
        <div class={`${prefixCls.value}-heading`}>
          <div class={`${prefixCls.value}-heading-left`}>
            {backDom}
            {avatar}
            {hasContent(title) && (
              <span
                class={`${prefixCls.value}-heading-title`}
                title={typeof title === "string" ? title : undefined}
              >
                {title}
              </span>
            )}
            {hasContent(subTitle) && (
              <span
                class={`${prefixCls.value}-heading-sub-title`}
                title={typeof subTitle === "string" ? subTitle : undefined}
              >
                {subTitle}
              </span>
            )}
            {hasContent(tags) && (
              <span class={`${prefixCls.value}-heading-tags`}>{tags}</span>
            )}
          </div>
          {hasContent(extra) && (
            <span class={`${prefixCls.value}-heading-extra`}>
              {h(Space, undefined, { default: () => [extra] })}
            </span>
          )}
        </div>
      ) : null;
      const breadcrumbDom = renderBreadcrumb(props.breadcrumb, slots);
      const children = slots.default?.();
      const footer = renderProp(
        props.footer !== undefined ? props.footer : slots.footer?.(),
      );
      const { class: attrsClass, ...restAttrs } = attrs;
      const className = [
        prefixCls.value,
        breadcrumbDom && "has-breadcrumb",
        hasContent(footer) && "has-footer",
        ghost.value && `${prefixCls.value}-ghost`,
        compact.value && `${prefixCls.value}-compact`,
        attrsClass,
      ];

      return (
        <div ref={rootRef} {...restAttrs} class={className}>
          {breadcrumbDom}
          {headingDom}
          {hasContent(children) && (
            <div class={`${prefixCls.value}-content`}>{children}</div>
          )}
          {hasContent(footer) && (
            <div class={`${prefixCls.value}-footer`}>{footer}</div>
          )}
        </div>
      );
    };
  },
});

export default withInstall(PageHeader);
