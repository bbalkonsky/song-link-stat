import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import MainPage from "@/components/main-component/MainPage";
import DayPage from "@/components/day-component/DayPage";
import UserPage from "@/components/user-component/UserPage";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Buefy);

const routes = [
  { path: '/', component: MainPage },
  { path: '/day/:id', component: DayPage },
  { path: '/user/:id', component: UserPage },
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
