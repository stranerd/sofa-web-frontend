<template>
  <SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import { Logic } from 'sofa-logic'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { SettingsLayout },
  middlewares: {},
  name: "SettingsIndexPage",
  setup () {
    useMeta({
      title: "Settings",
    })

    const router = useRouter()
    if (Logic.Common.isLarge) router.push("/settings/profile")
  },
})
</script>