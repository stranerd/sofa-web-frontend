<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:py-5 p-4">
      <div class="w-full flex gap-4 md:items-center">
        <a class="w-[28px] pt-2 md:pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </a>

        <div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Forgot your password</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal text-center'">
            Enter the email address associated with your account and we’ll send you a link to reset your password
          </sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10">
        <div class="flex flex-col gap-6 w-full">
          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:p-4 p-3'" type="text" :name="'Email'" ref="email" v-model="emailValue"
              :placeholder="'Email'" :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
          </sofa-form-wrapper>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" @click="forgotPassword()">
              Continue
            </sofa-button>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'">Don’t have an account?</sofa-normal-text>
          <router-link to="/auth/register">
            <sofa-normal-text :color="'!text-primaryBlue'">Sign up</sofa-normal-text>
          </router-link>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { FormValidations, scrollToTop } from "@/composables"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaFormWrapper,
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaButton,
    SofaFormWrapper,
  },
  middlewares: {},
  name: "AuthForgotPasswordPage",
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  setup () {
    useMeta({
      title: "Forgot password",
    })

    onMounted(() => {
      scrollToTop()
    })

    const formComp = ref<any>()

    const emailValue = ref("")

    const forgotPassword = () => {
      const state = formComp.value.validate()

      if (state) {
        Logic.Auth.SendPasswordResetMail(emailValue.value).then((data) => {
          if (data) {
            Logic.Common.GoToRoute("/auth/reset-password")
          }
        })
      }
    }

    return {
      Logic,
      emailValue,
      FormValidations,
      formComp,
      forgotPassword,
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
