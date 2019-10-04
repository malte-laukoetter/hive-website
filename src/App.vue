<style scoped></style>

<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { MetaInfo } from "vue-meta";

@Component({
  metaInfo: {
    title: "",
    titleTemplate: titleChunk => {
      return titleChunk
        ? `${titleChunk} | Hive Stats and Leaderboards`
        : "Hive Stats and Leaderboards";
    },
    meta: [
      {
        vmid: "description",
        property: "description",
        content:
          "Hive Stats, Leaderboards, Maps, Team changes and many things more!"
      },
      {
        property: "twitter:site",
        content: "@hivemc_updates"
      },
      {
        vmid: "og:description",
        property: "og:description",
        content:
          "Hive Stats, Leaderboards, Maps, Team changes and many things more!"
      },
      {
        vmid: "og:title",
        property: "og:title",
        template: chunk => {
          return chunk
            ? `${chunk} | Hive Stats and Leaderboards`
            : "Hive Stats and Leaderboards";
        },
        content: "Hive Stats and Leaderboards"
      }
    ]
  } as MetaInfo
})
export default class App extends Vue {}
</script>
