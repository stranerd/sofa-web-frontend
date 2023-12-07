<template>
  <QuizWrapper :id="($route.params.id as string)">
    <template v-slot="{ quiz, extras }">
      <dashboard-layout v-if="extras.canEdit" :hide="{ bottom: true, top: true }" bgColor="mdlg:bg-backgroundGray bg-white"
        :topbarOptions="{
          type: 'subpage',
          title: quiz.title,
          actions: [
            {
              isIcon: true,
              data: [
                {
                  name: 'Share',
                  icon: 'share-option',
                  handler: () => showShareModal = true,
                  size: 'h-[20px]',
                  hide: !extras.isMine,
                },
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
                  hide: !extras.isMine,
                },
              ],
            },
            {
              IsOutlined: true,
              name: 'Exit',
              handler: () => Logic.Common.goBack()
            },
          ],
          badges: [{ text: quiz.status, color: quiz.status === 'published' ? 'green' : 'gray' }],
        }">
        <template v-slot:left-session>
          <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
            <SofaAddQuestion
              v-model:questionId="extras.selectedQuestionId"
              :quiz="quiz"
              :questions="extras.sortedQuestions"
              @addQuestion="showAddQuestionModal = true"
              @duplicateQuestion="(question) => extras.duplicateQuestion(question)"
              @deleteQuestion="(id) => { interactingQuestionId = id; showDeleteQuestion = true }"
              @reorderQuestions="(ids) => extras.reorderQuestions(ids)"
            />
          </div>
        </template>

        <template v-slot:right-session>
          <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto justify-between">
            <SofaQuestionOptions v-if="extras.currentQuestionById"
              :quiz="quiz"
              :question="extras.currentQuestionById"
              :factory="extras.questionFactory"
              :close="() => showMoreOptions = false"
              @saveQuestion="extras.saveCurrentQuestion()"
              @duplicateQuestion="(question) => { showMoreOptions = false; extras.duplicateQuestion(question) }"
              @deleteQuestion="(id) => { showMoreOptions = false; interactingQuestionId = id; showDeleteQuestion = true }"
              @deleteQuiz="() => { showMoreOptions = false; showDeleteQuiz = true }"
            />
          </div>
        </template>

        <template v-slot:middle-session>
          <!-- Top bar for smaller screens -->
          <div class="w-full flex mdlg:!hidden justify-between items-center bg-backgroundGray p-4">
            <SofaIcon class="h-[19px]" name="circle-close" @click="handleMobileGoback" />

            <SofaNormalText class="!font-bold !text-sm" :content="showSettingModal ? 'Update quiz' : Logic.Study.getQuestionTypeLabel(extras.currentQuestionById?.type) ?? ''" />

            <div class="flex items-center gap-3" :class="{ 'invisible': showSettingModal }">
              <SofaIcon class="h-[18px]" name="share-option" @click="showShareModal = true" />
              <SofaIcon class="h-[18px]" name="cog" @click="showSettingModal = true" />
              <SofaIcon class="h-[14px]" name="preview" @click="() => Logic.Common.GoToRoute(`/quiz/${quiz.id}/preview`)" />
              <SofaIcon class="h-[6px]" name="more-options-horizontal" @click="showMoreOptions = true" />
            </div>
          </div>

          <div class="w-full flex flex-col bg-white px-4 mdlg:py-4 flex-grow h-full overflow-y-auto"
            :class="{ 'mdlg:shadow-custom mdlg:rounded-2xl gap-4': !showSettingModal }">
            <SofaQuestionContent v-if="!showSettingModal && extras.currentQuestionById" :factory="extras.questionFactory" />
            <QuizSettings v-if="showSettingModal && !Logic.Common.isLarge"
                :quiz="quiz"
                :factory="extras.quizFactory"
                :close="() => showSettingModal = false"
                @updateQuiz="extras.updateQuiz().then(handleSettingSaved)"
                @publishQuiz="extras.publishQuiz().then(handleSettingSaved)"
              />
          </div>

          <!-- Add question for smaller screens -->
          <SofaAddQuestion v-if="!Logic.Common.isLarge && !showSettingModal"
            v-model:questionId="extras.selectedQuestionId"
            :quiz="quiz"
            :questions="extras.sortedQuestions"
            @addQuestion="showAddQuestionModal = true"
            @duplicateQuestion="(question) => extras.duplicateQuestion(question)"
            @deleteQuestion="(id) => { interactingQuestionId = id; showDeleteQuestion = true }"
            @reorderQuestions="(ids) => extras.reorderQuestions(ids)"
          />
        </template>
      </dashboard-layout>

      <RequestAccessModal :quiz="quiz" v-else-if="quiz"
        @requestAccess="extras.requestAccess"
      />

      <div v-else class="w-full flex flex-col items-center justify-center p-4">
        <div class="mdlg:w-[60%] w-full h-full flex flex-col">
          <SofaEmptyState title="Quiz not found"
            subTitle="Quiz doesn't exist. Check out other materials in the marketplace"
            actionLabel="Go to marketplace" :action="() => Logic.Common.GoToRoute('/marketplace')" titleStyle="mdlg:!text-xl"
          />
        </div>
      </div>

      <ManageAccessModal v-if="showShareModal"
        :quiz="quiz"
        @close="showShareModal = false"
      />

      <!-- Larger screen setings modal -->
      <SofaModal v-if="showSettingModal" :close="() => showSettingModal = false" customClass="hidden mdlg:!flex" :canClose="false">
        <div class="mdlg:w-[50%] mdlg:h-full h-[95%] md:w-[70%] flex flex-col items-center relative">
          <div class="bg-white w-full flex flex-col gap-4 mdlg:p-6 p-4 rounded-2xl items-center justify-center">
            <SofaHeaderText class="!text-xl !font-bold" content="Update quiz" />
            <QuizSettings
              :quiz="quiz"
              :factory="extras.quizFactory"
              :close="() => showSettingModal = false"
              @updateQuiz="extras.updateQuiz().then(handleSettingSaved)"
              @publishQuiz="extras.publishQuiz().then(handleSettingSaved)"
            />
          </div>
        </div>
      </SofaModal>

      <!-- More option / settings for smaller screens -->
      <SofaModal v-if="showMoreOptions" :close="() => showMoreOptions = false">
        <div class="bg-white mdlg:!w-[70%] lg:!w-[60%] h-[95%] w-full flex flex-col rounded-t-2xl gap-4 justify-between relative overflow-y-auto">
           <div class="mdlg:hidden flex gap-2 justify-between items-center p-4 border-b bg-white border-[#F2F5F8]">
            <SofaNormalText class="!text-sm !font-bold" content="Options" />
            <SofaIcon class="h-[19px]" name="circle-close" @click="showMoreOptions = false" />
          </div>

          <SofaQuestionOptions v-if="extras.currentQuestionById"
            :quiz="quiz"
            :question="extras.currentQuestionById"
            :factory="extras.questionFactory"
            :close="() => showMoreOptions = false"
            @saveQuestion="extras.saveCurrentQuestion()"
            @duplicateQuestion="(question) => { showMoreOptions = false; extras.duplicateQuestion(question) }"
            @deleteQuestion="(id) => { showMoreOptions = false; interactingQuestionId = id; showDeleteQuestion = true }"
            @deleteQuiz="() => { showMoreOptions = false; showDeleteQuiz = true }"
          />
        </div>
      </SofaModal>

      <SofaDeletePrompt v-if="showDeleteQuiz" title="Are you sure?"
        subTitle="This action is permanent. You will lose all saved questions in this quiz."
        :close="() => showDeleteQuiz = false" :buttons="[
          {
            label: 'No',
            isClose: true,
            action: () => showDeleteQuiz = false
          },
          {
            label: 'Yes, delete',
            isClose: false,
            action: () => extras.deleteQuiz().then(() => showDeleteQuiz = false)
          },
        ]" />

      <SofaDeletePrompt v-if="showDeleteQuestion && interactingQuestionId" title="Are you sure?"
        subTitle="This action is permanent. You won't be able to undo this." :close="() => showDeleteQuestion = false"
        :buttons="[
          {
            label: 'No',
            isClose: true,
            action: () => showDeleteQuestion = false
          },
          {
            label: 'Yes, delete',
            isClose: false,
            action: () => extras.deleteQuestion(interactingQuestionId).then(() => showDeleteQuestion = false)
          },
        ]" />

      <SofaModal v-if="showAddQuestionModal" :close="() => showAddQuestionModal = false">
        <div class="md:w-[70%] mdlg:w-[50%] mdlg:h-full h-[95%] w-full flex flex-col justify-end md:justify-start items-center">
          <div class="bg-white w-full flex flex-col mdlg:p-6 gap-4 p-4 md:rounded-2xl rounded-t-[20px] items-center justify-center">
            <div class="w-full text-center hidden md:inline-block">
              <SofaHeaderText class="!text-xl !font-bold" content="Choose question type" />
            </div>

            <div class="w-full flex justify-between items-center md:!hidden">
              <SofaNormalText class="!font-bold !text-base" content="Choose question type" />
              <SofaIcon class="h-[16px]" name="circle-close" @click="showAddQuestionModal = false" />
            </div>

            <div class="w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 gap-4">
              <a class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center hover:bg-[#E6F5FF] bg-[#F2F5F8] rounded-lg"
                v-for="type in Logic.Study.getAllQuestionTypes()" :key="type.value" @click="extras.addQuestion(type.value).then(() => showAddQuestionModal = false)">
                <SofaIcon :name="type.icon" class="h-[50px]" />
                <SofaNormalText :content="type.label" />
              </a>
            </div>
          </div>
        </div>
      </SofaModal>
    </template>
  </QuizWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useMeta } from "vue-meta"
import {
  SofaDeletePrompt,
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
import RequestAccessModal from "@/components/quizzes/RequestAccessModal.vue"
import ManageAccessModal from "@/components/quizzes/ManageAccessModal.vue"

export default defineComponent({
  components: {
    QuizWrapper,
    SofaDeletePrompt,
    SofaIcon,
    SofaEmptyState,
    SofaNormalText,
    SofaQuestionOptions,
    SofaModal,
    QuizSettings,
    SofaAddQuestion,
    SofaQuestionContent,
    SofaHeaderText,
    RequestAccessModal,
    ManageAccessModal,
  },
  name: "QuizIdEdit",
  middlewares: {
    goBackRoute: "/library",
  },
  setup () {
    useMeta({
      title: "Edit Quiz",
    })

    const showDeleteQuiz = ref(false)
    const showDeleteQuestion = ref(false)
    const showAddQuestionModal = ref(false)

    const interactingQuestionId = ref('')

    const showSettingModal = ref(false)

    const showMoreOptions = ref(false)

    const showShareModal = ref(false)

    const handleSettingSaved = (status: boolean) => {
      if (status) showSettingModal.value = false
    }

    const handleMobileGoback = () => {
      if (showSettingModal.value) showSettingModal.value = false
      else Logic.Common.goBack()
    }

    return {
      showDeleteQuiz,
      showDeleteQuestion,
      showAddQuestionModal,
      showShareModal,
      showMoreOptions,
      showSettingModal,
      interactingQuestionId,
      handleSettingSaved,
      Logic,
      handleMobileGoback,
    }
  },
})
</script>
