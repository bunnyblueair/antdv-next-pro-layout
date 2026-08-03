import type { App, Component, Plugin } from "vue";

/** 为库组件补充 app.use() 安装能力，避免依赖 UI 库的内部工具函数。 */
export function withInstall<T extends Component>(component: T): T & Plugin {
  const installable = component as T & Plugin;
  installable.install = (app: App) => {
    const name = (component as { name?: string }).name;
    if (name) {
      app.component(name, component);
    }
  };
  return installable;
}
