<template>
  <SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import { Logic } from 'sofa-logic'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: { SettingsLayout },
  middlewares: {},
  name: "SettingsIndexPage",
  setup () {
    useMeta({
      title: "Settings",
    })

    if (Logic.Common.isLarge) Logic.Common.GoToRoute("/settings/profile")
  },
})
</script>