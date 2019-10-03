<template>
  <hive-app>
    <div class="text-center">
      <div class="display-3">404</div>
      <div class="body-1">Nothing here to see :(</div>
    </div>
  </hive-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    metaInfo: {
        title: '404',
        meta: [{
            property: 'robots',
            content: 'noindex'
        }]
    }
});
</script>
