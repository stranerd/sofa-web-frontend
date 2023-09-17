<template>
  <div
    class="fixed top-0 left-0 h-full w-full bg-transparent z-[999999999999999999]"
    v-if="loaderSetup.loading"
  >
    <div class="loader w-full fixed left-0 top-0 overflow-x-hidden">
      <div class="bar"></div>
    </div>
  </div>

  <metainfo>
    <template #title="{ content }">{{
      content ? `${content} | SOFA` : `SOFA`
    }}</template>
  </metainfo>
  <router-view />
  <sofa-alert
    :content="loaderSetup.message"
    v-if="loaderSetup.show"
    :close="
      () => {
        loaderSetup.show = false;
      }
    "
    :type="loaderSetup.type"
  />
</template>
<script lang="ts">
import { useMeta } from "vue-meta";
import { defineComponent, onMounted, ref } from "vue";
import { Logic } from "sofa-logic";
import { SofaAlert } from "sofa-ui-components";

export default defineComponent({
  components: {
    SofaAlert,
  },
  setup() {
    useMeta({
      title: "Home",
      htmlAttrs: { lang: "en", amp: true },
    });

    const loaderSetup = ref(Logic.Common.loaderSetup);

    onMounted(() => {
      Logic.Common.watchProperty("loaderSetup", loaderSetup);
    });

    return {
      loaderSetup,
    };
  },
});
</script>
<style>
body,
html {
  -webkit-tap-highlight-color: transparent;
}
</style>