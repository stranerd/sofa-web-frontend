<template>
  <auth-layout title="Welcome back" subTitle="Let the progress continue">
    <div class="flex flex-col gap-6 w-full">
      <AuthProvider />

      <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="text" :name="'Email'" ref="email" v-model="loginForm.email" :placeholder="'Email'"
          :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" :type="'password'" :placeholder="'Password'" :name="'Password'" ref="password"
          :rules="[FormValidations.RequiredRule]" v-model="loginForm.password" />
      </sofa-form-wrapper>

      <div class="w-full flex flex-col">
        <sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" @click="SignIn">
          Login
        </sofa-button>
      </div>
    </div>

    <div class="w-full flex items-center justify-center pt-3">
      <router-link to="/auth/forgot">
        <sofa-normal-text :color="'!text-primaryBlue'">Forgot password?</sofa-normal-text>
      </router-link>
    </div>

    <div class="flex items-center gap-2 pt-3">
      <sofa-normal-text :color="'text-grayColor'">Don’t have an account?</sofa-normal-text>
      <router-link to="/auth/register">
        <sofa-normal-text :color="'!text-primaryBlue'">Sign up</sofa-normal-text>
      </router-link>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import AuthProvider from "@/components/auth/AuthProvider.vue"
import { FormValidations } from "@/composables"
import { createSession } from '@/composables/auth/session'
import { generateMiddlewares } from '@/middlewares'
import { Logic, SignInInput } from 'sofa-logic'
import {
  SofaButton,
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
    SofaButton,
    SofaFormWrapper,
  },
  name: "AuthLoginPage",
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  setup () {
    useMeta({
      title: "Login To Your Account",
    })

    const formComp = ref<any>()

    const loginForm = reactive<SignInInput>({
      email: '',
      password: '',
    })

    const SignIn = async () => {
      if (formComp.value.validate()) await Logic.Auth.SignIn({
        email: loginForm.email,
        password: loginForm.password,
      })
        .then(createSession)
        .catch((error) => {
          Logic.Common.showValidationError(error, formComp)
        })
    }

    return {
      loginForm,
      FormValidations,
      SignIn,
      formComp,
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
