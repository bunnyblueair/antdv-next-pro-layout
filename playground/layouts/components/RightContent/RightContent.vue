<script setup lang="ts">
import { h } from "vue";
import {
  GithubOutlined,
  SettingOutlined,
  LogoutOutlined,
  BgColorsOutlined,
} from "@antdv-next/icons";
import { changePrimaryColor, getLocalColor } from "@/hooks/useTheme";
import type { MenuProps } from "antdv-next";

type MenuInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

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

const userMenu = {
  items: [
    {
      key: "settings",
      label: "个人设置",
      icon: h(SettingOutlined),
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "退出登录",
      icon: h(LogoutOutlined),
    },
  ],
  onClick: fnClick,
};
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

    <a-dropdown
      placement="bottomRight"
      :trigger="['click', 'hover']"
      :menu="userMenu"
    >
      <a-space :size="8" align="start">
        <a-avatar
          shape="circle"
          size="default"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="头像"
        ></a-avatar>
        <span class="nick"> {{ props.name }} </span>
      </a-space>
    </a-dropdown>
  </a-space>
</template>
