<style scoped>
.v-list {
  height: 417px;
  overflow-x: auto;
}
</style>

<template>
  <v-card>
    <v-card-title>
      <span>{{ title }}</span>
      <span class="subtitle-1 ml-2"
        >{{ achievements.filter(a => a.unlocked).length }} /
        {{ achievements.length }}</span
      >
    </v-card-title>
    <v-list three-line subheader>
      <template v-for="achievement of achievements">
        <achievement-list-item
          :key="achievement.id"
          :achievement="achievement"
        ></achievement-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Achievement } from "hive-api/dist/hive.min.js";
import AchievementListItem from "@/components/AchievementListItem.vue";

@Component({
  components: {
    AchievementListItem
  }
})
export default class LeaderboardCard extends Vue {
  @Prop({ type: Array, default: () => [] })
  readonly achievements!: Achievement[];

  @Prop({ type: String, default: "Achievements" })
  readonly title!: string;
}
</script>
