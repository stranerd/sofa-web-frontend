<template>
  <global-layout>
    <sub-page-layout>
      <div
        class="w-full h-full flex-grow flex flex-col justify-between relative"
      >
        <div
          class="w-full flex flex-row items-center space-x-3 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
        >
          <sofa-icon
            :customClass="'h-[15px]'"
            :name="'back-arrow'"
            @click="Logic.Common.goBack()"
          />
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Setup Your Account</sofa-normal-text
          >
          <div></div>
        </div>

        <div class="w-full flex flex-col h-full bg-white flex-grow px-4 py-4">
          <account-setup />
        </div>

        <div class="w-full flex flex-row"></div>
      </div>
    </sub-page-layout>
  </global-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import { scrollToTop } from "@/composables";
import { SofaIcon, SofaNormalText } from "sofa-ui-components";
import { Logic } from "sofa-logic";
import AccountSetup from "@/components/onboarding/AccountSetup.vue";
import { onIonViewWillEnter } from "@ionic/vue";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    AccountSetup,
  },
  middlewares: {},
  name: "AccountSetupPage",
  setup() {
    useMeta({
      title: "Setup Your Account",
    });

    onMounted(() => {
      scrollToTop();
    });

    onIonViewWillEnter(() => {
      scrollToTop();
    });

    return {
      Logic,
    };
  },
});
</script>
