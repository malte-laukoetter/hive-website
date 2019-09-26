<style scoped>
  .v-card {
    height: calc(100% - 64px);
    margin-top: 64px
  }

  .col.avatar {
    margin-top: -80px
  }

  mc-format {
    --mc-format-e: #e3b207;
  }
</style>

<template>
  <v-card>
    <v-container class="full-height">
      <v-row class="full-height" dense>
        <v-col cols="12" class="d-flex avatar">
          <minecraft-avatar class="elevation-2 mx-auto" :size="128" :uuid="playerInfo.uuid" :name="playerInfo.name"></minecraft-avatar>
        </v-col>
        <v-col cols="12" class="headline text-center">{{playerInfo.name}}</v-col>
        <v-col cols="12" class="overline text-center"><uuid-format :uuid="playerInfo.uuid"></uuid-format></v-col>
        <v-col cols="12" class="subtitle-1 text-center"><mc-format :text="`${playerInfo.rank.colorCode}${playerInfo.rank.humanName}`"></mc-format></v-col>
        <v-spacer></v-spacer>
        <v-col cols="6">
          <v-col cols="12" class="text-center subtitle-1">
            {{playerInfo.firstLogin | dateFormat}}
          </v-col>
          <v-col cols="12" class="text-center subtitle-2 mt-n5">First Login</v-col>
        </v-col>
        <v-col cols="6">
          <v-col cols="12" class="text-center subtitle-1">
            {{playerInfo.lastLogin | dateFormat}}
          </v-col>
          <v-col cols="12" class="text-center subtitle-2 mt-n5">Last Login</v-col>
        </v-col>
        <v-col cols="12" class="d-flex flex-wrap">
          <v-btn class="flex-grow-1" v-if="swarm" text :to="`/player/${swarm}`">The Swarm</v-btn>
          <v-btn class="flex-grow-1" text :href="`https://hivemc.com/player/${playerInfo.uuid}`">Hive Website</v-btn>
          <v-btn class="flex-grow-1" text :href="`https://namemc.com/profile/${playerInfo.uuid}`">NameMc</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PlayerInfo, TheSwarmAchievement } from 'hive-api'
import '../components/uuid-format.js'
import 'mc-format'
import MinecraftAvatar from '../components/MinecraftAvatar.vue';

@Component({
  components: {
    MinecraftAvatar
  }
})
export default class PlayerInfoCard extends Vue {
  @Prop({type: Object})
  private playerInfo!: PlayerInfo

  get swarm() {
    const swarmAchievement = this.playerInfo.achievements.find(achievement => achievement.id === 'THESWARM')

    if (!swarmAchievement || !(swarmAchievement instanceof TheSwarmAchievement)) return false

    if (!swarmAchievement.theSwarmFrom) return false

    return swarmAchievement.theSwarmFrom.uuid
  }
}
</script>
