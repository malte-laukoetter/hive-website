<template>
  <div>
    <hive-scrollable-chart
      ref="chart"
      :datasets="dataSets"
      :width="chartWidth"
      :height="height"
      :loading="loading || data.length === 0 || data[0].length === 0"
    >
      <template #header>
        <v-card-title>{{ title }}</v-card-title>
      </template>
      <hive-loading-circular :loading="loading"></hive-loading-circular>
      <span
        class="ma-2"
        v-if="!loading && (data.length === 0 || data[0].length === 0)"
        >No data collected so far... Please come back later :)</span
      >
    </hive-scrollable-chart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  GameType
} from "hive-api/dist/hive.min.js";
import * as firebase from "firebase/app";
import "firebase/database";

@Component
export default class StatLineChart extends Vue {
  @Prop(Array)
  readonly data!: { x: number; y: number }[][];
  @Prop(Array)
  readonly labels!: string[];
  @Prop(String)
  readonly title!: string;
  @Prop({ type: Number, default: 400 })
  readonly height!: number;

  @Ref("chart")
  readonly chart!: HTMLElement;

  @Prop({ type: Boolean, default: true })
  private loading!: boolean;

  get chartWidth() {
    const dateDifference = this.data
      .filter(data => data.length > 0)
      .map(data => data[data.length - 1].x - data[0].x)
      .sort()[0];
    const size = dateDifference
      ? Math.floor(dateDifference / 30_000_000)
      : 1500;

    return Math.max(size, 1500);
  }

  get dataSets() {
    return this.data.map((data, index) => ({
      label: this.labels[index],
      data: data.map(({ x, y }) => ({
        x: new Date(x),
        y: y
      })),
      borderColor:
        index % 2 === 1
          ? this.$vuetify.theme.dark
            ? (this.$vuetify.theme.themes.dark.secondary as string)
            : (this.$vuetify.theme.themes.light.secondary as string)
          : undefined
    }));
  }

  @Watch("data", { immediate: true })
  async onUuidChange() {
    setTimeout(() => {
      (this.chart as any).redraw();
    }, 500);
  }
}
</script>
