<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <n-config-provider :theme-overrides="{ common: { fontWeightStrong: '600' } }">
    <RouterView />
  </n-config-provider>
</template>
