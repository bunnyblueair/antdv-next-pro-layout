<script setup lang="ts">
import { changePrimaryColor, getLocalColor } from "@/hooks/useTheme";
import { MenuTheme } from "ant-design-vue";
import { PropType, ref } from "vue";

type ConfigType = {
  /**导航布局 */
  layout: "side" | "top" | "mix";
  /**全局主题色*/
  theme: "dark" | "light";
  /**菜单导航主题色 */
  menuTheme: MenuTheme;
  /**固定顶部栏 */
  fixedHeader: boolean;
  /**固定菜单栏 */
  fixSiderbar: boolean;
  /**自动分割菜单 */
  splitMenus: boolean;
  /**内容区域-顶栏 */
  headerRender?: any | boolean | undefined;
  /**内容区域-页脚 */
  footerRender?: any | boolean | undefined;
  /**内容区域-菜单头 */
  menuHeaderRender?: any | boolean | undefined;
  /**内容区域-导航标签项 */
  tabRender?: any | boolean | undefined;
};

const emit = defineEmits(["update:open", "update:config", "close"]);
const props = defineProps({
  /**布局设置抽屉显示 */
  open: {
    type: Boolean,
    required: true,
  },
  /**布局配置 */
  config: {
    type: Object as PropType<ConfigType>,
    default: () => ({
      layout: "side",
      headerTheme: "light",
      navTheme: "light",
      fixSiderbar: true,
      fixedHeader: true,
      splitMenus: true,
    }),
  },
});

/**修改布局设置 */
function changeConf(key: string, value: boolean | string | number | undefined) {
  const config = Object.assign({}, props.config);
  if (Reflect.has(config, key)) {
    // 同时修改mix混合菜单的导航主题
    if (key === "navTheme") {
      Reflect.set(config, "headerTheme", value);
    }
    Reflect.set(config, key, value);
    emit("update:config", config);
  }
}

let color = ref<string>(getLocalColor());

/**改变主题色 */
function fnColorChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.nodeName === "INPUT") {
    changePrimaryColor(target.value ?? "#1890ff");
  } else {
    changePrimaryColor();
  }
  color.value = getLocalColor();
}
</script>

<template>
  <a-drawer
    :open="open"
    :width="600"
    placement="right"
    @close="() => emit('close', false)"
  >
    <div>
      <a-divider orientation="left">布局属性</a-divider>
      <a-list item-layout="vertical" size="large" row-key="title">
        <a-list-item>
          整体布局
          <template #actions> 导航模式模块设置 </template>
          <template #extra>
            <a-radio-group 
              style="margin-bottom: 12px; width: 136px;"
              :value="config.layout"
              @change="(e:any) => changeConf('layout', e.target.value)"
            >
              <a-radio value="side">左侧菜单布局</a-radio>
              <a-radio value="top">顶部菜单布局</a-radio>
              <a-radio value="mix">混合菜单布局</a-radio>
            </a-radio-group>
          </template>
        </a-list-item>
        <a-list-item>
          风格配色
          <template #actions> 整体风格配色设置 </template>
          <template #extra>
            <a-space :size="16" align="end" direction="horizontal">
              <a-button type="primary" size="small" @click="fnColorChange">
                随机
              </a-button>
              <input type="color" :value="color" @input="fnColorChange" />
            </a-space>
          </template>
        </a-list-item>
        <a-list-item>
          主题明亮
          <template #actions> 全局主题色 </template>
          <template #extra>
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="config.theme === 'dark'"
              @change="
            (checked:any) => changeConf('theme', checked ? 'dark' : 'light')
          "
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          深色菜单
          <template #actions> 只能改变导航模式的菜单 </template>
          <template #extra>
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="config.menuTheme === 'dark'"
              @change="
            (checked:any) => changeConf('menuTheme', checked ? 'dark' : 'light')
          "
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          固定顶部导航栏
          <template #actions> 顶部导航栏是否固定，不随滚动条移动 </template>
          <template #extra>
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="config.fixedHeader"
              @change="(checked:any) => changeConf('fixedHeader', checked)"
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          固定左侧菜单
          <template #actions> 左侧菜单是否固定，仅左侧菜单布局时有效 </template>
          <template #extra>
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="config.fixSiderbar"
              @change="(checked:any) => changeConf('fixSiderbar', checked)"
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          自动分割菜单
          <template #actions>
            顶部有多级菜单时显示左侧菜单，仅混合菜单布局时有效
          </template>
          <template #extra>
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="config.splitMenus"
              @change="(checked:any) => changeConf('splitMenus', checked)"
            ></a-switch>
          </template>
        </a-list-item>
      </a-list>
      <a-divider orientation="left">内容区域</a-divider>
      <a-list item-layout="vertical" size="large" row-key="title">
        <a-list-item>
          顶栏
          <template #actions> 是否显示顶部导航栏 </template>
          <template #extra>
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              :checked="config.headerRender === undefined"
              @change="
            (checked:any) => changeConf('headerRender', checked === true && undefined)
          "
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          页脚
          <template #actions> 是否显示底部导航栏 </template>
          <template #extra>
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              :checked="config.footerRender === undefined"
              @change="
            (checked:any) => changeConf('footerRender', checked === true && undefined)
          "
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          菜单头
          <template #actions> 是否显示左侧菜单栏顶部LOGO区域 </template>
          <template #extra>
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              :checked="config.menuHeaderRender === undefined"
              @change="
            (checked:any) => changeConf('menuHeaderRender', checked === true && undefined)
          "
            ></a-switch>
          </template>
        </a-list-item>
        <a-list-item>
          导航标签项
          <template #actions> 是否显示顶部Tab导航标签项 </template>
          <template #extra>
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              :checked="config.tabRender === undefined"
              @change="
            (checked:any) => changeConf('tabRender', checked === true && undefined)
          "
            ></a-switch>
          </template>
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>
</template>

<style scoped></style>
