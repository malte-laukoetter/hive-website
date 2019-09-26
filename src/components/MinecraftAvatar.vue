<template>
  <v-avatar :size="size" tile v-bind="avatarOptions">
    <img
      :src="`https://crafatar.com/avatars/${uuid}?size=${size}&overlay`"
      :alt="`Minecraft Skin Head of ${name}`"/>
  </v-avatar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MinecraftAvatar extends Vue {
  @Prop(String)
  private uuid!: string
  @Prop(String)
  private name!: string
  @Prop(Number)
  private size!: number
  @Prop({type: Object, default: () => {}})
  private avatarOptions!: unknown
}
</script>