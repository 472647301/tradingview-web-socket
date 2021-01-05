<template>
  <div class="header" :style="{ height: height + 'px' }">
    <button
      v-for="item in symbolList"
      :key="item.symbol"
      :class="item.symbol === symbol ? 'secondary' : 'primary'"
      @click="$emit('onClick', item)"
    >
      {{ item["base-currency"].toLocaleUpperCase() }}/{{
        item["quote-currency"].toLocaleUpperCase()
      }}
    </button>
  </div>
</template>

<script>
export default {
  name: "KLineHeader",
  props: {
    symbol: String,
    symbolList: Array,
  },
  data() {
    return {
      height: window.innerHeight,
    };
  },
};
</script>