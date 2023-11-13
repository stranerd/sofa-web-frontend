<template>
  <auth-layout title="Set up your account">
    <AccountSetup />
  </auth-layout>
</template>

<script lang="ts">
import AccountSetup from "@/components/onboarding/AccountSetup.vue"
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    AccountSetup,
  },
  name: "AuthOnboardingPage",
  beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
  setup () {
    useMeta({
      title: "Setup your account",
    })

    return {}
  },
  data () {
    return {
      parentRefs: null,
    }
  },
  mounted () {
    const parentRefs: any = this.$refs
    this.parentRefs = parentRefs
  },
})
</script>
