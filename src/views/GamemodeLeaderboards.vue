<template>
  <hive-app :name="$route.meta.title">
    <template #navigation>
      <hive-app-bar-extended>
        <v-tab
          :to="`/leaderboard/${gameType.id}`"
          v-for="gameType in supportedGameTypes"
          :key="gameType.id"
        >
          {{ gameType.name }}
        </v-tab>
      </hive-app-bar-extended>
    </template>

    <div class="full-height">
      <router-view></router-view>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LoadingCircular from "@/components/LoadingCircular.vue";
import TimelineChart from "@/components/TimelineChart.vue";
import PlayerInfoCard from "@/components/PlayerInfoCard.vue";
import CountCard from "@/components/CountCard.vue";
import ScrollableChart from "@/components/ScrollableChart.vue";
import BarChart from "@/components/BarChart.vue";
import PlayerInfo from "@/views/PlayerInfo.vue";
import HiveAppBarExtended from "@/components/HiveAppBarExtended.vue";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
@Component({
  components: {
    LoadingCircular,
    ScrollableChart,
    TimelineChart,
    PlayerInfoCard,
    CountCard,
    BarChart,
    HiveAppBarExtended,
    PlayerInfo
  }
})
export default class GamemodeLeaderboards extends Vue {
  @Prop({ type: String })
  readonly game!: string;

  private supportedGameTypes = [
    GameTypes.DR,
    GameTypes.GRAV,

    GameTypes.HIDE,

    GameTypes.BED,
    GameTypes.SKY,
    GameTypes.GNT,
    GameTypes.GNTM,

    GameTypes.TIMV,
    GameTypes.MIMV,

    GameTypes.BP,
    GameTypes.DRAW,

    GameTypes.SG,
    GameTypes.SGN,
    GameTypes.HERO,

    GameTypes.SP,
    GameTypes.CAI,
    GameTypes.LAB,
    GameTypes.HB,

    GameTypes.BD,
    GameTypes.CR,
    GameTypes.EF,
    GameTypes.MM,
    GameTypes.OITC,
    GameTypes.RR,
    GameTypes.SLAP,
    GameTypes.SPL
  ];

  private player: HivePlayer | null = null;
  private playerInfo: HivePlayerInfo | null = null;

  /*async fetchData(): Promise<void> {
    if (this.uuid == null) return;

    this.player = new HivePlayer(this.uuid);
    this.playerInfo = await this.player.info();
  }

  @Watch("uuid", { immediate: true })
  onUuidChange() {
    this.fetchData();
  }*/
}
</script>
