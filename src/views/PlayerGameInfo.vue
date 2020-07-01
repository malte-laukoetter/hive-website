<template>
  <div>
    <hive-loading-circular :loading="loading"></hive-loading-circular>

    <hive-no-data-banner
      :value="!loading && (!playerGameInfo || playerGameInfo.points === 0)"
    ></hive-no-data-banner>

    <v-row v-if="!loading && playerGameInfo && playerGameInfo.points !== 0">
      <v-col cols="12" md="4">
        <hive-player-game-info-card
          :name="playerInfo.name"
          :uuid="playerInfo.uuid"
          :playerGameInfo="playerGameInfo"
        ></hive-player-game-info-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col cols="6" sm="4" md="4" v-for="stat in stats" :key="stat.title">
            <hive-count-card
              :count="stat.func(playerGameInfo[stat.prop])"
              :title="stat.title"
            ></hive-count-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" :md="12">
        <hive-player-stat-line-chart
          :uuid="uuid"
          title="Points"
          :properties="[`points/${game}`]"
          :labels="['Points']"
        ></hive-player-stat-line-chart>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo,
  PlayerGameInfo as HivePlayerGameInfo,
  GameTypes,
  GameType,
  AchievementInfo,
  Achievement,
  GameAchievement,
  PlayerGameInfoAchievements
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
import gameModeConfigs from "@/gamemodesConfig";
import { MetaInfo } from "vue-meta";
import { mdiAlert } from "@mdi/js";

@Component({
  metaInfo: ((vue: PlayerGameInfo) => ({
    title: `${vue.playerInfo ? vue.playerInfo.name : vue.uuid} - ${
      (GameTypes[vue.game] as GameType).name
    }`,
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `${vue.playerInfo ? vue.playerInfo.name : vue.uuid} - ${
          (GameTypes[vue.game] as GameType).name
        }`
      }
    ]
  })) as () => MetaInfo
})
export default class PlayerGameInfo extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;
  @Prop({ type: String })
  readonly game!: keyof GameTypes;

  private player: HivePlayer | null = null;
  private playerInfo: PlayerInfo | null = null;
  private playerGameInfo: HivePlayerGameInfo | null = null;

  private loading: boolean = true;
  private mdiAlert = mdiAlert;

  get stats() {
    return gameModeConfigs[this.game].stats;
  }

  async fetchData(): Promise<void> {
    if (this.uuid == null) return;
    this.loading = true;

    this.player = new HivePlayer(this.uuid);
    const gameType: GameType = GameTypes[this.game];

    try {
      const [playerGameInfo, playerInfo] = await Promise.all([
        this.player.gameInfo(gameType),
        this.player.info()
      ]);
      this.playerInfo = playerInfo;
      this.playerGameInfo = playerGameInfo;
    } catch {
      this.playerInfo = null;
      this.playerGameInfo = null;
    } finally {
      this.loading = false;
    }
  }

  @Watch("uuid", { immediate: true })
  @Watch("game", { immediate: false })
  onUuidChange() {
    this.fetchData();
  }
}
</script>
