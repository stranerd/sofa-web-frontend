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
  <study-mode-modal />
  <!-- Save to folder -->
  <save-to-folder
    v-if="showSaveToFolder"
    :close="
      () => {
        showSaveToFolder = false;
      }
    "
  />
  <!-- Report material -->
  <rate-and-review-modal
    v-if="reportMaterialSetup.show"
    :close="
      () => {
        reportMaterialSetup.show = false;
      }
    "
    :canClose="true"
    :has-ratings="false"
    :title="`Report this ${reportMaterialSetup.type}`"
    @on-review-submitted="
      (data) => {
        sendReportMaterial(data);
      }
    "
  />
</template>
<script lang="ts">
import { useMeta } from "vue-meta";
import { defineComponent, onMounted, ref } from "vue";
import { Logic } from "sofa-logic";
import { SofaAlert } from "sofa-ui-components";
import SaveToFolder from "./components/common/SaveToFolder.vue";
import StudyModeModal from './components/library/StudyModeModal.vue';
import {
  reportMaterialSetup,
  sendReportMaterial,
  showSaveToFolder,
} from "./composables/library";
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue";

export default defineComponent({
  components: {
    SofaAlert,
    SaveToFolder,
    RateAndReviewModal,
    StudyModeModal,
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
      showSaveToFolder,
      reportMaterialSetup,
      sendReportMaterial,
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
