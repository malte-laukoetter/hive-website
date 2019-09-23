<template>
  <v-card>
    <v-card-title v-if="title">
      {{title}}
    </v-card-title>
    <v-data-table
      disable-filtering
      disable-pagination
      disable-sort
      :headers="[{
        text: 'Place',
        value: '_place',
        align: 'center'
      }, {
        text: 'Player',
        value: 'name'
      }, {
        text: propertyTitle,
        value: 'value'
      }]"
      hide-default-footer
      item-key="uuid"
      :items="filteredData"
      :loading="filteredData.length === 0"
      >
      <template v-slot:item._place="{value}">
        <v-icon v-if="value <= 3">mdi-numeric-{{value}}-circle-outline</v-icon>
        <span v-if="value > 3">{{ value | toLocaleString }}</span>
      </template>
      <template v-slot:item.name="{item}">
        <v-avatar class="ma-1 mr-3" size=32>
          <v-img
            :src="`https://cravatar.eu/avatar/${item.uuid}`"
            :alt="`Minecraft Skin Head of ${item.name}`"></v-img>
        </v-avatar>
        <span>{{ item.name }}</span>
      </template>
      <template v-slot:item.value="{value}">
        {{value | toLocaleString}}
      </template>
    </v-data-table>
    <slot name="actions"></slot>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PlayerListItem from "../components/PlayerListItem.vue";
import LoadingCircular from "../components/LoadingCircular.vue";

type LeaderboardEntry = {
  _place: number;
  name: string;
  value: string;
  uuid: string;
}

@Component({
  components: {
    PlayerListItem,
    LoadingCircular
  }
})
export default class LeaderboardCard extends Vue {
  @Prop({type: Array, default: () => []})
  readonly data!: LeaderboardEntry[]

  @Prop({type: String, default: ''})
  readonly propertyTitle!: string

  @Prop({type: String, default: ''})
  readonly title!: string

  @Prop({type: Number, default: 5})
  readonly size!: number

  @Prop({type: Number, default: 0})
  readonly offset!: number
  
  @Prop(String)
  readonly href: string | undefined
  private fetchedData: LeaderboardEntry[] = []

  @Watch('href', { immediate: true })
  onHrefChanged(href: string) {
    this.fetchLeaderboard()
  }

  get filteredData(): LeaderboardEntry[] {
    const data = this.href != null ? this.fetchedData : this.data

    return data.slice(this.offset, this.offset + this.size)
  }

  async fetchLeaderboard(): Promise<void> {
    if (this.href == null) return

    this.fetchedData = await fetch(this.href).then(res => res.json());
  }
}
</script>
