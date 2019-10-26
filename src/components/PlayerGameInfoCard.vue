<template>
  <hive-base-player-info-card
    :name="name"
    :uuid="uuid"
    :title="`${loadingTitle ? 'Loading...' : title ? title.mcFormatName : ''}`"
  >
    <v-col cols="12" class="subtitle-2 text-center">{{
      requiredPointsTitle
    }}</v-col>
    <v-spacer></v-spacer>
    <v-col
      :cols="Math.floor(12 / dates.length)"
      v-for="date in dates"
      :key="date.title"
    >
      <v-col cols="12" class="text-center subtitle-1">
        {{ playerGameInfo[date.prop] | dateFormat }}
      </v-col>
      <v-col cols="12" class="text-center subtitle-1 mt-n5">{{
        date.title
      }}</v-col>
    </v-col>
  </hive-base-player-info-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  PlayerGameInfo,
  PlayerInfo,
  GameTitle
} from "hive-api/dist/hive.min.js";
import gameModeConfigs from "@/gamemodesConfig";

@Component
export default class PlayerGameInfoCard extends Vue {
  @Prop({ type: String })
  private name!: string;
  @Prop({ type: String })
  private uuid!: string;
  @Prop({ type: Object })
  private playerGameInfo!: PlayerGameInfo;

  private title: GameTitle | null = null;
  private nextTitle: GameTitle | null = null;
  private loadingTitle = true;

  @Watch("playerGameInfo", { immediate: true })
  async onPlayerGameInfoChange() {
    this.loadingTitle = true;
    this.title = await this.playerGameInfo.currentTitle();
    if (this.title) {
      this.nextTitle = await this.title.next();
    }
    this.loadingTitle = false;
  }

  get requiredPointsTitle(): string {
    if (!this.title) return "";

    const minPoints = this.title.requiredPoints;

    if (minPoints === -1) return "Top Player";

    if (!this.nextTitle) {
      return `after ${minPoints.toLocaleString()} Points`;
    }

    const maxPoints = this.nextTitle.requiredPoints;

    return `${minPoints.toLocaleString()} - ${maxPoints.toLocaleString()} Points`;
  }

  get dates() {
    return gameModeConfigs[this.playerGameInfo.type.id].logins;
  }
}
</script>
