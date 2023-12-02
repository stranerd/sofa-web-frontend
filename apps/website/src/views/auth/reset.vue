<template>
  <auth-layout title="Reset your password">
    <div class="flex flex-col gap-6 w-full">
      <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="tel" :name="'Token'" ref="token" v-model="passwordForm.token"
          :placeholder="'Enter 6-digit token'" :rules="[FormValidations.RequiredRule]" />

        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="password" :name="'New password'" ref="new_password"
          v-model="passwordForm.password" :placeholder="'New password'" :rules="[FormValidations.RequiredRule]" />

        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor'"
          :padding="'md:p-4 p-3'" type="password" :name="'Confirm password'" ref="confirm_new_password"
          v-model="passwordForm.confirm_password" :placeholder="'Confirm new password'" :rules="[
            FormValidations.RequiredRule,
            FormValidations.customValidator(passwordForm.password == passwordForm.confirm_password, 'Passwords do not match'),
          ]" />
      </sofa-form-wrapper>

      <div class="w-full flex flex-col">
        <sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" @click="resetPassword()">
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
import { createSession } from '@/composables/auth/session'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
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
    SofaNormalText,
    SofaTextField,
    SofaButton,
    SofaFormWrapper,
  },
  name: "AuthResetPage",
  beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
  setup () {
    useMeta({
      title: "Reset password",
    })

    const formComp = ref<any>()

    const passwordResetIsDone = ref(false)

    const passwordForm = reactive({
      password: "",
      confirm_password: "",
      token: "",
    })

    const resetPassword = () => {
      if (formComp.value.validate()) {
        Logic.Auth.ResetPasswordWithToken({
          password: passwordForm.confirm_password,
          token: passwordForm.token,
        })
          .then(createSession)
          .catch((error) => {
            Logic.Common.showError(error?.response?.data[0]?.message)
          })
      }
    }

    return {
      passwordForm,
      FormValidations,
      formComp,
      passwordResetIsDone,
      resetPassword,
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
