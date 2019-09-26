<template>
  <hive-app :name="playerInfo ? playerInfo.name : 'Player'">
    <template #navigation>
      <hive-app-bar-extended>
        <v-tab :to="`/player/${uuid}`" exact>
          General
        </v-tab>
        <v-tab :to="{name: gameType.id}" v-for="gameType in supportedGameTypes" :key="gameType.id">
          {{gameType.name}}
        </v-tab>
      </hive-app-bar-extended>
    </template>
  
    <div class="full-height">
      <loading-circular :loading="!playerInfo"></loading-circular>

      <v-row v-if="!!playerInfo">
        <v-col cols="6" sm="4" md="2">
          <count-card :count="playerInfo.tokens" title="Tokens"></count-card>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <count-card :count="playerInfo.medals" title="Medals"></count-card>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <count-card :count="0" title="Achievements"></count-card>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <count-card :count="playerInfo.trophies.length" title="Trophies"></count-card>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <count-card :count="playerInfo.crates || 0" title="Crates"></count-card>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <count-card :count="0" title="Points"></count-card>
        </v-col>

        <v-col cols="12" md="4">
          <player-info-card :player-info="playerInfo"></player-info-card>
        </v-col>
        <v-col cols="12"  md="8">
          <scrollable-chart :datasets="pointTokenDataSets" :width="5000" :height="400"></scrollable-chart>
        </v-col>
                  
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Achievements</v-card-title>
            <bar-chart :data="achievements" :labels="['Global', ...achievementLabels]" title="Achievements"></bar-chart>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Points</v-card-title>
            <bar-chart :data="points" :labels="achievementLabels" title="Points"></bar-chart>
          </v-card>
        </v-col>
              
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Achievements</v-card-title>
            <bar-chart :data="achievements" :labels="['Global', ...achievementLabels]" title="Achievements"></bar-chart>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Points</v-card-title>
            <bar-chart :data="points" :labels="achievementLabels" title="Points"></bar-chart>
          </v-card>
        </v-col>
        <v-col cols="12">
          <scrollable-chart :width="5000" :height="400"></scrollable-chart>
        </v-col>
        <v-col cols="12">
          <scrollable-chart :width="5000" :height="400"></scrollable-chart>
        </v-col>
      </v-row>

      <router-view></router-view>


  <!--    <v-card class="d-flex" style="flex-wrap: nowrap;">
        <div class="flex-grow-1 flex-shrink-0">
          <v-tabs vertical="" v-model="activeTab">
            <v-tab v-for="label in achievementLabels" :key="label">
              <v-icon left>mdi-account</v-icon>
              {{label}}
            </v-tab>
            <v-tab>
              <v-icon left>mdi-lock</v-icon>
              Option 2
            </v-tab>
            <v-tab>
              <v-icon left>mdi-access-point</v-icon>
              Option 3
            </v-tab>
          </v-tabs>
        </div>
        <div
          style="min-width: 100px; max-width: 100%;"
          class="flex-grow-0 flex-shrink-1"
        >
          <v-tabs-items v-model="activeTab" class="flex-grow-1 flex-shrink-1">
          <v-tab-item>
            <div>
              <router-view></router-view>
            </div>
          </v-tab-item>
          <v-tab-item>
  <div>
              <router-view></router-view>
            </div>        </v-tab-item>
          <v-tab-item>
  <div>
            </div>        </v-tab-item>
      </v-tabs-items>
        </div>
        
        
      </v-card>-->
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LoadingCircular from "../components/LoadingCircular.vue";
import TimelineChart from "../components/TimelineChart.vue";
import PlayerInfoCard from "../components/PlayerInfoCard.vue";
import CountCard from "../components/CountCard.vue";
import ScrollableChart from "../components/ScrollableChart.vue";
import BarChart from "../components/BarChart.vue";
import HiveAppBarExtended from "../components/HiveAppBarExtended.vue";
import { Player as HivePlayer, PlayerInfo, GameTypes } from 'hive-api'
import '../components/uuid-format.js'

@Component({
  components: {
    LoadingCircular,
    ScrollableChart,
    TimelineChart,
    PlayerInfoCard,
    CountCard,
    BarChart,
    HiveAppBarExtended
  }
})
export default class Player extends Vue {
  @Prop({type: String})
  readonly uuid!: string

  private supportedGameTypes = [GameTypes.SG, GameTypes.BP, GameTypes.CAI, GameTypes.CR, GameTypes.DR,
        GameTypes.HB, GameTypes.HERO, GameTypes.HIDE, GameTypes.OITC, GameTypes.SP, GameTypes.TIMV, GameTypes.SKY,
        GameTypes.LAB, GameTypes.DRAW, GameTypes.SLAP, GameTypes.EF, GameTypes.MM, GameTypes.GRAV, GameTypes.RR,
        GameTypes.GNT, GameTypes.GNTM, GameTypes.PMK, GameTypes.BD, GameTypes.SGN, GameTypes.SPL, GameTypes.MIMV,
        GameTypes.BED]

  private activeTab = 0

  private player: HivePlayer | null = null
  private playerInfo: PlayerInfo | null = null

  private achievementLabels = ["SKY", "TIMV", "BED", "SP", "DR", "HIDE", "BP", "global", "CAI", "MIMV", "LAB", "SG", "HB", "SPL", "OITC", "HERO", "RR", "CR"]
  private achievements = [63,63,62,45,43,42,33,32,31,27,19,18,16,16,10,8,7,2]
  private points = [1879487,600380,576330,573596,179040,106480,73590,68856,51545,47170,43840,30051,24610,16645,11628,10660,6090,5806,5170,4865,4690,2026,931,606,563,505]

  private data = []
  get pointTokenDataSets() {return [
    {
      label: 'Points',
      data: this.data.map(({x, y}) => ({x : new Date(x), y: y*2*Math.random()})),
      borderColor: this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.secondary as string : this.$vuetify.theme.themes.light.secondary as string,
    },
    {
      label: 'Tokens',
      data: this.data.map(({x, y}) => ({x : new Date(x), y}))
    },
  ]
  }

  async fetchData(): Promise<void> {
    if (this.uuid == null) return

    this.player = new HivePlayer(this.uuid);
    this.playerInfo = await this.player.info();

    this.data = await fetch('/data.json').then(res => res.json());

  }

  @Watch('uuid', {immediate: true})
  onUuidChange() {
    this.fetchData()
  }
}
</script>
