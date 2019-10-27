<style scoped>
mc-format {
  --mc-format-e: #e3b207;
  --mc-format-f: #aaa;
}
</style>

<template>
  <div>
    <hive-loading-circular :loading="loading"></hive-loading-circular>
    <v-list two-line subheader v-if="!loading">
      <template v-for="group of titles">
        <v-divider :key="group.group"></v-divider>
        <v-subheader class="subtitle-2" :key="`${group.group}-subheader`" style="text-transform: capitalize;">{{group.group | formatGroupName}}</v-subheader>
        <v-list-item v-for="title of group.titles" :key="title.id">
          <v-list-item-content>
            <v-list-item-title><mc-format :text="title.mcFormatName"></mc-format></v-list-item-title>
            <v-list-item-subtitle v-if="!title.topRank">Starting at <span class="subtitle-2">{{title.requiredPoints | toLocaleString}}</span> points</v-list-item-subtitle>
            <v-list-item-subtitle v-if="title.topRank">Top Rank</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { GameTypes, GameType, GameTitle } from "hive-api/dist/hive.min.js";
import "mc-format";

@Component({
  filters: {
    formatGroupName: (name: string) => {
      return name.toLowerCase().replace('_', ' ')
    } 
  }
})
export default class TitleList extends Vue {
  private titles: {group: string, titles: GameTitle[]}[] = []
  private loading: boolean = true

  @Prop({ type: String, default: "BED" })
  readonly gameType!: string;

  @Watch("gameType", { immediate: true })
  async loadTitles() {
    this.loading = true
    const titles = await (GameTypes as any as {[key: string]: GameType})[this.gameType].titles()

    const groupMap = titles.reduce((acc, title) => {
      if (title.topRank) {
        acc['Top Rank'] = [title]
      } else if (title.group) {
        if (!acc[title.group]) {
          acc[title.group] = []
        }

        acc[title.group].push(title)
      } else {
        if (!acc['Ranks']) {
          acc['Ranks'] = []
        }

        acc['Ranks'].push(title)
      }

      return acc
    }, {} as {[name: string]: GameTitle[]})
  
    this.titles = Object.entries(groupMap).map(([group, titles]) => ({
      group,
      titles
    }))

    this.loading = false
  }
}
</script>
