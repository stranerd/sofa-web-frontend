<template>
  <auth-layout>
    <div
      class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4"
    >
      <div class="w-full flex flex-row space-x-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0">
          <sofa-icon
            :customClass="'md:!h-[26px] h-[20px] cursor-pointer'"
            :name="'auth-goback'"
          />
        </span>

        <div
          class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start space-y-1"
        >
          <sofa-header-text :customClass="'md:!text-2xl text-lg'"
            >Create your account</sofa-header-text
          >
          <sofa-normal-text
            :color="'text-grayColor'"
            :customClass="'!font-normal'"
            >Choose your account type</sofa-normal-text
          >
        </div>
      </div>

      <div
        class="h-full flex flex-col items-center justify-center space-y-4 w-full"
      >
        <div
          class="flex md:!flex-row flex-col space-y-3 md:!space-x-6 md:!space-y-0 justify-center items-center w-full"
        >
          <div
            @click="goToOnboarding('student')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full cursor-pointer custom-border bg-primaryBlue flex flex-col items-center space-y-2 justify-center"
          >
            <sofa-icon
              :customClass="'md:!h-[65px] h-[45px]'"
              :name="'student-auth'"
            />

            <sofa-normal-text
              :customClass="'!font-semibold'"
              :color="'text-white'"
            >
              Student
            </sofa-normal-text>
          </div>

          <div
            @click="goToOnboarding('tutor')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full custom-border cursor-pointer bg-primaryGreen flex flex-col items-center space-y-2 justify-center"
          >
            <sofa-icon
              :customClass="'md:!h-[65px] h-[45px]'"
              :name="'tutor-auth'"
            />
            <sofa-normal-text
              :customClass="'!font-semibold'"
              :color="'text-white'"
            >
              Teacher
            </sofa-normal-text>
          </div>

          <div
            @click="goToOnboarding('organisation')"
            class="md:!h-[180px] md:!w-[180px] h-[120px] w-full custom-border cursor-pointer bg-primaryPurple flex flex-col items-center space-y-2 justify-center"
          >
            <sofa-icon
              :customClass="'md:!h-[65px] h-[45px]'"
              :name="'organisation-auth'"
            />
            <sofa-normal-text
              :customClass="'!font-semibold'"
              :color="'text-white'"
            >
              Organization
            </sofa-normal-text>
          </div>
        </div>

        <div class="flex flex-row items-center space-x-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'"
            >Have an account?</sofa-normal-text
          >
          <sofa-normal-text
            :color="'!text-primaryBlue'"
            :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute('/auth/login')"
            >Sign in</sofa-normal-text
          >
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import { scrollToTop } from "@/composables";
import { SofaIcon, SofaNormalText, SofaHeaderText } from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
  },
  middlewares: {},
  name: "AuthIndexPage",
  setup() {
    useMeta({
      title: "Auth",
    });

    onMounted(() => {
      scrollToTop();
    });

    const goToOnboarding = (type: "student" | "organisation" | "tutor") => {
      localStorage.setItem("user_account_type", type);
      Logic.Common.GoToRoute(`/auth/onboarding?type=${type}`);
    };

    return {
      Logic,
      goToOnboarding,
    };
  },
});
</script>
