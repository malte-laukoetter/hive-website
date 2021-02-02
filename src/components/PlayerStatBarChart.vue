<template>
  <div>
    <hive-loading-circular :loading="loading"></hive-loading-circular>
    <span
      class="ma-2"
      v-if="!loading && (data.length === 0 || data[0].length === 0)"
      >No data collected so far... Please come back later :)</span
    >

    <hive-bar-chart
      v-if="!loading && !(data.length === 0 || data[0].length === 0)"
      :data="data"
      :labels="labels"
      :title="title"
    ></hive-bar-chart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  GameType
} from "hive-api/dist/hive.min.js";

@Component
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
      const snapshot = await fetch(`/api/firebase/playerStats/data`).then(data => data.json());
      const dataObject: { [key: string]: number } = snapshot[this.property];

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
