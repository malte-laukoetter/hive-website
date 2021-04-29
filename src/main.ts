import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import VueMeta from "vue-meta";
import { Methods } from "hive-api/dist/hive.min.js";

if (location.hostname !== "localhost") {
  Methods.BASE_URL = () => "/api/hive";
}

import "./assets/style.css";

Vue.config.productionTip = false;
Vue.use(VueMeta);

new Vue({
  router,
  vuetify,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount("#app");

Vue.filter("toLocaleString", function(value: any) {
  if (value == null) return "";
  if (!value.toLocaleString) return value;

  return value.toLocaleString();
});

Vue.filter("dateFormat", function(value: Date) {
  if (!value) return "";
  if (!value.getTime) return value;

  return value.toLocaleString(undefined, {
    hour12: false,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
});
