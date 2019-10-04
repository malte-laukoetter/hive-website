<style scoped>
.v-tabs.nav-tabs .v-tab:not(.v-tab--active):not(.v-tab--disabled) {
  color: #fff;
  opacity: 0.9;
}
.v-toolbar__title {
  font-family: "Roboto Slab", serif;
}
.v-toolbar__title a {
  color: inherit;
  text-decoration: inherit;
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
    v-scroll="updateSearchIsSolo"
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
      ></v-img>
    </template>

    <v-toolbar-title class="ml-6" v-if="$vuetify.breakpoint.smAndUp">
      <router-link to="/">
        <span>Hive Statistics</span>
      </router-link>
    </v-toolbar-title>

    <v-btn icon class="mr-1" v-if="$vuetify.breakpoint.xsOnly">
      <v-icon>{{ mdiHome }}</v-icon>
    </v-btn>

    <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>

    <v-toolbar-items
      :style="{ width: $vuetify.breakpoint.xsOnly ? '100%' : '50%' }"
    >
      <hive-search :solo="searchIsSolo"></hive-search>
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
        <v-tab to="/team" class="font-weight-bold">
          Team Changes
        </v-tab>
        <v-tab to="/maps" class="font-weight-bold">
          Maps
        </v-tab>
        <v-tab to="/server" class="font-weight-bold">
          Server Statistics
        </v-tab>
        <v-tab to="/players" class="font-weight-bold">
          Player Statistics
        </v-tab>
        <v-tab to="/leaderboards" class="font-weight-bold">
          Gamemode Leaderboards
        </v-tab>
        <v-tab to="/rankings" class="font-weight-bold">
          Rankings
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import HiveSearch from "../components/HiveSearch.vue";
import { mdiHome } from "@mdi/js";

@Component({
  components: {
    HiveSearch
  }
})
export default class AppBar extends Vue {
  private mdiHome = mdiHome;

  private searchIsSolo: boolean = false;

  mounted() {
    this.searchIsSolo = this.$vuetify.breakpoint.smAndUp;
  }

  updateSearchIsSolo() {
    this.searchIsSolo =
      window.scrollY === 0 && this.$vuetify.breakpoint.smAndUp;
  }
}
</script>
