<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row gap-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Welcome back</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!font-normal'">Let the progress
            continue</sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:!px-10 px-0">
        <div class="flex flex-col gap-6 w-full">
          <div class="w-full flex flex-col gap-4">
            <div class="w-full flex flex-col items-center justify-center">
              <GoogleLogin :callback="onSuccessGoogle" />
            </div>

            <!-- <div>
              <div
                class="w-full border-[2px] border-[#E1E6EB] custom-border md:!py-4 md:!px-4 px-3 py-3 flex flex-row items-center justify-center"
              >
                <vue-apple-login
                  color="white"
                  :border="false"
                  type="continue"
                  width="100%"
                  height="25"
                  logoSize="large"
                  :onSuccess="onSuccessApple"
                  mode="center-align"
                  :className="'!border-none !h-auto'"
                  :onFailure="onFailure"
                ></vue-apple-login>

              </div>
            </div> -->
          </div>

          <div class="w-full flex flex-row gap-3 items-center pt-2">
            <div class="border-[1px] border-[#E1E6EB] w-full"></div>
            <sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">Or use
              email</sofa-normal-text>
            <div class="border-[1px] border-[#E1E6EB] w-full"></div>
          </div>

          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'Email'" ref="email" v-model="loginForm.email"
              :placeholder="'Email'" :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" :type="'password'" :placeholder="'Password'" :name="'Password'"
              ref="password" :rules="[FormValidations.RequiredRule]" v-model="loginForm.password" />
          </sofa-form-wrapper>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:!py-4 py-3'" @click="SignIn(formComp)">
              Login
            </sofa-button>
          </div>
        </div>

        <div class="w-full flex flex-row items-center justify-center pt-3">
          <router-link to="/auth/forgot-password"><sofa-normal-text :color="'!text-primaryBlue'">Forgot
              password?</sofa-normal-text></router-link>
        </div>

        <div class="flex flex-row items-center gap-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'">Don’t have an account?
          </sofa-normal-text>
          <router-link to="/auth/register"><sofa-normal-text :color="'!text-primaryBlue'">Sign
              up</sofa-normal-text></router-link>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { FormValidations, scrollToTop } from "@/composables"
import { SignIn, loginForm } from "@/composables/auth"
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

    const onSuccessGoogle = (data: any) => {
      Logic.Auth.GoogleSignInForm = {
        accessToken: "",
        idToken: data.credential,
      }
      Logic.Auth.GoogleSignIn()
    }

    const onSuccessApple = (data: any) => {
      console.log(data)
    }

    const onFailure = () => {
      //
    }

    return {
      Logic,
      loginForm,
      FormValidations,
      SignIn,
      formComp,
      onSuccessApple,
      onSuccessGoogle,
      onFailure,
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
