<template>
  <div class="fixed top-0 left-0 h-full w-full bg-[#00000050] z-[100000000000] cursor-not-allowed" v-if="loaderSetup.loading || loaderSetup.loaders.length">
    <div class="loader-bar" />
  </div>
  <metainfo>
    <template #title="{ content }">
      {{ content ? `${content} | SOFA` : `SOFA` }}
    </template>
  </metainfo>
  <router-view />
  <SofaAlert v-for="(alert, i) in loaderSetup.alerts" :key="i" :close="() => loaderSetup.alerts.splice(i, 1)"
   :content="alert.message" :type="alert.type" />
  <study-mode-modal />
  <!-- Save to folder -->
  <save-to-folder v-if="showSaveToFolder" :close="() => showSaveToFolder = false" />
  <!-- Report material -->
  <rate-and-review-modal v-if="reportMaterialSetup.show" :close="() => reportMaterialSetup.show = false" :canClose="true"
    :has-ratings="false" :title="`Report this ${reportMaterialSetup.type}`" @on-review-submitted="sendReportMaterial" />
  <add-material-modal v-if="showAddItem" :close="() => showAddItem = false" />
</template>

<script lang="ts" setup>
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue"
import { Logic } from "sofa-logic"
import { SofaAlert } from "sofa-ui-components"
import { useMeta } from "vue-meta"
import AddMaterialModal from "@/components/common/AddMaterialModal.vue"
import { showAddItem } from "./composables"
import SaveToFolder from "./components/common/SaveToFolder.vue"
import StudyModeModal from './components/library/StudyModeModal.vue'
import {
  reportMaterialSetup,
  sendReportMaterial,
  showSaveToFolder,
} from "./composables/library"
import { useRoute } from 'vue-router'
import { useAuth } from './composables/auth/auth'
import { watch } from 'vue'

useMeta({
  title: "Home",
  htmlAttrs: { lang: "en", amp: true },
})

const loaderSetup = Logic.Common.loaderSetup

const route = useRoute()
const { user } = useAuth()

watch([route, user], async () => {
  const path = route.fullPath
  const quizzes = user.value?.account.editing?.quizzes
  if (!quizzes) return
  if (!path.startsWith(`/quiz/${quizzes.id}/edit`)) Logic.Users.updateUserEditingQuizzes(null).catch()
})
</script>
