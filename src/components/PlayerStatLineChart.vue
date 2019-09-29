<template>
  <div>

    <scrollable-chart
      ref="chart"
      :datasets="dataSets"
      :width="chartWidth"
      :height="400"
    >
      <template #header><v-card-title>{{title}}</v-card-title></template>
      <loading-circular :loading="loading"></loading-circular>    
    </scrollable-chart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingCircular from "@/components/LoadingCircular.vue";
import TimelineChart from "@/components/TimelineChart.vue";
import PlayerInfoCard from "@/components/PlayerInfoCard.vue";
import CountCard from "@/components/CountCard.vue";
import ScrollableChart from "@/components/ScrollableChart.vue";
import BarChart from "@/components/BarChart.vue";
import HiveAppBarExtended from "@/components/HiveAppBarExtended.vue";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  GameType
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
import NoDataBanner from "@/components/NoDataBanner.vue";
import * as firebase from 'firebase/app'
import 'firebase/database'

@Component({
  components: {
    LoadingCircular,
    ScrollableChart,
    TimelineChart,
    PlayerInfoCard,
    CountCard,
    BarChart,
    HiveAppBarExtended,
    NoDataBanner
  }
})
export default class PlayerStatLineChart extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;
  @Prop(Array)
  readonly properties!: string[]
  @Prop(Array)
  readonly labels!: string[]
  @Prop(String)
  readonly title!: string

  @Ref('chart')
  readonly chart!: HTMLElement

  private loading: boolean = true;

  private data: {[key: string]: {x: number, y: number}[]} = {}

  get chartWidth() {
    const dateDifference = Object.values(this.data).map(data => data[data.length - 1].x - data[0].x).sort()[0]
    const size = dateDifference ? Math.floor(dateDifference / 30_000_000) : 1000

    return Math.max(size, 800)
  }

  get dataSets() {
    return Object.entries(this.data).map(([property, data], index) =>
      ({
        label: this.labels[this.properties.indexOf(property)],
        data: data.map(({ x, y }) => ({
          x: new Date(x),
          y: y
        })),
        borderColor: index % 2 === 1 ? ( this.$vuetify.theme.dark
          ? (this.$vuetify.theme.themes.dark.secondary as string)
          : (this.$vuetify.theme.themes.light.secondary as string)): undefined
      }))
  }

  async fetchData(property: string): Promise<void> {
    const db = firebase.database()

    const snapshot = await db.ref('playerStats').child('data').child(this.uuid).child(property).once('value')
    const dataObject: {[key: string]: number} = await snapshot.val()
    const data = Object.entries(dataObject)

    this.$set(this.data, property, data.map(([key, value]) => ({x: parseInt(key, 10), y: value})))

    return
  }

  @Watch("uuid", { immediate: true })
  @Watch("property")
  async onUuidChange() {
    if (this.uuid == null) return;
      this.loading = true
    try {
      await Promise.all(this.properties.map(property => this.fetchData(property)))
      
      setTimeout(() => {
        ;(this.chart as any).redraw()
      }, 500)
    } catch {
    } finally {
      this.loading = false;
    }
  }
}
</script>
