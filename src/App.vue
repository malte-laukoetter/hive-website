<style scoped></style>

<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  metaInfo: {
    title: '',
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Hive Stats and Leaderboards` : 'Hive Stats and Leaderboards';
    }
  }
})
export default class App extends Vue {}
</script>
