<style scoped>
a {
  color: inherit;
  text-decoration: inherit;
}
</style>

<template>
  <v-autocomplete
    style="margin-top: 8px"
    append-icon=""
    :append-outer-icon="mdiMagnify"
    label="Search"
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
      <router-link v-if="item.type === 'PLAYER'" :to="`/player/${item.uuid}`">
        <player-list-item
          :uuid="item.uuid"
          :name="item.name"
          hide-info-icon
        ></player-list-item>
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
import { routeConfig } from "../router";
import { RouteConfig } from "vue-router";
import PlayerListItem from "../components/PlayerListItem.vue";
import { mdiMagnify } from '@mdi/js'

function flattenRoutes(routes: RouteConfig[]) {
  const routeStack = [...routes];
  const flattenedRoutes: RouteConfig[] = [];

  while (routeStack.length > 0) {
    const route = routeStack.pop();

    if (route) {
      flattenedRoutes.push(route);

      if (route.children) {
        route.children.forEach(childRoute =>
          routeStack.push({
            ...childRoute,
            path: route.path + childRoute.path,
            name: route.name + " / " + childRoute.name
          })
        );
      }
    }
  }

  return flattenedRoutes;
}

function findInRoute(search: string, route: RouteConfig): boolean {
  if (route.path.toLowerCase().includes(search)) {
    return true;
  } else if (route.name && route.name.toLowerCase().includes(search)) {
    return true;
  }
  return false;
}

type SearchResult =
  | { type: "PAGE"; path: string; name: string }
  | { type: "PLAYER"; name: string; uuid: string };

@Component({
  components: {
    PlayerListItem
  }
})
export default class HiveSearch extends Vue {
  private search: string | SearchResult = "";
  private items: SearchResult[] = [];
  private mdiMagnify = mdiMagnify

  @Watch("search")
  async onSearchChange(search: string) {
    if (typeof search !== "string") {
      search = "";
    }
    search = search.toLowerCase();

    const routeItems: SearchResult[] = flattenRoutes(routeConfig)
      .filter(route => findInRoute(search, route))
      .map(route => ({
        path: route.path,
        name: route.name || route.path,
        type: "PAGE"
      }));

    if (search.length >= 3) {
      const res: [
        { uuid: string; name: string }[],
        { username: string; UUID: string }
      ] = await Promise.all([
        fetch(`https://api.lergin.de/hive/names/${search}`).then(res =>
          res.json()
        ),
        fetch(`https://api.hivemc.com/v1/player/${search}`)
          .then(res => res.json())
          .catch(err => ({}))
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
        this.$router.push(`/player/${selectedItem.uuid}`);
        break;
    }
  }
}
</script>
