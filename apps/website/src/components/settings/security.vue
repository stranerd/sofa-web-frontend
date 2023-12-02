<template>
  <div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
    <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp"
      class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Password
      </sofa-header-text>

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="password" :name="'Current password'" ref="oldPassword"
        :placeholder="'Current password'" :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
        v-model="passwordResetForm.old_password" :update-value="passwordResetForm.old_password" />

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="password" :name="'New password'" ref="password"
        :placeholder="'New password'" :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
        v-model="passwordResetForm.new_password" :update-value="passwordResetForm.new_password" />

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="password" :name="'Confirm new password'" ref="new.password"
        :placeholder="'Confirm new password'" :rules="[
          FormValidations.RequiredRule,
          FormValidations.customValidator(
            passwordResetForm.confirm_password ==
            passwordResetForm.new_password,
            'Password do not match.'
          ),
        ]" :borderColor="'border-transparent'" v-model="passwordResetForm.confirm_password"
        :update-value="passwordResetForm.confirm_password" />
      <div class="w-full flex flex-row justify-end">
        <div class="flex flex-row">
          <sofa-button :padding="'px-7 py-2'" :customClass="'!w-auto'" @click.prevent="updateUserPassword()">
            Update
          </sofa-button>
        </div>
      </div>
    </sofa-form-wrapper>

    <div class="h-[40px]"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import {
  SofaHeaderText,
  SofaTextField,
  SofaButton,
  SofaFormWrapper,
} from "sofa-ui-components"
import { FormValidations } from "@/composables"
import { Logic } from "sofa-logic"

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaTextField,
    SofaButton,
    SofaFormWrapper,
  },
  setup () {
    const formComp = ref<any>()

    const passwordResetForm = reactive({
      old_password: "",
      new_password: "",
      confirm_password: "",
    })

    const updateUserPassword = () => {
      const state = formComp.value.validate()

      if (state) {
        Logic.Auth.UpdatePasswordForm = {
          oldPassword: passwordResetForm.old_password,
          password: passwordResetForm.new_password,
        }
        Logic.Auth.UpdatePassword(true)
          .then(() => {
            Logic.Common.showAlert({
              message: "Your password has been updated",
              type: "success",
            })
            passwordResetForm.confirm_password = ""
            passwordResetForm.new_password = ""
            passwordResetForm.old_password = ""
          })
          .catch((error) => {
            console.log(error)
            Logic.Common.showValidationError(error, formComp.value)
          })
      }
    }
    return {
      FormValidations,
      passwordResetForm,
      formComp,
      updateUserPassword,
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
