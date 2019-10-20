import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import MainPage from "@/components/MainPage";
import DatePage from "@/components/DatePage";
import UserPage from "@/components/UserPage";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Buefy);

const routes = [
  { path: '/', component: MainPage },
  { path: '/date/:id', component: DatePage },
  { path: '/user/:id', component: UserPage },
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
