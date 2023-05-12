<template>
  <div
    class="loader z-[45666664999998] !sticky top-0 overflow-x-hidden"
    v-if="loaderSetup.show"
  >
    <div class="bar"></div>
  </div>
  <metainfo>
    <template #title="{ content }">{{
      content ? `${content} | SOFA` : `SOFA`
    }}</template>
  </metainfo>
  <router-view />
</template>
<script lang="ts">
import { useMeta } from "vue-meta";
import { defineComponent, onMounted, ref } from "vue";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {},
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
