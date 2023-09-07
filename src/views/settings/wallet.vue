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
        Wallet</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <setting-wallet />
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import { SofaNormalText, SofaIcon } from "sofa-ui-components";
import SettingWallet from "@/components/settings/wallet.vue";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaNormalText,
    SettingWallet,
    SofaIcon,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Payment",
        property: "UserWallet",
        method: "GetUserWallet",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "AllCommercialBanks",
        method: "GetCommercialBanks",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "AllTransactions",
        method: "GetTransactions",
        params: [
          {
            limit: 10,
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
            sort: [
              {
                field: "createdAt",
                desc: false,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "PaymentMethods",
        method: "GetPaymentMethods",
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
        ignoreProperty: false,
      },
    ],
  },
  name: "WalletSettingPage",
  setup() {
    useMeta({
      title: "Wallet",
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
