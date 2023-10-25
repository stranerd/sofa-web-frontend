<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center space-x-3 justify-between z-50 bg-backgroundGray py-4 px-4 sticky top-0 left-0">
        <sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
        <sofa-normal-text :customClass="'!font-bold !text-base'">
          Quizzes</sofa-normal-text>
        <div></div>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 space-x-3">
        <span :class="`px-6 py-2  ${item.id == selectedItemId ? 'bg-primaryPurple' : 'bg-white'
          } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer `"
          v-for="(item, index) in mainFilters" :key="index" @click="selectedItemId = item.id">
          <sofa-normal-text :color="`${item.id == selectedItemId ? 'text-white' : 'text-deepGray'
            } `" :custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
        </span>
      </div>

      <div class="w-full flex flex-col space-y-3 px-4 pt-3">
        <template v-if="currentQuizData.length">
          <sofa-activity-card v-for="(activity, index) in currentQuizData" :key="index" :activity="activity"
            :custom-class="'!bg-white shadow-custom cursor-pointer relative'" @click.stop="openQuiz(activity)"
            :isWrapped="true">
            <div class="absolute right-0 top-0 py-3 px-3 bg-white rounded-tr-[8px]">
              <sofa-icon :name="'more-options-horizontal'" :customClass="'h-[6px] '"
                @click.stop="showMoreOptionHandler(activity)" />
            </div>
          </sofa-activity-card>
        </template>
        <sofa-empty-state v-else :title="'You have no quizzes here'"
          :subTitle="'Discover thousands of quizzes and save them here for easy access'" :actionLabel="'Explore'" :action="() => {
            Logic.Common.GoToRoute('/marketplace')
          }
            " />
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>

    <!-- More options -->
    <sofa-modal v-if="showMoreOptions" :close="() => {
      showMoreOptions = false
    }
      ">
      <div class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
        @click.stop="() => {
          //
        }
          ">
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-4 space-y-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4">
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              Options
            </sofa-normal-text>
            <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
          </div>

          <div class="w-full flex flex-col space-y-3 px-4 py-4">
            <div class="w-full flex flex-row items-center space-x-2 py-3" v-for="(item, index) in moreOptions"
              :key="index" @click.stop="item.action()">
              <sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
              <sofa-normal-text>
                {{ item.title }}
              </sofa-normal-text>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>
  </sub-page-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"
import {
  AllQuzzies,
  createQuizData,
  moreOptions,
  openQuiz,
  showMoreOptionHandler,
  showMoreOptions,
  showStudyMode,
  TutorQuizzes,
} from "@/composables/library"
import {
  createQuizGame,
  goToStudyMode,
  otherTasks,
  selectedQuizId,
  selectedQuizMode,
  userIsParticipating,
} from "@/composables/quiz"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import { ResourceType } from "sofa-logic/src/logic/types/domains/study"
import {
  SofaActivityCard,
  SofaEmptyState,
  SofaIcon,
  SofaModal,
  SofaNormalText
} from "sofa-ui-components"
import { defineComponent, onMounted, reactive, ref, watch } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaActivityCard,
    SofaModal,
    SofaEmptyState,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "AllQuzzies",
        method: "GetQuizzes",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "TutorQuizzes",
        method: "GetTutorQuizzes",
        requireAuth: true,
        ignoreProperty: true,
        shouldSkip: () => !(Logic.Auth.AuthUser && Logic.Auth.AuthUser.roles.isAdmin),
        params: []
      },
      {
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [
          {
            where: [
              {
                field: "type",
                value: "topics",
                condition: "eq",
              },
            ],
          },
        ],
        requireAuth: true,
      },
    ],
  },
  name: "LibraryQuizzesPage",
  setup () {
    useMeta({
      title: "Quizzes",
    })

    onMounted(() => {
      scrollToTop()
    })

    const selectedItemId = ref("quiz-recent")

    const mainFilters = reactive([
      {
        name: "Recent",
        active: true,
        id: "quiz-recent",
      },
      {
        name: "Saved",
        active: false,
        id: "quiz-saved",
      },
      {
        name: "Published",
        active: false,
        id: "quiz-published",
      },
      {
        name: "Draft",
        active: false,
        id: "quiz-draft",
      },
    ])

    if (Logic.Auth.AuthUser?.roles.isAdmin) {
      mainFilters.push({
        name: "Tutors",
        active: false,
        id: "quiz-tutors",
      })
    }

    const quizzes = ref<ResourceType[]>([])
    const tutorQuizzes = ref<ResourceType[]>([])

    const currentQuizData = ref<ResourceType[]>([])

    const setQuizzes = () => {
      quizzes.value.length = 0

      AllQuzzies.value?.results.forEach((quiz) => {
        quizzes.value.push(createQuizData(quiz))
      })

      tutorQuizzes.value.length = 0

      TutorQuizzes.value?.results.forEach((quiz) => {
        tutorQuizzes.value.push(createQuizData(quiz))
      })
    }

    const filterItem = () => {
      const status = selectedItemId.value.split("-")[1]

      if (status == "tutors") {
        currentQuizData.value = tutorQuizzes.value
      } else if (status == "recent") {
        currentQuizData.value = quizzes.value
      } else {
        currentQuizData.value = quizzes.value.filter(
          (quiz) => quiz.status == status
        )
      }
    }

    watch(selectedItemId, () => {
      filterItem()
    })

    onMounted(() => {
      scrollToTop()
      Logic.Study.watchProperty("AllQuzzies", AllQuzzies)
      Logic.Study.watchProperty("TutorQuizzes", TutorQuizzes)
      setQuizzes()
      filterItem()
    })

    return {
      Logic,
      mainFilters,
      quizzes,
      showStudyMode,
      selectedQuizId,
      goToStudyMode,
      otherTasks,
      selectedQuizMode,
      userIsParticipating,
      createQuizGame,
      AllQuzzies,
      currentQuizData,
      selectedItemId,
      showMoreOptionHandler,
      showMoreOptions,
      moreOptions,
      openQuiz,
    }
  },
})
</script>
