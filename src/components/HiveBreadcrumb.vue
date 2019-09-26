<template>
  <v-breadcrumbs class="pa-0 ml-2 my-2" :items="breadcrumbs"></v-breadcrumbs>  
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {Route, RouteRecord} from 'vue-router'

@Component
export default class HiveBreadcrumb extends Vue {
  get breadcrumbs() {
    return this.$route.matched.map(routeRecord => {
      let breadcrumbs = []
      if (typeof routeRecord.meta.breadcrumbs === 'function') {
        breadcrumbs = routeRecord.meta.breadcrumbs(this.$route.params)
      } else {
        breadcrumbs = [... routeRecord.meta.breadcrumbs ? routeRecord.meta.breadcrumbs : []]
        breadcrumbs.push({ text: routeRecord.name, to: routeRecord.path, exact: true})
      }
      return breadcrumbs
    }).flat()
  }
}
</script>