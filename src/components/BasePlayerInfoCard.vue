<style scoped>
.v-card {
  height: calc(100% - 64px);
  margin-top: 64px;
}

.col.avatar {
  margin-top: -80px;
}

mc-format {
  --mc-format-e: #e3b207;
  --mc-format-f: #aaa;
}
</style>

<template>
  <v-card>
    <v-container class="full-height">
      <v-row class="full-height" dense>
        <v-col cols="12" class="d-flex avatar">
          <hive-minecraft-avatar
            class="elevation-2 mx-auto"
            :size="128"
            :uuid="uuid"
            :name="name"
          ></hive-minecraft-avatar>
        </v-col>
        <v-col cols="12" class="headline text-center">{{ name }}</v-col>
        <v-col cols="12" class="overline text-center"
          ><uuid-format :uuid="uuid"></uuid-format
        ></v-col>
        <v-col cols="12" class="subtitle-1 text-center"
          ><mc-format :text="title"></mc-format
        ></v-col>
        <slot></slot>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PlayerInfo, TheSwarmAchievement } from "hive-api/dist/hive.min.js";
import "mc-format";
import "@/components/uuid-format.js";

@Component
export default class BasePlayerInfoCard extends Vue {
  @Prop({ type: String })
  private name!: String;
  @Prop({ type: String })
  private uuid!: String;
  @Prop({ type: String })
  private title!: String;
}
</script>
