<template>
  <hive-app>
    <div class="full-height">
        <v-row>
            <v-col cols="12" md="12">
                <server-unique-player-line-chart></server-unique-player-line-chart>
            </v-col>
            <v-col cols="12" md="12">
                <game-types-unique-player-line-chart></game-types-unique-player-line-chart>
            </v-col>
        </v-row>
    </div>
  </hive-app>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ServerUniquePlayerLineChart from "@/components/ServerUniquePlayerLineChart.vue";
import GameTypesUniquePlayerLineChart from "@/components/GameTypesUniquePlayerLineChart.vue";

@Component({
  components: {
    ServerUniquePlayerLineChart,
    GameTypesUniquePlayerLineChart
  }
})
export default class Server extends Vue {

}
</script>
