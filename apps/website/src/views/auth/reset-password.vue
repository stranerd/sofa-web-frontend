<template>
  <auth-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative md:!px-9 md:!py-5 py-4 px-4">
      <div class="w-full flex flex-row gap-4 md:!items-center">
        <span class="w-[28px] pt-2 md:!pt-0" @click="Logic.Common.goBack()">
          <sofa-icon :customClass="'md:!h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
        </span>

        <div class="w-full flex flex-col md:!justify-center md:!items-center justify-start items-start gap-1">
          <sofa-header-text :customClass="'md:!text-2xl text-lg'">Reset your password</sofa-header-text>
        </div>
      </div>

      <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:!px-10 px-0">
        <div class="flex flex-col gap-6 w-full">
          <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="tel" :name="'Token'" ref="token" v-model="passwordForm.token"
              :placeholder="'Enter 6-digit token'" :rules="[FormValidations.RequiredRule]" />

            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="password" :name="'New password'" ref="new_password"
              v-model="passwordForm.password" :placeholder="'New password'" :rules="[FormValidations.RequiredRule]" />

            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="password" :name="'Confirm password'"
              ref="confirm_new_password" v-model="passwordForm.confirm_password" :placeholder="'Confirm new password'"
              :rules="[
                FormValidations.RequiredRule,
                FormValidations.customValidator(
                  passwordForm.password == passwordForm.confirm_password,
                  'Password do not match'
                ),
              ]" />
          </sofa-form-wrapper>

          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full'" :padding="'md:!py-4 py-3'" @click="resetPassword()">
              Continue
            </sofa-button>
          </div>
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
import { SignIn } from "@/composables/auth"
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaFormWrapper,
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import { defineComponent, onMounted, reactive, ref } from "vue"
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
  name: "AuthResetPasswordPage",
  setup () {
    useMeta({
      title: "Reset password",
    })

    onMounted(() => {
      scrollToTop()
    })

    const formComp = ref<any>()

    const passwordResetIsDone = ref(false)

    const passwordForm = reactive({
      password: "",
      confirm_password: "",
      token: "",
    })

    const resetPassword = () => {
      const state = formComp.value.validate()

      if (state) {
        Logic.Auth.ResetPasswordWithTokenForm = {
          password: passwordForm.confirm_password,
          token: passwordForm.token,
        }
        Logic.Auth.ResetPasswordWithToken(true).then(() => {
          //
        })
      }
    }

    return {
      Logic,
      passwordForm,
      FormValidations,
      formComp,
      passwordResetIsDone,
      resetPassword,
      SignIn,
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
