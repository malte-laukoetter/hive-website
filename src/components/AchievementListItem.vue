<template>
  <v-list-item v-if="achievement && achievementInfo">
    <v-list-item-icon>
      <v-progress-circular
        :color="inProgress ? 'warning' : 'success'"
        :value="(100 * achievement.progress) / achievementInfo.stages"
      ></v-progress-circular>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{
        achievementInfo.name ? achievementInfo.name : achievement.id
      }}</v-list-item-title>
      <v-list-item-subtitle v-if="achievement.unlocked">
        <span class="grey--text text--darken-3 font-weight-medium">{{
          achievement.unlockedAt | toLocaleString
        }}</span>
        - {{ achievementInfo.description }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else-if="inProgress">
        <span class="grey--text text--darken-3 font-weight-medium"
          >{{ achievement.progress | toLocaleString }} /
          {{ achievementInfo.stages | toLocaleString }}</span
        >
        - {{ achievementInfo.description }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else>
        <span class="grey--text text--darken-3 font-weight-medium"
          >Unstarted</span
        >
        - {{ achievementInfo.description }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Achievement, AchievementInfo } from "hive-api/dist/hive.min.js";
import { mdiProgressWrench, mdiLock, mdiLockOpen } from "@mdi/js";

@Component({
  components: {}
})
export default class LeaderboardCard extends Vue {
  @Prop({ type: Object })
  readonly achievement!: Achievement;

  private achievementInfo: AchievementInfo | null = null;

  @Watch("achievement", { immediate: true })
  async onAchievementChange() {
    this.achievementInfo = await this.achievement.info();

    this.achievementInfo.stages;
  }

  get inProgress() {
    return this.achievement.progress > 1 && !this.achievement.unlocked;
  }

  get icon() {
    if (this.achievement.unlocked) {
      return mdiLockOpen;
    } else {
      return mdiLock;
    }
  }
}
</script>
