<template>
  <auth-layout title="Create your account" subTitle="Join the School Of Future Africa">
    <div class="flex flex-col gap-6 w-full">
      <AuthProvider />

      <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="email" :name="'Email'" ref="email" v-model="registerForm.email"
          :placeholder="'Email'" :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" :type="'password'" :placeholder="'Password'" :name="'Password'" ref="password"
          :rules="[FormValidations.RequiredRule]" v-model="registerForm.password" />
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="password" :name="'Confirm password'" ref="confirm_new_password"
          v-model="registerForm.confirm_password" :placeholder="'Confirm password'"
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
  </auth-layout>
</template>

<script lang="ts">
import AuthProvider from "@/components/auth/AuthProvider.vue"
import { FormValidations } from "@/composables"
import { generateMiddlewares } from '@/middlewares'
import { Logic, SignUpInput } from 'sofa-logic'
import {
  SofaButton,
  SofaCheckbox,
  SofaFormWrapper,
  SofaNormalText,
  SofaTextField
} from "sofa-ui-components"
import { defineComponent, reactive, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    AuthProvider,
    SofaNormalText,
    SofaTextField,
    SofaCheckbox,
    SofaButton,
    SofaFormWrapper,
  },
  name: "AuthRegisterPage",
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  setup () {
    useMeta({
      title: "Create Your Account",
    })

    const formComp = ref<any>()

    const registerForm = reactive<SignUpInput & { confirm_password: string }>({
      email: '',
      name: {
        first: '',
        last: '',
      },
      password: '',
      confirm_password: '',
      organization_name: '',
      description: '',
    })

    const termsAccepted = ref(false)

    const SignUp = (formComp: any) => {
      Logic.Auth.SignUpForm = {
        email: registerForm.email,
        name: {
          first: 'new',
          last: 'user',
        },
        password: registerForm.password,
        description: registerForm.description,
      }

      const formState: boolean = formComp.validate()

      if (!termsAccepted.value) {
        Logic.Common.showLoader({
          show: true,
          message: 'Please accept the terms and conditions',
          type: 'warning',
        })
        return
      }

      Logic.Auth.SignUp(formState)
        .then((data) => {
          if (data) {
            Logic.Common.hideLoader()
            Logic.Common.GoToRoute('/auth/verify-email')
          }
        })
        .catch((error) => {
          Logic.Common.showValidationError(error, formComp)
        })
    }

    return {
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
