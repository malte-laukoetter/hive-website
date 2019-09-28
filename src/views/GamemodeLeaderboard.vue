<template>
  <v-data-table 
    :headers="headers"
    :items="data"
    item-key="uuid"
    :server-items-length="1000"
    :loading="loading"
    :options.sync="options"
    disable-filtering
    fixed-header

  >
    <template #top>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{game | gameTypeToName}}</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <date-picker-dialog @input="onDataDateChange" :value="dataDate" label="Data from" :date-picker-props="{ reactive: true, min: '2017-12-06', max: '2019-09-12', 'first-day-of-week': 1 }"></date-picker-dialog>
        <date-picker-dialog @input="onCompareDateChange" :value="compareDate" label="Compared with" :datePickerProps="{ reactive: true, min: '2017-12-06', max: '2019-09-28', 'first-day-of-week': 1 }"></date-picker-dialog>
      </v-toolbar>
    </template>
    <template v-for="prop in properties" #[`item.${prop}`]="{ value }">
      <span :key="prop">{{ value | toLocaleString }}</span>
    </template>
    <template #item.uuid="{ item }">
      <minecraft-avatar class="ma-1 mr-3" :size="32" :name="item.name" :uuid="item.uuid"></minecraft-avatar>
      <span>{{item.name}}</span>
    </template>
    <template #item.place="{ value }">
      <v-icon v-if="value <= 2">{{ placeIcon(value + 1) }}</v-icon>
      <span v-if="value > 2">{{ value + 1 | toLocaleString }}</span>
    </template>
  </v-data-table>

</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {DataOptions} from 'vuetify/src/components/VData/VData'
import DatePickerDialog from '@/components/DatePickerDialog.vue'
import MinecraftAvatar from '@/components/MinecraftAvatar.vue'
import {GameTypes, GameType} from 'hive-api/dist/hive.min.js'
import * as firebase from "firebase/app";
import 'firebase/firebase-firestore'
import LZString from 'lz-string'
import gameModeConfigs from '@/gamemodesConfig'
import {
  mdiNumeric1CircleOutline,
  mdiNumeric2CircleOutline,
  mdiNumeric3CircleOutline
} from "@mdi/js";

type LeaderboardEntry = {
  name: string,
  uuid: string,
  place: number,
} & {
  [key: string]: number,
}
type Leaderboard = LeaderboardEntry[]


@Component({
  components: {
    DatePickerDialog,MinecraftAvatar
  },
  filters: {
    gameTypeToName: (gameType: string) => {
      return ((GameTypes as any) as { [key: string]: GameType })[gameType].name;
    }
  }
})
export default class PlayerInfo extends Vue {
  @Prop({ type: String })
  readonly game!: string;
  @Prop({ type: String, default: '2019-09-20' })
  private dataDate!: string
  @Prop({ type: String, default: '2019-08-20' })
  private compareDate!: string

  private data: Leaderboard = []
  private loading: boolean = true
  private options: DataOptions | null = null

  get headers() {
    return  [
      {
        text: 'Place',
        align: 'center',
        value: 'place',
      },
      { text: 'Player', value: 'uuid', sortable: 'false' },
      ... gameModeConfigs[this.game].leaderboard.map(({key, title}) => ({text: title, value: key}))
    ]
  }

  get properties() {
    return gameModeConfigs[this.game].leaderboard.map(({key}) => key)
  }

  onDataDateChange(date: string) {
    this.$router.push({
      name: `${this.game} Leaderboard`,
      params: {
        dataDate: date,
        compareDate: this.compareDate
      }
    })
  }  
  
  onCompareDateChange(date: string) {
    this.$router.push({
      name: `${this.game} Leaderboard`,
      params: {
        dataDate: this.dataDate,
        compareDate: date
      }
    })
  }

  private dataStore: {
    [page: number]: LeaderboardEntry[]
  } = {}

  @Watch('game')
  @Watch('dataDate')
  @Watch('compareDate')
  clearDataStore() {
    this.data = []
    this.dataStore = {}
  }

  @Watch('game')
  @Watch('dataDate')
  @Watch('compareDate')
  @Watch('options')
  async updateTable() {
    const ITEMS_PRE_FIRESTORE_PAGE = 100
    const FIRESTORE_PAGES = 10
    const ITEMS_PER_PAGE_ALL = -1
    this.loading = true

    if (!this.options) return

    let { sortBy, page, itemsPerPage, sortDesc } = this.options
    const sorting = sortBy.length > 0

    if (itemsPerPage === ITEMS_PER_PAGE_ALL) {
      itemsPerPage = ITEMS_PRE_FIRESTORE_PAGE * FIRESTORE_PAGES
      page = 1
    }

    const firstItem = (page - 1) * itemsPerPage
    const lastItem = firstItem + itemsPerPage

    let firstItemFirestorePage = Math.floor(firstItem / ITEMS_PRE_FIRESTORE_PAGE)
    let lastItemFirestorePage = Math.floor(lastItem / ITEMS_PRE_FIRESTORE_PAGE)

    if (sorting) {
      firstItemFirestorePage = 0
      lastItemFirestorePage = 9
    }

    const pageFetchPromises = []

    for (let firestorePage = firstItemFirestorePage; firestorePage <= lastItemFirestorePage; firestorePage++) {
      pageFetchPromises.push(this.fetchPage(firestorePage))
    }

    const offset = firstItemFirestorePage * ITEMS_PRE_FIRESTORE_PAGE

    const data = await Promise.all(pageFetchPromises)
    this.data = data
      .flat()
      .sort((a, b) => {
        const sortA = a[sortBy[0]]
        const sortB = b[sortBy[0]]

        if (sortDesc[0]) {
          if (sortA < sortB) return 1
          if (sortA > sortB) return -1
          return 0
        } else {
          if (sortA < sortB) return -1
          if (sortA > sortB) return 1
          return 0
        }
      })
      .slice(firstItem - offset, lastItem - offset)

     // 
  /*  const db = firebase.firestore()
    const page = 0;

    const data = await db.collection('gameLeaderboards').doc(this.game).collection('data').doc(`${this.dataDate}-${page}`).get()

    let doc = data;

    if (doc && doc.exists) {
      const data: {a: firebase.firestore.Blob} | undefined = doc.data() as {a: firebase.firestore.Blob}

      if (!data) return

      const decodedData = JSON.parse(LZString.decompressFromBase64(data.a.toBase64()));
*//*
      let prevDoc = res[1][0];

      if(prevDoc && prevDoc.exists && !this.prevDataCacheKeys.has(res[1][1])){
        let prevData = JSON.parse(LZString.decompressFromBase64(prevDoc.data().a.toBase64()));
        this.prevData = this.prevData.concat(prevData);
        this.prevDataCacheKeys.add(res[1][1])
        this.$.grid.clearCache();
      }

      data = data.map(place => {
        let placePrevData = this.prevData.filter(a => a.uuid === place.uuid);

        if(placePrevData[0]){
          place.prev = Object.keys(placePrevData[0])
            // calc values for each key
            .map(key => [key, place[key] - placePrevData[0][key] || NaN])
            // put them together into one object
            .reduce((obj, [key, val]) => { obj[key] = val; return obj }, {})
        }

        return place;
      }); *//*

      this.data = decodedData
      console.log(this.data)
    }*/
    this.loading = false

  }

  async fetchPage(page: number): Promise<LeaderboardEntry[]> {
    if (this.dataStore[page]) return this.dataStore[page]

    const db = firebase.firestore()
    const doc = await db.collection('gameLeaderboards').doc(this.game).collection('data').doc(`${this.dataDate}-${page}`).get()

    if (!doc || !doc.exists) return []

    const data: {a: firebase.firestore.Blob} | undefined = doc.data() as {a: firebase.firestore.Blob}


    if (!data) return []

    return JSON.parse(LZString.decompressFromBase64(data.a.toBase64()));
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
