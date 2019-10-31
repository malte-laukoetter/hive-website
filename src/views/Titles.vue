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
    title: "Titles",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Hive Gamemode Titles`
      }
    ]
  }
})
export default class Titles extends Vue {
  supportedGameTypes: GameType[] = [
    /*GameTypes.SG,*/ GameTypes.BP,
    GameTypes.CAI,
    GameTypes.CR,
    GameTypes.DR,
    GameTypes.HB,
    /*GameTypes.HERO,*/ GameTypes.HIDE,
    GameTypes.OITC,
    GameTypes.SP,
    GameTypes.TIMV,
    GameTypes.SKY,
    GameTypes.LAB,
    GameTypes.DRAW,
    GameTypes.SLAP,
    GameTypes.EF,
    GameTypes.MM,
    GameTypes.GRAV,
    GameTypes.RR,
    GameTypes.GNT,
    GameTypes.GNTM,
    GameTypes.PMK,
    GameTypes.BD,
    /*GameTypes.SGN,*/ GameTypes.SPL,
    GameTypes.MIMV,
    GameTypes.BED,
    /*GameTypes.SURV,*/ GameTypes.EE /*, GameTypes.SHU*/
  ];
}
</script>
