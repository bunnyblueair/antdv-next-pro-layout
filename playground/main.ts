import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 全局导入antd
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// pro-layout 布局
import ProLayout, { PageContainer } from 'antdv-pro-layout';
import 'antdv-pro-layout/style.less';

const app = createApp(App);
app.use(router);

app.use(Antd);
app.use(ProLayout).use(PageContainer);

app.mount('#app');
