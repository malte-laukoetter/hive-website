import Vue, { ComponentOptions, AsyncComponent } from "vue";
import Router, { RouteConfig, RawLocation } from "vue-router";
import Home from "./views/Home.vue";
import { GameTypes, GameType } from "hive-api/dist/hive.min.js";
import gamemodeConfigs from "./gamemodesConfig";

Vue.use(Router);

const breadcrumb: {
  [key: string]: {
    text: string;
    disabled?: boolean;
    link?: boolean;
    exact?: boolean;
    to?: RawLocation;
    href?: string;
  };
} = {
  home: {
    text: "Home",
    exact: true,
    to: { name: "Home" }
  },
  leaderboard: {
    text: "Rankings",
    exact: true,
    to: { path: "/rankings" }
  }
};

export const leaderboards: {
  title: string;
  breadcrumb: string;
  id: string;
  propertyTitle: string;
  href: string;
}[] = [
  {
    title: "Medals Ranking",
    breadcrumb: "Medals",
    id: "medal",
    propertyTitle: "Gold Medals",
    href: "medals"
  },
  {
    title: "Kills Ranking",
    breadcrumb: "Kills",
    id: "totalkills",
    propertyTitle: "Kills",
    href: "kills"
  },
  {
    title: "Points Ranking",
    breadcrumb: "Points",
    id: "totalpoints",
    propertyTitle: "Points",
    href: "points"
  },
  {
    title: "Achievements Ranking",
    breadcrumb: "Achievements",
    id: "achievement",
    propertyTitle: "Achievements",
    href: "achievements"
  },
  {
    title: "Tokens Ranking",
    breadcrumb: "Tokens",
    id: "token",
    propertyTitle: "Tokens",
    href: "tokens"
  },
  {
    title: "Hide Block Levels Ranking",
    breadcrumb: "Hide Block Levels",
    id: "hide_blocklevels",
    propertyTitle: "Block Levels",
    href: "hide_levels"
  }
];

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
      breadcrumbs: [breadcrumb.home]
    },
    component: () =>
      import(/* webpackChunkName: "teamChanges" */ "./views/TeamChanges.vue")
  },
  {
    path: "/maps",
    name: "Maps",
    component: () => import(/* webpackChunkName: "maps" */ "./views/Maps.vue"),
    meta: {
      breadcrumbs: [breadcrumb.home]
    }
  },
  {
    path: "/titles",
    name: "Titles",
    component: () =>
      import(/* webpackChunkName: "titles" */ "./views/Titles.vue"),
    meta: {
      breadcrumbs: [breadcrumb.home]
    }
  },
  {
    path: "/faq",
    name: "FAQ",
    component: () => import(/* webpackChunkName: "faq" */ "./views/Faq.vue"),
    meta: {
      breadcrumbs: [breadcrumb.home]
    }
  },
  {
    path: "/server",
    name: "Server",
    component: () =>
      import(/* webpackChunkName: "server" */ "./views/Server.vue"),
    meta: {
      breadcrumbs: [breadcrumb.home]
    }
  },
  {
    path: "/players/:uuid",
    children: [
      ...Object.keys(gamemodeConfigs).map(
        type =>
          ({
            name: type,
            path: type,
            props: route => ({
              game: type,
              ...route.params
            }),
            component: () =>
              import(
                /* webpackChunkName: "playerGameInfo" */ "./views/PlayerGameInfo.vue"
              ),
            meta: {
              breadcrumbs: (params: { uuid: string }) => [
                {
                  text: ((GameTypes as any) as { [key: string]: GameType })[
                    type
                  ].name,
                  exact: true,
                  to: `/players/${params.uuid}/${type}`
                }
              ]
            }
          } as RouteConfig)
      ),
      {
        name: "Player",
        path: "",
        props: true,
        meta: {
          breadcrumbs: () => []
        },
        component: () =>
          import(/* webpackChunkName: "playerInfo" */ "./views/PlayerInfo.vue")
      }
    ],
    props: true,
    component: () =>
      import(/* webpackChunkName: "player" */ "./views/Player.vue"),
    meta: {
      breadcrumbs: (params: { uuid: string }) => [
        breadcrumb.home,
        {
          text: "Player",
          disabled: true
        },
        {
          text: params.uuid,
          exact: true,
          to: { name: "Player", params: { uuid: params.uuid } }
        }
      ]
    }
  },
  {
    path: "/rankings",
    name: "Rankings",
    meta: {
      breadcrumbs: [breadcrumb.home]
    },
    component: () =>
      import(/* webpackChunkName: "ranking" */ "./views/Leaderboards.vue")
  },
  ...leaderboards.map(leaderboard => ({
    path: `/rankings/${leaderboard.href}`,
    name: leaderboard.title,
    props: {
      title: leaderboard.title,
      id: leaderboard.id,
      propertyTitle: leaderboard.propertyTitle
    },
    meta: {
      breadcrumbs: () => [
        breadcrumb.home,
        breadcrumb.leaderboard,
        {
          text: leaderboard.breadcrumb,
          exact: true,
          to: `/rankings/${leaderboard.href}`
        }
      ]
    },
    component: () =>
      import(/* webpackChunkName: "leaderboard" */ "./views/Leaderboard.vue")
  })),
  {
    path: "/leaderboards",
    children: [
      ...Object.keys(gamemodeConfigs).map(
        type =>
          ({
            name: `${type} Leaderboard`,
            path: `${type}/:dataDate?/:compareDate?`,
            props: route => ({
              game: type,
              ...route.params
            }),
            component: () =>
              import(
                /* webpackChunkName: "gamemodeLeaderboard" */ "./views/GamemodeLeaderboard.vue"
              ),
            meta: {
              breadcrumbs: () => [
                {
                  text: ((GameTypes as any) as { [key: string]: GameType })[
                    type
                  ].name,
                  exact: true,
                  to: `/leaderboards/${type}`
                }
              ],
              title: `${
                ((GameTypes as any) as { [key: string]: GameType })[type].name
              } Leaderboard`
            }
          } as RouteConfig)
      ),
      {
        path: "",
        redirect: { path: "HIDE" }
      }
    ],
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "gamemodeLeaderboards" */ "./views/GamemodeLeaderboards.vue"
      ),
    meta: {
      breadcrumbs: () => [
        breadcrumb.home,
        {
          text: "Gamemode Leaderboards",
          disabled: true
        }
      ]
    }
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "404" */ "./views/404.vue")
  }
];

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routeConfig
});
