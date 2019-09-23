import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");

Vue.filter('toLocaleString', function (value: any) {
  if (!value) return ''
  if (!value.toLocaleString) return value

  return value.toLocaleString()
})
