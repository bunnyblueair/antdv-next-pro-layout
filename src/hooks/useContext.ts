import {
  provide,
  inject,
  readonly,
  defineComponent,
  type InjectionKey,
  type SetupContext,
  type VNode,
  type PropType,
  type DefineComponent,
} from "vue";

type ContextType<T> = T;

type CreateContext<T> = DefineComponent<
  {},
  () => VNode | VNode[] | undefined,
  T
>;

export const createContext = <T>(
  contextInjectKey: InjectionKey<ContextType<T>> = Symbol(),
  injectCompName = "Context.Provider"
): CreateContext<T> => {
  const ContextProvider = defineComponent({
    name: injectCompName,
    props: {
      value: {
        type: Object as PropType<ContextType<T>>,
        required: true,
      },
    },
    setup(props: { value: ContextType<any> }, { slots }: SetupContext) {
      provide(contextInjectKey, readonly(props.value));
      return () => slots.default?.();
    },
  });

  return ContextProvider as any;
};

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T));
};
