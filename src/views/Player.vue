<template>
  <hive-app :name="playerInfo ? playerInfo.name : 'Player'">
    <template #navigation>
      <hive-app-bar-extended>
        <v-tab :to="`/players/${uuid}`" exact>
          General
        </v-tab>
        <v-tab
          :to="{ name: gameType.id }"
          v-for="gameType in supportedGameTypes"
          :key="gameType.id"
        >
          {{ gameType.name }}
        </v-tab>
      </hive-app-bar-extended>
    </template>

    <div class="full-height">
        <v-alert type="info">
          All player profiles have been removed so here is Lergin_'s profile to show you what once was available here :)
        </v-alert>

      <router-view></router-view>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Player as HivePlayer,
  PlayerInfo as HivePlayerInfo,
  GameTypes
} from "hive-api/dist/hive.min.js";
import "@/components/uuid-format.js";
import { MetaInfo } from "vue-meta";

@Component({
  metaInfo: ((vue: Player) => ({
    title: vue.playerInfo ? vue.playerInfo.name : vue.uuid,
    meta: [
      {
        vmid: "og:image",
        name: "og:image",
        content: `https://crafatar.com/renders/body/${vue.uuid}`
      },
      {
        vmid: "og:title",
        name: "og:title",
        content: vue.playerInfo ? vue.playerInfo.name : vue.uuid
      }
    ]
  })) as () => MetaInfo
})
export default class Player extends Vue {
  @Prop({ type: String })
  readonly uuid!: string;

  private supportedGameTypes = [
    GameTypes.DR,
    GameTypes.GRAV,

    GameTypes.HIDE,

    GameTypes.BED,
    GameTypes.TIMV,
    GameTypes.BP,
    GameTypes.DRAW,
  ];

  private player: HivePlayer | null = null;
  playerInfo: HivePlayerInfo | null = null;

  async fetchData(): Promise<void> {
    if (this.uuid == null) return;

    this.player = new HivePlayer(this.uuid);
    this.playerInfo = await this.player.info();

    if (this.uuid.length < 32) {
      this.$router.push(`/players/${this.player.uuid}`);
    }
  }

  @Watch("uuid", { immediate: true })
  onUuidChange() {
    this.fetchData();
  }
}
</script>
