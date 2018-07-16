<template>
  <div class="trade">
    <trader-view ref="tv"></trader-view>
  </div>
</template>

<script>
import traderView from '@/components/TraderView'
export default {
  components: {
    traderView
  },
  mounted() {
    this.$refs.tv.init()
  }
}
</script>

