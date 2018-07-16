<template>
  <div id="app">
    <pubilc-header></pubilc-header>
    <router-view/>
  </div>
</template>

<script>
import PubilcHeader from './components/PublicHeader'
export default {
  components: {
    PubilcHeader
  },
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
