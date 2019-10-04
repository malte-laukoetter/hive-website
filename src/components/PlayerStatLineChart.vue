<template>
  <stat-line-chart
    :data="Object.values(data)"
    :labels="labels"
    :title="title"
    :loading="loading"
  ></stat-line-chart>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  GameType
} from "hive-api/dist/hive.min.js";
import StatLineChart from "@/components/StatLineChart.vue";
import * as firebase from "firebase/app";
import "firebase/database";

@Component({
  components: {
    StatLineChart
  }
})
export default class PlayerStatLineChart extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;
  @Prop(Array)
  readonly properties!: string[];
  @Prop(Array)
  readonly labels!: string[];
  @Prop(String)
  readonly title!: string;

  private loading: boolean = true;

  private data: { [key: string]: { x: number; y: number }[] } = {};

  async fetchData(property: string): Promise<void> {
    const db = firebase.database();

    const snapshot = await db
      .ref("playerStats")
      .child("data")
      .child(this.uuid)
      .child(property)
      .once("value");
    const dataObject: { [key: string]: number } = await snapshot.val();
    const data = Object.entries(dataObject);

    this.$set(
      this.data,
      property,
      data.map(([key, value]) => ({ x: parseInt(key, 10), y: value }))
    );

    return;
  }

  @Watch("uuid", { immediate: true })
  @Watch("property")
  async onUuidChange() {
    if (this.uuid == null) return;
    this.loading = true;
    try {
      await Promise.all(
        this.properties.map(property => this.fetchData(property))
      );
    } catch (e) {
      console.debug(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>
