<template>
  <expanded-layout
    :layoutStyle="'!w-full !justify-between !flex !flex-col !px-0 !py-0'"
    :hasTopBar="false"
    :hasBottomBar="false"
  >
    <sofa-swiper
      :free-mode="false"
      :show-pagination="false"
      :space-between="0"
      :slide-per-view="1"
      custom-class="!w-full !h-screen"
      :swiper-class="'!h-screen'"
      v-model="currentQuestionIndex"
      :current-slide-position="questionIndex"
      :enabled="enabledSwiper"
      ref="swiperInstance"
    >
      <swiper-slide
        class="!h-screen !justify-between !flex !flex-col !relative"
        v-for="(question, index) in questions"
        :key="index"
      >
        <div
          :class="`py-8 w-full md:!flex hidden flex-row items-center justify-center sticky top-0 left-0 bg-white  ${
            state != 'preview' ? '' : 'invisible'
          }`"
          style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)"
        >
          <div
            class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex flex-row items-center space-x-3 justify-between"
          >
            <div class="w-full relative h-[14px] bg-[#E1E6EB] rounded-[8px]">
              <div
                class="absolute top-0 left-0 h-full bg-primaryGreen rounded-[8px]"
                :style="`width: calc(${
                  ((index + 1) / questions.length) * 90
                }% + 10%);`"
              >
                <span
                  class="w-[60px] h-[40px] z-[33344444] top-[-15px] text-white flex items-center justify-center rounded-[32px] absolute right-0 bg-primaryGreen !font-semibold"
                >
                  {{ index + 1 }}/{{ questions.length }}
                </span>
              </div>
            </div>
            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!text-base cursor-pointer'"
              @click="Logic.Common.goBack()"
            >
              Exit
            </sofa-normal-text>
          </div>
        </div>

        <!-- Top bar for smaller screens -->
        <div
          class="w-full flex flex-row md:!hidden justify-between items-center z-50 bg-backgroundGray px-4 py-4 sticky top-0 left-0"
        >
          <sofa-icon
            :customClass="'h-[19px]'"
            :name="'circle-close'"
            @click="Logic.Common.goBack()"
          />

          <sofa-normal-text :customClass="'!font-bold !text-sm'">
            {{ mobileTitle }}
          </sofa-normal-text>

          <div :class="`flex flex-row items-center space-x-3`">
            <sofa-normal-text>
              {{ index + 1 }}/{{ questions.length }}</sofa-normal-text
            >
          </div>
        </div>

        <div class="flex flex-col w-full space-y-5" v-if="state == 'preview'">
          <div
            class="w-full flex flex-col space-y-1 items-center justify-center md:!px-0 px-4"
          >
            <sofa-normal-text
              :customClass="'!font-bold md:!text-xl text-lg'"
              :size="''"
              >{{ question.title }}</sofa-normal-text
            >
            <sofa-normal-text :customClass="'md:!text-lg text-xs'">{{
              question.question
            }}</sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row items-center justify-center md:!py-6 md:!px-0 py-4 px-4 bg-white"
            style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)"
          >
            <sofa-header-text
              :customClass="'!font-bold md:!text-2xl text-lg'"
              >{{ question.info }}</sofa-header-text
            >
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
          v-else
        >
          <div
            class="flex flex-col lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full space-y-4"
          >
            <sofa-header-text
              v-if="
                question.options.type != 'blanks' &&
                question.options.type != 'drag'
              "
              :customClass="'!font-bold md:!text-2xl text-base w-full text-left justify-start flex flex-row'"
              >{{ question.question }}</sofa-header-text
            >

            <!-- Radio -->

            <div
              class="w-full flex flex-col space-y-4 pt-4"
              v-if="question.options.type == 'radio'"
            >
              <div
                v-for="(option, index) in question.options.data"
                :key="index"
                class="w-full flex flex-row items-center justify-between rounded-[12px] px-3 py-3 border-[#E1E6EB] bg-white space-x-3"
                style="border-width: 2px 2px 4px 2px"
              >
                <div class="flex-grow flex flex-row space-x-3 items-center">
                  <sofa-icon
                    :name="option.shape"
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
                <div
                  class="flex-grow flex flex-row space-x-3 py-3 items-center"
                >
                  <sofa-icon
                    :name="option.shape"
                    :custom-class="`${getShapeSize(option.shape)}`"
                  />
                  <input
                    class="focus:outline-none bg-transparent placeholder:text-grayColor w-full placeholder:font-semibold text-base placeholder:text-base"
                    :placeholder="option.content[0].label"
                  />
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
              >
                <template
                  v-for="(content, index) in question.options.data[0].content"
                  :key="index"
                >
                  <sofa-header-text
                    v-if="content.type == 'text'"
                    :customClass="'!font-bold md:!text-2xl text-base '"
                    >{{ content.label }}</sofa-header-text
                  >
                  <div
                    v-if="content.type == 'textField'"
                    class="w-[160px] rounded-[12px] md:!px-3 md:!py-3 px-2 py-1 bg-white flex items-center justify-center"
                    style="border-width: 2px 2px 4px 2px"
                  >
                    <input
                      :placeholder="content.label"
                      class="w-full focus:outline-none placeholder:md:!text-2xl placeholder:text-base placeholder:text-grayColor placeholder:font-bold md:!text-2xl text-base font-bold"
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
                    >{{ content.label }}</sofa-header-text
                  >
                  <div
                    v-if="content.type == 'drop'"
                    :class="`md:!w-[160px] md:!h-[70px] w-[140px] h-[45px] rounded-[12px] md:!px-4 md:!py-3 px-3 py-1 bg-white flex items-center justify-center ${content.extraClass}`"
                    style="border-width: 2px 2px 4px 2px"
                    @dragover="dragOverHandler($event, true)"
                    @drop="dropHandler"
                    :id="content.extraClass"
                    @dragleave="dragLeaveHandler"
                  >
                    <sofa-header-text
                      :customClass="'!font-bold md:!text-2xl text-base !text-grayColor '"
                      >{{ content.label }}</sofa-header-text
                    >
                  </div>
                </template>

                <div
                  class="w-full flex flex-row items-center space-x-3 pt-6 md:!h-[90px] h-[40px]"
                  @dragover="dragOverHandler($event, false)"
                  @drop="dropHandler"
                  :id="'dropMainContainer'"
                >
                  <div
                    v-for="(dragOption, index) in question.options.data[1]
                      .content"
                    :key="index"
                    :class="`px-6 py-3 flex flex-row items-center cursor-move justify-center touch-none bg-skyBlue rounded-[12px]  ${dragOption.extraClass}`"
                    style="border-width: 2px 2px 4px 2px"
                    :id="dragOption.extraClass"
                    draggable="true"
                    @dragstart="handleDrag"
                  >
                    <sofa-header-text
                      :customClass="'!font-bold md:!text-2xl text-base '"
                    >
                      {{ dragOption.label }}
                    </sofa-header-text>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sequence -->
            <div
              class="w-full flex flex-col space-y-4 pt-4 boundary1"
              v-if="question.options.type == 'sequence'"
            >
              <draggable
                v-model="question.options.data[0].content"
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
                      <div
                        class="flex-grow flex flex-row space-x-3 items-center"
                      >
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
                <template #item="{ element }">
                  <div class="w-full flex flex-row items-center space-x-3">
                    <div
                      class="w-full flex flex-row items-center cursor-move justify-between rounded-[12px] flex-grow px-4 py-3 border-[#E1E6EB] bg-white space-x-3"
                      style="border-width: 2px 2px 4px 2px"
                    >
                      <sofa-icon
                        :name="element.shape"
                        :custom-class="`${getShapeSize(element.shape)}`"
                      />
                      <div
                        class="flex-grow flex flex-row space-x-3 items-center"
                      >
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
                v-model="question.options.data[1].content"
                group="sortable3"
                class="col-span-1 space-y-3"
                item-key="label"
              >
                <template #item="{ element }">
                  <div class="w-full flex flex-row items-center space-x-3">
                    <div
                      class="w-full flex flex-row items-center cursor-move justify-between rounded-[12px] flex-grow px-4 py-3 border-[#E1E6EB] bg-white space-x-3"
                      style="border-width: 2px 2px 4px 2px"
                    >
                      <sofa-icon
                        :name="element.shape"
                        :custom-class="`${getShapeSize(element.shape)}`"
                      />
                      <div
                        class="flex-grow flex flex-row space-x-3 items-center"
                      >
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
          </div>
        </div>

        <div
          :class="`md:!py-5 py-4 w-full sticky flex flex-row items-center justify-center bottom-0 left-0 md:!bg-white bg-backgroundGray   ${
            state != 'preview' ? '' : 'invisible'
          }`"
          style="box-shadow: 0px -4px 4px rgba(8, 0, 24, 0.05)"
        >
          <div
            class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full md:!flex hidden flex-row items-center justify-between"
          >
            <sofa-button
              :bgColor="'bg-white'"
              :text-color="'text-grayColor'"
              :customClass="'!font-semibold border-[2px] border-gray-200'"
              :padding="'px-6 py-2'"
              @click="goToNextSlide()"
            >
              Skip
            </sofa-button>

            <span
              class="px-4 py-2 rounded-[8px] bg-[#F2F5F8] !font-semibold text-grayColor"
            >
              {{ index + 1 }}/{{ questions.length }}
            </span>

            <sofa-button
              :customClass="'!font-semibold'"
              :padding="'px-6 py-2'"
              @click="goToNextSlide()"
            >
              Next
            </sofa-button>
          </div>
          <div class="w-full flex flex-col px-4 md:!hidden">
            <sofa-button
              :customClass="'w-full'"
              :padding="'py-3'"
              @click="goToNextSlide()"
              >Next</sofa-button
            >
          </div>
        </div>
      </swiper-slide>
    </sofa-swiper>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaNormalText,
  SofaHeaderText,
  SofaSwiper,
  SofaIcon,
  SofaButton,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { SwiperSlide } from "swiper/vue";

import draggable from "vuedraggable";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaHeaderText,
    SofaSwiper,
    SwiperSlide,
    SofaIcon,
    SofaButton,
    draggable,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "SingleQuiz",
        method: "GetQuiz",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "AllQuestions",
        method: "GetQuestions",
        params: [],
        useRouteId: true,
        requireAuth: true,
        ignoreProperty: true,
      },
    ],
  },
  name: "QuizPage",
  setup() {
    useMeta({
      title: "Quiz",
    });

    const state = ref("preview");

    const enabledSwiper = ref(true);

    const dragDropState = ref("");

    const lastDroppedContainerId = ref("new");

    const swiperInstance = ref<any>();

    const swiperKey = ref(Math.random() * 100000);

    const currentQuestionIndex = ref(0);

    const questionIndex = ref(0);

    const SingleQuiz = ref(Logic.Study.SingleQuiz);
    const AllQuestions = ref(Logic.Study.AllQuestions);

    const mobileTitle = ref("Quiz preview");

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

    const placeholders = {};

    const questions = reactive<
      {
        title: string;
        info: string;
        question: string;
        duration: string;
        options: {
          type: string;
          data: {
            content: {
              label: string;
              type: string;
              value?: string;
              extraClass?: string;
              shape?: string;
            }[];
            shape?: string;
          }[];
        };
      }[]
    >([
      {
        title: "Multiple Choice",
        info: "Choose the correct answer",
        question:
          "Which of the following is a condition for a foreigner to be granted citizenship?",
        duration: "5",
        options: {
          type: "radio",
          data: [
            {
              content: [
                {
                  label: "Swearing an oath of allegiance",
                  type: "text",
                },
              ],
              shape: "circle",
            },
            {
              content: [
                {
                  label: "Possession of a university degree",
                  type: "text",
                },
              ],
              shape: "triangle",
            },
            {
              content: [
                {
                  label: "A registered member of a political party",
                  type: "text",
                },
              ],
              shape: "square",
            },
            {
              content: [
                {
                  label: "Possession of an international passport",
                  type: "text",
                },
              ],
              shape: "kite",
            },
          ],
        },
      },
      {
        title: "True/False",
        info: "Choose if this statement is true or false",
        question:
          "Possession of an international passport is a condition for a foreigner to be granted citizenship.",
        duration: "5",
        options: {
          type: "radio",
          data: [
            {
              content: [
                {
                  label: "True",
                  type: "text",
                },
              ],
              shape: "circle",
            },
            {
              content: [
                {
                  label: "False",
                  type: "text",
                },
              ],
              shape: "triangle",
            },
          ],
        },
      },
      {
        title: "Write answer",
        info: "Type in your answer in the given box",
        question: "What season begins with the falling of tree leaves?",
        duration: "5",
        options: {
          type: "textField",
          data: [
            {
              content: [
                {
                  label: "Write your answer here",
                  type: "text",
                },
              ],
              shape: "circle",
            },
          ],
        },
      },
      {
        title: "Fill in the blanks",
        info: "Type your answers in the boxes given",
        question:
          "The first world war started in the year ____ and ended in the year _____",
        duration: "5",
        options: {
          type: "blanks",
          data: [
            {
              content: [
                {
                  label: "The first world war started in the year",
                  type: "text",
                },
                {
                  label: "answer here",
                  value: "",
                  type: "textField",
                },
                {
                  label: "and ended in the year",
                  type: "text",
                },
                {
                  label: "answer here",
                  value: "",
                  type: "textField",
                },
              ],
              shape: "",
            },
          ],
        },
      },
      {
        title: "Drag answers",
        info: "Answers are given for you to drag and drop in the blank boxes",
        question:
          "The first world war started in the year ____ and ended in the year _____",
        duration: "5",
        options: {
          type: "drag",
          data: [
            {
              content: [
                {
                  label: "The first world war started in the year",
                  type: "text",
                },
                {
                  label: "drop here",
                  value: "",
                  type: "drop",
                  extraClass: "dragDrop1",
                },
                {
                  label: "and ended in the year",
                  type: "text",
                },
                {
                  label: "drop here",
                  value: "",
                  type: "drop",
                  extraClass: "dragDrop2",
                },
              ],
              shape: "",
            },
            {
              content: [
                {
                  label: "1914",
                  type: "answer-box",
                  extraClass: "drag1",
                },
                {
                  label: "1918",
                  type: "answer-box",
                  extraClass: "drag2",
                },
              ],
            },
          ],
        },
      },
      {
        title: "Sequence",
        info: "Drag boxes or use arrows to arrange sequence correctly",
        question: "Arrange these words in alphabetical order",
        duration: "5",
        options: {
          type: "sequence",
          data: [
            {
              content: [
                {
                  label: "Empty",
                  type: "text",
                },
                {
                  label: "Exact",
                  type: "text",
                },
                {
                  label: "Effect",
                  type: "text",
                },
                {
                  label: "Elephant",
                  type: "text",
                },
              ],
              shape: "",
            },
          ],
        },
      },
      {
        title: "Match",
        info: "Click a box on the left and then one the right to match",
        question: "Arrange these words in alphabetical order",
        duration: "5",
        options: {
          type: "match",
          data: [
            {
              content: [
                {
                  label: "Oyster",
                  type: "text",
                  shape: "circle",
                },
                {
                  label: "Monkey",
                  type: "text",
                  shape: "triangle",
                },
                {
                  label: "Cheetah",
                  type: "text",
                  shape: "square",
                },
                {
                  label: "Sheep",
                  type: "text",
                  shape: "kite",
                },
              ],
              shape: "",
            },
            {
              content: [
                {
                  label: "Cub",
                  type: "text",
                  shape: "circle",
                },
                {
                  label: "Lamb",
                  type: "text",
                  shape: "triangle",
                },
                {
                  label: "Spat",
                  type: "text",
                  shape: "square",
                },
                {
                  label: "Infant",
                  type: "text",
                  shape: "kite",
                },
              ],
              shape: "",
            },
          ],
        },
      },
    ]);

    const counterInterval = ref();

    const showQuestion = (index: number) => {
      state.value = "preview";

      questions[index].duration = "5";

      counterInterval.value = setInterval(() => {
        if (parseInt(questions[index].duration) == 1) {
          state.value = "question";
          clearInterval(counterInterval.value);
        } else {
          questions[index].duration = (
            parseInt(questions[index].duration) - 1
          ).toString();
        }
      }, 1000);
    };

    const setQuestions = (autoSelectQuestion = true) => {
      AllQuestions.value.results?.forEach((question, index) => {
        const questionData = Logic.Study.ProcessQuestionData(question);

        // console.log(questionData);
        // questions.push(...[questionData]);
      });
    };

    onMounted(() => {
      scrollToTop();
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz),
        Logic.Study.watchProperty("AllQuestions", AllQuestions);
      setQuestions();
      showQuestion(0);
    });

    const specialQuestionTypes = ["match", "sequence", "drag"];

    watch(currentQuestionIndex, () => {
      questionIndex.value = currentQuestionIndex.value;

      const thisQuestion = questions[currentQuestionIndex.value];

      if (specialQuestionTypes.includes(thisQuestion.options.type)) {
        enabledSwiper.value = false;
        swiperInstance.value.swiperInstance.enabled = false;
        swiperInstance.value.swiperInstance.update();
      }

      showQuestion(questionIndex.value);
    });

    const goToNextSlide = () => {
      if (!swiperInstance.value.swiperInstance.enabled) {
        enabledSwiper.value = true;
        swiperInstance.value.swiperInstance.enabled = true;
        swiperInstance.value.swiperInstance.update();
      }
      if (questionIndex.value < questions.length - 1) {
        questionIndex.value++;
      }
    };

    const handleDrag = (event) => {
      event.dataTransfer.setData("application/my-app", event.target.id);
      event.dataTransfer.effectAllowed = "move";
      dragDropState.value = "dragged";
    };

    const dragLeaveHandler = (event) => {
      if (placeholders[event.target.id]) {
        event.target.appendChild(placeholders[event.target.id]);
      }
    };

    const dragOverHandler = (event, clearContent) => {
      event.preventDefault();
      if (clearContent) {
        const placeholder = event.target.querySelector(".placeholder");

        if (placeholder) {
          placeholders[event.target.id] = placeholder;

          event.target.innerHTML = "";
        }
      }
      event.dataTransfer.dropEffect = "move";

      dragDropState.value = "hover";
    };

    const dropHandler = (event) => {
      event.preventDefault();
      // Get the id of the target and add the moved element to the target's DOM
      const data = event.dataTransfer.getData("application/my-app");

      if (event.target.id == null || event.target.id == "") {
        return;
      }

      if (
        lastDroppedContainerId.value == null ||
        lastDroppedContainerId.value == ""
      ) {
        return;
      }

      if (event.target.id == data) {
        return;
      }

      const elementExist = event.target.querySelector(`#${data}`);

      if (
        elementExist == null &&
        lastDroppedContainerId.value != event.target.id
      ) {
        event.target.appendChild(document.getElementById(data));

        lastDroppedContainerId.value = event.target.id;
        dragDropState.value = "dropped";
      }
    };

    return {
      moment,
      Logic,
      questions,
      state,
      currentQuestionIndex,
      getShapeSize,
      handleDrag,
      enabledSwiper,
      dragOverHandler,
      dropHandler,
      dragLeaveHandler,
      swiperInstance,
      swiperKey,
      questionIndex,
      goToNextSlide,
      mobileTitle,
    };
  },
});
</script>
