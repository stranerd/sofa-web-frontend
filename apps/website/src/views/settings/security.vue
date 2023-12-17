<template>
  <SettingsLayout title="Security">
    <setting-security />
  </SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import SettingSecurity from "@/components/settings/security.vue"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SettingsLayout,
    SettingSecurity
  },
  name: "SecuritySettingPage",
  middlewares: { goBackRoute: '/settings' },
  setup () {
    useMeta({
      title: "Security",
    })
  },
})
</script>