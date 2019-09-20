import Vue from "vue";
import Router, { RouteConfig } from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/team",
    name: "Team Changes",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "teamChanges" */ "./views/TeamChanges.vue")
  },
  {
    path: "/maps",
    name: "Maps",
    component: Home
  },
  {
    path: "/player",
    name: "Player Statistics",
    component: Home
  },
  {
    path: "/leaderboard",
    name: "Leaderboards",
    children: [
      {
        path: '/medals',
        name: 'Medals'
      }
    ]
  },
  {
    path: "/imprint",
    name: "Imprint",
    component: Home
  },
]

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routeConfig
});
