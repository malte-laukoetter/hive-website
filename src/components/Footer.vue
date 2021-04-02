<template>
  <v-footer app absolute>
    <v-col class="text-center" cols="12">
      <router-link to="/faq">FAQ</router-link> —
      <a href="https://m-l.dev/imprint">Imprint</a> —
      <a href="https://m-l.dev/privacy">Privacy Policy</a> —
      <span class="text-overline">{{commitRef}}</span> —
      <span class="text-overline">{{buildId}}</span> —
      <span class="text-overline">{{buildDate}}</span>
    </v-col>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Footer extends Vue {
  commitRef: string = process.env.VUE_APP_COMMIT_REF.substring(0,6)
  buildId: string = process.env.VUE_APP_BUILD_ID.substring(0,6)
  buildDate: string = process.env.VUE_APP_BUILD_DATE
}
</script>
