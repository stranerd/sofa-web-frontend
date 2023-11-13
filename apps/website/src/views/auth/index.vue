<template>
  <auth-layout title="Create your account" subTitle="Choose your account type">
    <div class="flex md:flex-row flex-col gap-3 md:gap-6 justify-center items-center w-full">
      <div v-for="userType in types" :key="userType.value"
        @click="goToOnboarding(userType.value)"
          :class="`md:h-[180px] md:w-[180px] h-[120px] w-full cursor-pointer custom-border ${userType.bgClass} flex flex-col items-center gap-2 justify-center`">
          <sofa-icon :customClass="'md:h-[65px] h-[45px]'" :name="userType.icon" />

          <sofa-normal-text :customClass="'!font-semibold'" :color="'text-white'">
            {{ userType.label }}
          </sofa-normal-text>
        </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import { SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
  },
  name: "AuthIndexPage",
  beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
  setup () {
    useMeta({
      title: "Auth",
    })

    const goToOnboarding = (type: string) => {
      localStorage.setItem("user_account_type", type)
      Logic.Common.GoToRoute(`/auth/onboarding?type=${type}`)
    }

    const types = [
      { value: 'student', label: 'Student', icon: 'student-auth', bgClass: 'bg-PrimaryBlue' },
      { value: 'tutor', label: 'Teacher', icon: 'tutor-auth', bgClass: 'bg-PrimaryGreen'  },
      { value: 'organization', label: 'Organization', icon: 'organization-auth', bgClass: 'bg-PrimaryPurple' },
    ]

    return {
      types,
      goToOnboarding,
    }
  },
})
</script>
