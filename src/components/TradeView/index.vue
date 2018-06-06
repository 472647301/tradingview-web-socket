<template>
  <div id="tv_chart_container"></div>
</template>

<script>
import Tv from './script'
export default {
  mounted() {
    Tv.init('APPLD', '30')
  }
}
</script>
