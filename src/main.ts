import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/performance";
import HiveBreadcrumb from "./components/HiveBreadcrumb.vue";
import HiveFooter from "./components/HiveFooter.vue";
import HiveApp from "./components/HiveApp.vue";
import VueMeta from "vue-meta";
import {Methods} from 'hive-api/dist/hive.min.js'

if(location.hostname !== "localhost") {
  Methods.BASE_URL = () => '/api/hive'
}

import "./assets/style.css";

const firebaseConfig = {
  apiKey: "AIzaSyBPl570AoqaHuCgX342wICImCJbz4c3vFs",
  authDomain: "hivewebsite-1da4d.firebaseapp.com",
  databaseURL: "https://hivewebsite-1da4d.firebaseio.com",
  projectId: "hivewebsite-1da4d",
  storageBucket: "hivewebsite-1da4d.appspot.com",
  messagingSenderId: "836246928386",
  appId: "1:836246928386:web:ec67fdff6c8f63c6aebb1b",
  measurementId: "G-YNMZTKC3VM"
};

firebase.initializeApp(firebaseConfig);
;(window as any).__cmp('getGooglePersonalization', function(consent: any, success: boolean) {
  if(success && consent.googlePersonalizationData.consentValue) {
    firebase.performance()
  }
});

Vue.config.productionTip = false;

Vue.component("hive-breadcrumb", HiveBreadcrumb);
Vue.component("hive-footer", HiveFooter);
Vue.component("hive-app", HiveApp);
Vue.use(VueMeta);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");

router.afterEach(async (to) => {
  await Vue.nextTick()
  ;(window as any).gtag('config', 'UA-60277501-8', { 'anonymize_ip': true, 'page_path': to.fullPath});
})

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
