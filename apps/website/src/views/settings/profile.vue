<template>
  <SettingsLayout title="Profile">
    <setting-profile />
  </SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import SettingProfile from "@/components/settings/profile.vue"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SettingsLayout,
    SettingProfile,
  },
  name: "ProfileSettingPage",
  setup () {
    useMeta({
      title: "Profile",
    })
  },
})
</script>