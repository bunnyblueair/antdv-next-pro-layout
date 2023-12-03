<template>
  <PageContainer
    title="Version"
    sub-title="show current project dependencies"
    :ghost="false"
    :avatar="{
      src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
    }"
    :breadcrumb="{ routes }"
    @back="
      () => {
        console.log(1);
      }
    "
  >
    <template #content>
      <strong>Content Area</strong>
    </template>
    <template #extra>
      <strong>Extra Area</strong>
    </template>
    <template #tags>
      <a-tag>Tag1</a-tag>
      <a-tag color="pink">Tag2</a-tag>
    </template>
    <template #footer>
      <a-tabs>
        <a-tab-pane key="1" tab="Details" />
        <a-tab-pane key="2" tab="Rule" />
      </a-tabs>
    </template>

    <a-card title="Info">
      <p v-for="i in list" :key="i">
        text block...
        <a-tag>{{ i }}</a-tag>
      </p>
    </a-card>
  </PageContainer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PageContainer } from "antdv-pro-layout";

const list = ref<number>(50);

const routes = [
  {
    path: "index",
    breadcrumbName: "First-level Menu",
  },
  {
    path: "first",
    breadcrumbName: "Second-level Menu",
  },
  {
    path: "second",
    breadcrumbName: "Third-level Menu",
  },
];
</script>
