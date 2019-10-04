<template>
  <div>
    <loading-circular :loading="loading"></loading-circular>

    <no-data-banner
      :value="!loading && (!playerGameInfo || playerGameInfo.points === 0)"
    ></no-data-banner>

    <v-row v-if="!loading && playerGameInfo && playerGameInfo.points !== 0">
      <v-col cols="12" md="4">
        <player-game-info-card
          :name="playerInfo.name"
          :uuid="playerInfo.uuid"
          :playerGameInfo="playerGameInfo"
        ></player-game-info-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col cols="6" sm="4" md="4" v-for="stat in stats" :key="stat.title">
            <count-card
              :count="stat.func(playerGameInfo[stat.prop])"
              :title="stat.title"
            ></count-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" :md="12">
        <player-stat-line-chart
          :uuid="uuid"
          title="Points"
          :properties="[`points/${game}`]"
          :labels="['Points']"
        ></player-stat-line-chart>
      </v-col>

      <v-col cols="12" md="4" v-if="playerGameInfo.achievements">
        <achievement-list :achievements="achievementList"></achievement-list>
      </v-col>

      <v-col cols="12" md="8" v-if="playerGameInfo.achievements">
        <player-stat-line-chart
          :uuid="uuid"
          title="Achievements"
          :properties="[`achievements/${game}`]"
          :labels="['Achievements']"
        ></player-stat-line-chart>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LoadingCircular from "@/components/LoadingCircular.vue";
import TimelineChart from "@/components/TimelineChart.vue";
import PlayerInfoCard from "@/components/PlayerInfoCard.vue";
import CountCard from "@/components/CountCard.vue";
import ScrollableChart from "@/components/ScrollableChart.vue";
import PlayerGameInfoCard from "@/components/PlayerGameInfoCard.vue";
import BarChart from "@/components/BarChart.vue";
import NoDataBanner from "@/components/NoDataBanner.vue";
import AchievementList from "@/components/AchievementList.vue";
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
import PlayerStatLineChart from "@/components/PlayerStatLineChart.vue";

@Component({
  components: {
    LoadingCircular,
    ScrollableChart,
    TimelineChart,
    PlayerInfoCard,
    CountCard,
    BarChart,
    PlayerGameInfoCard,
    NoDataBanner,
    PlayerStatLineChart,
    AchievementList
  },
  metaInfo: ((vue: PlayerGameInfo) => ({
    title: `${vue.playerInfo ? vue.playerInfo.name : vue.uuid} - ${
      (GameTypes[vue.game] as GameType).name
    }`,
    meta: [
      {
        vmid: "og:title",
        property: "og:title",
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

  private gameAchievements: AchievementInfo[] = [];

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

  @Watch("game", { immediate: true })
  async fetchAchievements() {
    this.gameAchievements = await (GameTypes[
      this.game
    ] as GameType).achievements();
  }

  get achievementList(): Achievement[] {
    if (!this.playerGameInfo || !(this.playerGameInfo as any).achievements)
      return [];

    const playerGameInfo: PlayerGameInfoAchievements = (this
      .playerGameInfo as any) as PlayerGameInfoAchievements;

    return [
      ...playerGameInfo.achievements,
      ...this.gameAchievements
        .filter(a => !playerGameInfo.achievements.find(({ id }) => id == a.id))
        .map(
          a => new GameAchievement(a.id, 0, new Date(0), GameTypes[this.game])
        )
    ];
  }
}
</script>
