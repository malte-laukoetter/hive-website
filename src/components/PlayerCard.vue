<style scoped>
a {
  text-decoration: inherit;
  color: inherit !important;
}

.v-avatar {
  margin-top: -64px;
}

.v-card {
  margin-top: 48px;
}
</style>

<template>
  <v-card>
    <router-link :to="`/players/${uuid}`">
      <v-container>
        <v-row dense>
          <v-col class="shrink text-center">
            <minecraft-avatar
              class="elevation-2"
              :size="96"
              :uuid="uuid"
              :name="name"
            ></minecraft-avatar>
            <div class="mt-2 grey--text text--darken-2 font-weight-regular">
              {{ name }}
            </div>
          </v-col>
          <v-col class="d-flex flex-column justify-end align-end">
            <slot></slot>
          </v-col>
        </v-row>
      </v-container>
    </router-link>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import "@/components/uuid-format";
import MinecraftAvatar from "@/components/MinecraftAvatar.vue";

export default Vue.extend({
  components: {
    MinecraftAvatar
  },
  props: {
    uuid: String,
    name: String,
    rank: String,
    hideInfoIcon: Boolean
  },

  data: () => ({})
});
</script>
