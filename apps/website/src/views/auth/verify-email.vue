<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row gap-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Verify your email</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal'">Enter the 6-digit code sent to your
            email
            {{
              Logic.Auth?.AuthUser?.email
              ? `(${Logic.Auth.AuthUser.email})`
              : ""
            }}
          </sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:!px-10 px-0">
        <div class="flex flex-col gap-6 w-full items-center justify-center">
          <div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
            <sofa-otp-input :numberOfInput="6" :type="'tel'" :onChangeOTP="onChangeOTP" v-model="otpValue" />
          </div>

          <div class="w-full flex flex-col pt-3">
            <sofa-button :customClass="'w-full'" :padding="'md:!py-4 py-3'" @click="VerifyUserEmail(otpValue)">
              Verify
            </sofa-button>
          </div>
        </div>

        <div class="flex flex-row items-center gap--3">
          <sofa-normal-text :color="'text-grayColor'">Have an account?</sofa-normal-text>
          <router-link to="/auth/login"><sofa-normal-text :color="'!text-primaryBlue'">Sign
              in</sofa-normal-text></router-link>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"
import { FormValidations, scrollToTop } from "@/composables"
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaButton,
  SofaOtpInput,
} from "sofa-ui-components"
import { Logic } from "sofa-logic"
import { loginForm, SignIn, VerifyUserEmail } from "@/composables/auth"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaButton,
    SofaOtpInput,
  },
  middlewares: {},
  name: "VerifyEmailPage",
  setup () {
    useMeta({
      title: "Verify your email",
    })

    onMounted(() => {
      scrollToTop()
    })

    const otpValue = ref("")

    const onChangeOTP = () => {
      //
    }

    return {
      Logic,
      loginForm,
      FormValidations,
      SignIn,
      onChangeOTP,
      localStorage,
      otpValue,
      VerifyUserEmail,
    }
  },
})
</script>
