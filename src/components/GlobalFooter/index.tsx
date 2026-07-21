import { defineComponent, PropType, ExtractPropTypes } from "vue";
import { CustomRenderFalse } from "../../typings";
import "./index.css";

export const globalFooterProps = {
  links: {
    type: Array as PropType<
      {
        key?: string;
        title: string;
        href: string;
        blankTarget?: boolean;
      }[]
    >,
    required: true,
  },
  copyright: {
    type: [Object, Function, String, Boolean] as PropType<CustomRenderFalse>,
    default: () => undefined,
  },
};

export type GlobalFooterProps = Partial<
  ExtractPropTypes<typeof globalFooterProps>
>;

export default defineComponent({
  name: "GlobalFooter",
  props: globalFooterProps,
  setup(props, { slots }) {
    const baseClassName = "ant-pro-global-footer";

    // 修复：原实现把 links/copyright 为空的判断写在 setup 顶层，
    // setup 只执行一次，导致运行时清空 links 后组件仍会渲染。
    // 这里把判断移入渲染函数，让条件能随 props 变化响应。
    return () => {
      if (
        Array.isArray(props.links) &&
        props.links.length === 0 &&
        (props.copyright == null || props.copyright === false)
      ) {
        return null;
      }
      const copyright =
        props.copyright || (slots.copyright && slots.copyright());

      return (
        <footer class={baseClassName}>
          {props.links && (
            <div class={`${baseClassName}-links`}>
              {props.links.map((link) => (
                <a
                  key={link.key}
                  title={link.title}
                  target={link.blankTarget ? "_blank" : "_self"}
                  href={link.href}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {props.copyright && (
            <div class={`${baseClassName}-copyright`}>{copyright}</div>
          )}
        </footer>
      );
    };
  },
});
