<template>
  <div class="fixed top-0 left-0 h-full w-full bg-[#00000050] z-[100000000000] cursor-not-allowed"
    v-if="loaderSetup.loading || loaderSetup.loaders.length">
    <div class="loader-bar" />
  </div>
  <metainfo>
    <template #title="{ content }">
      {{ content ? `${content} | SOFA` : `SOFA` }}
    </template>
  </metainfo>
  <router-view :key="$route.path" />
  <SofaAlert v-for="(alert, i) in loaderSetup.alerts" :key="i" :close="() => loaderSetup.alerts.splice(i, 1)"
    :content="alert.message" :type="alert.type" />
  <study-mode-modal />
  <!-- Save to folder -->
  <save-to-folder v-if="selectedFolderMaterailToAdd" :material="selectedFolderMaterailToAdd" :close="() => selectedFolderMaterailToAdd = null" />
  <!-- Report material -->
  <rate-and-review-modal v-if="reportMaterialSetup.show" :close="() => reportMaterialSetup.show = false" :canClose="true"
    :has-ratings="false" :title="`Report this ${reportMaterialSetup.type}`" @on-review-submitted="sendReportMaterial" />
  <add-material-modal v-if="showAddItem" :close="() => showAddItem = false" />
  <SofaDeletePrompt v-for="(confirmation, index) in confirmations" :key="index" :title="confirmation.title"
    :subTitle="confirmation.sub" :close="() => confirmation.close(false)" :buttons="[
      {
        label: confirmation.leftLabel ?? 'No',
        hide: confirmation.leftHide,
        bgColor: confirmation.leftBg,
        textColor: confirmation.leftColor,
        isClose: true,
        action: () => confirmation.close(false)
      },
      {
        label: confirmation.rightLabel ?? 'Yes',
        hide: confirmation.rightHide,
        bgColor: confirmation.rightBg,
        textColor: confirmation.rightColor,
        isClose: false,
        action: () => confirmation.close(true)
      },
    ]" />
</template>

<script lang="ts" setup>
import AddMaterialModal from "@/components/common/AddMaterialModal.vue"
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import { Logic } from "sofa-logic"
import { SofaAlert, SofaDeletePrompt } from "sofa-ui-components"
import { watch } from 'vue'
import { useMeta } from "vue-meta"
import { useRoute } from 'vue-router'
import SaveToFolder from "./components/common/SaveToFolder.vue"
import StudyModeModal from './components/library/StudyModeModal.vue'
import { showAddItem } from "./composables"
import { useAuth } from './composables/auth/auth'
import {
  reportMaterialSetup,
  sendReportMaterial,
  selectedFolderMaterailToAdd,
} from "./composables/library"

useMeta({
  title: "Home",
  htmlAttrs: { lang: "en", amp: true },
})

const loaderSetup = Logic.Common.loaderSetup
const confirmations = Logic.Common.confirmations

const route = useRoute()
const { user } = useAuth()

watch([route, user], async () => {
  const path = route.fullPath
  const quizzes = user.value?.account.editing?.quizzes
  if (!quizzes) return
  if (!path.startsWith(`/quiz/${quizzes.id}/edit`)) Logic.Users.updateUserEditingQuizzes(null).catch()
}, { immediate: true })
</script>
