<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 p-4">
      <div class="w-full flex gap-4 md:items-center">
        <a class="w-[28px] pt-2 md:pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </a>

        <div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Welcome back</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal'">Let the progress continue</sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-7 justify-center w-full md:px-10">
        <div class="flex flex-col gap-6 w-full">
          <AuthProvider />

          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:!p-4 p-3'" type="text" :name="'Email'" ref="email" v-model="loginForm.email"
              :placeholder="'Email'" :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
              :padding="'md:!p-4 p-3'" :type="'password'" :placeholder="'Password'" :name="'Password'" ref="password"
              :rules="[FormValidations.RequiredRule]" v-model="loginForm.password" />
          </sofa-form-wrapper>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:!py-4 py-3'" @click="SignIn(formComp)">
              Login
            </sofa-button>
          </div>
        </div>

        <div class="w-full flex items-center justify-center">
          <router-link to="/auth/forgot-password">
            <sofa-normal-text :color="'!text-primaryBlue'">Forgot password?</sofa-normal-text>
          </router-link>
        </div>

        <div class="flex items-center gap-2">
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
import AuthProvider from "@/components/auth/AuthProvider.vue"
import { FormValidations, scrollToTop } from "@/composables"
import { SignIn, loginForm } from "@/composables/auth"
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
    AuthProvider,
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaButton,
    SofaFormWrapper,
  },
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  name: "AuthLoginPage",
  setup () {
    useMeta({
      title: "Login To Your Account",
    })

    onMounted(() => {
      scrollToTop()
      if (Logic.Auth.AuthUser) {
        Logic.Common.GoToRoute("/", true)
      }
    })

    const formComp = ref<any>()

    return {
      Logic,
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
