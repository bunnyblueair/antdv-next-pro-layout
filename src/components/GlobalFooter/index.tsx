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
  prefixCls: {
    type: String,
    default: "ant-pro",
  },
};

export type GlobalFooterProps = Partial<
  ExtractPropTypes<typeof globalFooterProps>
>;

export default defineComponent({
  name: "GlobalFooter",
  props: globalFooterProps,
  setup(props, { slots }) {
    const baseClassName = `${props.prefixCls}-global-footer`;
    const copyright = props.copyright || (slots.copyright && slots.copyright());

    if (
      Array.isArray(props.links) &&
      props.links.length === 0 &&
      (props.copyright == null || props.copyright === false)
    ) {
      return null;
    }

    return () => (
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
  },
});
