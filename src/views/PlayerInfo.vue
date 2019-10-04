<template>
  <div>
    <loading-circular :loading="loading"></loading-circular>

    <no-data-banner :value="!loading && !playerInfo"></no-data-banner>

    <v-row v-if="!loading && !!playerInfo">
      <v-col cols="6" sm="4" md="2">
        <count-card :count="playerInfo.tokens" title="Tokens"></count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <count-card :count="playerInfo.medals" title="Medals"></count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <count-card :count="achievements" title="Achievements"></count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <count-card
          :count="playerInfo.trophies.length"
          title="Trophies"
        ></count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <count-card :count="playerInfo.crates || 0" title="Crates"></count-card>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <count-card :count="totalPoints" title="Points"></count-card>
      </v-col>

      <v-col cols="12" md="4">
        <player-info-card :player-info="playerInfo"></player-info-card>
      </v-col>
      <v-col cols="12" md="8">
        <player-stat-line-chart
          :uuid="uuid"
          title="Points & Tokens"
          :properties="['points/total', 'tokens']"
          :labels="['Points', 'Tokens']"
        ></player-stat-line-chart>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Achievements</v-card-title>
          <player-stat-bar-chart
            :uuid="uuid"
            title="Achievements"
            property="achievements"
          ></player-stat-bar-chart>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Points</v-card-title>
          <player-stat-bar-chart
            :uuid="uuid"
            title="Points"
            property="points"
          ></player-stat-bar-chart>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <achievement-list
          :achievements="achievementList"
          title="Global Achievements"
        ></achievement-list>
      </v-col>

      <v-col cols="12" md="4">
        <player-stat-line-chart
          :uuid="uuid"
          title="Medals"
          :properties="['medals']"
          :labels="['Medals']"
        ></player-stat-line-chart>
      </v-col>

      <v-col cols="12" md="4">
        <player-stat-line-chart
          :uuid="uuid"
          title="Achievements"
          :properties="['achievements/total']"
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
import BarChart from "@/components/BarChart.vue";
import HiveAppBarExtended from "@/components/HiveAppBarExtended.vue";
import PlayerStatBarChart from "@/components/PlayerStatBarChart.vue";
import PlayerStatLineChart from "@/components/PlayerStatLineChart.vue";
import AchievementList from "@/components/AchievementList.vue";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes,
  Server,
  AchievementInfo,
  Achievement,
  ServerAchievement
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
    NoDataBanner,
    PlayerStatBarChart,
    PlayerStatLineChart,
    AchievementList
  }
})
export default class PlayerInfo extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;

  private player: HivePlayer | null = null;
  private playerInfo: HivePlayerInfo | null = null;
  private totalPoints: number | string = "?";
  private achievements: number | string = "?";
  private globalAchievements: AchievementInfo[] = [];
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
  onUuidChange(newUuid: string, oldUuid: string) {
    const db = firebase.database();
    if (oldUuid) {
      const oldPlayerDataRef = db
        .ref("playerStats")
        .child("data")
        .child(this.uuid)
        .child("data");
      oldPlayerDataRef
        .child("points")
        .child("total")
        .off("value");
      oldPlayerDataRef
        .child("achievements")
        .child("total")
        .off("value");
    }

    this.fetchData();
    const playerDataRef = db
      .ref("playerStats")
      .child("data")
      .child(this.uuid)
      .child("data");
    playerDataRef
      .child("points")
      .child("total")
      .on("value", snapshot => {
        this.totalPoints = snapshot.val();
      });
    playerDataRef
      .child("achievements")
      .child("total")
      .on("value", snapshot => {
        this.achievements = snapshot.val();
      });
  }

  mounted() {
    this.fetchGlobalAchievements();
  }

  async fetchGlobalAchievements() {
    this.globalAchievements = await Server.achievements();
  }

  get achievementList(): Achievement[] {
    if (!this.playerInfo) return [];
    return [
      ...this.playerInfo.achievements,
      ...this.globalAchievements
        .filter(
          a => !this.playerInfo!.achievements.find(({ id }) => id == a.id)
        )
        .map(a => new ServerAchievement(a.id, 0, new Date(0)))
    ];
  }
}
</script>
