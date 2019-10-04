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
    class="elevation-2"
  >
    <template #top>
      <v-toolbar flat color="white">
        <div class="flex-grow-1"></div>
        <date-picker-dialog
          class="mb-n6"
          @input="onDataDateChange"
          :value="dataDate"
          label="Data from"
          :date-picker-props="{
            reactive: true,
            min: OLDEST_DATE,
            max: LATEST_DATE,
            'first-day-of-week': 1
          }"
        ></date-picker-dialog>
        <date-picker-dialog
          class="mb-n6"
          @input="onCompareDateChange"
          :value="compareDate"
          label="Compared with"
          :datePickerProps="{
            reactive: true,
            min: OLDEST_DATE,
            max: LATEST_DATE,
            'first-day-of-week': 1
          }"
        ></date-picker-dialog>
      </v-toolbar>
    </template>
    <template v-for="prop in properties" #[`item.${prop}`]="{ value, item }">
      <div :key="prop">
        <span>{{ value | toLocaleString }}</span>
        <span class="caption ml-1">{{
          formatChange(value, item.uuid, prop)
        }}</span>
      </div>
    </template>
    <template #item.uuid="{ item }">
      <router-link :to="`/players/${item.uuid}/${game}`">
        <minecraft-avatar
          class="ma-1 mr-3"
          :size="32"
          :name="item.name"
          :uuid="item.uuid"
        ></minecraft-avatar>
        <span>{{ item.name }}</span>
      </router-link>
    </template>
    <template #item.place="{ value, item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-icon>{{
              changeIcon(
                value,
                compareData.has(item.uuid)
                  ? compareData.get(item.uuid).place
                  : undefined
              )
            }}</v-icon>
            <v-icon v-if="value <= 2">{{ placeIcon(value + 1) }}</v-icon>
            <span v-if="value > 2">{{ (value + 1) | toLocaleString }}</span>
          </div>
        </template>
        <span>
          Previously:
          {{
            compareData.has(item.uuid)
              ? compareData.get(item.uuid).place + 1
              : "?"
          }}
        </span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import DatePickerDialog from "@/components/DatePickerDialog.vue";
import MinecraftAvatar from "@/components/MinecraftAvatar.vue";
import { GameTypes, GameType } from "hive-api/dist/hive.min.js";
import * as firebase from "firebase/app";
import "firebase/firebase-firestore";
import LZString from "lz-string";
import gameModeConfigs from "@/gamemodesConfig";
import {
  mdiNumeric1CircleOutline,
  mdiNumeric2CircleOutline,
  mdiNumeric3CircleOutline,
  mdiChevronTripleUp,
  mdiChevronUp,
  mdiChevronTripleDown,
  mdiChevronDown,
  mdiChevronRight,
  mdiHelpCircleOutline
} from "@mdi/js";
import { MetaInfo } from "vue-meta";

type LeaderboardEntry = {
  name: string;
  uuid: string;
  place: number;
} & {
  [key: string]: number;
};
type Leaderboard = LeaderboardEntry[];

let date = new Date();
date.setDate(date.getDate() - 1);
const YESTERDAY = date.toISOString().substring(0, 10);
date.setMonth(date.getMonth() - 1);
const ONE_MONTY_BEFORE = date.toISOString().substring(0, 10);

@Component({
  components: {
    DatePickerDialog,
    MinecraftAvatar
  },
  filters: {
    gameTypeToName: (gameType: string) => {
      return ((GameTypes as any) as { [key: string]: GameType })[gameType].name;
    }
  },
  metaInfo: ((vue: GamemodeLeaderboard) => ({
    title: `Advanced Leaderboards - ${
      ((GameTypes as any) as { [key: string]: GameType })[vue.game].name
    }`,
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Advanced Leaderboards - ${
          ((GameTypes as any) as { [key: string]: GameType })[vue.game].name
        }`
      }
    ]
  })) as () => MetaInfo
})
export default class GamemodeLeaderboard extends Vue {
  readonly LATEST_DATE = YESTERDAY;
  readonly OLDEST_DATE = "2017-12-06";
  @Prop({ type: String })
  readonly game!: string;
  @Prop({ type: String, default: YESTERDAY })
  private dataDate!: string;
  @Prop({ type: String, default: ONE_MONTY_BEFORE })
  private compareDate!: string;

  private data: Leaderboard = [];
  private compareData: Map<string, LeaderboardEntry> = new Map();
  private loading: boolean = true;
  private options: {
    page: number;
    itemsPerPage: number;
    sortBy: string[];
    sortDesc: boolean[];
    groupBy: string[];
    groupDesc: boolean[];
    multiSort: boolean;
    mustSort: boolean;
  } | null = null;

  get headers() {
    return [
      {
        text: "Place",
        align: "center",
        value: "place"
      },
      { text: "Player", value: "uuid", sortable: "false" },
      ...gameModeConfigs[this.game].leaderboard.map(({ key, title }) => ({
        text: title,
        value: key
      }))
    ];
  }

  get properties() {
    return gameModeConfigs[this.game].leaderboard.map(({ key }) => key);
  }

  changeIcon(curr: number, prev: number | undefined) {
    if (prev == null) return mdiHelpCircleOutline;

    if (curr === prev) return mdiChevronRight;

    if (curr < prev) {
      if (curr < 100 && prev - curr > 10) return mdiChevronTripleUp;
      if (curr > 100 && prev - curr > 100) return mdiChevronTripleUp;
      return mdiChevronUp;
    }
    if (curr > prev) {
      if (prev < 100 && prev - curr < -10) return mdiChevronTripleDown;
      if (prev > 100 && prev - curr < -100) return mdiChevronTripleDown;
      return mdiChevronDown;
    }
  }

  onDataDateChange(date: string) {
    this.$router.push({
      name: `${this.game} Leaderboard`,
      params: {
        dataDate: date,
        compareDate: this.compareDate
      }
    });
  }

  onCompareDateChange(date: string) {
    this.$router.push({
      name: `${this.game} Leaderboard`,
      params: {
        dataDate: this.dataDate,
        compareDate: date
      }
    });
  }

  private dataStore: {
    [page: string]: LeaderboardEntry[];
  } = {};

  @Watch("game")
  clearDataStore() {
    this.data = [];
    this.dataStore = {};
  }

  @Watch("game")
  @Watch("dataDate")
  @Watch("compareDate")
  @Watch("options")
  async updateTable() {
    const ITEMS_PRE_FIRESTORE_PAGE = 100;
    const FIRESTORE_PAGES = 10;
    const ITEMS_PER_PAGE_ALL = -1;
    this.loading = true;

    if (!this.options) return;

    let { sortBy, page, itemsPerPage, sortDesc } = this.options;

    if (itemsPerPage === ITEMS_PER_PAGE_ALL) {
      itemsPerPage = ITEMS_PRE_FIRESTORE_PAGE * FIRESTORE_PAGES;
      page = 1;
    }

    const pageFetchPromises = [];
    const comparePageFetchPromises = [];

    for (
      let firestorePage = 0;
      firestorePage < FIRESTORE_PAGES;
      firestorePage++
    ) {
      pageFetchPromises.push(this.fetchPage(this.dataDate, firestorePage));
      comparePageFetchPromises.push(
        this.fetchPage(this.compareDate, firestorePage)
      );
    }

    const [data, compareData] = await Promise.all([
      Promise.all(pageFetchPromises),
      Promise.all(comparePageFetchPromises)
    ]);
    this.compareData = compareData.flat().reduce((acc, entry) => {
      acc.set(entry.uuid, entry);
      return acc;
    }, new Map<string, LeaderboardEntry>());

    const firstItem = (page - 1) * itemsPerPage;
    const lastItem = firstItem + itemsPerPage;

    this.data = data
      .flat()
      .sort((a, b) => {
        const sortA = a[sortBy[0]];
        const sortB = b[sortBy[0]];

        if (sortDesc[0]) {
          if (sortA < sortB) return 1;
          if (sortA > sortB) return -1;
          return 0;
        } else {
          if (sortA < sortB) return -1;
          if (sortA > sortB) return 1;
          return 0;
        }
      })
      .slice(firstItem, lastItem);

    this.loading = false;
  }

  async fetchPage(date: string, page: number): Promise<LeaderboardEntry[]> {
    if (this.dataStore[`${date}-${page}`])
      return this.dataStore[`${date}-${page}`];

    const db = firebase.firestore();
    const doc = await db
      .collection("gameLeaderboards")
      .doc(this.game)
      .collection("data")
      .doc(`${date}-${page}`)
      .get();

    if (!doc || !doc.exists) return [];

    const data: { a: firebase.firestore.Blob } | undefined = doc.data() as {
      a: firebase.firestore.Blob;
    };

    if (!data) return [];

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

  formatChange(value: number, uuid: string, prop: string): string {
    if (!this.compareData.has(uuid)) return "";

    const change = value - this.compareData.get(uuid)![prop];

    return `(${change > 0 ? "+" : ""}${change.toLocaleString()})`;
  }
}
</script>
