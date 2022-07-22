import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 通用字体
import "vfonts/Lato.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
