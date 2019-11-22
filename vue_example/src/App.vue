<template>
  <div id="app">
    <div id="tv_chart_container"></div>
  </div>
</template>

<script lang="ts">
import KlineChart from "./mixins/KlineChart";
import Component, { mixins } from "vue-class-component";

@Component({
  components: {
    KlineChart
  }
})
class App extends mixins(KlineChart) {}
export default App;
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
