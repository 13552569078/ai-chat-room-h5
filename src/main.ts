import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VConsole from 'vconsole';

import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
import './assets/styles/index.scss';
// import 'amfe-flexible';

if (process.env.NODE_ENV === 'development') {
  // const vConsole = new VConsole();
}

const app = createApp(App);

app.use(store).use(router)
  .mount('#app');
