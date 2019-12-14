<style scoped>
a {
  color: inherit;
  text-decoration: inherit;
}

.v-autocomplete >>> .v-input__icon--append .v-icon {
  transform: none !important;
}
</style>

<template>
  <v-autocomplete
    :solo="solo"
    flat
    :light="solo && !$vuetify.theme.dark"
    style="margin-top: 8px; width: 100%"
    :append-icon="mdiMagnify"
    label="Search for a player or leaderboard"
    auto-select-first
    no-filter
    clearable
    hide-details
    return-object
    item-text="name"
    :items="items"
    :search-input.sync="search"
    @change="goToPath"
  >
    <template v-slot:item="{ item }">
      <router-link v-if="item.type === 'PLAYER'" :to="`/players/${item.uuid}`">
        <hive-player-list-item
          :uuid="item.uuid"
          :name="item.name"
          hide-info-icon
        ></hive-player-list-item>
      </router-link>
      <template v-if="item.type === 'PAGE'">
        <router-link :to="item.path">
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.path"></v-list-item-subtitle>
          </v-list-item-content>
        </router-link>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import { mdiMagnify } from "@mdi/js";
import { GameTypes, GameType } from "hive-api/dist/hive.min.js";
import { leaderboards } from "@/router";
import gamemodeConfigs from "@/gamemodesConfig";

type PageSearchResult = { type: "PAGE"; path: string; name: string };

type SearchResult =
  | PageSearchResult
  | { type: "PLAYER"; name: string; uuid: string };

const pageSearchResults: PageSearchResult[] = [
  {
    type: "PAGE",
    path: "/",
    name: "Home"
  },
  {
    type: "PAGE",
    path: "/team",
    name: "Team Changes"
  },
  {
    type: "PAGE",
    path: "/maps",
    name: "Maps"
  },
  {
    type: "PAGE",
    path: "/server",
    name: "Server Statistics"
  },
  {
    type: "PAGE",
    path: "/faq",
    name: "FAQ"
  },
  {
    type: "PAGE",
    path: "/ranks",
    name: "Ranks"
  },
  {
    type: "PAGE",
    path: "/rankings",
    name: "Rankings"
  },/*
  ... leaderboards.map(
    leaderboard =>
      ({
        type: "PAGE",
        path: `/rankings/${leaderboard.href}`,
        name: leaderboard.title
      } as PageSearchResult)
  ),*/
  ... Object.keys(gamemodeConfigs).map(
    type =>
      ({
        type: "PAGE",
        path: `/leaderboards/${type}`,
        name: `${
          ((GameTypes as any) as { [key: string]: GameType })[type].name
        } Leaderboard`
      } as PageSearchResult)
  )
];

function findInRoute(search: string, route: PageSearchResult): boolean {
  if (route.path.toLowerCase().includes(search)) {
    return true;
  } else if (route.name && route.name.toLowerCase().includes(search)) {
    return true;
  }
  return false;
}

@Component
export default class Search extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly solo!: boolean;
  private search: string | SearchResult = "";
  private items: SearchResult[] = [];
  private mdiMagnify = mdiMagnify;

  @Watch("search")
  async onSearchChange(search: string) {
    if (typeof search !== "string") {
      search = "";
    }
    search = search.toLowerCase();

    const routeItems: SearchResult[] = pageSearchResults.filter(route =>
      findInRoute(search, route)
    );

    if (search) {
      const res: [
        { uuid: string; name: string }[],
        { username: string; UUID: string }
      ] = await Promise.all([
        fetch(`https://api.lergin.de/hive/names/${search}`).then(res =>
          res.json()
        ),
        search.length > 3
          ? fetch(`https://api.hivemc.com/v1/player/${search}`)
              .then(res => res.json())
              .catch(err => ({}))
          : {}
      ]);

      const playerItems: SearchResult[] = res[0]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ uuid, name }) => ({ type: "PLAYER", uuid, name }));

      if (res[1].username) {
        playerItems.unshift({
          name: res[1].username,
          uuid: res[1].UUID,
          type: "PLAYER"
        });
      }

      this.items = [...routeItems, ...playerItems];
    } else {
      this.items = routeItems;
    }
  }

  goToPath(selectedItem: SearchResult | undefined) {
    if (!selectedItem) return;

    switch (selectedItem.type) {
      case "PAGE":
        this.$router.push(selectedItem.path);
        break;
      case "PLAYER":
        this.$router.push(`/players/${selectedItem.uuid}`);
        break;
    }
  }
}
</script>
