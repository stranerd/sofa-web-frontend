<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:px-9 md:py-5 p-4">
      <div class="w-full flex gap-4 md:items-center">
        <a class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </a>

        <div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Create your account</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal'">Join the School Of Future Africa</sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10">
        <div class="flex flex-col gap-6 w-full">
          <AuthProvider />

          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:p-4 p-3'" type="email" :name="'Email'" ref="email"
              v-model="registerForm.email" :placeholder="'Email'"
              :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:p-4 p-3'" :type="'password'" :placeholder="'Password'" :name="'Password'"
              ref="password" :rules="[FormValidations.RequiredRule]" v-model="registerForm.password" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:p-4 p-3'" type="password" :name="'Confirm password'"
              ref="confirm_new_password" v-model="registerForm.confirm_password" :placeholder="'Confirm password'"
              :rules="[FormValidations.RequiredRule, FormValidations.customValidator(registerForm.password == registerForm.confirm_password, 'Passwords do not match')]" />
          </sofa-form-wrapper>

          <div class="flex flex-col items-center gap-2">
            <sofa-checkbox v-model="termsAccepted">
              <span class="text-grayColor text-left">
                I have read and accepted SOFA’s
                <a class="text-primaryBlue hover:underline">Terms of Service</a>
                <span> and </span>
                <a class="text-primaryBlue hover:underline">Privacy Policy</a>
              </span>
            </sofa-checkbox>
          </div>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" @click="SignUp(formComp)">
              Sign Up
            </sofa-button>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'">Have an account?</sofa-normal-text>
          <router-link to="/auth/login">
            <sofa-normal-text :color="'!text-primaryBlue'">Sign in</sofa-normal-text>
          </router-link>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import AuthProvider from "@/components/auth/AuthProvider.vue"
import { FormValidations } from "@/composables"
import { SignUp, registerForm, termsAccepted } from "@/composables/auth"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaCheckbox,
  SofaFormWrapper,
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import { defineComponent, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    AuthProvider,
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaCheckbox,
    SofaButton,
    SofaFormWrapper,
  },
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  middlewares: {},
  name: "AuthRegisterPage",
  setup () {
    useMeta({
      title: "Create Your Account",
    })

    const formComp = ref<any>()

    return {
      Logic,
      formComp,
      registerForm,
      FormValidations,
      termsAccepted,
      SignUp,
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
