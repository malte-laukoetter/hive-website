<template>
  <hive-stat-line-chart
    :data="[data]"
    title="Unique Players - Server"
    :labels="['Players']"
    :loading="loading"
  ></hive-stat-line-chart>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";

@Component
export default class ServerUniquePlayerLineChart extends Vue {
  private loading: boolean = true;

  private data: { x: number; y: number }[] = [];

  async fetchData(): Promise<void> {
    const dataObject: { [key: string]: number } = await fetch(
      "https://api.lergin.de/hive/uniqueplayers"
    ).then(res => res.json());
    const data = Object.entries(dataObject);

    this.data = data.map(([key, value]) => ({
      x: parseInt(key, 10),
      y: value
    }));

    return;
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
