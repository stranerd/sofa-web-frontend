<template>
  <dashboard-layout
    :topbarOptions="{
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
                Logic.Common.GoToRoute('/quiz/' + Logic.Study.SingleQuiz?.id);
              },
              size: 'h-[17px]',
            },
            {
              name: 'Settings',
              icon: 'cog',
              handler: () => {
                showSettingModal = true;
              },
              size: 'h-[20px]',
            },
          ],
        },
        {
          IsOutlined: true,
          name: 'Exit',
          handler: () => {
            Logic.Common.goBack();
          },
        },
      ],
    }"
    :hideSmNavigator="{
      bottom: true,
      top: true,
    }"
    :bgColor="'mdlg:!bg-backgroundGray bg-white'"
  >
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col h-full space-y-4 overflow-y-hidden"
      >
        <sofa-add-question
          @OnQuestionSelected="handleSelectedQuestion"
          v-if="
            Logic.Common.mediaQuery() != 'sm' &&
            Logic.Common.mediaQuery() != 'md' &&
            AllQuestions
          "
          :data="AllQuestions.results"
        />
      </div>
    </template>

    <template v-slot:middle-session>
      <!-- Top bar for smaller screens -->
      <div
        class="w-full flex flex-row mdlg:!hidden justify-between items-center z-50 bg-backgroundGray px-4 py-4 sticky top-0 left-0"
      >
        <sofa-icon
          :customClass="'h-[19px]'"
          :name="'circle-close'"
          @click="handleMobileGoback()"
        />

        <sofa-normal-text :customClass="'!font-bold !text-sm'">
          {{ mobileTitle }}
        </sofa-normal-text>

        <div
          :class="`flex flex-row items-center space-x-3 ${
            showSettingModal ? 'invisible' : ''
          } `"
        >
          <sofa-icon
            :customClass="'h-[18px]'"
            :name="'cog'"
            v-if="!showSettingModal"
            @click="showSettings()"
          />

          <sofa-icon
            :customClass="'h-[6px]'"
            :name="'more-options-horizontal'"
            @click="showMoreOptions = true"
          />
        </div>
      </div>
      <div
        class="w-full mdlg:!shadow-custom mdlg:!py-5 py-2 px-5 relative bg-white mdlg:!rounded-[16px] flex-grow h-full flex flex-col space-y-4"
      >
        <template
          v-if="
            selectedQuestionData &&
            (Logic.Common.mediaQuery() == 'sm' ||
              Logic.Common.mediaQuery() == 'md') &&
            !showSettingModal
          "
        >
          <sofa-question-content
            :question="selectedQuestionData"
            :questionType="selectedQuestionData?.image"
          />
        </template>
        <template
          v-if="
            Logic.Common.mediaQuery() != 'sm' &&
            Logic.Common.mediaQuery() != 'md' &&
            selectedQuestionData
          "
        >
          <sofa-question-content
            :question="selectedQuestionData"
            :questionType="selectedQuestionData?.image"
          />
        </template>
      </div>

      <!-- create quiz for smaller screens -->
      <template v-if="showSettingModal">
        <div class="w-full mdlg:!hidden flex-col bg-white py-2 px-4 md:!flex">
          <quiz-settings
            @OnQuizUpdated="handleSettingSaved"
            :quiz="SingleQuiz"
            :close="
              () => {
                showSettingModal = false;
              }
            "
          />
        </div>
      </template>

      <!-- Add question for smaller screens -->
      <sofa-add-question
        v-if="
          (Logic.Common.mediaQuery() == 'sm' ||
            Logic.Common.mediaQuery() == 'md') &&
          !showSettingModal &&
          AllQuestions
        "
        @OnQuestionSelected="handleSelectedQuestion"
        :data="AllQuestions.results"
      ></sofa-add-question>

      <!-- Larger screen setings modal -->
      <sofa-modal
        v-if="showSettingModal"
        :close="
          () => {
            showSettingModal = false;
          }
        "
        :customClass="'hidden mdlg:!flex'"
        :canClose="false"
      >
        <div
          class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] flex flex-col items-center relative"
          @click.stop="
            () => {
              //
            }
          "
        >
          <div
            class="bg-white w-full flex flex-col lg:!px-6 space-y-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center"
          >
            <sofa-header-text :customClass="'!text-xl !font-bold'">{{
              SingleQuiz ? "Update quiz" : "Create a quiz"
            }}</sofa-header-text>

            <quiz-settings
              @OnQuizUpdated="handleSettingSaved"
              :quiz="SingleQuiz"
              :close="
                () => {
                  showSettingModal = false;
                }
              "
            />
          </div>
        </div>
      </sofa-modal>

      <!-- More option / settings for smaller screens -->
      <sofa-modal
        v-if="showMoreOptions"
        :close="
          () => {
            showMoreOptions = false;
          }
        "
      >
        <div
          class="mdlg:!w-[70%] bg-white lg:!w-[60%] px-0 pt-0 h-[95%] w-full flex flex-col rounded-t-[16px] space-y-4 justify-between relative overflow-y-auto"
          @click.stop="
            () => {
              //
            }
          "
        >
          <sofa-question-options
            :close="
              () => {
                showMoreOptions = false;
              }
            "
            :questionSettings="selectedQuestionData.settings"
          />
        </div>
      </sofa-modal>
    </template>

    <template v-slot:right-session>
      <div
        class="w-full shadow-custom px-0 pt-4 bg-white rounded-[16px] flex flex-col space-y-4 h-full justify-between relative overflow-y-hidden"
      >
        <template v-if="selectedQuestionData">
          <sofa-question-options
            :questionSettings="selectedQuestionData.settings"
          />
        </template>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaQuestionOptions,
  SofaModal,
  SofaAddQuestion,
  SofaQuestionContent,
  SofaHeaderText,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import QuizSettings from "@/components/quizzes/Settings.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    SofaIcon,
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
      {
        domain: "Study",
        property: "SingleQuiz",
        method: "GetQuiz",
        params: [],
        useRouteQuery: true,
        queries: ["id"],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "AllQuestions",
        method: "GetQuestions",
        params: [],
        useRouteQuery: true,
        queries: ["id"],
        requireAuth: true,
      },
    ],
  },
  name: "CreateQuiz",
  setup() {
    useMeta({
      title: "Create Quiz",
    });

    const SingleQuiz = ref(Logic.Study.SingleQuiz);
    const AllQuestions = ref(Logic.Study.AllQuestions);

    const showSettingModal = ref(true);

    const mobileTitle = ref("Create quiz");

    const create = () => {
      Logic.Common.GoToRoute("/");
    };

    const selectedQuestion = ref(0);

    const showMoreOptions = ref(false);

    const selectedQuestionData = ref();

    const handleSettingSaved = (status: boolean) => {
      if (status) {
        showSettingModal.value = false;
      }
    };

    const switchToEdit = () => {
      const route = useRoute();

      if (route.query?.id) {
        handleSettingSaved(true);
      }
    };

    const handleSelectedQuestion = (question: any) => {
      if (question) {
        selectedQuestionData.value = question;
        if (!showSettingModal.value) {
          mobileTitle.value = question.type;
        }
      } else {
        mobileTitle.value = "Add question";
      }
    };

    onMounted(() => {
      scrollToTop();
      switchToEdit();
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz),
        Logic.Study.watchProperty("AllQuestions", AllQuestions);
    });

    watch(SingleQuiz, () => {
      if (SingleQuiz.value) {
        showSettingModal.value = false;
      }
    });

    const showSettings = () => {
      showSettingModal.value = true;
      mobileTitle.value = "Update quiz";
    };

    const handleMobileGoback = () => {
      if (showSettingModal.value) {
        if (SingleQuiz.value) {
          showSettingModal.value = false;
        } else {
          Logic.Common.goBack();
        }
      } else {
        Logic.Common.goBack();
      }
    };

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
    };
  },
});
</script>
<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Enter message";
  color: #78828c;
}
</style>
