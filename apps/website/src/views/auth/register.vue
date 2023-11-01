<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row space-x-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start space-y-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">{{
            accountType == "organization"
            ? "Set up your organization"
            : "Create your account"
          }}</sofa-header-text>
          <sofa-normal-text v-if="accountType != 'organization'" :color="'text-grayColor'"
            :customClass="'!font-normal'">Join the School Of Future Africa</sofa-normal-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center space-y-4 justify-center w-full md:!px-10 px-0">
        <div class="flex flex-col space-y-6 w-full">
          <template v-if="accountType != 'organization'">
            <div class="w-full flex flex-col space-y-4">
              <div class="w-full flex flex-col items-center justify-center">
                <GoogleLogin :callback="onSuccessGoogle" prompt />
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

            <div class="w-full flex flex-row space-x-3 items-center pt-2">
              <div class="border-[1px] border-[#E1E6EB] w-full"></div>
              <sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">Or use
                email</sofa-normal-text>
              <div class="border-[1px] border-[#E1E6EB] w-full"></div>
            </div>
          </template>

          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col space-y-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'Organization name'" ref="first_name"
              v-if="accountType == 'organization'" v-model="registerForm.organization_name"
              :placeholder="'Name of organization'" :rules="[FormValidations.RequiredRule]" />

            <sofa-textarea :hasTitle="false"
              :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint  !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
              :placeholder="'About the organization'" v-model="registerForm.description"
              :rules="[FormValidations.RequiredRule]" ref="description" v-if="accountType == 'organization'" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="email" :name="'Email'" ref="email"
              v-model="registerForm.email" :placeholder="'Email'"
              :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" :type="'password'" :placeholder="'Password'" :name="'Password'"
              ref="password" :rules="[FormValidations.RequiredRule]" v-model="registerForm.password" />
          </sofa-form-wrapper>

          <div class="flex flex-col items-center space-x-2">
            <sofa-checkbox v-model="termsAccepted">
              <span class="text-grayColor text-left">
                I have read and accepted SOFA’s
                <a class="text-primaryBlue hover:underline" target="_blank" href="#">Terms of Service</a>
                <span> and </span>
                <a class="text-primaryBlue hover:underline" target="_blank" href="#">Privacy Policy</a>
              </span>
            </sofa-checkbox>
          </div>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:!py-4 py-3'" @click="SignUp(formComp, accountType)">
              {{ accountType == "organization" ? "Get started" : "Sign Up" }}
            </sofa-button>
          </div>
        </div>

        <div class="flex flex-row items-center space-x-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'">Have an account?</sofa-normal-text>
          <router-link to="/auth/login"><sofa-normal-text :color="'!text-primaryBlue'">Sign
              in</sofa-normal-text></router-link>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { FormValidations, scrollToTop } from "@/composables"
import { SignUp, registerForm, termsAccepted } from "@/composables/auth"
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaCheckbox,
  SofaFormWrapper,
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaCheckbox,
    SofaButton,
    SofaFormWrapper,
    SofaTextarea,
  },
  middlewares: {},
  name: "AuthRegisterPage",
  setup () {
    useMeta({
      title: "Create Your Account",
    })

    const accountType = ref("student")

    const formComp = ref<any>()

    onMounted(() => {
      // get account type
      const routeQueries = Logic.Common.route.query

      if (routeQueries?.type) {
        localStorage.setItem(
          "user_account_type",
          routeQueries?.type.toString()
        )
        accountType.value = routeQueries?.type.toString()
      }
      scrollToTop()
    })

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
      formComp,
      registerForm,
      FormValidations,
      termsAccepted,
      accountType,
      SignUp,
      onSuccessGoogle,
      onSuccessApple,
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
