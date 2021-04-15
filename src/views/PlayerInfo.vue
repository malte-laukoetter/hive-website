<template>
  <div>
    <hive-loading-circular :loading="loading"></hive-loading-circular>

    <hive-no-data-banner :value="!loading && !playerInfo"></hive-no-data-banner>

    <v-row v-if="!loading && !!playerInfo">
      <v-col cols="6" sm="4" md="2">
        <hive-count-card
          :count="playerInfo.tokens"
          title="Tokens"
        ></hive-count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <hive-count-card
          :count="playerInfo.medals"
          title="Medals"
        ></hive-count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <hive-count-card
          :count="playerInfo.trophies.length"
          title="Trophies"
        ></hive-count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <hive-count-card
          :count="playerInfo.crates || 0"
          title="Crates"
        ></hive-count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <hive-count-card :count="totalPoints" title="Points"></hive-count-card>
      </v-col>

      <v-col cols="12" md="4">
        <hive-player-info-card
          :player-info="playerInfo"
        ></hive-player-info-card>
      </v-col>
      <v-col cols="12" md="8">
        <hive-player-stat-line-chart
          :uuid="uuid"
          title="Points & Tokens"
          :properties="['points/total', 'tokens']"
          :labels="['Points', 'Tokens']"
        ></hive-player-stat-line-chart>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Points</v-card-title>
          <hive-player-stat-bar-chart
            :uuid="uuid"
            title="Points"
            property="points"
          ></hive-player-stat-bar-chart>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <hive-player-stat-line-chart
          :uuid="uuid"
          title="Medals"
          :properties="['medals']"
          :labels="['Medals']"
        ></hive-player-stat-line-chart>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  Server
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
import NoDataBanner from "@/components/NoDataBanner.vue";

@Component
export default class PlayerInfo extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;

  private player: HivePlayer | null = null;
  private playerInfo: HivePlayerInfo | null = null;
  private totalPoints: number | string = "?";
  private loading: boolean = true;

  private data = [];
  get pointTokenDataSets() {
    return [
      {
        label: "Points",
        data: this.data.map(({ x, y }) => ({
          x: new Date(x),
          y: y * 2 * Math.random()
        })),
        borderColor: this.$vuetify.theme.dark
          ? (this.$vuetify.theme.themes.dark.secondary as string)
          : (this.$vuetify.theme.themes.light.secondary as string)
      },
      {
        label: "Tokens",
        data: this.data.map(({ x, y }) => ({ x: new Date(x), y }))
      }
    ];
  }

  async fetchData(): Promise<void> {
    if (this.uuid == null) return;

    this.loading = true;
    try {
      this.player = new HivePlayer(this.uuid);
      this.playerInfo = await this.player.info();
    } catch {
      this.playerInfo = null;
    } finally {
      this.loading = false;
    }
  }

  @Watch("uuid", { immediate: true })
  async onUuidChange(newUuid: string, oldUuid: string) {
    this.fetchData();
      
    const snapshot = await fetch(`/api/firebase/playerStats/data`).then(data => data.json());
    this.totalPoints = snapshot.points.total;
  }
}
</script>
