import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 全局导入 antdv-next
import Antd from "antdv-next";
import "antdv-next/dist/reset.css";

const app = createApp(App);
app.use(router);

app.use(Antd);

app.mount("#app");
