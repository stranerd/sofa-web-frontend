<template>
  <auth-layout title="Verify your email"
    :subTitle="`Enter the 6-digit code sent to your email ${Logic.Auth.AuthUser?.email ?? ''}`">
    <div class="flex flex-col gap-6 w-full items-center justify-center">
      <div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
        <sofa-otp-input :numberOfInput="6" :type="'tel'" :onChangeOTP="onChangeOTP" v-model="otpValue" />
      </div>

      <div class="w-full flex flex-col pt-3">
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
import { VerifyUserEmail } from "@/composables/auth"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaNormalText,
  SofaOtpInput
} from "sofa-ui-components"
import { defineComponent, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaButton,
    SofaOtpInput,
  },
  name: "AuthVerifyEmailPage",
  beforeRouteEnter: generateMiddlewares([async () => {
    // check if there is an email
    // if (!getEmailVerificationEmail()) return '/auth/signin'
  }]),
  setup () {
    useMeta({
      title: "Verify your email",
    })

    const otpValue = ref("")

    const onChangeOTP = () => {
      //
    }

    return {
      Logic,
      FormValidations,
      onChangeOTP,
      otpValue,
      VerifyUserEmail,
    }
  },
})
</script>
