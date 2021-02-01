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
        <v-icon>{{ icons.mdiAccountGroup }}</v-icon>
      </v-btn>
      <v-btn to="/rankings">
        <span>Rankings</span>
        <v-icon>{{ icons.mdiFormatListNumbered }}</v-icon>
      </v-btn>
      <v-btn to="/leaderboards">
        <span>Leaderboards</span>
        <v-icon>{{ icons.mdiClipboardList }}</v-icon>
      </v-btn>
      <v-btn to="/maps">
        <span>Maps</span>
        <v-icon>{{ icons.mdiCity }}</v-icon>
      </v-btn>
      <v-btn to="/server">
        <span>Server</span>
        <v-icon>{{ icons.mdiChartHistogram }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-content>
      <v-container>
        <div class="headline font-weight-light">{{ name || $route.name }}</div>
        <hive-breadcrumb></hive-breadcrumb>
        <v-alert type="error">
          The Hive: Java Edition will be shutting down at April 15th 2021. This site will stop updating any data at a similar time. At the beginning of May 2021 all player profiles will be deleted. You can find more information about this in the forums: <a href="https://forum.hivemc.com/threads/hive-java-edition.339307/">https://forum.hivemc.com/threads/hive-java-edition.339307/</a> 
        </v-alert>
        <slot></slot>
      </v-container>
    </v-content>
    <hive-footer></hive-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  mdiAccountGroup,
  mdiCity,
  mdiChartHistogram,
  mdiClipboardList,
  mdiFormatListNumbered
} from "@mdi/js";

@Component
export default class App extends Vue {
  @Prop(String)
  readonly name: string | undefined;

  readonly icons = {
    mdiAccountGroup,
    mdiCity,
    mdiChartHistogram,
    mdiClipboardList,
    mdiFormatListNumbered
  };
}
</script>
