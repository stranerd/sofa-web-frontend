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
        Profile</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <setting-profile />
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import { SofaNormalText, SofaIcon } from "sofa-ui-components";
import { Logic } from "sofa-logic";
import SettingProfile from "@/components/settings/profile.vue";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaNormalText,
    SettingProfile,
    SofaIcon,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Users",
        property: "Verifications",
        method: "GetVerifications",
        params: [
          {
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          },
        ],
        requireAuth: true,
      },
    ],
  },
  name: "ProfileSettingPage",
  setup() {
    useMeta({
      title: "Profile",
    });

    onMounted(() => {
      //
    });

    return {
      Logic,
    };
  },
});
</script>
