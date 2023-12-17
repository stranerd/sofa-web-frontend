<template>
  <SettingsLayout title="Notifications">
    <div class="flex flex-col px-4 w-full">
      <div class="flex justify-between items-center gap-4 bg-white rounded-2xl p-4 shadow-custom">
        <sofa-normal-text customClass="!font-bold">Push notifications</sofa-normal-text>
        <sofa-icon customClass="h-[22px]" name="toggle-on" />
      </div>
    </div>
  </SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SettingsLayout,
  },
  name: "SettingsNotificationsPage",
  middlewares: { goBackRoute: '/settings' },
  setup () {
    useMeta({
      title: "Notifications",
    })
  },
})
</script>