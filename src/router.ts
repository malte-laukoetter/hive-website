import Vue from "vue";
import Router, { RouteConfig, RawLocation } from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const breadcrumb: {
  [key: string]: {
    text: string,
    disabled?: boolean
    link?: boolean
    exact?: boolean
    to?: RawLocation
    href?: string
  }
} = {
  home: {
    text: 'Home',
    exact: true,
    to: { name: 'Home' }
  },
  leaderboard: {
    text: 'Leaderboards',
    exact: true,
    to: { name: 'Leaderboards' }
  }
}

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/team",
    name: "Team Changes",
    meta: {
      breadcrumbs: [
        breadcrumb.home
      ]
    },
    component: () => import(/* webpackChunkName: "teamChanges" */ "./views/TeamChanges.vue")
  },
  {
    path: "/maps",
    name: "Maps",
    component: Home,
    meta: {
      breadcrumbs: [
        breadcrumb.home
      ]
    },
  },
  {
    path: "/player",
    name: "Player Statistics",
    component: Home,
    meta: {
      breadcrumbs: [
        breadcrumb.home
      ]
    },
  },
  {
    path: "/leaderboard",
    name: "Leaderboards",
    meta: {
      breadcrumbs: [
        breadcrumb.home
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboards" */ "./views/Leaderboards.vue")
  },
  {
    path: '/leaderboard/medals',
    name: 'Medal Leaderboard',
    props: {
      title: 'Medal Leaderboard',
      id: 'medal',
      propertyTitle: 'Gold Medals'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  }, {
    path: '/leaderboard/kills',
    name: 'Kill Leaderboard',
    props: {
      title: 'Kill Leaderboard',
      id: 'totalkills',
      propertyTitle: 'Kills'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  }, {
    path: '/leaderboard/points',
    name: 'Point Leaderboard',
    props: {
      title: 'Point Leaderboard',
      id: 'totalpoints',
      propertyTitle: 'Points'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  }, {
    path: '/leaderboard/achievements',
    name: 'Achievement Leaderboard',
    props: {
      title: 'Achievement Leaderboard',
      id: 'achievement',
      propertyTitle: 'Achievements'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  }, {
    path: '/leaderboard/tokens',
    name: 'Token Leaderboard',
    props: {
      title: 'Token Leaderboard',
      id: 'token',
      propertyTitle: 'Tokens'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  }, {
    path: '/leaderboard/hide',
    name: 'Hide Block Level Leaderboard',
    props: {
      title: 'Hide Block Level Leaderboard',
      id: 'hide_blocklevels',
      propertyTitle: 'Block Levels'
    },
    meta: {
      breadcrumbs: [
        breadcrumb.home,
        breadcrumb.leaderboard
      ]
    },
    component: () => import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  },
]

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routeConfig
});
