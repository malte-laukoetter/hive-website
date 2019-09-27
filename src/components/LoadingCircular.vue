<template>
  <div class="d-flex flex-column justify-center fill-height" v-if="loading">
    <div class="d-flex flex-row justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class LoadingCircular extends Vue {
  @Prop({ type: Boolean })
  readonly loading!: boolean;
}
</script>
