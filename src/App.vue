<template>
  <v-app>
    <v-app-bar
      app
      fixed
      dark
      shrink-on-scroll
      src="/img/hub.png"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Hive Statistics</v-toolbar-title>

      <v-spacer></v-spacer>

      <hive-search></hive-search>

      <v-navigation-drawer v-model="drawer" app v-if="$vuetify.breakpoint.smAndDown">
        <v-list-item>
          Medals
        </v-list-item>
        <v-list-item>
          Achievements
        </v-list-item>
        <v-list-item>
          Points
        </v-list-item>
        <v-list-item>
          Tokens
        </v-list-item>
        <v-list-item>
          Kills
        </v-list-item>
        <v-list-item>
          Hide'n'Seek Block Levels
        </v-list-item>
      </v-navigation-drawer>

      <template v-slot:extension v-if="$vuetify.breakpoint.mdAndUp">
        <v-tabs
          v-model="currentItem"
          background-color="transparent"
          fixed-tabs
          slider-color="white"
        >
          <v-tab to="team">
            Team Changes
          </v-tab>
          <v-tab to="maps">
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
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-tab
                v-on="on"
              >
                Leaderboards
                <v-icon right>mdi-menu-down</v-icon>
              </v-tab>
            </template>
            <v-list>
              <v-list-item>
                Medals
              </v-list-item>
              <v-list-item>
                Achievements
              </v-list-item>
              <v-list-item>
                Points
              </v-list-item>
              <v-list-item>
                Tokens
              </v-list-item>
              <v-list-item>
                Kills
              </v-list-item>
              <v-list-item>
                Hide'n'Seek Block Levels
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content >
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import HiveSearch from './components/HiveSearch.vue'

export default Vue.extend({
  name: "App",
  components: {
    HiveSearch
  },
  data: () => ({
    drawer: false
    //
  })
});
</script>
