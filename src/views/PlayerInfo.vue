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
        <scrollable-chart
          :datasets="pointTokenDataSets"
          :width="5000"
          :height="400"
        ></scrollable-chart>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Achievements</v-card-title>
          <player-stat-bar-chart :uuid="uuid" title="Achievements" property="achievements"></player-stat-bar-chart>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Points</v-card-title>
          <player-stat-bar-chart :uuid="uuid" title="Points" property="points"></player-stat-bar-chart>
        </v-card>
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
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
import NoDataBanner from "@/components/NoDataBanner.vue";
import * as firebase from 'firebase/app'
import 'firebase/database'

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
    PlayerStatBarChart
  }
})
export default class PlayerInfo extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;

  private player: HivePlayer | null = null;
  private playerInfo: HivePlayerInfo | null = null;
  private totalPoints: number = 0;
  private achievements: number = 0;
  private loading: boolean = true;

  private achievementLabels = [
    "SKY",
    "TIMV",
    "BED",
    "SP",
    "DR",
    "HIDE",
    "BP",
    "global",
    "CAI",
    "MIMV",
    "LAB",
    "SG",
    "HB",
    "SPL",
    "OITC",
    "HERO",
    "RR",
    "CR"
  ];
  private points = [
    1879487,
    600380,
    576330,
    573596,
    179040,
    106480,
    73590,
    68856,
    51545,
    47170,
    43840,
    30051,
    24610,
    16645,
    11628,
    10660,
    6090,
    5806,
    5170,
    4865,
    4690,
    2026,
    931,
    606,
    563,
    505
  ];

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
      this.data = await fetch("/data.json").then(res => res.json());
      this.loading = false;
    }
  }

  @Watch("uuid", { immediate: true })
  onUuidChange(newUuid: string, oldUuid: string) {
    const db = firebase.database()
    if (oldUuid) {
      const oldPlayerDataRef = db.ref('playerStats').child('data').child(this.uuid).child('data')
      oldPlayerDataRef.child('points').child('total').off('value')
      oldPlayerDataRef.child('achievements').child('total').off('value')
    }

    this.fetchData();
    const playerDataRef = db.ref('playerStats').child('data').child(this.uuid).child('data')
    playerDataRef.child('points').child('total').on('value', (snapshot) => {
      this.totalPoints = snapshot.val()
    })
    playerDataRef.child('achievements').child('total').on('value', (snapshot) => {
      this.achievements = snapshot.val()
    })
  }
}
</script>
