<script setup lang="ts">
import { computed, type PropType } from "vue";
import {
  CheckOutlined,
  CopyOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import { message, theme } from "ant-design-vue";
import {
  ConfigType,
  changePrimaryColor,
  getContentStyle,
  themeConfig,
} from "@/hooks/useTheme";
import { viewTransitionTheme, defaultSettings } from "antdv-pro-layout";
import "./SettingDrawer.css";

const emit = defineEmits(["update:open", "update:config", "close"]);
const props = defineProps({
  open: { type: Boolean, required: true },
  config: { type: Object as PropType<ConfigType>, required: true },
});

// antd reset.css 不会给 body 设置文字色，纯文本（如菜单风格等 label）需绑定 token 才能明暗自适应
const { token: themeToken } = theme.useToken();

/** 主题色列表（对齐 React colorList） */
const colorList = [
  { key: "techBlue", color: "#1677FF", title: "科技蓝（默认）" },
  { key: "daybreak", color: "#1890ff", title: "拂晓蓝" },
  { key: "dust", color: "#F5222D", title: "薄暮" },
  { key: "volcano", color: "#FA541C", title: "火山" },
  { key: "sunset", color: "#FAAD14", title: "日暮" },
  { key: "cyan", color: "#13C2C2", title: "明青" },
  { key: "green", color: "#52C41A", title: "极光绿" },
  { key: "geekblue", color: "#2F54EB", title: "极客蓝" },
  { key: "purple", color: "#722ED1", title: "酱紫" },
];

const navThemeList = [
  { key: "light", title: "亮色菜单风格" },
  { key: "realDark", title: "暗色菜单风格" },
];
const menuThemeList = [
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
];

const layoutList = [
  { key: "side", title: "侧边菜单布局" },
  { key: "top", title: "顶部菜单布局" },
  { key: "mix", title: "混合菜单布局" },
];
const siderMenuTypeList = [
  { key: "sub", title: "经典模式" },
  { key: "group", title: "分组模式" },
];
const regionalList = [
  { key: "header", title: "顶栏" },
  { key: "tab", title: "标签页" },
  { key: "footer", title: "页脚" },
  { key: "menu", title: "菜单" },
  { key: "menuHeader", title: "菜单头" },
];

const currentColor = computed(() =>
  (themeConfig.token?.colorPrimary || "").toLowerCase(),
);

/** 修改配置（对齐 React changeSetting，含联动） */
function changeSetting(key: string, value: any) {
  const config: any = { ...props.config };
  config[key] = value;
  // 联动逻辑（对齐 React）
  if (key === "layout") {
    config.contentWidth = value === "top" ? "Fixed" : "Fluid";
    if (value !== "mix") config.splitMenus = false;
  }
  if (key === "navTheme") {
    if (value === "realDark") {
      config.menuTheme = "dark";
      config.theme = "dark";
    } else {
      config.menuTheme = "light";
      config.theme = "light";
    }
  }
  // keep contentStyle in sync with layout / contentWidth
  if (key === "layout" || key === "contentWidth") {
    config.contentStyle = getContentStyle(config.layout, config.contentWidth);
  }
  emit("update:config", config);
}

function regionalChecked(key: string) {
  const v = (props.config as any)[key + "Render"];
  return v || v === undefined;
}
function changeRegional(key: string, checked: boolean) {
  changeSetting(key + "Render", checked === true ? undefined : false);
}

/** toggle nav theme with a View Transitions circular reveal */
function onNavThemeChange(key: string, e: MouseEvent) {
  if (key === props.config.navTheme) return;
  viewTransitionTheme(() => {
    changeSetting("navTheme", key);
  }, e);
}

function onColor(c: string) {
  changePrimaryColor(c);
}

function copySetting() {
  const c = props.config;
  // build JSON based on the real layout component defaultSettings (PureSettings),
  // overridden by the current drawer config (not the React ProSettings shape)
  const settings = {
    ...defaultSettings,
    theme: c.theme,
    menuTheme: c.menuTheme,
    layout: c.layout,
    fixedHeader: c.fixedHeader,
    fixSiderbar: c.fixSiderbar,
    splitMenus: c.splitMenus,
    siderMenuType: c.siderMenuType,
  };
  const json = JSON.stringify(settings, null, 2);
  try {
    navigator.clipboard?.writeText(json);
    message.success("拷贝成功，请到配置文件中替换默认配置");
  } catch (e) {
    // ignore
  }
}
</script>

<template>
  <a-drawer
    :open="open"
    placement="right"
    :closable="false"
    :width="300"
    @close="() => emit('close', false)"
  >
    <div class="sd-content" :style="{ color: themeToken.colorText }">
      <!-- 整体风格设置 -->
      <div class="sd-body">
        <a-typography-title :level="5">整体风格设置</a-typography-title>
        <div class="sd-block-checkbox">
          <a-tooltip
            v-for="item in navThemeList"
            :key="item.key"
            :title="item.title"
          >
            <div
              class="sd-block-checkbox-item"
              :class="{ active: config.navTheme === item.key }"
              @click="onNavThemeChange(item.key, $event)"
            >
              <CheckOutlined
                v-if="config.navTheme === item.key"
                class="sd-block-checkbox-selectIcon"
              />
              <div class="sd-mini" :class="'sd-mini--' + item.key">
                <span class="sd-mini__sider"></span>
                <span class="sd-mini__body"></span>
              </div>
            </div>
          </a-tooltip>
        </div>
        <div class="sd-row">
          <span>菜单风格</span>
          <a-segmented
            :value="config.menuTheme"
            :options="menuThemeList"
            size="small"
            @change="(v: any) => changeSetting('menuTheme', v)"
          />
        </div>
      </div>

      <!-- 主题色 -->
      <div class="sd-body">
        <a-typography-title :level="5">主题色</a-typography-title>
        <div class="sd-theme-color">
          <a-tooltip v-for="c in colorList" :key="c.key" :title="c.title">
            <div
              class="sd-theme-color-block"
              :style="{ backgroundColor: c.color }"
              @click="onColor(c.color)"
            >
              <CheckOutlined v-if="currentColor === c.color.toLowerCase()" />
            </div>
          </a-tooltip>
        </div>
      </div>

      <a-divider />

      <!-- 导航模式 -->
      <div class="sd-body">
        <a-typography-title :level="5">导航模式</a-typography-title>
        <div class="sd-block-checkbox">
          <a-tooltip
            v-for="item in layoutList"
            :key="item.key"
            :title="item.title"
          >
            <div
              class="sd-block-checkbox-item"
              :class="{ active: config.layout === item.key }"
              @click="changeSetting('layout', item.key)"
            >
              <CheckOutlined
                v-if="config.layout === item.key"
                class="sd-block-checkbox-selectIcon"
              />
              <div class="sd-mini" :class="'sd-mini--' + item.key">
                <span class="sd-mini__sider"></span>
                <span class="sd-mini__body"
                  ><span class="sd-mini__head"></span
                ></span>
              </div>
            </div>
          </a-tooltip>
        </div>
      </div>

      <!-- 侧边菜单类型（仅 side/mix） -->
      <div
        class="sd-body"
        v-if="config.layout === 'side' || config.layout === 'mix'"
      >
        <a-typography-title :level="5">侧边菜单类型</a-typography-title>
        <div class="sd-block-checkbox">
          <a-tooltip
            v-for="item in siderMenuTypeList"
            :key="item.key"
            :title="item.title"
          >
            <div
              class="sd-block-checkbox-item"
              :class="{ active: config.siderMenuType === item.key }"
              @click="changeSetting('siderMenuType', item.key)"
            >
              <CheckOutlined
                v-if="config.siderMenuType === item.key"
                class="sd-block-checkbox-selectIcon"
              />
              <div class="sd-mini" :class="'sd-mini--' + item.key">
                <span
                  class="sd-line"
                  :class="
                    item.key === 'sub'
                      ? 'sd-line--parent'
                      : 'sd-line--grouptitle'
                  "
                ></span>
                <span class="sd-line sd-line--child"></span>
                <span class="sd-line sd-line--child"></span>
              </div>
            </div>
          </a-tooltip>
        </div>
      </div>

      <!-- 布局设置 -->
      <div class="sd-body">
        <a-typography-title :level="5">布局设置</a-typography-title>
        <a-list class="sd-list" :split="false" size="small">
          <a-list-item>
            <span>内容区域宽度</span>
            <template #extra>
              <a-select
                size="small"
                style="width: 80px"
                :value="config.contentWidth"
                @change="(v: any) => changeSetting('contentWidth', v)"
              >
                <a-select-option v-if="config.layout !== 'side'" value="Fixed"
                  >定宽</a-select-option
                >
                <a-select-option value="Fluid">流式</a-select-option>
              </a-select>
            </template>
          </a-list-item>
          <a-list-item>
            <span>固定 Header</span>
            <template #extra>
              <a-switch
                size="small"
                :checked="config.fixedHeader"
                @change="(c: boolean) => changeSetting('fixedHeader', c)"
              />
            </template>
          </a-list-item>
          <a-list-item>
            <span :style="{ opacity: config.layout === 'top' ? 0.5 : 1 }"
              >固定侧边菜单</span
            >
            <template #extra>
              <a-tooltip
                :title="config.layout === 'top' ? '侧边菜单布局时可配置' : ''"
                placement="left"
              >
                <a-switch
                  size="small"
                  :disabled="config.layout === 'top'"
                  :checked="config.fixSiderbar"
                  @change="(c: boolean) => changeSetting('fixSiderbar', c)"
                />
              </a-tooltip>
            </template>
          </a-list-item>
          <a-list-item>
            <span :style="{ opacity: config.layout !== 'mix' ? 0.5 : 1 }"
              >自动分割菜单</span
            >
            <template #extra>
              <a-switch
                size="small"
                :disabled="config.layout !== 'mix'"
                :checked="config.splitMenus"
                @change="(c: boolean) => changeSetting('splitMenus', c)"
              />
            </template>
          </a-list-item>
        </a-list>
      </div>

      <a-divider />

      <!-- 内容区域 -->
      <div class="sd-body">
        <a-typography-title :level="5">内容区域</a-typography-title>
        <a-list class="sd-list" :split="false" size="small">
          <a-list-item v-for="r in regionalList" :key="r.key">
            <span>{{ r.title }}</span>
            <template #extra>
              <a-switch
                size="small"
                :checked="regionalChecked(r.key)"
                @change="(c: boolean) => changeRegional(r.key, c)"
              />
            </template>
          </a-list-item>
        </a-list>
      </div>

      <a-divider />

      <a-alert type="warning" show-icon style="margin-block-end: 16px">
        <template #icon><NotificationOutlined /></template>
        <template #message
          >配置栏在开发环境用于预览，生产环境视情况使用，请拷贝后手动修改配置文件</template
        >
      </a-alert>

      <a-button block style="margin-block-end: 24px" @click="copySetting">
        <template #icon><CopyOutlined /></template>
        拷贝设置
      </a-button>
    </div>
  </a-drawer>
</template>

<style scoped></style>
