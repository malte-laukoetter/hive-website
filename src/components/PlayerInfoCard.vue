<template>
  <hive-base-player-info-card
    :name="playerInfo.name"
    :uuid="playerInfo.uuid"
    :title="`${playerInfo.rank.colorCode}${playerInfo.rank.humanName}`"
  >
    <v-spacer></v-spacer>
    <v-col cols="12">
      <v-col cols="12" class="text-center subtitle-1">
        {{ playerInfo.firstLogin | dateFormat }}
      </v-col>
      <v-col cols="12" class="text-center subtitle-2 mt-n5">First Login</v-col>
    </v-col>
    <v-col cols="12" class="d-flex flex-wrap">
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
  </hive-base-player-info-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PlayerInfo } from "hive-api/dist/hive.min.js";

@Component
export default class PlayerInfoCard extends Vue {
  @Prop({ type: Object })
  private playerInfo!: PlayerInfo;
}
</script>
