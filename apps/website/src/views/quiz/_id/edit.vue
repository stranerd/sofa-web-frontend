<template>
  <QuizWrapper :id="($route.params.id as string)">
    <template v-slot="{ quiz, questions, extras }">
      <dashboard-layout v-if="extras.canEdit && questions.length" :hide="{ bottom: true, top: true }" bgColor="mdlg:bg-backgroundGray bg-white"
        :topbarOptions="{
          type: 'subpage',
          title: quiz.title,
          actions: [
            {
              isIcon: true,
              data: [
                {
                  name: 'Preview',
                  icon: 'preview',
                  handler: () => Logic.Common.GoToRoute(`/quiz/${quiz.id}/preview`),
                  size: 'h-[17px]',
                },
                {
                  name: 'Settings',
                  icon: 'cog',
                  handler: () => showSettingModal = true,
                  size: 'h-[20px]',
                },
              ],
            },
            {
              IsOutlined: true,
              name: 'Exit',
              handler: () => Logic.Common.goBack()
            },
            {
              IsOutlined: !hasUnsavedChanges,
              name: 'Save',
              handler: () => Logic.Study.saveQuizLocalChanges(),
            },
          ],
          badges: [{ text: quiz.status, color: quiz.status === 'published' ? 'green' : 'gray' }],
        }">
        <template v-slot:left-session>
          <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
            <SofaAddQuestion
              v-model:questionId="selectedQuestionId"
              :questions="extras.sortedQuestions"
              :addQuestion="extras.addQuestion"
              :duplicateQuestion="extras.duplicateQuestion"
              :deleteQuestion="extras.deleteQuestion"
              :reorderQuestions="extras.reorderQuestions"
            />
          </div>
        </template>

        <template v-slot:right-session>
          <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto justify-between">
            <SofaQuestionOptions />
          </div>
        </template>

        <template v-slot:middle-session>
          <!-- Top bar for smaller screens -->
          <div class="w-full flex mdlg:!hidden justify-between items-center bg-backgroundGray p-4">
            <SofaIcon class="h-[19px]" name="circle-close" @click="handleMobileGoback" />

            <SofaNormalText class="!font-bold !text-sm" :content="showSettingModal ? 'Update quiz' : Logic.Study.getQuestionTypeLabel(questions.find((q) => q.id === selectedQuestionId)?.type) ?? ''" />

            <div class="flex items-center gap-3" :class="{ 'invisible': showSettingModal }">
              <SofaIcon class="h-[18px]" name="cog" @click="showSettingModal = true" />

              <SofaIcon class="h-[14px]" name="preview" @click="() => Logic.Common.GoToRoute(`/quiz/${quiz.id}/preview`)" />

              <SofaIcon class="h-[6px]" name="more-options-horizontal" @click="showMoreOptions = true" />
            </div>
          </div>

          <div class="w-full flex flex-col bg-white px-4 mdlg:py-4 flex-grow h-full overflow-y-auto"
            :class="{ 'mdlg:shadow-custom mdlg:rounded-2xl gap-4': !showSettingModal }">
            <!-- create quiz for smaller screens -->
            <SofaQuestionContent v-if="0 && !showSettingModal" />
            <QuizSettings v-if="showSettingModal" @OnQuizUpdated="handleSettingSaved" :quiz="quiz" :close="() => showSettingModal = false" class="mdlg:hidden" />
          </div>

          <!-- Add question for smaller screens -->
          <SofaAddQuestion v-if="!Logic.Common.isLarge && !showSettingModal"
            v-model:questionId="selectedQuestionId"
            :questions="extras.sortedQuestions"
            :addQuestion="extras.addQuestion"
            :duplicateQuestion="extras.duplicateQuestion"
            :deleteQuestion="extras.deleteQuestion"
            :reorderQuestions="extras.reorderQuestions"
          />
        </template>
      </dashboard-layout>

      <div v-else class="w-full flex flex-col items-center justify-center p-4">
        <div class="mdlg:w-[60%] w-full h-full flex flex-col">
          <SofaEmptyState title="Quiz not found"
            subTitle="It is either this quiz doesn't exist or you don't have access to this quiz. Check out other materials in the marketplace"
            actionLabel="Go to marketplace" :action="() => Logic.Common.GoToRoute('/marketplace')" titleStyle="mdlg:!text-xl"
          />
        </div>
      </div>

      <!-- Larger screen setings modal -->
      <SofaModal v-if="showSettingModal" :close="() => showSettingModal = false" customClass="hidden mdlg:!flex" :canClose="false">
        <div class="mdlg:w-[50%] mdlg:h-full h-[95%] md:w-[70%] flex flex-col items-center relative">
          <div class="bg-white w-full flex flex-col gap-4 mdlg:p-6 p-4 rounded-2xl items-center justify-center">
            <SofaHeaderText class="!text-xl !font-bold" content="Update quiz" />
            <QuizSettings @OnQuizUpdated="handleSettingSaved" :quiz="quiz" :close="() => showSettingModal = false" />
          </div>
        </div>
      </SofaModal>

      <!-- More option / settings for smaller screens -->
      <SofaModal v-if="showMoreOptions" :close="() => showMoreOptions = false">
        <div class="bg-white mdlg:!w-[70%] lg:!w-[60%] h-[95%] w-full flex flex-col rounded-t-2xl gap-4 justify-between relative overflow-y-auto">
          <SofaQuestionOptions :close="() => showMoreOptions = false" v-if="questions.length" />
        </div>
      </SofaModal>
    </template>
  </QuizWrapper>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue"
import { useMeta } from "vue-meta"
import {
  SofaEmptyState,
  SofaIcon,
  SofaNormalText,
  SofaQuestionOptions,
  SofaModal,
  SofaAddQuestion,
  SofaQuestionContent,
  SofaHeaderText,
} from "sofa-ui-components"
import { Logic } from "sofa-logic"
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import QuizSettings from "@/components/quizzes/Settings.vue"

export default defineComponent({
  components: {
    QuizWrapper,
    SofaIcon,
    SofaEmptyState,
    SofaNormalText,
    SofaQuestionOptions,
    SofaModal,
    QuizSettings,
    SofaAddQuestion,
    SofaQuestionContent,
    SofaHeaderText,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [
          {
            all: true,
          },
        ],
        requireAuth: true,
      },
    ],
  },
  name: "QuizIdEdit",
  setup () {
    useMeta({
      title: "Edit Quiz",
    })

    const selectedQuestionId = ref('')

    const UpdatedQuestion = ref(Logic.Study.UpdatedQuestion)

    const questionSettings = ref(Logic.Study.questionSettings)

    const showSettingModal = ref(false)

    const hasUnsavedChanges = ref(false)

    const quizDataUpdate = ref(Logic.Study.quizDataUpdate)

    const showMoreOptions = ref(false)

    const handleSettingSaved = (status: boolean) => {
      if (status) {
        showSettingModal.value = false
      }
    }

    onMounted(() => {
      Logic.Study.watchProperty("UpdatedQuestion", UpdatedQuestion)
      Logic.Study.watchProperty("questionSettings", questionSettings)
      Logic.Study.watchProperty("quizDataUpdate", quizDataUpdate)

      // Clear local data
      localStorage.removeItem("quiz_question_update")
    })

    watch([UpdatedQuestion, questionSettings, quizDataUpdate], () => {
      hasUnsavedChanges.value = false
    })

    const handleMobileGoback = () => {
      if (showSettingModal.value) showSettingModal.value = false
      else Logic.Common.goBack()
    }

    return {
      selectedQuestionId,
      showMoreOptions,
      showSettingModal,
      handleSettingSaved,
      Logic,
      handleMobileGoback,
      hasUnsavedChanges,
    }
  },
})
</script>

<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Enter message";
  color: #78828c;
}
</style>
