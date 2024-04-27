<template>
  <PageContainer>
    <a-result
      status="404"
      title="Hello World"
      sub-title="Sorry, you are not authorized to access this page."
      class="result-box"
    >
      <template #extra>
        <a-button type="primary" @click="handleClick">Back Home</a-button>
      </template>
    </a-result>
  </PageContainer>
</template>

<script lang="ts" setup>
import { PageContainer } from "antdv-pro-layout";
import { message } from "ant-design-vue/lib";

const handleClick = () => {
  console.log("info");
  message.info("Back Home Button clicked!");
};
</script>

<style scoped lang="css">
.result-box {
  height: 100%;
  background: rgb(255, 255, 255);
}
[data-theme="dark"] .result-box {
  background: #141414;
}
</style>
