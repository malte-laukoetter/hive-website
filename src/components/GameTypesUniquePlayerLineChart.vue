<template>
  <stat-line-chart :data="data" title="Unique Players / Gamemode" :labels="labels" :loading="loading"></stat-line-chart>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import StatLineChart from "@/components/StatLineChart.vue"
import { GameTypes, GameType } from 'hive-api';

@Component({
  components: {
    StatLineChart
  }
})
export default class ServerUniquePlayerLineChart extends Vue {
  private loading: boolean = true;

  private data: {x: number, y: number}[][] = []
  private labels: string[] = []

  async fetchData(): Promise<void> {
    const dataObject: {[key: string]: {[key: string]: number}} = await fetch('https://api.lergin.de/hive/gamemodePlayersAll').then(res => res.json())
    const data = Object.values(dataObject)
      .map(data =>
        Object.entries(data)
          .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
      )
    const labels = Object.keys(dataObject).map((gameType: string) => (GameTypes[gameType as keyof GameTypes] as GameType).name)

    this.data = data

    return
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
