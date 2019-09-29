<style scoped>
.v-data-table >>> .v-data-table-header-mobile {
  display: none;
}
</style>

<template>
  <v-card>
    <v-card-title v-if="title">
      {{ title }}
    </v-card-title>
    <v-data-table
      disable-filtering
      disable-pagination
      disable-sort
      :mobile-breakpoint="300"
      :headers="[
        {
          text: 'Place',
          value: '_place',
          align: 'center'
        },
        {
          text: 'Player',
          value: 'name'
        },
        {
          text: propertyTitle,
          value: 'value'
        }
      ]"
      hide-default-footer
      item-key="uuid"
      :items="filteredData"
      :loading="filteredData.length === 0"
    >
      <template v-slot:item._place="{ value }">
        <v-icon v-if="value <= 3">{{ placeIcon(value) }}</v-icon>
        <span v-if="value > 3">{{ value | toLocaleString }}</span>
      </template>
      <template v-slot:item.name="{ item }">
        <router-link :to="`/player/${item.uuid}`">
          <minecraft-avatar
            class="ma-1 mr-3"
            :size="32"
            :uuid="item.uuid"
            :name="item.name"
          ></minecraft-avatar>
          <span>{{ item.name }}</span>
        </router-link>
      </template>
      <template v-slot:item.value="{ value }">
        {{ value | toLocaleString }}
      </template>
    </v-data-table>
    <slot name="actions"></slot>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import MinecraftAvatar from "@/components/MinecraftAvatar.vue";
import {
  mdiNumeric1CircleOutline,
  mdiNumeric2CircleOutline,
  mdiNumeric3CircleOutline
} from "@mdi/js";

type LeaderboardEntry = {
  _place: number;
  name: string;
  value: string;
  uuid: string;
};

@Component({
  components: {
    MinecraftAvatar
  }
})
export default class LeaderboardCard extends Vue {
  @Prop({ type: Array, default: () => [] })
  readonly data!: LeaderboardEntry[];

  @Prop({ type: String, default: "" })
  readonly propertyTitle!: string;

  @Prop({ type: String, default: "" })
  readonly title!: string;

  @Prop({ type: Number, default: 5 })
  readonly size!: number;

  @Prop({ type: Number, default: 0 })
  readonly offset!: number;

  @Prop(String)
  readonly href: string | undefined;
  private fetchedData: LeaderboardEntry[] = [];

  @Watch("href", { immediate: true })
  onHrefChanged(href: string) {
    this.fetchLeaderboard();
  }

  get filteredData(): LeaderboardEntry[] {
    const data = this.href != null ? this.fetchedData : this.data;

    return data.slice(this.offset, this.offset + this.size);
  }

  async fetchLeaderboard(): Promise<void> {
    if (this.href == null) return;

    this.fetchedData = await fetch(this.href).then(res => res.json());
  }

  placeIcon(place: 1 | 2 | 3): string {
    switch (place) {
      case 1:
        return mdiNumeric1CircleOutline;
      case 2:
        return mdiNumeric2CircleOutline;
      case 3:
        return mdiNumeric3CircleOutline;
    }
  }
}
</script>
