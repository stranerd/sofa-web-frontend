<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row gap-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Set up your account</sofa-header-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:!px-10 px-0">
        <div class="flex flex-col gap-6 w-full">
          <accountSetup />
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import accountSetup from "@/components/onboarding/AccountSetup.vue"
import { FormValidations, scrollToTop } from "@/composables"
import { Logic } from "sofa-logic"
import { SofaHeaderText, SofaIcon } from "sofa-ui-components"
import { defineComponent, onMounted } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaHeaderText,
    accountSetup,
  },
  middlewares: {},
  name: "AuthOnboardingPage",
  setup () {
    useMeta({
      title: "Setup your account",
    })

    onMounted(() => {
      scrollToTop()
    })

    return {
      Logic,
      FormValidations,
    }
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
