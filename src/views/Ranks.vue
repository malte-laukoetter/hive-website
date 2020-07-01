<template>
  <hive-app>
    <div class="full-height">
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="type in supportedGameTypes" :key="type.id">
          <v-expansion-panel-header>
            <span class="subtitle-1 ml-2">{{ type.name }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <hive-title-list :game-type="type.id"></hive-title-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { GameTypes, GameType } from "hive-api/dist/hive.min.js";

@Component({
  metaInfo: {
    title: "Ranks",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Hive Gamemode Ranks`
      }
    ]
  }
})
export default class Ranks extends Vue {
  supportedGameTypes: GameType[] = [
    GameTypes.BP,
    GameTypes.DR,
    GameTypes.HIDE,
    GameTypes.SP,
    GameTypes.TIMV,
    GameTypes.SKY,
    GameTypes.DRAW,
    GameTypes.GRAV,
    GameTypes.BED,
    GameTypes.SHU
  ];
}
</script>
