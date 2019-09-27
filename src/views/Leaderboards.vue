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
        <leaderboard-card
          :href="
            `https://api.lergin.de/hive/leaderboard/${leaderboard.id}?limit=5`
          "
          :title="leaderboard.title"
          :property-title="leaderboard.propertyTitle"
          :size="5"
        >
          <template #actions>
            <v-card-actions>
              <v-btn text :to="`/leaderboard/${leaderboard.href}`"
                >Show all</v-btn
              >
            </v-card-actions>
          </template>
        </leaderboard-card>
      </v-col>
    </v-row>
  </hive-app>
</template>

<script lang="ts">
import Vue from "vue";
import LeaderboardCard from "@/components/LeaderboardCard.vue";

export default Vue.extend({
  components: {
    LeaderboardCard
  },
  data: () =>
    ({
      leaderboards: [
        {
          title: "Medal Leaderboard",
          id: "medal",
          href: "medals",
          propertyTitle: "Gold Medals"
        },
        {
          title: "Point Leaderboard",
          id: "totalpoints",
          href: "points",
          propertyTitle: "Points"
        },
        {
          title: "Token Leaderboard",
          id: "token",
          href: "tokens",
          propertyTitle: "Tokens"
        },
        {
          title: "Achievement Leaderboard",
          id: "achievement",
          href: "achievements",
          propertyTitle: "Achievements"
        },
        {
          title: "Kill Leaderboard",
          id: "totalkills",
          href: "kills",
          propertyTitle: "Kills"
        },
        {
          title: "Hide Block Level Leaderboard",
          id: "hide_blocklevels",
          href: "hide",
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
