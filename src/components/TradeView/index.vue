<template>
  <div id="tv_chart_container">
  </div>
</template>

<script>
import Tv from './script'
export default {
  mounted() {
    Tv.init({ symbol: 'AA', interval: '1D' })
    // 开启交易面板
    const eventList = [
      { name: 'init', price: undefined },
      { name: 'setBuy', price: 478 },
      { name: 'setSell', price: 358 },
      { name: 'setSpread', price: 120 }
    ]
    setTimeout(() => {
      eventList.forEach(elm => {
        frames[0].window.postMessage({ eventType: elm.name, value: elm.price }, '*')
      })
    }, 300)
  }
}
</script>

<style scoped>
#tv_chart_container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

