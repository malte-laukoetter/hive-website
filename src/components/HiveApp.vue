<style scoped>
.container {
  max-width: 1265px;
  height: 100%;
}
</style>

<template>
  <v-app>
    <slot name="navigation">
      <hive-app-bar></hive-app-bar>
    </slot>

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
        <div class="headline font-weight-light">{{ name || $route.name }}</div>
        <hive-breadcrumb></hive-breadcrumb>
        <slot></slot>
      </v-container>
    </v-content>

    <hive-footer></hive-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import HiveAppBar from "./HiveAppBar.vue";

@Component({
  components: {
    HiveAppBar
  }
})
export default class HiveApp extends Vue {
  @Prop(String)
  readonly name: string | undefined;
}
</script>
