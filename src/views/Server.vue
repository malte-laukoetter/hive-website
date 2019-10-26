<template>
  <hive-app>
    <div class="full-height">
      <v-row>
        <v-col cols="12" md="12">
          <hive-server-unique-player-line-chart></hive-server-unique-player-line-chart>
        </v-col>
        <v-col
          cols="12"
          md="6"
          v-for="gameType of Object.keys(data)"
          :key="gameType"
        >
          <v-lazy min-height="200">
            <hive-stat-line-chart
              :height="200"
              :data="[toChartData(data[gameType])]"
              :title="`Unique Players - ${GameTypes[gameType].name}`"
              :labels="['Players']"
              :loading="loading"
            ></hive-stat-line-chart>
          </v-lazy>
        </v-col>
      </v-row>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { GameTypes } from "hive-api/dist/hive.min.js";

@Component({
  metaInfo: {
    title: "Server",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Server`
      }
    ]
  }
})
export default class Server extends Vue {
  private loading: boolean = true;

  private data: { [key: string]: { [key: string]: number } } = {};
  private GameTypes = GameTypes;

  async fetchData(): Promise<void> {
    this.data = await fetch(
      "https://api.lergin.de/hive/gamemodePlayersAll"
    ).then(res => res.json());
  }

  private toChartData(data: {
    [key: string]: number;
  }): { x: number; y: number }[] {
    return Object.entries(data).map(([key, value]) => ({
      x: parseInt(key, 10),
      y: value
    }));
  }

  async mounted() {
    this.loading = true;
    try {
      await this.fetchData();
    } catch (e) {
      console.debug(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>
