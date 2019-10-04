<style scoped>
.place-1 {
  background-color: #d7c05b;
}

.place-2 {
  background-color: #e6e8fa;
}

.place-3 {
  background-color: #b4a17e;
}
</style>

<template>
  <hive-app>
    <div class="full-heigth">
      <loading-circular :loading="data.length === 0"></loading-circular>

      <v-row v-if="data.length > 0">
        <v-col cols="12" sm="4" v-for="i in 3" :key="i">
          <player-card
            :class="{ [`place-${i}`]: true }"
            :uuid="data[i - 1].uuid"
            :name="data[i - 1].name"
          >
            <div class="headline">{{ data[i - 1].value | toLocaleString }}</div>
            <div class="subtitle">{{ propertyTitle }}</div>
          </player-card>
        </v-col>
        <v-col cols="12">
          <leaderboard-card
            :data="data"
            :property-title="propertyTitle"
            :size="97"
            :offset="3"
          ></leaderboard-card>
        </v-col>
      </v-row>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LeaderboardCard from "@/components/LeaderboardCard.vue";
import LoadingCircular from "@/components/LoadingCircular.vue";
import PlayerCard from "@/components/PlayerCard.vue";
import { MetaInfo } from "vue-meta";

type LeaderboardEntry = {
  _place: number;
  name: string;
  value: string;
  uuid: string;
};

@Component({
  components: {
    LeaderboardCard,
    PlayerCard,
    LoadingCircular
  },
  metaInfo: ((vue: Leaderboard) => ({
    title: vue.title,
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: vue.title
      }
    ]
  })) as () => MetaInfo
})
export default class Leaderboard extends Vue {
  @Prop({ type: String })
  readonly id!: string;

  @Prop({ type: String, default: "" })
  readonly propertyTitle!: string;

  @Prop({ type: String, default: "" })
  readonly title!: string;

  private data: LeaderboardEntry[] = [];

  async fetchLeaderboard(): Promise<void> {
    if (this.id == null) return;

    this.data = await fetch(
      `https://api.lergin.de/hive/leaderboard/${this.id}?limit=100`
    ).then(res => res.json());
  }

  @Watch("id", { immediate: true })
  onIdChange() {
    this.fetchLeaderboard();
  }
}
</script>
