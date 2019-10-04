<template>
  <div>
    <loading-circular :loading="loading"></loading-circular>

    <bar-chart
      v-if="!loading"
      :data="data"
      :labels="labels"
      :title="title"
    ></bar-chart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
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
import * as firebase from "firebase/app";
import "firebase/database";

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
export default class PlayerStatBarChart extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;
  @Prop(String)
  readonly property!: string;
  @Prop(String)
  readonly title!: string;

  private loading: boolean = true;

  private labels: string[] = [];
  private data: number[] = [];

  async fetchData(): Promise<void> {
    if (this.uuid == null) return;

    this.loading = true;
    try {
      const db = firebase.database();

      const snapshot = await db
        .ref("playerStats")
        .child("data")
        .child(this.uuid)
        .child("data")
        .child(this.property)
        .once("value");
      const dataObject: { [key: string]: number } = await snapshot.val();
      const data = Object.entries(dataObject)
        .filter(([key, value]) => key !== "total")
        .sort(([key, value], [key2, value2]) => value2 - value);

      this.data = data.map(([key, value]) => value);
      this.labels = data.map(([key, value]) => {
        if (key === "global") return "Global";
        return ((GameTypes as any) as { [key: string]: GameType })[key].name;
      });
    } catch (e) {
      console.debug(e);
    } finally {
      this.loading = false;
    }
  }

  @Watch("uuid", { immediate: true })
  @Watch("property")
  onUuidChange() {
    this.fetchData();
  }
}
</script>
