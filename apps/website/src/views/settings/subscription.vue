<template>
  <SettingsLayout title="Subscription">
    <setting-subscription />
  </SettingsLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from "vue-meta";
import SettingsLayout from "@/components/settings/SettingsLayout.vue";
import SettingSubscription from "@/components/settings/subscription.vue";

export default defineComponent({
  components: {
    SettingsLayout,
    SettingSubscription,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Payment",
        property: "AllPlans",
        method: "GetPlans",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
    ],
  },
  name: "SubscriptionSettingPage",
  setup() {
    useMeta({
      title: "Subscription",
    });
  },
});
</script>
