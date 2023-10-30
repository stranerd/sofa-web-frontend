<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row gap-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Create your account</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal'">Choose your account
            type</sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center justify-center gap-4 w-full">
        <div class="flex md:!flex-row flex-col gap-3 md:!gap-6 md:!gap-0 justify-center items-center w-full">
          <div @click="goToOnboarding('student')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full cursor-pointer custom-border bg-primaryBlue flex flex-col items-center gap-2 justify-center">
            <sofa-icon :customClass="'md:!h-[65px] h-[45px]'" :name="'student-auth'" />

            <sofa-normal-text :customClass="'!font-semibold'" :color="'text-white'">
              Student
            </sofa-normal-text>
          </div>

          <div @click="goToOnboarding('tutor')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full custom-border cursor-pointer bg-primaryGreen flex flex-col items-center gap-2 justify-center">
            <sofa-icon :customClass="'md:!h-[65px] h-[45px]'" :name="'tutor-auth'" />
            <sofa-normal-text :customClass="'!font-semibold'" :color="'text-white'">
              Teacher
            </sofa-normal-text>
          </div>

          <div @click="goToOnboarding('organization')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full custom-border cursor-pointer bg-primaryPurple flex flex-col items-center gap-2 justify-center">
            <sofa-icon :customClass="'md:!h-[65px] h-[45px]'" :name="'organization-auth'" />
            <sofa-normal-text :customClass="'!font-semibold'" :color="'text-white'">
              Organization
            </sofa-normal-text>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"
import { Logic } from "sofa-logic"
import { SofaHeaderText, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineComponent, onMounted } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
  },
  middlewares: {},
  name: "AuthIndexPage",
  setup () {
    useMeta({
      title: "Auth",
    })

    onMounted(() => {
      scrollToTop()
    })

    const goToOnboarding = (type: "student" | "organization" | "tutor") => {
      localStorage.setItem("user_account_type", type)
      Logic.Common.GoToRoute(`/auth/onboarding?type=${type}`)
    }

    return {
      Logic,
      goToOnboarding,
    }
  },
})
</script>
