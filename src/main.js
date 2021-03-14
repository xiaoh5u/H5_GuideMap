import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Popup, Slider } from 'vant';
import mitt from 'mitt';
const app = createApp(App);

//eventbus
app.config.globalProperties.$bus = new mitt();
app .use(router) .use(Popup) .use(Slider) .mount('#app');
