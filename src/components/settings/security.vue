<template>
  <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Password
      </sofa-header-text>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'"
        type="password"
        :name="'Current password'"
        ref="current.password"
        :placeholder="'Current password'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
      />

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'"
        type="password"
        :name="'New password'"
        ref="new.password"
        :placeholder="'New password'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
      />

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-3'"
        type="password"
        :name="'Confirm new password'"
        ref="new.password"
        :placeholder="'Confirm new password'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
      />
    </div>

    <div class="h-[40px]"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { SofaHeaderText, SofaTextField } from "sofa-ui-components";
import { FormValidations } from "@/composables";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaTextField,
  },
  setup() {
    return {
      FormValidations,
    };
  },
});
</script>
