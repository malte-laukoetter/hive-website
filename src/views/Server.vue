<template>
  <hive-app>
    <div class="full-height">
        <v-row>
            <v-col cols="12" md="12">
                <server-unique-player-line-chart></server-unique-player-line-chart>
            </v-col>
            <v-col cols="12" md="6" v-for="gameType of Object.keys(data)" :key="gameType">
                <stat-line-chart :height="200" :data="[toChartData(data[gameType])]" :title="`Unique Players - ${GameTypes[gameType].name}`" :labels="['Players']" :loading="loading"></stat-line-chart>
            </v-col>
        </v-row>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { GameTypes } from 'hive-api/dist/hive.min.js'
import ServerUniquePlayerLineChart from "@/components/ServerUniquePlayerLineChart.vue";
import StatLineChart from "@/components/StatLineChart.vue"

@Component({
  components: {
    ServerUniquePlayerLineChart,
    StatLineChart
  },
  metaInfo: {
    title: 'Server'
  }
})
export default class Server extends Vue {
  private loading: boolean = true;

  private data: {[key: string]: {[key: string]: number}} = {}
  private GameTypes = GameTypes

  async fetchData(): Promise<void> {
    this.data = await fetch('https://api.lergin.de/hive/gamemodePlayersAll').then(res => res.json())
  }

  private toChartData(data: {[key: string]: number}): {x: number, y: number}[] {
    return Object.entries(data)
        .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
  }

  async mounted() {
    this.loading = true
    try {
      await this.fetchData()
    } catch {
    } finally {
      this.loading = false;
    }
  }
}
</script>
