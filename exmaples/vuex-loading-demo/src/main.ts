import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import GsUI from './gsui-2.3.1/gs-ui';

console.log(GsUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
