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
          @click="selectedType = option.type"
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
            @click="option.value = item.name"
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
            :class="`col-span-1 px-3 py-3 flex flex-col space-y-2 items-center justify-center ${
              item.name == option.value ? 'bg-[#E6F5FF]' : 'bg-[#F2F5F8]'
            }  rounded-[8px] `"
            v-for="(item, index) in option.options"
            :key="index"
          >
            <sofa-icon :name="item.image" :custom-class="'h-[50px]'" />
            <sofa-normal-text>{{ item.name }}</sofa-normal-text>
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
      >
        <sofa-icon :name="'copy'" :customClass="'h-[16px]'" />
        <sofa-normal-text>Duplicate question</sofa-normal-text>
      </div>
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 cursor-pointer"
        @click="showDeleteQuestion = true"
      >
        <sofa-icon :name="'trash'" :customClass="'h-[16px]'" />
        <sofa-normal-text :color="'text-primaryRed'"
          >Delete question</sofa-normal-text
        >
      </div>
    </div>
  </div>
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
    questionSettings: {
      type: Array as () => {
        type: string;
        value: string;
      }[],
    },
    questionId: {
      type: String,
      default: "",
    },
    questionType: {
      type: String,
      default: "",
    },
  },
  name: "SofaQuestionOptions",
  setup(props, context) {
    const showDeleteQuestion = ref(false);
    const selectedType = ref("question-type");
    const allOptions = {
      "question-type": {
        name: "Question type",
        options: [
          {
            name: "Multiple choice",
            active: false,
            image: "multiple-choice-type",
          },
          {
            name: "True/False",
            active: false,
            image: "true-false-type",
          },
          {
            name: "Write answer",
            active: false,
            image: "write-answer-type",
          },
          {
            name: "Fill in blank(s)",
            active: false,
            image: "fill-in-blanks-type",
          },
          {
            name: "Drag answers",
            active: false,
            image: "drag-answers-type",
          },
          {
            name: "Match",
            active: false,
            image: "match-type",
          },
          {
            name: "Sequence",
            active: false,
            image: "sequence-type",
          },
        ],
        opened: true,
        hasImage: true,
        icon: "question-type",
        type: "question-type",
        value: "Multiple choice",
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

    const questionTypes = Logic.Study.questionTypes;

    const showScrollBar = ref(false);

    const questionSettingsRef = toRef(props, "questionSettings");

    const setOptions = () => {
      questionOptions.length = 0;
      questionSettingsRef.value?.forEach((setting) => {
        const option = allOptions[setting.type];

        option.value = setting.value;
        questionOptions.push(option);
      });
    };

    onMounted(() => {
      setOptions();
    });

    watch(questionSettingsRef, () => {
      setOptions();
    });

    watch(questionOptions, () => {
      Logic.Common.debounce(() => {
        Logic.Study.questionSettings = JSON.parse(
          JSON.stringify(questionOptions)
        );
      });
    });

    const deleteQuestion = () => {
      Logic.Study.DeleteQuestion(props.questionId, Logic.Study.SingleQuiz.id)
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
      console.log(props.questionType);

      const newQuestionData = questionTypes[props.questionType];

      Logic.Study.CreateQuestionForm = Logic.Study.convertQuestionToInput(
        newQuestionData,
        props.questionType
      );

      Logic.Study.CreateQuestion(true, Logic.Study.SingleQuiz.id);

      Logic.Common.showLoader({
        show: true,
        loading: false,
        message: "Question duplicated",
        type: "success",
      });
    };

    return {
      questionOptions,
      selectedType,
      showScrollBar,
      showDeleteQuestion,
      deleteQuestion,
      duplicateQuestion,
    };
  },
});
</script>
