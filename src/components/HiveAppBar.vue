<style scoped>
.v-tabs.nav-tabs .v-tab:not(.v-tab--active):not(.v-tab--disabled) {
  color: #fff;
  opacity: 0.9;
}
</style>
<template>
  <v-app-bar
    app
    fixed
    dark
    :shrink-on-scroll="$vuetify.breakpoint.smAndUp"
    src="/img/hub.png"
    :extension-height="$vuetify.breakpoint.mdAndUp ? 48 : 0"
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

    <v-toolbar-items
      :style="{ width: $vuetify.breakpoint.xsOnly ? '100%' : 'inherit' }"
    >
      <hive-search></hive-search>
    </v-toolbar-items>

    <template v-slot:extension>
      <v-tabs
        class="nav-tabs"
        background-color="transparent"
        color="secondary"
        fixed-tabs
        v-if="$vuetify.breakpoint.mdAndUp"
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import HiveSearch from "../components/HiveSearch.vue";

@Component({
  components: {
    HiveSearch
  }
})
export default class AppBar extends Vue {}
</script>
