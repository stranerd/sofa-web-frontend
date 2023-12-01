<template>
  <div class="fixed top-0 left-0 h-full w-full bg-[#00000050] z-[100000000000] cursor-not-allowed"
    v-if="loaderSetup.loading">
    <div class="loader w-full overflow-x-hidden">
      <div class="bar"></div>
    </div>
  </div>
  <metainfo>
    <template #title="{ content }">{{
      content ? `${content} | SOFA` : `SOFA`
    }}</template>
  </metainfo>
  <router-view />
  <sofa-alert :content="loaderSetup.message" v-if="loaderSetup.show" :close="() => loaderSetup.show = false" :type="loaderSetup.type" />
  <study-mode-modal />
  <!-- Save to folder -->
  <save-to-folder v-if="showSaveToFolder" :close="() => showSaveToFolder = false" />
  <!-- Report material -->
  <rate-and-review-modal v-if="reportMaterialSetup.show" :close="() => reportMaterialSetup.show = false" :canClose="true"
    :has-ratings="false" :title="`Report this ${reportMaterialSetup.type}`" @on-review-submitted="sendReportMaterial" />
</template>

<script lang="ts">
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import { Logic } from "sofa-logic"
import { SofaAlert } from "sofa-ui-components"
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"
import SaveToFolder from "./components/common/SaveToFolder.vue"
import StudyModeModal from './components/library/StudyModeModal.vue'
import {
  reportMaterialSetup,
  sendReportMaterial,
  showSaveToFolder,
} from "./composables/library"

export default defineComponent({
  components: {
    SofaAlert,
    SaveToFolder,
    RateAndReviewModal,
    StudyModeModal,
  },
  setup () {
    useMeta({
      title: "Home",
      htmlAttrs: { lang: "en", amp: true },
    })

    const loaderSetup = ref(Logic.Common.loaderSetup)

    onMounted(() => {
      Logic.Common.watchProperty("loaderSetup", loaderSetup)
    })

    return {
      loaderSetup,
      showSaveToFolder,
      reportMaterialSetup,
      sendReportMaterial,
    }
  },
})
</script>
<style>
body,
html {
  -webkit-tap-highlight-color: transparent;
}
</style>
