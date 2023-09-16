<template>
  <auth-layout>
    <div
      class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4"
    >
      <div class="w-full flex flex-row space-x-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon
            :customClass="'md:!h-[26px] h-[20px] cursor-pointer'"
            :name="'auth-goback'"
          />
        </span>

        <div
          class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start space-y-1"
        >
          <sofa-header-text :customClass="'md:!text-2xl text-lg'"
            >Forgot your password</sofa-header-text
          >
          <sofa-normal-text
            :color="'text-grayColor'"
            :customClass="'!font-normal text-center'"
            >Enter the email address associated with your account and we’ll send
            you a link to reset your password</sofa-normal-text
          >
        </div>
      </div>

      <div
        class="h-full flex flex-col items-center space-y-4 justify-center w-full md:!px-10 px-0"
      >
        <div class="flex flex-col space-y-6 w-full">
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
              v-model="emailValue"
              :placeholder="'Email'"
              :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]"
            />
          </sofa-form-wrapper>

          <div class="w-full flex flex-col">
            <sofa-button
              :customClass="'w-full'"
              :padding="'md:!py-4 py-3'"
              @click="forgotPassword()"
            >
              Continue
            </sofa-button>
          </div>
        </div>

        <div class="flex flex-row items-center space-x-2 pt-3">
          <sofa-normal-text :color="'text-grayColor'"
            >Don’t have an account?
          </sofa-normal-text>
          <router-link to="/auth/register"
            ><sofa-normal-text :color="'!text-primaryBlue'"
              >Sign up</sofa-normal-text
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
  SofaButton,
  SofaFormWrapper,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { SignIn } from "@/composables/auth";

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
  setup() {
    useMeta({
      title: "Forgot password",
    });

    onMounted(() => {
      scrollToTop();
    });

    const formComp = ref<any>();

    const emailValue = ref("");

    const forgotPassword = () => {
      const state = formComp.value.validate();

      if (state) {
        Logic.Auth.SendPasswordResetMail(emailValue.value).then((data) => {
          if (data) {
            Logic.Common.GoToRoute("/auth/reset-password");
          }
        });
      }
    };

    return {
      Logic,
      emailValue,
      FormValidations,
      formComp,
      SignIn,
      forgotPassword,
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
