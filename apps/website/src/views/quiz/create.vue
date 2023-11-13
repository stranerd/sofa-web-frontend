<template>
  <component :is="currentComponent" :topbarOptions="{
    type: 'subpage',
    title: SingleQuiz ? SingleQuiz.title : 'Create a quiz',
    actions: [
      {
        isIcon: true,
        data: [
          {
            name: 'Preview',
            icon: 'preview',
            handler: () => {
              Logic.Common.GoToRoute(
                '/quiz/' + Logic.Study.SingleQuiz?.id + '?mode=preview'
              )
            },
            size: 'h-[17px]',
          },
          {
            name: 'Settings',
            icon: 'cog',
            handler: () => {
              showSettingModal = true
            },
            size: 'h-[20px]',
          },
        ],
      },
      ...actionButtonItems,
      {
        IsOutlined: !hasUnsavedChanges,
        name: 'Save',
        handler: () => {
          Logic.Study.saveQuizLocalChanges()
        },
      },
    ],
    badges: [
      {
        text: SingleQuiz?.status,
        color: SingleQuiz?.status != 'published' ? 'gray' : 'green',
      },
    ],
  }" :hideSmNavigator="{
  bottom: true,
  top: true,
}" :bgColor="'mdlg:!bg-backgroundGray bg-white'" :middleSessionWidth="'lg:w-[56%]  mdlg:w-[50%] mdlg:!pb-5'">
    <!-- Not found -->
    <div class="w-full flex flex-col h-[50px] items-center justify-center px-4">
      <div class="lg:w-[60%] mdlg:w-[60%] w-full h-full flex flex-col">
        <sofa-empty-state :title="'Quiz not found'"
          :subTitle="`It is either this quiz doesn't exist or you don't have access to this quiz. Check out other materials in the marketplace`"
          :actionLabel="'Go to marketplace'" :action="() => {
            Logic.Common.GoToRoute('/marketplace')
          }
            " :titleStyle="'mdlg:!text-xl '" />
      </div>
    </div>

    <template v-slot:left-session v-if="currentComponent == 'dashboard-layout'">
      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col h-full gap-4 overflow-y-hidden">
        <sofa-add-question @OnQuestionSelected="handleSelectedQuestion" v-if="Logic.Common.isLarge && AllQuestions" :data="AllQuestions.results" />
      </div>
    </template>

    <template v-slot:middle-session v-if="currentComponent == 'dashboard-layout'">
      <!-- Top bar for smaller screens -->
      <div
        class="w-full flex flex-row mdlg:!hidden justify-between items-center z-[9999] bg-backgroundGray px-4 py-4 sticky top-0 left-0">
        <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="handleMobileGoback()" />

        <sofa-normal-text :customClass="'!font-bold !text-sm'">
          {{ mobileTitle }}
        </sofa-normal-text>

        <div :class="`flex flex-row items-center gap-3 ${showSettingModal ? 'invisible' : ''
          } `">
          <sofa-icon :customClass="'h-[18px]'" :name="'cog'" v-if="!showSettingModal" @click="showSettings()" />

          <sofa-icon :customClass="'h-[14px]'" :name="'preview'" v-if="!showSettingModal" @click="() => {
            Logic.Common.GoToRoute('/quiz/' + Logic.Study.SingleQuiz?.id)
          }
            " />

          <sofa-icon :customClass="'h-[6px]'" :name="'more-options-horizontal'" @click="showMoreOptions = true" />
        </div>
      </div>
      <div
        class="w-full mdlg:!shadow-custom mdlg:!py-5 py-2 px-5 relative bg-white mdlg:!rounded-[16px] flex-grow h-full flex flex-col gap-4">
        <template v-if="!Logic.Common.isLarge && !showSettingModal">
          <sofa-question-content v-if="AllQuestions && AllQuestions.results.length" />
        </template>
        <template v-if="Logic.Common.isLarge">
          <sofa-question-content v-if="AllQuestions && AllQuestions.results.length" />
        </template>
      </div>

      <!-- create quiz for smaller screens -->
      <template v-if="showSettingModal">
        <div class="w-full mdlg:!hidden flex-col bg-white py-2 px-4 md:!flex">
          <quiz-settings @OnQuizUpdated="handleSettingSaved" :quiz="SingleQuiz" :close="() => {
            showSettingModal = false
          }
            " />
        </div>
      </template>

      <!-- Add question for smaller screens -->
      <sofa-add-question v-if="!Logic.Common.isLarge && !showSettingModal && AllQuestions"
        @OnQuestionSelected="handleSelectedQuestion" :data="AllQuestions.results"></sofa-add-question>

      <!-- Larger screen setings modal -->
      <sofa-modal v-if="showSettingModal" :close="() => {
        showSettingModal = false
      }
        " :customClass="'hidden mdlg:!flex'" :canClose="false">
        <div class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] flex flex-col items-center relative"
          @click.stop="() => {
            //
          }
            ">
          <div
            class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center">
            <sofa-header-text :customClass="'!text-xl !font-bold'">{{
              SingleQuiz ? "Update quiz" : "Create a quiz"
            }}</sofa-header-text>

            <quiz-settings @OnQuizUpdated="handleSettingSaved" :quiz="SingleQuiz" :close="() => {
              showSettingModal = false
            }
              " />
          </div>
        </div>
      </sofa-modal>

      <!-- More option / settings for smaller screens -->
      <sofa-modal v-if="showMoreOptions" :close="() => {
        showMoreOptions = false
      }
        ">
        <div
          class="mdlg:!w-[70%] bg-white lg:!w-[60%] px-0 pt-0 h-[95%] w-full flex flex-col rounded-t-[16px] gap-4 justify-between relative overflow-y-auto"
          @click.stop="() => {
            //
          }
            ">
          <sofa-question-options :close="() => {
            showMoreOptions = false
          }
            " v-if="AllQuestions && AllQuestions.results.length" />
        </div>
      </sofa-modal>
    </template>

    <template v-slot:right-session v-if="currentComponent == 'dashboard-layout'">
      <div
        class="w-full shadow-custom px-0 pt-4 bg-white rounded-[16px] flex flex-col gap-4 h-full justify-between relative overflow-y-hidden">
        <sofa-question-options v-if="AllQuestions && AllQuestions.results.length" />
      </div>
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue"
import { useMeta } from "vue-meta"
import moment from "moment"
import { scrollToTop } from "@/composables"
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
import QuizSettings from "@/components/quizzes/Settings.vue"

export default defineComponent({
  components: {
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
      {
        domain: "Study",
        property: "SingleQuiz",
        method: "GetQuiz",
        params: [true],
        useRouteQuery: true,
        queries: ["id"],
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "AllQuestions",
        method: "GetQuestions",
        params: [],
        useRouteQuery: true,
        queries: ["id"],
        requireAuth: true,
        ignoreProperty: true,
      },
    ],
  },
  name: "CreateQuiz",
  setup () {
    useMeta({
      title: "Create Quiz",
    })

    const SingleQuiz = ref(Logic.Study.SingleQuiz)
    const AllQuestions = ref(Logic.Study.AllQuestions)

    const UpdatedQuestion = ref(Logic.Study.UpdatedQuestion)

    const questionSettings = ref(Logic.Study.questionSettings)

    const currentComponent = ref("dashboard-layout")
    const showSettingModal = ref(false)

    const hasUnsavedChanges = ref(false)

    const quizDataUpdate = ref(Logic.Study.quizDataUpdate)

    const mobileTitle = ref("Create quiz")

    const create = () => {
      Logic.Common.GoToRoute("/")
    }

    const actionButtonItems = reactive([
      {
        IsOutlined: true,
        name: "Exit",
        handler: () => {
          Logic.Common.goBack()
        },
      },
    ])

    const selectedQuestion = ref(0)

    const showMoreOptions = ref(false)

    const selectedQuestionData = ref()

    const handleSettingSaved = (status: boolean) => {
      if (status) {
        showSettingModal.value = false
      }
    }

    const switchToEdit = () => {
      if (SingleQuiz.value) {
        handleSettingSaved(true)
      }
    }

    const handleSelectedQuestion = (question: any) => {
      if (question) {
        selectedQuestionData.value = question
        if (!showSettingModal.value) {
          mobileTitle.value = question.type
        }
      } else {
        mobileTitle.value = "Add question"
      }
    }

    onMounted(() => {
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz)
      Logic.Study.watchProperty("AllQuestions", AllQuestions)
      Logic.Study.watchProperty("UpdatedQuestion", UpdatedQuestion)
      Logic.Study.watchProperty("questionSettings", questionSettings)
      Logic.Study.watchProperty("quizDataUpdate", quizDataUpdate)
      scrollToTop()
      switchToEdit()

      // Clear local data
      localStorage.removeItem("quiz_question_update")

      if (SingleQuiz.value) {
        setTimeout(() => {
          hasUnsavedChanges.value = false
        }, 1000)

        currentComponent.value = "dashboard-layout"
      } else {
        currentComponent.value = "expanded-layout"
      }
    })

    watch(UpdatedQuestion, () => {
      hasUnsavedChanges.value = false
    })

    watch(questionSettings, () => {
      hasUnsavedChanges.value = true
    })

    watch(quizDataUpdate, () => {
      hasUnsavedChanges.value = true
    })

    watch(SingleQuiz, () => {
      if (SingleQuiz.value) {
        showSettingModal.value = false

        // remove save button
        if (SingleQuiz.value?.title != "Untitled Quiz") {
          actionButtonItems.length = 0
          actionButtonItems.push({
            IsOutlined: true,
            name: "Exit",
            handler: () => {
              Logic.Common.goBack()
            },
          })
        }
      }
    })

    const showSettings = () => {
      showSettingModal.value = true
      mobileTitle.value = "Update quiz"
    }

    const handleMobileGoback = () => {
      if (showSettingModal.value) {
        if (SingleQuiz.value) {
          showSettingModal.value = false
        } else {
          Logic.Common.goBack()
        }
      } else {
        Logic.Common.goBack()
      }
    }

    return {
      moment,
      create,
      selectedQuestion,
      showMoreOptions,
      showSettingModal,
      handleSettingSaved,
      handleSelectedQuestion,
      selectedQuestionData,
      Logic,
      mobileTitle,
      SingleQuiz,
      AllQuestions,
      showSettings,
      handleMobileGoback,
      actionButtonItems,
      hasUnsavedChanges,
      currentComponent,
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
