<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import AppLayoutDefault from "./AppLayoutDefault.vue";
import Dashboard from "./Dashboard.vue";
import Auth from "./Auth.vue";
import { shallowRef, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "AppLayout",
  setup() {
    const layout = shallowRef();
    const route = useRoute();
    watch(
      () => route.meta,
      (meta) => {
        try {
          if (meta.layout == "Dashboard") layout.value = Dashboard;
          if (meta.layout == "Auth") layout.value = Auth;
        } catch (e) {
          layout.value = AppLayoutDefault;
        }
      },
      { immediate: true }
    );
    return { layout };
  },
};
</script>
