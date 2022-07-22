<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import KLineHeader from "@/components/KLineHeader.vue";
import KLineWidget from "@/components/KLineWidget.vue";
import { getSymbols } from "@/api";
import { ws } from "@/utils/socket";
import type { SymbolList } from "@/types";

const symbolList = ref<SymbolList>([]);
const symbol = ref("");
const symbolInfo = ref({});
const kLineRef = ref(null) as Ref<typeof KLineWidget | null>;
onMounted(async () => {
  ws.initWebSocket();
  const result = await getSymbols();
  if (result instanceof Array) {
    const [list, symbolData] = result;
    symbolList.value = list;
    symbol.value = symbolData;
    symbolInfo.value = list[0];
  }
});
const symbolHanlder = (e: string) => {
  symbol.value = e;
};
</script>

<template>
  <KLineHeader
    v-if="symbolList"
    :symbol="symbol"
    :symbolList="symbolList"
    @symbolHanlder="symbolHanlder"
  />
  <KLineWidget
    v-if="symbol"
    :symbolInfo="symbolInfo"
    :symbol="symbol.toLocaleUpperCase()"
    ref="kLineRef"
  />
</template>
