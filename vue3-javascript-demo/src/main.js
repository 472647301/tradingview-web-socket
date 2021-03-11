import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus, { i18n } from './plugins/element'
import './styles/reset.css'

const app = createApp(App)
installElementPlus(app)
app.use(router).use(i18n).mount('#app')
