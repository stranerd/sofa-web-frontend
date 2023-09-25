<template>
  <div class="w-full flex flex-col">
    <div class="flex flex-col w-full space-y-5" v-if="state == 'preview'">
      <div
        class="w-full flex flex-col space-y-1 items-center justify-center md:!px-0 px-4"
      >
        <sofa-normal-text
          :customClass="'!font-bold md:!text-xl text-lg'"
          :size="''"
          :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
          >{{ question.title }}</sofa-normal-text
        >
        <sofa-normal-text
          :customClass="'md:!text-lg text-xs'"
          :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
          >{{ question.question }}</sofa-normal-text
        >
      </div>

      <div
        class="w-full flex flex-row items-center justify-center md:!py-6 md:!px-0 py-4 px-4 bg-white"
        style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)"
      >
        <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'">{{
          question.info
        }}</sofa-header-text>
      </div>

      <div class="w-full flex flex-row items-center justify-center">
        <span
          class="h-[46px] w-[46px] rounded-full bg-white flex flex-row items-center justify-center"
        >
          <sofa-header-text :customClass="'!text-lg'">{{
            question.duration
          }}</sofa-header-text>
        </span>
      </div>
    </div>

    <div
      class="w-full flex flex-row justify-center items-center px-6"
      v-if="state == 'question'"
    >
      <div
        class="flex flex-col lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full space-y-4"
      >
        <div
          class="w-full flex flex-col border-b-[2px] border-[#E1E6EB] pb-2 justify-start"
          v-if="Logic.Common.mediaQuery() != 'sm'"
        >
          <sofa-header-text
            :custom-class="'text-left !font-bold'"
            v-if="mode != 'game' && mode != 'tutor_test'"
            :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
          >
            {{ quizTitle }}
          </sofa-header-text>
          <sofa-header-text
            :custom-class="'text-left !font-bold'"
            :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            v-else
          >
            Question {{ questionIndex + 1 }}
          </sofa-header-text>
        </div>
        <sofa-header-text
          v-if="
            question.options.type != 'blanks' && question.options.type != 'drag'
          "
          :customClass="'!font-bold md:!text-2xl text-base w-full text-left justify-start flex flex-row'"
          :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
          >{{ question.question }}</sofa-header-text
        >

        <!-- Question instruction -->
        <div class="w-full flex flex-col justify-start pb-2">
          <template v-if="question.title == 'Multiple choice'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Choose
              {{ Logic.Common.inWords(question.answer?.split(",").length) }}
              answer{{ question.answer?.split(",").length > 1 ? "s" : "" }}
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'Write answer'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Type your answer
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'True/False'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Choose one answer
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'Fill in blank(s)'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Fill in the gaps
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'Drag answers'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Drag answers
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'Sequence'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Drag to rearrange
            </sofa-normal-text>
          </template>
          <template v-if="question.title == 'Match'">
            <sofa-normal-text
              :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
            >
              Drag items on the right side to rearrange
            </sofa-normal-text>
          </template>
        </div>

        <!-- Radio -->

        <div
          class="w-full flex flex-col space-y-4"
          v-if="question.options.type == 'radio'"
        >
          <div
            v-for="(option, index) in question.options.data"
            :key="index"
            :class="`w-full flex flex-row items-center cursor-pointer justify-between bg-white rounded-[12px] px-3 py-3 ${
              optionState(option) == 'hover'
                ? '!bg-[#E2F3FD]  border-[#7DC8FA]'
                : ''
            } ${
              optionState(option) == 'correct_answer'
                ? '!bg-[#E1F5EB] !border-primaryGreen'
                : ''
            }
            ${
              optionState(option) == 'wrong_answer'
                ? '!bg-[#FAEBEB] !border-primaryRed'
                : ''
            }
            ${
              optionState(option) == 'selected'
                ? '!bg-[#E2F3FD] !border-primaryBlue  shake'
                : ''
            }
             border-[#E1E6EB] bg-white space-x-3`"
            style="border-width: 2px 2px 4px 2px"
            @mouseleave="option.hover = false"
            @mouseenter="option.hover = true"
            @click="setAnswer(option.content[0].label)"
          >
            <div class="flex-grow flex flex-row space-x-3 items-center">
              <sofa-icon
                :name="`${option.shape}${
                  optionState(option) == 'hover' ? '-blue' : ''
                }${optionState(option) == 'correct_answer' ? '-green' : ''}${
                  optionState(option) == 'wrong_answer' ? '-red' : ''
                }`"
                :custom-class="`${getShapeSize(option.shape)}`"
              />
              <sofa-header-text
                :customClass="' md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex flex-row'"
                >{{ option.content[0].label }}</sofa-header-text
              >
            </div>
          </div>
        </div>

        <!-- Textfield -->
        <div
          class="w-full flex flex-col space-y-4 pt-4"
          v-if="question.options.type == 'textField'"
        >
          <div
            v-for="(option, index) in question.options.data"
            :key="index"
            class="w-full flex flex-row items-center justify-between rounded-[12px] md:!px-3 md:!py-3 px-3 py-1 border-[#E1E6EB] bg-white space-x-3"
            style="border-width: 2px 2px 4px 2px"
          >
            <div class="flex-grow flex flex-row space-x-3 py-3 items-center">
              <sofa-textarea
                :placeholder="option.content[0].label"
                v-model="question.userAnswer"
                :rich-editor="false"
                :text-area-style="`focus:outline-none bg-transparent  !text-bodyBlack !bg-white placeholder:text-grayColor w-full placeholder:font-semibold text-base placeholder:text-base`"
              >
              </sofa-textarea>
            </div>
          </div>
        </div>

        <!-- Blanks -->
        <div
          class="w-full flex flex-col space-y-4 pt-4"
          v-if="question.options.type == 'blanks'"
        >
          <div
            class="w-full flex flex-row md:!space-x-3 space-x-2 gap-2 items-center flex-wrap"
            v-if="fillInblankAnswers.length"
          >
            <template
              v-for="(content, index) in question.options.data[0].content"
              :key="index"
            >
              <sofa-header-text
                v-if="content.type == 'text'"
                :customClass="'!font-bold md:!text-2xl text-base '"
                :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
                >{{ content.label }}</sofa-header-text
              >
              <div
                v-if="content.type == 'textField'"
                class="w-[160px] rounded-[12px] md:!px-3 md:!py-3 px-2 py-1 bg-white flex items-center justify-center"
                style="border-width: 2px 2px 4px 2px"
              >
                <input
                  :placeholder="content.label"
                  class="w-full focus:outline-none placeholder:md:!text-2xl !text-bodyBlack !bg-white placeholder:text-base placeholder:text-grayColor placeholder:font-bold md:!text-2xl text-base font-bold"
                  v-model="fillInblankAnswers[index].value"
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Drag and drop -->

        <div
          class="w-full flex flex-col space-y-4 pt-4 boundary1"
          v-if="question.options.type == 'drag'"
        >
          <div
            class="w-full flex flex-row md:!space-x-3 space-x-2 gap-2 items-center flex-wrap"
          >
            <template
              v-for="(content, index) in question.options.data[0].content"
              :key="index"
            >
              <sofa-header-text
                v-if="content.type == 'text'"
                :customClass="'!font-bold md:!text-2xl text-base '"
                :color="quizIsDarkMode ? 'text-white' : 'text-bodyBlack'"
                >{{ content.label }}</sofa-header-text
              >
              <draggable
                :key="index"
                v-if="content.type == 'drop'"
                :list="content.content"
                item-key="id"
                :group="{ name: 'drag-and-drop-question' }"
                :class="`md:!w-[160px] md:!h-[70px] w-[140px] h-[48px] rounded-[12px] md:!px-4 md:!py-3 px-3 py-1 bg-white flex items-center justify-center ${content.extraClass}`"
                style="border-width: 2px 2px 4px 2px"
                @end="dropHandler"
              >
                <template #item="{ element, index }">
                  <div
                    :key="index"
                    :class="`md:!px-6 md:!py-3 px-4 py-1 flex flex-row items-center cursor-move justify-center touch-none bg-skyBlue rounded-[12px]  ${element.extraClass}`"
                    style="border-width: 2px 2px 4px 2px"
                  >
                    <sofa-header-text
                      :customClass="'!font-bold md:!text-2xl text-base '"
                    >
                      {{ element.label }}
                    </sofa-header-text>
                  </div>
                </template>
              </draggable>
            </template>

            <draggable
              class="w-full flex flex-row items-center space-x-3 pt-6 md:!h-[90px] h-[40px]"
              :list="question.options.data[1].content"
              item-key="id"
              :group="{ name: 'drag-and-drop-question' }"
              @end="dropHandler"
            >
              <template #item="{ element, index }">
                <div
                  :key="index"
                  :class="`md:!px-6 md:!py-3 px-4 py-1 flex flex-row items-center cursor-move justify-center touch-none bg-skyBlue rounded-[12px]  ${element.extraClass}`"
                  style="border-width: 2px 2px 4px 2px"
                >
                  <sofa-header-text
                    :customClass="'!font-bold md:!text-2xl text-base '"
                  >
                    {{ element.label }}
                  </sofa-header-text>
                </div>
              </template>
            </draggable>
          </div>
        </div>

        <!-- Sequence -->
        <div
          class="w-full flex flex-col space-y-4 pt-4 boundary1"
          v-if="question.options.type == 'sequence'"
        >
          <draggable
            v-model="sequenceOption"
            group="sortable1"
            class="space-y-4"
            item-key="label"
          >
            <template #item="{ element, index }">
              <div class="w-full flex flex-row items-center space-x-3">
                <div
                  class="px-6 py-3 rounded-[12px] flex flex-row items-center justify-center bg-white border-[#E1E6EB]"
                  style="border-width: 2px 2px 4px 2px"
                >
                  <sofa-header-text
                    :customClass="' md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex flex-row'"
                    >{{ index + 1 }}</sofa-header-text
                  >
                </div>
                <div
                  class="w-full flex flex-row items-center cursor-move justify-between rounded-[12px] flex-grow px-4 py-3 border-[#E1E6EB] bg-white space-x-3"
                  style="border-width: 2px 2px 4px 2px"
                >
                  <div class="flex-grow flex flex-row space-x-3 items-center">
                    <sofa-header-text
                      :customClass="' md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex flex-row !line-clamp-1'"
                      >{{ element.label }}</sofa-header-text
                    >
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Match -->

        <div
          class="w-full grid grid-cols-2 gap-4 pt-4 boundary1"
          v-if="question.options.type == 'match'"
        >
          <draggable
            v-model="question.options.data[0].content"
            group="sortable2"
            class="col-span-1 space-y-3"
            item-key="label"
            :disabled="true"
          >
            <template #item="{ element, index }">
              <div class="w-full flex flex-row items-center space-x-3">
                <div
                  class="w-full flex flex-row items-center justify-between rounded-[12px] flex-grow px-4 py-3 border-[#E1E6EB] bg-white space-x-3"
                  style="border-width: 2px 2px 4px 2px"
                >
                  <sofa-icon
                    :name="element.shape"
                    :custom-class="`${matchShapes[index]}`"
                  />
                  <div class="flex-grow flex flex-row space-x-3 items-center">
                    <sofa-header-text
                      :customClass="' md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex flex-row !line-clamp-1'"
                      >{{ element.label }}</sofa-header-text
                    >
                  </div>
                </div>
              </div>
            </template>
          </draggable>

          <draggable
            v-model="matchOption"
            group="sortable3"
            class="col-span-1 space-y-3"
            item-key="label"
          >
            <template #item="{ element, index }">
              <div class="w-full flex flex-row items-center space-x-3">
                <div
                  class="w-full flex flex-row items-center cursor-move justify-between rounded-[12px] flex-grow px-4 py-3 border-[#E1E6EB] bg-white space-x-3"
                  style="border-width: 2px 2px 4px 2px"
                >
                  <sofa-icon
                    :name="element.shape"
                    :custom-class="`${matchShapes[index]}`"
                  />
                  <div class="flex-grow flex flex-row space-x-3 items-center">
                    <sofa-header-text
                      :customClass="' md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex flex-row !line-clamp-1'"
                      >{{ element.label }}</sofa-header-text
                    >
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <div
          class="w-full flex flex-col space-y-2 items-start justify-start pt-2"
          v-if="answerState == 'wrong'"
        >
          <sofa-header-text :size="'xl'">Correct answer</sofa-header-text>
          <sofa-normal-text>{{ question.answer }}</sofa-normal-text>
        </div>
      </div>
    </div>

    <div
      class="w-full flex flex-col space-y-3 h-full items-center justify-center"
      v-if="state == 'completed'"
    >
      <template v-if="mode == 'test'">
        <sofa-pie-chart
          :data="resultData"
          :cutoutPercentage="'90%'"
          ref="pieChartRefForTestScore"
          :textStyle="`!text-3xl ${pieChartColor}`"
          >{{ quizResult().percentagePass }}%</sofa-pie-chart
        >

        <div class="flex flex-col space-y-1">
          <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'">{{
            pieLabel
          }}</sofa-header-text>
          <sofa-normal-text :color="'text-grayColor'"
            >{{ quizResult().correctAnswers }}/{{ questions.length }} correct
            answers</sofa-normal-text
          >
        </div>
      </template>

      <template v-if="mode == 'practice'">
        <div class="flex flex-col space-y-1">
          <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'">
            Congratulations!</sofa-header-text
          >
          <sofa-normal-text :color="'text-grayColor'"
            >Your have mastered this quiz</sofa-normal-text
          >
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRef, watch } from "vue";
import draggable from "vuedraggable";
import {
  SofaNormalText,
  SofaHeaderText,
  SofaIcon,
  SofaPieChart,
  SofaTextarea,
} from "sofa-ui-components";
import { QuizQuestion } from "sofa-logic/src/logic/types/domains/study";
import { Logic } from "sofa-logic";
import {
  pieChartColor,
  pieChartRefForTestScore,
  pieLabel,
  questions,
  quizResult,
  resultData,
  saveParticipantAnswer,
  setResultData,
} from "@/composables/quiz";

export default defineComponent({
  components: {
    draggable,
    SofaNormalText,
    SofaHeaderText,
    SofaIcon,
    SofaPieChart,
    SofaTextarea,
  },
  props: {
    questionData: {
      type: Object as () => QuizQuestion,
    },
    answerState: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "preview",
    },
    mode: {
      type: String,
      default: "preview",
    },
    questionIndex: {
      type: Number,
      default: 0,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    quizIsDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["OnAnswerSelected"],
  setup(props, context) {
    const questionRef = toRef(props, "questionData");

    const possibleAnswers = ref(0);

    const multipleChoiceAnswers = reactive([]);

    const dragAndDropAnswers = reactive<string[]>([]);

    const matchShapes = [
      "circle",
      "triangle",
      "square",
      "kite",
      "circle",
      "triangle",
      "square",
      "kite",
    ];

    const fillInblankAnswers = reactive<
      {
        value: string;
      }[]
    >([]);

    questionRef.value.options.data.forEach((item) => {
      item.hover = false;
    });

    const question = reactive<QuizQuestion>(questionRef.value);

    const sequenceOption = ref<
      {
        label: string;
        type: string;
        value?: string;
        extraClass?: string;
        shape?: string;
      }[]
    >([]);

    const matchOption = ref<
      {
        label: string;
        type: string;
        value?: string;
        extraClass?: string;
        shape?: string;
      }[]
    >([]);

    const initialDuration = question.duration;

    const dropHandler = () => {
      const dropContents = question.options.data[0].content.filter(
        (item) => item.type == "drop"
      );

      dragAndDropAnswers.length = 0;

      dropContents.forEach((item) => {
        if (item.content[0]) {
          dragAndDropAnswers.push(item.content[0]?.label);
        }
      });
    };

    const getShapeSize = (shape: string) => {
      if (shape == "circle") {
        return "md:!h-[23px] h-[20px]";
      }

      if (shape == "triangle") {
        return "md:!h-[20px] h-[17px]";
      }

      if (shape == "square") {
        return "md:!h-[20px] h-[17px]";
      }

      if (shape == "kite") {
        return "md:!h-[24px] h-[21px]";
      }

      return "h-[23px]";
    };

    const currentIndexRef = toRef(props, "currentIndex");

    const counterInterval = ref();

    const handleQuestionSelected = () => {
      if (props.mode == "game" || props.mode == "tutor_test") {
        if (currentIndexRef.value == props.questionIndex) {
          question.duration = initialDuration;
          counterInterval.value = setInterval(() => {
            if (parseInt(question.duration) == 1) {
              clearInterval(counterInterval.value);
            } else {
              question.duration = (parseInt(question.duration) - 1).toString();
            }
          }, 1000);
        }
      }
    };

    const setOptions = () => {
      if (question.options.type == "sequence") {
        sequenceOption.value.push(
          ...JSON.parse(
            JSON.stringify(
              Logic.Common.shuffleArray(question.options.data[0].content)
            )
          )
        );
      }

      if (question.options.type == "match") {
        matchOption.value.push(
          ...JSON.parse(
            JSON.stringify(
              Logic.Common.shuffleArray(question.options.data[1].content)
            )
          )
        );
      }

      if (question.options.type == "blanks") {
        question.options.data[0].content.forEach(() => {
          fillInblankAnswers.push({
            value: "",
          });
        });
      }
    };

    const saveAnswer = (answer: any) => {
      if (questions[props.questionIndex]) {
        questions[props.questionIndex].userAnswer = answer;
      }
      question.userAnswer = answer;

      if (props.mode == "game" || props.mode == "tutor_test") {
        let mainAnswer: any = "";
        if (question.title == "Multiple choice") {
          mainAnswer = [
            props.questionData.options.data
              .map((item) => item.content[0].label)
              .indexOf(answer),
          ];
        }

        if (question.title == "Write answer") {
          mainAnswer = answer;
        }

        if (question.title == "True/False") {
          mainAnswer = answer == "True";
        }

        if (
          question.title == "Drag answers" ||
          question.title == "Fill in blank(s)" ||
          question.title == "Sequence" ||
          question.title == "Match"
        ) {
          mainAnswer = answer.split(", ");
        }

        Logic.Common.debounce(() => {
          saveParticipantAnswer(mainAnswer, props.questionData.id);
        }, 500);
      }
    };

    const setAnswer = (value: any) => {
      if (question.title == "True/False") {
        saveAnswer(value.trim());
      }

      if (question.title != "Multiple choice") {
        context.emit("OnAnswerSelected", value);
      } else {
        if (!multipleChoiceAnswers.includes(value.trim())) {
          if (multipleChoiceAnswers.length < possibleAnswers.value) {
            multipleChoiceAnswers.push(value.trim());
          } else {
            multipleChoiceAnswers.pop();
            multipleChoiceAnswers.push(value.trim());
          }
        } else {
          const currentValueIndex = multipleChoiceAnswers.indexOf(value.trim());
          if (currentValueIndex != -1) {
            multipleChoiceAnswers.splice(currentValueIndex, 1);
          }
        }

        saveAnswer(multipleChoiceAnswers.join(", "));
      }
    };

    const optionState = (option: {
      content: {
        label: string;
        type: string;
        value?: string;
        extraClass?: string;
        shape?: string;
      }[];
      shape?: string;
      hover?: boolean;
    }) => {
      if (props.answerState == "correct" || props.answerState == "wrong") {
        if (
          questions[props.questionIndex].answer?.trim() ==
          option.content[0].label?.trim()
        ) {
          return "correct_answer";
        }

        if (
          questions[props.questionIndex].answer
            ?.trim()
            .split(", ")
            .includes(option.content[0].label?.trim())
        ) {
          return "correct_answer";
        }

        if (
          questions[props.questionIndex].userAnswer?.trim() ==
          option.content[0].label?.trim()
        ) {
          return "wrong_answer";
        }

        if (
          questions[props.questionIndex].userAnswer
            ?.trim()
            .split(", ")
            .includes(option.content[0].label?.trim())
        ) {
          return "wrong_answer";
        }
      }

      if (option.hover && props.answerState == "selected") {
        return "selected";
      }

      if (option.hover || question.userAnswer == option.content[0].label) {
        return "hover";
      }

      if (multipleChoiceAnswers.includes(option.content[0].label)) {
        return "hover";
      }

      return "";
    };

    watch(currentIndexRef, () => {
      handleQuestionSelected();
    });

    watch(question, () => {
      if (question.title == "Write answer") {
        if (question.userAnswer) {
          saveAnswer(question.userAnswer?.trim());
        }
      }

      setResultData(quizResult().percentagePass);
    });

    watch(sequenceOption, () => {
      saveAnswer(sequenceOption.value.map((item) => item.label).join(", "));
    });

    watch(matchOption, () => {
      saveAnswer(matchOption.value.map((item) => item.label).join(", "));
    });

    watch(dragAndDropAnswers, () => {
      saveAnswer(dragAndDropAnswers.join(", "));
    });

    watch(fillInblankAnswers, () => {
      saveAnswer(
        fillInblankAnswers
          .map((item) => item.value)
          .filter((eachitem) => {
            return eachitem;
          })
          .join(", ")
      );
    });

    onMounted(() => {
      handleQuestionSelected();
      setOptions();

      setTimeout(() => {
        setResultData(quizResult().percentagePass);
      }, 1000);

      if (props.questionData.title == "Multiple choice") {
        possibleAnswers.value = props.questionData.answer?.split(",").length;
      }
    });

    return {
      dropHandler,
      getShapeSize,
      question,
      Logic,
      sequenceOption,
      matchOption,
      setAnswer,
      fillInblankAnswers,
      resultData,
      quizResult,
      questions,
      pieChartRefForTestScore,
      pieChartColor,
      pieLabel,
      optionState,
      matchShapes,
    };
  },
});
</script>
<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s infinite;
}
</style>
