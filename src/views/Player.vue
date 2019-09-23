<style scoped>
  .full-height {
    height: 100%;
  }
</style>

<template>
  <div class="full-height">
    <span>{{uuid}}</span>
    <loading-circular :loading="!playerInfo"></loading-circular>

    <v-row v-if="!!playerInfo">
      <v-col cols="12">
        <span>{{playerInfo.rank.humanName}}</span>
        <span>{{playerInfo.tokens}}</span>
        <span>{{playerInfo.name}}</span>
      </v-col>

      <v-col cols="12">
        <scrollable-chart :width="5000" :height="400"></scrollable-chart>
      </v-col>
      <v-col cols="12">
        <scrollable-chart :width="5000" :height="400"></scrollable-chart>
      </v-col>
      <v-col cols="12">
        <scrollable-chart :width="5000" :height="400"></scrollable-chart>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LoadingCircular from "../components/LoadingCircular.vue";
import TimelineChart from "../components/TimelineChart.vue";
import ScrollableChart from "../components/ScrollableChart.vue";
import { Player as HivePlayer, PlayerInfo } from 'hive-api'

@Component({
  components: {
    LoadingCircular,
    ScrollableChart,
    TimelineChart
  }
})
export default class Player extends Vue {
  @Prop({type: String})
  readonly uuid!: string

  private player: HivePlayer | null = null
  private playerInfo: PlayerInfo | null = null

  async fetchData(): Promise<void> {
    if (this.uuid == null) return

    console.log(this.uuid)

    this.player = new HivePlayer(this.uuid);
    this.playerInfo = await this.player.info();

    this.playerInfo.tokens
  }

  @Watch('uuid', {immediate: true})
  onUuidChange() {
    this.fetchData()
  }
}
</script>
