<template>
  <v-card>
    <v-col cols="12" class="text-center headline">
      <slot>{{count | toLocaleString}}</slot>
    </v-col>
    <v-col cols="12" class="text-center subtitle-1 mt-n5"><slot name="title">{{title}}</slot></v-col>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CountCard extends Vue {
  @Prop(String)
  readonly title!: string
  @Prop(Number)
  readonly count!: number
}
</script>
