<script setup lang="ts">
import { toRefs, type PropType, computed } from "vue";
import type { SymbolList } from "@/types";

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  symbolList: {
    type: Array as PropType<SymbolList>,
    required: true,
  },
});

const { symbol, symbolList } = toRefs(props);

const emit = defineEmits(["symbolHanlder"]);

const changeHallder = (e: Event) => emit("symbolHanlder", e);
const options = computed(() => {
  return symbolList.value.map((item) => {
    return {
      label: item.pair,
      value: `${item["base-currency"]} ${item["quote-currency"]}`,
    };
  });
});
</script>

<template>
  <n-page-header>
    <n-select
      v-model:value="symbol"
      @update:value="changeHallder"
      :options="options"
    />
  </n-page-header>
</template>
