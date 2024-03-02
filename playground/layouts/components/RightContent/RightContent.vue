<script setup lang="ts">
import {
  BuildOutlined,
  GithubOutlined,
  SettingOutlined,
  LogoutOutlined,
  BgColorsOutlined,
} from "@ant-design/icons-vue";
import { changePrimaryColor, getLocalColor } from "@/hooks/useTheme";
import { MenuInfo } from "ant-design-vue/lib/menu/src/interface";
const emit = defineEmits(["drawer"]);
const props = defineProps({
  /**用户名 */
  name: {
    type: String,
    default: "",
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

/**抽屉打开 */
function fnDrawerOpen() {
  emit("drawer", true);
}
</script>

<template>
  <div style="margin-right: 12px">
    <a-space :size="12" align="center">
      <a-tooltip>
        <template #title>开源仓库</template>
        <a-button type="text" href="https://gitee.com/TsMask" target="_blank">
          <template #icon>
            <GithubOutlined />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip>
        <template #title>变更布局</template>
        <a-button type="text" @click="fnDrawerOpen()">
          <template #icon>
            <BuildOutlined />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip>
        <template #title>改变颜色</template>
        <a-button type="text" @click="changePrimaryColor()">
          <template #icon>
            <BgColorsOutlined :style="{ color: getLocalColor() }" />
          </template>
        </a-button>
      </a-tooltip>

      <a-dropdown placement="bottomRight" :trigger="['click', 'hover']">
        <div class="user">
          <a-avatar
            shape="circle"
            size="default"
            src="https://dummyimage.com/120x120"
            alt="头像"
          ></a-avatar>
          <span class="nick"> ProLayout </span>
        </div>
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
  </div>
</template>
