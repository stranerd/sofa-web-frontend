<template>
  <auth-layout title="Setup your account" :subTitle="type ? undefined : 'Choose your account type'">
    <AccountSetup v-if="type" />
    <div v-else class="flex md:flex-row flex-col gap-3 md:gap-6 justify-center items-center w-full">
      <router-link v-for="userType in [
        { value: 'student', label: 'Student', icon: 'student-auth', bgClass: 'bg-primaryBlue' },
        { value: 'teacher', label: 'Teacher', icon: 'tutor-auth', bgClass: 'bg-primaryGreen' },
        { value: 'organization', label: 'Organization', icon: 'organization-auth', bgClass: 'bg-primaryPurple' },
      ]" :key="userType.value" :to="`/onboarding?type=${userType.value}`"
        :class="`md:h-[180px] md:w-[180px] h-[120px] w-full cursor-pointer custom-border ${userType.bgClass} flex flex-col items-center gap-2 justify-center`">
        <sofa-icon :customClass="'md:h-[65px] h-[45px]'" :name="userType.icon" />

        <sofa-normal-text :customClass="'!font-semibold'" :color="'text-white'">
          {{ userType.label }}
        </sofa-normal-text>
      </router-link>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import AccountSetup from "@/components/onboarding/AccountSetup.vue"
import { generateMiddlewares } from '@/middlewares'
import { SofaIcon, SofaNormalText } from "sofa-ui-components"
import { computed, defineComponent } from "vue"
import { useMeta } from "vue-meta"
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    AccountSetup,
    SofaIcon,
    SofaNormalText,
  },
  name: "OnboardingPage",
  beforeRouteEnter: generateMiddlewares([
    'isOnboarding',
    async ({ to }) => {
      const type = to.query.type as string | undefined
      if (!type || ['student', 'tutor', 'organization'].includes(type)) return
      return '/onboarding'
    }
  ]),
  setup () {
    useMeta({
      title: "Setup Your Account",
    })
    const route = useRoute()
    const type = computed(() => route.query.type as string | undefined)

    return { type }
  },
})
</script>
