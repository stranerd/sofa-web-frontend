<template>
  <div
    :class="`w-full flex flex-col h-full mdlg:!space-y-0 space-y-4 relative overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
      showScrollBar ? 'mdlg:!scrollbar-thin' : 'scrollbar-none'
    }`"
    @mouseover="showScrollBar = true"
    @mouseleave="showScrollBar = false"
  >
    <div
      class="mdlg:!hidden flex flex-row space-x-2 justify-between items-center px-4 py-4 border-b-[1px] sticky top-0 left-0 bg-white border-[#F2F5F8]"
    >
      <sofa-normal-text :customClass="'!text-sm !font-bold'">
        Options
      </sofa-normal-text>
      <sofa-icon
        :customClass="'h-[19px]'"
        :name="'circle-close'"
        @click="close()"
      />
    </div>
    <div class="flex flex-col space-y-6 h-full px-4">
      <div
        class="w-full flex flex-col space-y-4"
        v-for="(option, index) in questionOptions"
        :key="index"
      >
        <div
          class="w-full flex flex-row items-center justify-between cursor-pointer"
          @click="toggleOption(option)"
        >
          <div class="flex flex-row items-center space-x-2">
            <sofa-icon :customClass="'h-[18px]'" :name="option.icon" />
            <sofa-normal-text :customClass="'!font-bold'">{{
              option.name
            }}</sofa-normal-text>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <sofa-normal-text :color="'text-grayColor'">{{
              option.value
            }}</sofa-normal-text>
            <sofa-icon
              :customClass="'h-[7px]'"
              :name="option.opened ? 'chevron-up' : 'chevron-down'"
            />
          </div>
        </div>

        <div
          class="w-full flex flex-row flex-wrap gap-3"
          v-if="selectedType == option.type && !option.hasImage"
        >
          <span
            @mouseenter="item.active = true"
            @mouseleave="item.active = false"
            :class="`px-4 py-2  ${
              item.name == option.value ? 'bg-primaryPurple' : 'bg-[#EFF2F5]'
            } rounded-[8px] flex flex-row items-center justify-center space-x-1  cursor-pointer`"
            v-for="(item, index) in option.options"
            :key="index"
            @click="
              option.value = item.name;
              saveSettings();
            "
          >
            <sofa-normal-text
              :color="`${
                item.name == option.value ? 'text-white' : 'text-deepGray'
              } `"
              >{{ item.name }}</sofa-normal-text
            >
          </span>
        </div>

        <div
          v-if="selectedType == option.type && option.hasImage"
          class="w-full grid grid-cols-2 gap-3"
        >
          <div
            :class="`col-span-1 px-3 py-3 flex flex-col space-y-2 items-center justify-center cursor-pointer ${
              item.name == option.value ? 'bg-[#E6F5FF]' : 'bg-[#F2F5F8]'
            }  rounded-[8px] `"
            v-for="(item, index) in option.options"
            :key="index"
            @click="
              option.value = item.name;
              option.itemType = item.itemType;
              option.questionType = item.type;
              selectedQuestionType = item.itemType;
              saveSettings();
            "
          >
            <sofa-icon :name="item.image" :custom-class="'h-[50px]'" />
            <sofa-normal-text :customClass="'text-center'">{{
              item.name
            }}</sofa-normal-text>
          </div>
        </div>
      </div>

      <div class="h-[130px] w-full"></div>
    </div>

    <div
      class="sticky bottom-0 left-0 bg-white rounded-b-[12px] w-full px-4 py-4 border-t-[2px] border-[#F2F5F8] z-50 flex flex-col space-y-4 scrollbar-hide"
    >
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 cursor-pointer"
        @click="duplicateQuestion()"
        v-if="Logic.Common.mediaQuery() == 'sm'"
      >
        <sofa-icon :name="'copy'" :customClass="'h-[16px]'" />
        <sofa-normal-text>Duplicate question</sofa-normal-text>
      </div>
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 cursor-pointer"
        @click="showDeleteQuestion = true"
        v-if="Logic.Common.mediaQuery() == 'sm'"
      >
        <sofa-icon :name="'trash'" :customClass="'h-[16px]'" />
        <sofa-normal-text :color="'text-primaryRed'"
          >Delete question</sofa-normal-text
        >
      </div>
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 cursor-pointer"
        @click="showDeleteQuiz = true"
      >
        <sofa-icon :name="'trash'" :customClass="'h-[16px]'" />
        <sofa-normal-text :color="'text-primaryRed'"
          >Delete Quiz</sofa-normal-text
        >
      </div>
    </div>
  </div>
  <sofa-delete-prompt
    v-if="showDeleteQuiz"
    :title="'Are you sure you?'"
    :subTitle="`This action is permanent. You will loss all saved questions in this quiz.`"
    :close="
      () => {
        showDeleteQuiz = false;
      }
    "
    :buttons="[
      {
        label: 'No',
        isClose: true,
        action: () => {
          showDeleteQuiz = false;
        },
      },
      {
        label: 'Yes, delete',
        isClose: false,
        action: () => {
          deleteQuiz();
        },
      },
    ]"
  />
  <sofa-delete-prompt
    v-if="showDeleteQuestion"
    :title="'Are you sure you?'"
    :subTitle="`This action is permanent. You won't be able to undo this.`"
    :close="
      () => {
        showDeleteQuestion = false;
      }
    "
    :buttons="[
      {
        label: 'No',
        isClose: true,
        action: () => {
          showDeleteQuestion = false;
        },
      },
      {
        label: 'Yes, delete',
        isClose: false,
        action: () => {
          deleteQuestion();
        },
      },
    ]"
  />
</template>
<script lang="ts">
import { Logic } from "../../composable";
import { defineComponent, onMounted, reactive, ref, toRef, watch } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import SofaDeletePrompt from "../SofaDeletePrompt";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaDeletePrompt,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    close: {
      type: Function,
      required: false,
    },
  },
  name: "SofaQuestionOptions",
  setup(props, context) {
    const showDeleteQuestion = ref(false);
    const showDeleteQuiz = ref(false);
    const selectedType = ref("question-type");
    const allOptions = {
      "question-type": {
        name: "Question type",
        options: [
          {
            name: "Multiple choice",
            active: false,
            image: "multiple-choice-type",
            itemType: "multipleChoice",
            type: "multiple_choice",
          },
          {
            name: "True/False",
            active: false,
            image: "true-false-type",
            itemType: "trueOrFalse",
            type: "true_false",
          },
          {
            name: "Write answer",
            active: false,
            image: "write-answer-type",
            itemType: "writeAnswer",
            type: "write_answer",
          },
          {
            name: "Fill in blank(s)",
            active: false,
            image: "fill-in-blanks-type",
            itemType: "fillInBlanks",
            type: "fill_in_blank",
          },
          {
            name: "Drag answers",
            active: false,
            image: "drag-answers-type",
            itemType: "dragAnswers",
            type: "drag_answer",
          },
          {
            name: "Match",
            active: false,
            image: "match-type",
            itemType: "match",
            type: "match",
          },
          {
            name: "Sequence",
            active: false,
            image: "sequence-type",
            itemType: "sequence",
            type: "sequence",
          },
        ],
        opened: true,
        hasImage: true,
        icon: "question-type",
        type: "question-type",
        value: "Multiple choice",
        itemType: "multipleChoice",
        questionType: "multiple_choice",
      },
      "time-limit": {
        name: "Time limit",
        options: [
          {
            name: "5s",
            active: false,
            image: "",
          },
          {
            name: "10s",
            active: false,
            image: "",
          },
          {
            name: "20s",
            active: false,
            image: "",
          },
          {
            name: "30s",
            active: false,
            image: "",
          },
          {
            name: "1m",
            active: true,
            image: "",
          },
          {
            name: "1m 30s",
            active: false,
            image: "",
          },
          {
            name: "2m",
            active: false,
            image: "",
          },
          {
            name: "3m",
            active: false,
            image: "",
          },
          {
            name: "4m",
            active: false,
            image: "",
          },
          {
            name: "5m",
            active: false,
            image: "",
          },
        ],
        opened: false,
        icon: "time-limit",
        type: "time-limit",
        value: "30s",
      },
      "total-options": {
        name: "Total options",
        options: [
          {
            name: "2",
            active: false,
            image: "",
          },
          {
            name: "3",
            active: false,
            image: "",
          },
          {
            name: "4",
            active: false,
            image: "",
          },
          {
            name: "5",
            active: false,
            image: "",
          },
          {
            name: "6",
            active: false,
            image: "",
          },
        ],
        opened: false,
        icon: "total-options",
        type: "total-options",
        value: "4",
      },
      "sequence-total": {
        name: "Sequence Total",
        options: [
          {
            name: "4",
            active: false,
            image: "",
          },
          {
            name: "5",
            active: false,
            image: "",
          },
          {
            name: "6",
            active: false,
            image: "",
          },
        ],
        opened: false,
        icon: "total-options",
        type: "sequence-total",
        value: "4",
      },
      "match-total": {
        name: "Match Total",
        options: [
          {
            name: "4",
            active: false,
            image: "",
          },
          {
            name: "5",
            active: false,
            image: "",
          },
          {
            name: "6",
            active: false,
            image: "",
          },
        ],
        opened: false,
        icon: "total-options",
        type: "match-total",
        value: "4",
      },
      "correct-anwsers": {
        name: "Correct answer(s)",
        options: [
          {
            name: "1",
            active: false,
            image: "",
          },
          {
            name: "2",
            active: false,
            image: "",
          },
          {
            name: "3",
            active: false,
            image: "",
          },
          {
            name: "4",
            active: false,
            image: "",
          },
        ],
        opened: false,
        icon: "correct-anwsers",
        type: "correct-anwsers",
        value: "2",
      },
    };

    const questionOptions = reactive([]);

    const selectedQuestionType = ref("multipleChoice");

    const questionTypes = Logic.Study.questionTypes;

    const showScrollBar = ref(false);

    const selectedQuestion = ref(Logic.Study.selectedQuestion);

    const question = ref();

    const setOptions = () => {
      if (question.value) {
        questionOptions.length = 0;
        const currentSettings =
          Logic.Study.questionTypes[selectedQuestionType.value].settings;
        currentSettings?.forEach((setting) => {
          const option = allOptions[setting.type];

          option.value = setting.value;
          questionOptions.push(option);
        });
      }
    };

    onMounted(() => {
      Logic.Study.watchProperty("selectedQuestion", selectedQuestion);
      question.value = selectedQuestion.value;
      selectedQuestionType.value = question.value?.key;
      setOptions();
    });

    watch(question, () => {
      selectedQuestionType.value = question.value?.key;
    });

    watch(selectedQuestionType, () => {
      setOptions();
    });

    watch(selectedQuestion, () => {
      question.value = selectedQuestion.value;
    });

    const saveSettings = () => {
      Logic.Study.AllQuestions.results.forEach((item) => {
        if (item.id == question.value?.id) {
          item.data.type = selectedQuestionType.value;
        }
      });

      Logic.Study.questionSettings = JSON.parse(
        JSON.stringify(questionOptions)
      );
    };

    const deleteQuestion = () => {
      Logic.Study.DeleteQuestion(question.value.id, Logic.Study.SingleQuiz.id)
        .then((data) => {
          if (data) {
            Logic.Common.showLoader({
              show: true,
              loading: false,
              message: "Question has been deleted.",
              type: "success",
            });
            showDeleteQuestion.value = false;
          }
        })
        .catch(() => {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Unable to delete question. Please try again",
            type: "error",
          });
        });
    };

    const duplicateQuestion = () => {
      const newQuestionData = questionTypes[selectedQuestionType.value];

      Logic.Study.CreateQuestionForm = Logic.Study.convertQuestionToInput(
        newQuestionData,
        selectedQuestionType.value
      );

      Logic.Study.CreateQuestion(true, Logic.Study.SingleQuiz.id);

      Logic.Common.showLoader({
        show: true,
        loading: false,
        message: "Question duplicated",
        type: "success",
      });
    };

    const deleteQuiz = () => {
      Logic.Study.DeleteQuiz(Logic.Study.SingleQuiz.id);
    };

    const toggleOption = (option: any) => {
      if (option.opened) {
        option.opened = false;
        selectedType.value = "";
      } else {
        option.opened = true;
        selectedType.value = option.type;
      }
      questionOptions.forEach((eachOption) => {
        if (option.type != eachOption.type) {
          eachOption.opened = false;
        }
      });
    };

    return {
      questionOptions,
      selectedType,
      showScrollBar,
      showDeleteQuestion,
      selectedQuestionType,
      Logic,
      showDeleteQuiz,
      toggleOption,
      deleteQuestion,
      duplicateQuestion,
      saveSettings,
      deleteQuiz,
    };
  },
});
</script>
