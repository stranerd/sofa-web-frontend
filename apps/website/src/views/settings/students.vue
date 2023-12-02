<template>
  <SettingsLayout title="Students">
    <setting-students />
  </SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from "@/components/settings/SettingsLayout.vue"
import SettingStudents from "@/components/settings/students.vue"
import { Logic } from 'sofa-logic'
import { defineComponent, onMounted } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SettingsLayout,
    SettingStudents,
  },
  middlewares: {
    fetchRules: [],
  },
  name: "StudentsSettingPage",
  setup () {
    useMeta({
      title: "Your students",
    })

    onMounted(() => {
      if (Logic.Users.UserProfile?.type?.type == "organization") {
        Logic.Users.GetOrganizationMembers(Logic.Auth.AuthUser.id, {
          limit: 20,
        }).then(() => {
          Logic.Common.hideLoading()
        })
      }
    })
  },
})
</script>