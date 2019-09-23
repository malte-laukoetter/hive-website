<style scoped>
  .full-height {
    height: 100%;
  }
</style>

<template>
  <div class="full-height">
    <loading-circular :loading="changes.length === 0"></loading-circular>
    <v-timeline
      :dense="$vuetify.breakpoint.smAndDown"
      v-if="changes.length > 0"
    >
      <v-timeline-item
        v-for="dateChanges in changes"
        :key="dateChanges.date"
      >
        <template v-slot:opposite>
          <strong>
            {{dateChanges.date}}
          </strong>
        </template>
        <v-card class="elevation-2">
          <v-card-title v-if="$vuetify.breakpoint.smAndDown" class="font-weight-light">{{dateChanges.date}}</v-card-title>
          <v-list two-line subheader>
            <template v-for="typeChanges in dateChanges.changes">
              <v-subheader inset :key="typeChanges.type">{{typeChanges.type}}</v-subheader>

              <template v-for="change in typeChanges.changes">
                <player-list-item :key="`${change.uuid}-${typeChanges.type}`" v-bind="change"></player-list-item>
              </template>
            </template>
          </v-list>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";
import PlayerListItem from "../components/PlayerListItem.vue";
import LoadingCircular from "../components/LoadingCircular.vue";

async function fetchTeamChanges() {
  const data: {
    date: number;
    name: string;
    type: string;
    uuid: string;
  }[] = await fetch(`https://api.lergin.de/hive/team/0`).then(res => res.json())

  const changeDateMap = data
    .map(change => ({... change, date: new Date(change.date).toLocaleDateString()}))
    .reduce((acc, change) => {
      if(acc.has(change.date)) {
        acc.set(change.date, [... acc.get(change.date)!, change])
      } else {
        acc.set(change.date, [change])
      }

      return acc
    }, new Map<string, {
      name: string;
      type: string;
      uuid: string;
    }[]>())

  let changes: { date: string, changes: {type: string, changes: {name: string, uuid: string}[]}[]}[] =
    [... changeDateMap.entries()].map(([date, dateChanges]) => {
    const changes = dateChanges.reduce((acc, change) => {
      if(acc.has(change.type)) {
        acc.set(change.type, [... acc.get(change.type)!, change])
      } else {
        acc.set(change.type, [change])
      }
      return acc
    }, new Map<string, {name: string, uuid: string}[]>())
    
    return { date, changes: [... changes.entries()].map(([type, changes]) => ({type, changes})) }
  })

  return changes
}

export default Vue.extend({
  components: {
    HelloWorld,PlayerListItem,LoadingCircular
  },
  data: () => ({
    changes: []
  } as {
    changes: { date: string, changes: {type: string, changes: {name: string, uuid: string}[]}[]}[]
  }),
  created: async function() {
    this.changes = await fetchTeamChanges()
  }
});
</script>
