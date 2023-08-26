<template>
  <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Contact details
      </sofa-header-text>

      <div class="w-full flex flex-row items-center space-x-5 flex-wrap">
        <sofa-icon :customClass="'h-[15px]'" :name="'email-social'" />
        <sofa-icon :customClass="'h-[22px]'" :name="'whatsapp-social'" />
        <sofa-icon :customClass="'h-[18px]'" :name="'instagram-social'" />
        <sofa-icon :customClass="'h-[18px]'" :name="'tiktok-social'" />
        <sofa-icon :customClass="'h-[18px]'" :name="'twitter-social'" />
      </div>
    </div>

    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Give feedback
      </sofa-header-text>

      <sofa-textarea
        :hasTitle="false"
        :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
        :placeholder="'Let us know how we can help'"
        :richEditor="false"
      />

      <div class="w-full flex flex-row justify-end">
        <div class="flex flex-row">
          <sofa-button :padding="'px-7 py-2'" :customClass="'!w-auto'">
            Send
          </sofa-button>
        </div>
      </div>
    </div>

    <div class="h-[40px]"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  SofaHeaderText,
  SofaIcon,
  SofaTextarea,
  SofaButton,
} from "sofa-ui-components";
import { FormValidations } from "@/composables";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaIcon,
    SofaTextarea,
    SofaButton,
  },
  setup() {
    return {
      FormValidations,
    };
  },
});
</script>
