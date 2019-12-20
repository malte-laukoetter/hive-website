<template>
  <hive-app>
    <div class="full-height">
      <v-row justify="center">
        <v-col :cols="12">
          <v-img
            :src="require('../assets/icon.png')"
            class="my-3"
            contain
            height="128"
          ></v-img>
        </v-col>
        <v-col :cols="12" :md="12">
          <h1 class="display-2 font-weight-bold mb-3">
            Welcome to Hive Stats and Leaderboards!
          </h1>
          <p class="subheading font-weight-regular">
            Here you can find statistics about The Hive players, view different
            rankings and more advanced and historic gamemode leaderboards. We
            also provide a list of the latest changes in the team of The Hive
            and some statistics about the server.
          </p>
        </v-col>
        <v-col :cols="12">
          <hive-search solo class="elevation-2"></hive-search>
        </v-col>
        <v-col :sm="4" :cols="12">
          <h2 class="headline font-weight-bold mb-3">Server</h2>

          <div class="d-flex justify-center flex-column">
            <a href="/team" class="subheading my-1">
              Team Changes
            </a>
            <a href="/maps" class="subheading my-1">
              Maps
            </a>
            <a href="/server" class="subheading my-1">
              Unique Player Statistics
            </a>
            <a href="/ranks" class="subheading my-1">
              Game Ranks
            </a>
          </div>
        </v-col>
        <v-col :sm="4" :cols="12">
          <h2 class="headline font-weight-bold mb-3">Advanced Leaderboards</h2>

          <div class="d-flex justify-center flex-column">
            <a href="/leaderboards/HIDE" class="subheading my-1">
              Hide and Seek Leaderboard
            </a>
            <a href="/leaderboards/BED" class="subheading my-1">
              BedWars Leaderboard
            </a>
            <a href="/leaderboards/DR" class="subheading my-1">
              DeathRun Leaderboard
            </a>
            <a href="/leaderboards/TIMV" class="subheading my-1">
              Trouble in Mineville Leaderboard
            </a>
            <a href="/leaderboards/SKY" class="subheading my-1">
              SkyWars Leaderboard
            </a>
          </div>
        </v-col>
        <v-col :sm="4" :cols="12">
          <h2 class="headline font-weight-bold mb-3">Rankings</h2>

          <div class="d-flex justify-center flex-column">
            <a href="/rankings" class="subheading my-1">
              Overview
            </a>
            <a href="/rankings/medals" class="subheading my-1">
              Medals Ranking
            </a>
            <a href="/rankings/points" class="subheading my-1">
              Total Points Ranking
            </a>
            <a href="/rankings/tokens" class="subheading my-1">
              Tokens Ranking
            </a>
            <a href="/rankings/achievements" class="subheading my-1">
              Achievements Ranking
            </a>
          </div>
        </v-col>
      </v-row>
    </div>
  </hive-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  metaInfo: {
    title: ""
  }
});
</script>
