<template>
  <auth-layout title="Forgot your password" subTitle="Enter the email address associated with your account and we’ll send you a link to reset your password">
    <div class="flex flex-col gap-6 w-full">
      <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="text" :name="'Email'" ref="email" v-model="emailValue" :placeholder="'Email'"
          :rules="[FormValidations.RequiredRule, FormValidations.EmailRule]" />
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
  </auth-layout>
</template>

<script lang="ts">
import { FormValidations } from "@/composables"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaFormWrapper,
  SofaNormalText,
  SofaTextField
} from "sofa-ui-components"
import { defineComponent, ref } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaTextField,
    SofaButton,
    SofaFormWrapper,
  },
  name: "AuthForgotPage",
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  setup () {
    useMeta({
      title: "Forgot password",
    })

    const formComp = ref<any>()

    const emailValue = ref("")

    const forgotPassword = () => {
      if (formComp.value.validate()) {
        Logic.Auth.SendPasswordResetMail(emailValue.value)
          .then((data) => {
            if (!data) return
            Logic.Common.showAlert({
              message: 'A password reset token has been sent to your email',
              type: 'success',
            })
            Logic.Common.GoToRoute("/auth/reset")
          })
          .catch((error) => {
            Logic.Common.showError(error.response.data[0]?.message)
          })
      }
    }

    return {
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
