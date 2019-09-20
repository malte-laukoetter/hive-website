<template>
  <v-autocomplete
    style="margin-top: 8px"
    auto-select-first
    :items="items"
    :search-input.sync="search"
    label="Search"
    append-icon=""
    no-filter
    hide-details
    append-outer-icon="mdi-magnify"
    >
    <template v-slot:item="{ item }">
      <player-list-item
        v-if="item.type === 'PLAYER'"
        :uuid="item.name"
        :name="item.name"
        hide-info-icon
      ></player-list-item>
      <template v-if="item.type === 'PAGE'">
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle v-text="item.path"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
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

export default Vue.extend({
  components: {PlayerListItem},
    data: () => ({
      search: '',
    }),

    computed: {
      items () {
        const search: string = (this.search || '').toLowerCase()
        const results: SearchResult[] = []

        flattenRoutes(routeConfig)
          .filter(route => findInRoute(search, route))
          .forEach(route => results.push({path: route.path, name: route.name || route.path, type: 'PAGE'}))

        if (search.length >= 3) {
          results.push({type: 'PLAYER', name: this.search, uuid: this.search})
        }

        return results
      },
    },
 /*
    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        fetch('https://api.publicapis.org/entries')
          .then(res => res.json())
          .then(res => {
            const { count, entries } = res
            this.count = count
            this.entries = entries
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },*/
});
</script>
