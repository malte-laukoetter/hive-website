<template>
  <hive-app>
    <div class="full-height">
      <v-timeline
        :dense="!$vuetify.breakpoint.mdAndUp"
        v-if="changes.length > 0"
      >
        <v-timeline-item v-for="dateChanges in changes" :key="dateChanges.date">
          <template v-slot:opposite>
            <strong>
              {{ dateChanges.date }}
            </strong>
          </template>
          <v-card class="elevation-2">
            <v-card-title
              v-if="!$vuetify.breakpoint.mdAndUp"
              class="font-weight-light"
              >{{ dateChanges.date }}</v-card-title
            >
            <v-list two-line subheader>
              <template v-for="typeChanges in dateChanges.changes">
                <v-subheader inset :key="typeChanges.type">{{
                  typeChanges.type | changeType
                }}</v-subheader>

                <template v-for="change in typeChanges.changes">
                  <hive-player-list-item
                    :key="`${change.uuid}-${typeChanges.type}`"
                    v-bind="change"
                  ></hive-player-list-item>
                </template>
              </template>
            </v-list>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <infinite-loading @infinite="loadMore">
        <hive-loading-circular
          class="mt-2"
          loading
          slot="spinner"
        ></hive-loading-circular>
      </infinite-loading>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import InfiniteLoading, { StateChanger } from "vue-infinite-loading";

@Component({
  components: {
    InfiniteLoading
  },
  filters: {
    changeType(type: string) {
      switch (type) {
        case "HELPER_ADD":
          return "New Helpers";
        case "HELPER_REMOVE":
          return "Former Helpers";
        case "MODERATOR_ADD":
          return "New Moderators";
        case "MODERATOR_REMOVE":
          return "Former Moderators";
        case "SENIOR_MODERATOR_ADD":
          return "New Senior Moderators";
        case "SENIOR_MODERATOR_REMOVE":
          return "Former Senior Moderators";
        case "DEVELOPER_ADD":
          return "New Developers";
        case "DEVELOPER_REMOVE":
          return "Former Developers";
        case "OWNER_ADD":
          return "New Owners";
        case "OWNER_REMOVE":
          return "Former Owners";
        case "NECTAR_ADD":
          return "New Team Nectar Members";
        case "NECTAR_REMOVE":
          return "Former Team Nectar Members";
        default:
          return type;
      }
    }
  },
  metaInfo: {
    title: "Team",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Team`
      }
    ]
  }
})
export default class TeamChanges extends Vue {
  private data: {
    date: number;
    name: string;
    type: string;
    uuid: string;
  }[] = [];
  private page = 0;

  async loadMore($state: StateChanger) {
    const newData = await this.fetchTeamChanges(this.page);

    if (newData.length > 0) {
      this.data = [...this.data, ...newData];
      this.page = this.page + 1;

      $state.loaded();
    } else {
      $state.complete();
    }
  }

  get changes(): {
    date: string;
    changes: { type: string; changes: { name: string; uuid: string }[] }[];
  }[] {
    const changeDateMap = this.data
      .map(change => ({
        ...change,
        date: new Date(change.date).toLocaleDateString()
      }))
      .reduce(
        (acc, change) => {
          if (acc.has(change.date)) {
            acc.set(change.date, [...acc.get(change.date)!, change]);
          } else {
            acc.set(change.date, [change]);
          }

          return acc;
        },
        new Map<
          string,
          {
            name: string;
            type: string;
            uuid: string;
          }[]
        >()
      );

    let changes: {
      date: string;
      changes: { type: string; changes: { name: string; uuid: string }[] }[];
    }[] = [...changeDateMap.entries()].map(([date, dateChanges]) => {
      const changes = dateChanges.reduce((acc, change) => {
        if (acc.has(change.type)) {
          acc.set(change.type, [...acc.get(change.type)!, change]);
        } else {
          acc.set(change.type, [change]);
        }
        return acc;
      }, new Map<string, { name: string; uuid: string }[]>());

      return {
        date,
        changes: [...changes.entries()].map(([type, changes]) => ({
          type,
          changes
        }))
      };
    });

    return changes;
  }

  fetchTeamChanges(
    page: number = 0
  ): Promise<
    {
      date: number;
      name: string;
      type: string;
      uuid: string;
    }[]
  > {
    return fetch(`https://api.lergin.de/hive/team/${page}`).then(res =>
      res.json()
    );
  }
}
</script>
