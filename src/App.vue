<style scoped></style>

<template>
  <div ref="rootElement">
    <router-view />
  </div>
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
        name: "description",
        content:
          "Hive Stats, Leaderboards, Maps, Team changes and many things more!"
      },
      {
        name: "twitter:site",
        content: "@hivemc_updates"
      },
      {
        vmid: "og:description",
        name: "og:description",
        content:
          "Hive Stats, Leaderboards, Maps, Team changes and many things more!"
      },
      {
        vmid: "og:title",
        name: "og:title",
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
