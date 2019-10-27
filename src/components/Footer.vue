<template>
  <v-footer app absolute>
    <v-col class="text-center" cols="12">
      <router-link to="/faq">FAQ</router-link> —
      <a href="https://m-l.dev/imprint">Imprint</a> —
      <a href="https://m-l.dev/privacy">Privacy</a> —
      <a class="change-consent" onclick="window.__cmp('displayConsentUi');"
        >Change Privacy Settings</a
      >
    </v-col>
  </v-footer>
</template>
