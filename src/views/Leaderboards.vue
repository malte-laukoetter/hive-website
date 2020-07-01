<template>
  <hive-app>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="leaderboard in leaderboards"
        :key="leaderboard.id"
      >
        <hive-leaderboard-card
          :href="
            `https://api.lergin.de/hive/leaderboard/${leaderboard.id}?limit=5`
          "
          :title="leaderboard.title"
          :property-title="leaderboard.propertyTitle"
          :size="5"
        >
          <template #actions>
            <v-card-actions>
              <v-btn text :to="`/rankings/${leaderboard.href}`">Show all</v-btn>
            </v-card-actions>
          </template>
        </hive-leaderboard-card>
      </v-col>
    </v-row>
  </hive-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  metaInfo: {
    title: "Rankings",
    meta: [
      {
        vmid: "og:title",
        name: "og:title",
        content: `Rankings`
      }
    ]
  },
  data: () =>
    ({
      leaderboards: [
        {
          title: "Medals",
          id: "medal",
          href: "medals",
          propertyTitle: "Gold Medals"
        },
        {
          title: "Points",
          id: "totalpoints",
          href: "points",
          propertyTitle: "Points"
        },
        {
          title: "Tokens",
          id: "token",
          href: "tokens",
          propertyTitle: "Tokens"
        },
        {
          title: "Kills",
          id: "totalkills",
          href: "kills",
          propertyTitle: "Kills"
        },
        {
          title: "Games Played",
          id: "gamesplayed",
          propertyTitle: "Games",
          href: "games_played"
        },
        {
          title: "Hide Block Levels",
          id: "hide_blocklevels",
          href: "hide_levels",
          propertyTitle: "Block Levels"
        }
      ]
    } as {
      leaderboards: {
        title: string;
        href: string;
        id: string;
        propertyTitle: string;
      }[];
    })
});
</script>
