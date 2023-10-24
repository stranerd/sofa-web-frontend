<template>
  <div
    :class="`w-full h-full flex flex-row fixed top-0 left-0 bg-white items-center justify-center ${
      Logic.Common.isNativeApp ? '!font-lexend  overflow-y-auto ' : ''
    } `"
  >
    <div
      class="bg-white w-full lg:!w-[45%] mdlg:!w-[50%] h-full flex flex-col items-center justify-center mdlg:!pt-9 md:!pt-9 pt-0"
    >
      <slot />
    </div>

    <sofa-image-loader
      :customClass="`bg-primaryPurple hidden mdlg:!flex flex-col relative lg:!w-[55%] mdlg:!w-[50%] h-full items-center justify-center pt-9`"
      :photoUrl="'/images/auth-bg.png'"
    >
      <div
        class="w-full h-full bg-[#141618] bg-opacity-75 top-0 left-0 absolute flex flex-col space-y-5 px-[14%] py-6 justify-center"
      >
        <div class="w-full flex flex-row">
          <div class="bg-white custom-border px-5 py-3">
            <sofa-normal-text
              :customClass="'!font-bold !text-base space-x-2 flex flex-row'"
            >
              <span> Did you know? </span>
              <sofa-icon :name="'idea'" :customClass="'h-[20px]'" />
            </sofa-normal-text>
          </div>
        </div>
        <sofa-normal-text
          :color="'text-white'"
          :customClass="' text-left !text-2xl'"
        >
          The human brain can store about 2.5 petabytes of information? That's
          roughly equivalent to three million hours of TV shows.
        </sofa-normal-text>
      </div>
    </sofa-image-loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SofaImageLoader, SofaNormalText, SofaIcon } from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaImageLoader,
    SofaNormalText,
    SofaIcon,
  },
  name: "AuthLayout",
  setup() {
    return {
      Logic,
    };
  },
});
</script>
