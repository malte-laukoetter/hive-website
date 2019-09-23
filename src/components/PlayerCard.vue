<template>
  <v-card>
    <v-row>
      <v-col class="shrink ml-2">
        <v-avatar size="96">
          <img
            :src="`https://crafatar.com/avatars/${uuid}`"
            :alt="`Minecraft Skin Head of ${name}`"/>
        </v-avatar>
        <div class="mt-2 grey--text text--darken-2 font-weight-light">{{name}}</div>
      </v-col>
      <v-col class="d-flex flex-column justify-end align-end mr-2">
        <slot></slot>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import '../components/uuid-format';

export default Vue.extend({
  props: {
    uuid: String,
    name: String,
    rank: String,
    hideInfoIcon: Boolean
  },

  data: () => ({
  }),

  computed: {
    avatarUrl () {
      if (this.uuid) {
        return `https://cravatar.eu/avatar/${this.uuid}`
      }

      return `https://cravatar.eu/avatar/steve`
    },
  },
});
</script>
