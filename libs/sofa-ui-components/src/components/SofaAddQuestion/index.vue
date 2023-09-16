<template>
  <div
    :class="`w-full mdlg:!flex hidden flex-col space-y-4 h-full overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
      showScrollBar ? 'mdlg:!scrollbar-thin' : 'scrollbar-none'
    }`"
    @mouseover="showScrollBar = true"
    @mouseleave="showScrollBar = false"
  >
    <draggable
      v-model="questions"
      :group="'add-question'"
      class="w-full space-y-4"
      item-key="image"
      @dragend="handleDrag"
    >
      <template #item="{ element, index }">
        <div
          :class="`w-full px-4 py-4 rounded-[12px] cursor-pointer ${
            selectedQuestion == index ? 'bg-[#E6F5FF]' : 'bg-[#F1F6FA]'
          } space-y-2 flex flex-col`"
          :key="index"
          @click="selectQuestion(element, index)"
        >
          <div class="flex flex-row items-center space-x-2">
            <sofa-normal-text :customClass="'!font-bold'">{{
              index + 1
            }}</sofa-normal-text>
            <span class="w-[4px] h-[4px] rounded-full bg-deepGray"> </span>
            <sofa-normal-text :customClass="'!font-bold'">{{
              element.type
            }}</sofa-normal-text>
          </div>

          <div class="w-full h-[144px] bg-cover">
            <img :src="`/images/${element.image}.svg`" class="w-full h-full" />
          </div>
        </div>
      </template>
    </draggable>

    <div class="w-full py-3 px-3">
      <div
        class="h-[144px] w-full rounded-[12px] border-[2px] border-[#E1E6EB] flex flex-row items-center justify-center cursor-pointer"
        @click="showAddQuestionModal = true"
      >
        <sofa-icon :name="'add-item'" :custom-class="'h-[30px]'"></sofa-icon>
      </div>
    </div>
  </div>

  <!-- Smaller screens bottom bar -->

  <div
    class="w-full !flex flex-row fixed bottom-0 left-0 items-center py-3 px-4 border-t-[1px] justify-between mdlg:!hidden bg-white border-[#F1F6FA] z-[9999999]"
  >
    <div
      class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
    >
      <draggable
        class="flex flex-row space-x-2 items-center flex-nowrap whitespace-nowrap pr-4"
        v-model="questions"
        v-if="questions"
        :group="'add-question-mobile'"
        item-key="image"
        @dragend="handleDrag"
        :direction="'horizontal'"
        :disabled="true"
        @dragenter="
          () => {
            console.log('cool jos');
          }
        "
      >
        <template #item="{ element, index }">
          <div
            :class="`w-[48px] h-[48px] custom-border ${
              selectedQuestion == index
                ? 'bg-primaryPurple'
                : 'bg-lightGrayVaraint'
            }  items-center justify-center flex`"
            @click="selectQuestion(element, index)"
          >
            <sofa-normal-text
              :color="
                selectedQuestion == index ? 'text-white' : 'text-bodyBlack'
              "
            >
              {{ index + 1 }}
            </sofa-normal-text>
          </div>
        </template>
      </draggable>
    </div>

    <div
      class="w-[55px] flex flex-col justify-end"
      @click="showAddQuestionModal = true"
    >
      <span class="pl-2">
        <sofa-icon :customClass="'h-[44px]'" :name="'faded-plus'" />
      </span>
    </div>
  </div>

  <!-- Add question modal -->
  <sofa-modal
    v-if="showAddQuestionModal"
    :close="
      () => {
        showAddQuestionModal = false;
      }
    "
  >
    <div
      class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative"
      @click.stop="
        () => {
          //
        }
      "
    >
      <div
        class="bg-white w-full flex flex-col lg:!px-6 space-y-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center"
      >
        <div class="w-full text-center hidden md:!inline-block">
          <sofa-header-text :customClass="'!text-xl !font-bold '"
            >Choose question type</sofa-header-text
          >
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden"
        >
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Choose question type
          </sofa-normal-text>
          <sofa-icon
            :customClass="'h-[16px]'"
            :name="'circle-close'"
            @click="showAddQuestionModal = false"
          />
        </div>

        <div
          class="w-full grid md:!grid-cols-3 mdlg:!grid-cols-4 grid-cols-2 gap-4"
        >
          <div
            :class="`col-span-1 px-3 py-3 flex flex-col space-y-2 cursor-pointer items-center justify-center hover:bg-[#E6F5FF]  bg-[#F2F5F8] rounded-[8px] `"
            v-for="(item, index) in questionTypes"
            :key="index"
            @click="addQuestion(index.toString())"
          >
            <sofa-icon :name="item.icon" :custom-class="'h-[50px]'" />
            <sofa-normal-text>{{ item.type }}</sofa-normal-text>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import draggable from "vuedraggable";
import { Question } from "../../types/domains/study";
import { Logic } from "../../composable";
import SofaModal from "../SofaModal";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    draggable,
    SofaModal,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    data: {
      type: Array as () => Question[],
      default: [],
    },
  },
  name: "SofaAddQuestion",
  emits: ["OnQuestionSelected"],
  setup(props, context) {
    const showScrollBar = ref(false);
    const selectedQuestion = ref(0);
    const hideQuestions = ref(false);

    const questionIsSelected = ref(false);

    const showAddQuestionModal = ref(false);

    const dataRef = toRef(props, "data");

    const questionTypes = Logic.Study.questionTypes;

    const UpdatedQuestion = ref(Logic.Study.UpdatedQuestion);

    const questions = ref([]);

    const selectQuestion = (question: any, index: number) => {
      selectedQuestion.value = index;
      questionIsSelected.value = true;
      context.emit("OnQuestionSelected", question);
    };

    const setQuestions = (autoSelectQuestion = true) => {
      questions.value.length = 0;
      props.data?.forEach((question, index) => {
        const questionData = Logic.Study.ProcessQuestionData(question);

        questions.value.push(...[questionData]);
      });

      if (questions.value.length > 0 && autoSelectQuestion) {
        selectQuestion(questions.value[0], 0);
      }
    };

    onMounted(() => {
      if (dataRef.value) {
        setQuestions();
      }
      Logic.Study.watchProperty("UpdatedQuestion", UpdatedQuestion);
    });

    watch(questions, () => {
      if (questions.value) {
        const allQuestionIds = questions.value.map((question) => question.id);
        console.log(allQuestionIds);

        Logic.Study.ReorderQuizQuestionsForm = {
          questions: allQuestionIds,
        };
        Logic.Study.ReorderQuizQuestions(Logic.Study.SingleQuiz.id);
      }
    });

    const handleDrag = () => {
      const allQuestions = questions.value;

      setTimeout(() => {
        questions.value = allQuestions;
      }, 500);
    };

    watch(dataRef, () => {
      setQuestions(!questionIsSelected.value);
    });

    const addQuestion = (
      type:
        | "sequence"
        | "match"
        | "multipleChoice"
        | "writeAnswer"
        | "trueOrFalse"
        | "fillInBlanks"
        | "dragAnswers"
        | any
    ) => {
      const newQuestionData = questionTypes[type];

      showAddQuestionModal.value = false;

      Logic.Study.CreateQuestionForm = Logic.Study.convertQuestionToInput(
        newQuestionData,
        type
      );

      Logic.Study.CreateQuestion(true, Logic.Study.SingleQuiz.id);
    };

    return {
      questions,
      showScrollBar,
      selectQuestion,
      selectedQuestion,
      handleDrag,
      hideQuestions,
      addQuestion,
      showAddQuestionModal,
      questionTypes,
    };
  },
});
</script>
