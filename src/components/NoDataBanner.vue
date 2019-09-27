<template>
  <v-banner class="mt-4" :icon="mdiAlert" icon-color="warning" :value="value" elevation=1>
    No data available!
  </v-banner>
</template>


<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {mdiAlert} from '@mdi/js'

@Component
export default class PlayerGameInfo extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly value!: boolean;

  private mdiAlert = mdiAlert
}
</script>
