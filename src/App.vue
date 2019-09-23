<style scoped>
  .v-tabs.nav-tabs .v-tab:not(.v-tab--active):not(.v-tab--disabled) {
    color: #fff;
    opacity: 0.9;
  }

  .container {
    max-width: 1265px;
    height: 100%;
  }
</style>

<template>
  <v-app>
    <v-app-bar
      app
      fixed
      dark
      :shrink-on-scroll="$vuetify.breakpoint.smAndUp"
      src="/img/hub.png"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">
        <span>Hive Statistics</span>
      </v-toolbar-title>

      <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>

      <v-toolbar-items :style="{ width: $vuetify.breakpoint.xsOnly ? '100%' : 'inherit'}">
        <hive-search ></hive-search>
      </v-toolbar-items>

      <template v-slot:extension v-if="$vuetify.breakpoint.mdAndUp">
        <v-tabs
          class="nav-tabs"
          background-color="transparent"
          color="secondary"
          fixed-tabs
          optional
        >
          <v-tab to="/team">
            Team Changes
          </v-tab>
          <v-tab to="/maps">
            Maps
          </v-tab>
          <v-tab>
            Server Statistics
          </v-tab>
          <v-tab>
            Player Statistics
          </v-tab>
          <v-tab>
            Gamemode Leaderboards
          </v-tab>
          <v-tab to="/leaderboard">
            Rankings
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-bottom-navigation app grow v-if="$vuetify.breakpoint.smAndDown">
      <v-btn to="/team">
        <span>Team</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn to="/maps">
        <span>Maps</span>
        <v-icon>mdi-city</v-icon>
      </v-btn>
      <v-btn>
        <span>Server</span>
        <v-icon>mdi-chart-histogram</v-icon>
      </v-btn>
      <v-btn>
        <span>Player</span>
        <v-icon>mdi-account-details</v-icon>
      </v-btn>
      <v-btn to="/leaderboard">
        <span>Rankings</span>
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-content>
      <v-container>
        <div class="headline font-weight-light">{{$route.name}}</div>
        <v-breadcrumbs class="pa-0 ml-2 my-2" :items="breadcrumbs"></v-breadcrumbs>

        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import HiveSearch from './components/HiveSearch.vue'

@Component({
  components: {
    HiveSearch
  }
})
export default class App extends Vue {
  name = "App"

  get breadcrumbs() {
    const metaBreadcrumbs = this.$route.meta.breadcrumbs || []
    const routeBreadcrumbs = { text: this.$route.name, to: this.$route.fullPath}

    return [... metaBreadcrumbs, routeBreadcrumbs]
  }
}
</script>
