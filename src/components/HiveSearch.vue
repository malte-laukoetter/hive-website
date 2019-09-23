<template>
  <v-autocomplete
    style="margin-top: 8px"
    append-icon=""
    append-outer-icon="mdi-magnify"
    label="Search"

    auto-select-first
    no-filter
    clearable
    hide-details

    item-text="name"

    :items="items"
    :search-input.sync="search"

    @input="goToPath"
    >
    <template v-slot:item="{ item }">
      <player-list-item
        v-if="item.type === 'PLAYER'"
        :uuid="item.name"
        :name="item.name"
        hide-info-icon
      ></player-list-item>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {routeConfig} from '../router'
import { RouteConfig } from 'vue-router';
import PlayerListItem from "../components/PlayerListItem.vue";

function flattenRoutes(routes: RouteConfig[]) {
  const routeStack = [... routes]
  const flattenedRoutes: RouteConfig[] = []

  while (routeStack.length > 0) {
    const route = routeStack.pop()

    if(route) {
      flattenedRoutes.push(route)

      if (route.children) {
        route.children.forEach(childRoute => routeStack.push({
          ... childRoute,
          path: route.path + childRoute.path,
          name: route.name + ' / ' + childRoute.name,
        }))
      }
    }
  }
  
  return flattenedRoutes
}

function findInRoute(search: string, route: RouteConfig): boolean {
  if (route.path.toLowerCase().includes(search)) {
    return true
  } else if (route.name && route.name.toLowerCase().includes(search)) {
    return true
  }
  return false
}

type SearchResult =  {type: "PAGE", path: string, name: string} | {type: 'PLAYER', name: string, uuid: string}

@Component({
  components: {
    PlayerListItem
  }
})
export default class HiveSearch extends Vue {
  private search: string | SearchResult = ''

  get items () {
    let search = ''
    if (typeof this.search === 'string') {
      search = this.search
    }
    search = search.toLowerCase()

    const results: SearchResult[] = []

    flattenRoutes(routeConfig)
      .filter(route => findInRoute(search, route))
      .forEach(route => results.push({path: route.path, name: route.name || route.path, type: 'PAGE'}))

    if (search.length >= 3) {
      results.push({type: 'PLAYER', name: search, uuid: search})
    }

    return results
  }

  goToPath(selectedItem: SearchResult | undefined) {
    if (!selectedItem) return

    switch(selectedItem.type) {
      case "PAGE":
        this.$router.push(selectedItem.path)
        break
    }
  }
}

</script>
