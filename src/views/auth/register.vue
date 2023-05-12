<template>
  <auth-layout>
    <div
      class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4"
    >
      <div class="w-full flex flex-row space-x-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon
            :customClass="'md:!h-[26px] h-[20px]'"
            :name="'auth-goback'"
          />
        </span>

        <div
          class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start space-y-1"
        >
          <sofa-header-text :customClass="'md:!text-2xl text-lg'"
            >Create your account</sofa-header-text
          >
          <sofa-normal-text
            :color="'text-grayColor'"
            :customClass="'!font-normal'"
            >Join the School Of Future Africa</sofa-normal-text
          >
        </div>
      </div>

      <div
        class="h-full flex flex-col items-center space-y-4 justify-center w-full md:!px-10 px-0"
      >
        <div class="flex flex-col space-y-6 w-full">
          <div class="w-full flex flex-col space-y-4">
            <div
              class="w-full border-[2px] border-[#E1E6EB] custom-border md:!py-4 md:!px-4 px-3 py-3 flex flex-row space-x-2 items-center justify-center"
            >
              <sofa-icon :customClass="'h-[16px]'" :name="'google'" />
              <sofa-normal-text :custom-class="'!font-semibold'"
                >Continue with Google</sofa-normal-text
              >
            </div>

            <div
              class="w-full border-[2px] border-[#E1E6EB] custom-border md:!py-4 md:!px-4 px-3 py-3 flex flex-row space-x-2 items-center justify-center"
            >
              <sofa-icon :customClass="'h-[17px]'" :name="'apple'" />
              <sofa-normal-text :custom-class="'!font-semibold'"
                >Continue with Apple</sofa-normal-text
              >
            </div>
          </div>

          <div class="w-full flex flex-row space-x-3 items-center pt-2">
            <div class="border-[1px] border-[#E1E6EB] w-full"></div>
            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!whitespace-nowrap'"
              >Or use email</sofa-normal-text
            >
            <div class="border-[1px] border-[#E1E6EB] w-full"></div>
          </div>

          <sofa-form-wrapper
            :parentRefs="parentRefs"
            ref="formComp"
            class="w-full flex flex-col space-y-4"
          >
            <sofa-text-field
              :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'"
              type="text"
              :name="'Email'"
              ref="email"
              v-model="registerForm.email"
              :placeholder="'Email'"
              :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]"
            />
            <sofa-text-field
              :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'"
              :type="'password'"
              :placeholder="'Password'"
              :name="'Password'"
              ref="password"
              :rules="[FormValidations.RequiredRule]"
              v-model="registerForm.password"
            />
          </sofa-form-wrapper>

          <div class="flex flex-col items-center space-x-2">
            <sofa-checkbox v-model="termsAccepted">
              <span class="text-grayColor text-left">
                I have read and accepted SOFA’s
                <span class="text-primaryBlue">Terms of Service</span>
                <span> and </span>
                <span class="text-primaryBlue">Privacy Policy</span>
              </span>
            </sofa-checkbox>
          </div>

          <div class="w-full flex flex-col">
            <sofa-button
              :customClass="'w-full'"
              :padding="'md:!py-4 py-3'"
              @click="SignUp(formComp)"
            >
              Sign Up
            </sofa-button>
          </div>
        </div>

        <div class="flex flex-row items-center space-x-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'"
            >Have an account?</sofa-normal-text
          >
          <router-link to="/auth/login"
            ><sofa-normal-text :color="'!text-primaryBlue'"
              >Sign in</sofa-normal-text
            ></router-link
          >
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useMeta } from "vue-meta";
import { FormValidations, scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaTextField,
  SofaCheckbox,
  SofaButton,
  SofaFormWrapper,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { registerForm, SignUp, termsAccepted } from "@/composables/auth";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaCheckbox,
    SofaButton,
    SofaFormWrapper,
  },
  middlewares: {},
  name: "AuthRegisterPage",
  setup() {
    useMeta({
      title: "Create Your Account",
    });

    const formComp = ref<any>();

    onMounted(() => {
      scrollToTop();
    });

    return {
      Logic,
      formComp,
      registerForm,
      FormValidations,
      termsAccepted,
      SignUp,
    };
  },
  data() {
    return {
      parentRefs: null,
    };
  },
  mounted() {
    const parentRefs: any = this.$refs;
    this.parentRefs = parentRefs;
  },
});
</script>
