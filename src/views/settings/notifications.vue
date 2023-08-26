<template>
  <expanded-layout
    :hasBottomBar="false"
    layoutStyle="mdlg:!w-[75%] lg:!w-[60%] w-full pt-0  mdlg:!pt-6 "
  >
    <div
      class="w-full flex flex-row items-center space-x-3 z-50 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
    >
      <sofa-icon
        :customClass="'h-[15px]'"
        :name="'back-arrow'"
        @click="Logic.Common.goBack()"
      />
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        Notification</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <div class="w-full flex flex-col px-4">
      <div
        class="w-full flex flex-row justify-between items-center space-x-4 bg-white rounded-[16px] px-4 py-4 shadow-custom"
      >
        <sofa-normal-text :customClass="'!font-bold'"
          >Push notifications</sofa-normal-text
        >
        <div class="!w-auto">
          <sofa-icon
            :customClass="'h-[22px]'"
            :name="notificationIsOn ? 'toggle-on' : 'toggle-off'"
          />
        </div>
      </div>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useMeta } from "vue-meta";
import { SofaNormalText, SofaIcon } from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaIcon,
  },
  middlewares: {
    fetchRules: [],
  },
  name: "NotificationSettingPage",
  setup() {
    useMeta({
      title: "Notification",
    });

    const notificationIsOn = ref(true);

    onMounted(() => {
      //
    });

    return {
      Logic,
      notificationIsOn,
    };
  },
});
</script>
