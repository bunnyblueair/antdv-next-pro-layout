<script setup lang="ts">
import {
  GithubOutlined,
  SettingOutlined,
  LogoutOutlined,
  BgColorsOutlined,
} from "@ant-design/icons-vue";
import { changePrimaryColor, getLocalColor } from "@/hooks/useTheme";
import type { MenuInfo } from "ant-design-vue/es/menu/src/interface";

const props = defineProps({
  /**用户名 */
  name: {
    type: String,
    default: "ProLayout",
  },
});

/**头像展开项点击 */
function fnClick({ key }: MenuInfo) {
  switch (key) {
    case "settings":
      break;
    case "profile":
      break;
    case "logout":
      break;
  }
}
</script>

<template>
  <a-space :size="12" align="center">
    <a-tooltip>
      <template #title>开源仓库</template>
      <a-button
        type="text"
        style="color: inherit"
        href="https://gitee.com/TsMask"
        target="_blank"
      >
        <template #icon>
          <GithubOutlined />
        </template>
      </a-button>
    </a-tooltip>

    <a-tooltip>
      <template #title>改变颜色</template>
      <a-button
        type="text"
        style="color: inherit"
        @click="changePrimaryColor()"
      >
        <template #icon>
          <BgColorsOutlined :style="{ color: getLocalColor() }" />
        </template>
      </a-button>
    </a-tooltip>

    <a-dropdown placement="bottomRight" :trigger="['click', 'hover']">
      <a-space :size="8" align="start">
        <a-avatar
          shape="circle"
          size="default"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="头像"
        ></a-avatar>
        <span class="nick"> {{ props.name }} </span>
      </a-space>
      <template #overlay>
        <a-menu @click="fnClick">
          <a-menu-item key="settings">
            <template #icon>
              <SettingOutlined />
            </template>
            <span>个人设置</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout">
            <template #icon>
              <LogoutOutlined />
            </template>
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-space>
</template>
