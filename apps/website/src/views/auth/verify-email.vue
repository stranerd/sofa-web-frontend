<template>
  <auth-layout title="Verify your email"
    :subTitle="`Enter the 6-digit code sent to your email ${Logic.Auth.AuthUser?.email ?? ''}`">
    <div class="flex flex-col gap-6 w-full items-center justify-center">
      <div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
        <sofa-otp-input :numberOfInput="6" :type="'tel'" :onChangeOTP="() => {}" v-model="otpValue" />
      </div>

      <div class="w-full flex flex-col">
        <sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" @click="VerifyUserEmail(otpValue)">
          Verify
        </sofa-button>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-3">
      <sofa-normal-text :color="'text-grayColor'">Have an account?</sofa-normal-text>
      <router-link to="/auth/login">
        <sofa-normal-text :color="'!text-primaryBlue'">Sign in</sofa-normal-text>
      </router-link>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { FormValidations } from "@/composables"
import { createSession } from '@/composables/auth/session'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaNormalText,
  SofaOtpInput
} from "sofa-ui-components"
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaButton,
    SofaOtpInput,
  },
  name: "AuthVerifyEmailPage",
  beforeRouteEnter: generateMiddlewares([async () => {
    if (!Logic.Auth.AuthUser) return '/auth/signin'
  }]),
  setup () {
    useMeta({
      title: "Verify your email",
    })

    const otpValue = ref("")

    onMounted(async () => {
      await Logic.Auth.SendVerificationEmail()
    })

    const VerifyUserEmail = (token: string) => {
      if (token) {
        Logic.Auth.VerifyEmailWithToken({ token })
          .then(createSession)
          .catch((error) => {
            Logic.Common.showError(error?.response?.data[0]?.message)
          })
      } else {
        // show error
      }
    }

    return {
      Logic,
      FormValidations,
      otpValue,
      VerifyUserEmail,
    }
  },
})
</script>
