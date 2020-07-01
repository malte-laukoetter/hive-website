<template>
  <hive-app :name="$route.meta.title">
    <template #navigation>
      <hive-app-bar-extended>
        <v-tab
          :to="`/leaderboards/${gameType.id}`"
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
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";

@Component
export default class GamemodeLeaderboards extends Vue {
  @Prop({ type: String })
  readonly game!: string;

  private supportedGameTypes = [
    GameTypes.DR,
    GameTypes.GRAV,

    GameTypes.HIDE,

    GameTypes.BED,
    GameTypes.SKY,

    GameTypes.TIMV,
    GameTypes.BP,
    GameTypes.DRAW,

    GameTypes.SP
  ];

  private player: HivePlayer | null = null;
  private playerInfo: HivePlayerInfo | null = null;
}
</script>
