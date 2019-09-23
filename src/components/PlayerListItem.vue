<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img
        :src="avatarUrl"
        :alt="`Minecraft Skin Head of ${name}`"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{name}}</v-list-item-title>
      <v-list-item-subtitle v-if="$vuetify.breakpoint.smAndUp">
        <slot name="subtitle"><uuid-format :uuid="uuid"></uuid-format></slot>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action v-if="!hideInfoIcon">
      <v-btn icon>
        <v-icon color="grey lighten-1">mdi-information</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
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
