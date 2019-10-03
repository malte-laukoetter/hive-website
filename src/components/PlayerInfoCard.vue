<template>
  <base-player-info-card
    :name="playerInfo.name"
    :uuid="playerInfo.uuid"
    :title="`${playerInfo.rank.colorCode}${playerInfo.rank.humanName}`"
  >
    <v-spacer></v-spacer>
    <v-col cols="6">
      <v-col cols="12" class="text-center subtitle-1">
        {{ playerInfo.firstLogin | dateFormat }}
      </v-col>
      <v-col cols="12" class="text-center subtitle-2 mt-n5">First Login</v-col>
    </v-col>
    <v-col cols="6">
      <v-col cols="12" class="text-center subtitle-1">
        {{ playerInfo.lastLogin | dateFormat }}
      </v-col>
      <v-col cols="12" class="text-center subtitle-2 mt-n5">Last Login</v-col>
    </v-col>
    <v-col cols="12" class="d-flex flex-wrap">
      <v-btn class="flex-grow-1" v-if="swarm" text :to="`/players/${swarm}`"
        >The Swarm</v-btn
      >
      <v-btn
        class="flex-grow-1"
        text
        :href="`https://hivemc.com/player/${playerInfo.uuid}`"
        >Hive Website</v-btn
      >
      <v-btn
        class="flex-grow-1"
        text
        :href="`https://namemc.com/profile/${playerInfo.uuid}`"
        >NameMc</v-btn
      >
    </v-col>
  </base-player-info-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PlayerInfo, TheSwarmAchievement } from "hive-api/dist/hive.min.js";
import "../components/uuid-format.js";
import "mc-format";
import MinecraftAvatar from "../components/MinecraftAvatar.vue";
import BasePlayerInfoCard from "../components/BasePlayerInfoCard.vue";

@Component({
  components: {
    MinecraftAvatar,
    BasePlayerInfoCard
  }
})
export default class PlayerInfoCard extends Vue {
  @Prop({ type: Object })
  private playerInfo!: PlayerInfo;

  get swarm() {
    const swarmAchievement = this.playerInfo.achievements.find(
      achievement => achievement.id === "THESWARM"
    );

    if (!swarmAchievement || !(swarmAchievement instanceof TheSwarmAchievement))
      return false;

    if (!swarmAchievement.theSwarmFrom) return false;

    return swarmAchievement.theSwarmFrom.uuid;
  }
}
</script>
