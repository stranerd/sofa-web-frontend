<template>
  <div class="w-full flex flex-col h-full space-y-4" v-if="question">
    <div
      v-if="questionType != 'fill_in_blank' && questionType != 'drag_answer'"
      class="w-full flex flex-row items-start custom-border px-4 py-4 bg-[#F1F6FA] space-x-3"
    >
      <div class="w-[24px]">
        <sofa-icon :name="'question-input'" :custom-class="'h-[23px]'" />
      </div>
      <sofa-textarea
        :hasTitle="false"
        :textAreaStyle="'!bg-[#F1F6FA] h-[130px] w-full placeholder:text-grayColor !px-0 !py-0 resize-none'"
        :placeholder="question.placeholder"
        :richEditor="false"
        :updateValue="reactiveQuestion.content"
        v-model="reactiveQuestion.content"
        @input.prevent="null"
      />
    </div>
    <div
      class="w-full flex flex-row items-center flex-wrap space-x-1 md:!gap-2 gap-1"
      v-if="questionType == 'fill_in_blank' || questionType == 'drag_answer'"
    >
      <template v-for="(item, index) in reactiveQuestion.data" :key="index">
        <span class="flex flex-row items-center space-x-1">
          <sofa-custom-input
            :customClass="`bg-transparent focus:outline-none w-auto !text-bodyBlack  placeholder:text-grayColor py-2 px-2 questionText`"
            placeholder="Text here"
            v-if="item.type == 'text'"
            v-model="item.value"
            :updateValue="item.value"
          ></sofa-custom-input>
          <sofa-icon
            :customClass="'h-[14px] cursor-pointer'"
            :name="'circle-close'"
            v-if="item.type == 'text'"
            @click="removeItemFormData(index)"
          />
        </span>
        <span class="flex flex-row items-center space-x-1">
          <sofa-custom-input
            :class="`bg-transparent focus:outline-none w-auto placeholder:text-grayColor !text-bodyBlack  border-[2px] answerText border-[#E1E6EB] rounded-[8px] px-2 py-2`"
            placeholder="Answer here"
            v-if="item.type == 'answer'"
            v-model="item.value"
            :updateValue="item.value"
          ></sofa-custom-input>
          <sofa-icon
            :customClass="'h-[14px]  cursor-pointer'"
            :name="'circle-close'"
            @click="removeItemFormData(index)"
            v-if="item.type == 'answer'"
          />
        </span>
      </template>

      <sofa-button @click="addNewDataItem('text')">Add text</sofa-button>
      <sofa-button @click="addNewDataItem('answer')">Add answer</sofa-button>
    </div>

    <div
      class="w-full md:!flex flex-row items-center justify-center space-x-3 bg-primaryPurple custom-border px-5 py-5 hidden"
    >
      <sofa-normal-text :color="'text-white'"
        >Choose image to add to this question (optional)</sofa-normal-text
      >
      <sofa-file-attachment
        :is-wrapper="true"
        :accept="'image/png, image/gif, image/jpeg'"
        :custom-class="'!w-auto z-[999]'"
        v-model:local-file-url="reactiveQuestion.questionMedia"
        v-model="reactiveQuestion.questionMediaBlob"
      >
        <template v-slot:content>
          <sofa-button
            :bgColor="'bg-white'"
            :textColor="'text-bodyBlack'"
            :custom-class="'!z-50'"
            >Add Image</sofa-button
          >
        </template>
      </sofa-file-attachment>
    </div>

    <div class="w-full flex md:!hidden flex-col">
      <sofa-file-attachment
        :is-wrapper="true"
        :accept="'image/png, image/gif, image/jpeg'"
        :custom-class="'!w-full flex flex-col z-[999]'"
        v-model:local-file-url="reactiveQuestion.questionMedia"
        v-model="reactiveQuestion.questionMediaBlob"
      >
        <template v-slot:content>
          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full !z-50'" :padding="'py-3'"
              >Add image (optional)</sofa-button
            >
          </div>
        </template>
      </sofa-file-attachment>
    </div>

    <div
      class="w-full flex flex-col items-center justify-center"
      v-if="reactiveQuestion.questionMedia"
    >
      <sofa-image-loader
        :photoUrl="reactiveQuestion.questionMedia"
        :customClass="'h-[250px] lg:w-[70%] mdlg:w-[70%] w-full custom-border'"
      />
    </div>

    <div class="w-full grid grid-cols-2 gap-4 pt-4">
      <div
        :class="` ${
          questionType != 'match' ? 'col-span-2' : 'col-span-1'
        } flex flex-col space-y-4`"
        v-if="questionType != 'fill_in_blank' && questionType != 'drag_answer'"
      >
        <div
          v-for="(answer, index) in reactiveQuestion.options"
          :key="index"
          :class="` w-full flex flex-row items-center justify-between rounded-[12px] px-3 py-3 border-lightBorderColor bg-white space-x-3`"
          style="border-width: 2px 2px 4px 2px"
        >
          <div class="flex-grow flex flex-row space-x-3">
            <sofa-icon
              :name="answer.shape"
              :custom-class="`${answer.shapeSize}`"
            />
            <input
              class="focus:outline-none bg-transparent placeholder:text-grayColor text-bodyBlack w-full"
              :placeholder="answer.text"
              v-model="answer.value"
            />
          </div>
          <div
            class="w-[26px] cursor-pointer"
            v-if="answer.isRadio"
            @click="answer.isRadio ? setAnswers(answer) : null"
          >
            <sofa-icon
              :name="answer.answer ? 'selected' : 'not-selected'"
              :custom-class="'h-[23px]'"
            />
          </div>
        </div>
      </div>

      <template v-if="questionType == 'match'">
        <div class="col-span-1 flex flex-col space-y-4">
          <div
            v-for="(answer, index) in reactiveQuestion.match"
            :key="index"
            :class="`w-full flex flex-row items-center justify-between rounded-[12px] px-3 py-3 border-lightBorderColor bg-white space-x-3`"
            style="border-width: 2px 2px 4px 2px"
          >
            <div class="flex-grow flex flex-row space-x-3">
              <sofa-icon
                :name="answer.shape"
                :custom-class="`${answer.shapeSize}`"
              />
              <input
                class="focus:outline-none bg-transparent placeholder:text-grayColor text-bodyBlack w-full"
                :placeholder="answer.text"
                v-model="answer.value"
              />
            </div>
            <div class="w-[26px]" v-if="answer.isRadio">
              <sofa-icon :name="'not-selected'" :custom-class="'h-[23px]'" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="w-full flex flex-col border-t-[1px] border-[#F1F6FA] pt-4">
      <div
        class="w-full flex flex-row items-start custom-border px-4 py-4 bg-[#F1F6FA] space-x-3"
      >
        <div class="w-[24px]">
          <sofa-icon :name="'question-input'" :custom-class="'h-[23px]'" />
        </div>
        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'!bg-[#F1F6FA] h-[130px] w-full placeholder:text-grayColor !px-0 !py-0 resize-none'"
          :placeholder="'Explanation'"
          :richEditor="false"
          :updateValue="reactiveQuestion.explanation"
          v-model="reactiveQuestion.explanation"
          @input.prevent="null"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRef, watch } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import SofaButton from "../SofaButton";
import { SofaTextarea, SofaCustomInput, SofaFileAttachment } from "../SofaForm";
import { Logic } from "../../composable";
import SofaImageLoader from "../SofaImageLoader";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaButton,
    SofaTextarea,
    SofaCustomInput,
    SofaFileAttachment,
    SofaImageLoader,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    question: {
      type: Object as () => any,
    },
    questionType: {
      type: String,
    },
  },
  name: "SofaQuestionContent",
  setup(props) {
    const questionRef = toRef(props, "question");

    const possibleAnswers = ref(0);

    const questionSettings = ref(Logic.Study.questionSettings);

    const setPossibleAnswers = (answerSettingsDefault: any[] = []) => {
      const answerSettings =
        answerSettingsDefault.length == 0
          ? questionRef.value.settings.filter(
              (item) => item.type == "correct-anwsers"
            )
          : answerSettingsDefault;

      if (answerSettings.length) {
        possibleAnswers.value = parseInt(answerSettings[0].value);
      } else {
        possibleAnswers.value = 1;
      }
    };

    const reactiveQuestion = reactive(questionRef.value);

    const setAnswers = (answer: any) => {
      let currentlySelectedAnswer = reactiveQuestion.options.filter(
        (item) => item.isRadio && item.answer
      );

      const alreadySelected = currentlySelectedAnswer.filter((item) => {
        return item.id == answer.id;
      });

      if (alreadySelected.length) {
        currentlySelectedAnswer = currentlySelectedAnswer.filter((item) => {
          return item.id != answer.id;
        });
      } else {
        if (currentlySelectedAnswer.length >= possibleAnswers.value) {
          currentlySelectedAnswer.pop();
        }

        currentlySelectedAnswer.push(answer);
      }

      reactiveQuestion.options.forEach((answer) => {
        if (currentlySelectedAnswer.includes(answer)) {
          answer.answer = answer.value;
        } else {
          answer.answer = "";
        }
      });
    };

    watch(questionRef, () => {
      reactiveQuestion.active = questionRef.value.active;
      reactiveQuestion.content = questionRef.value.content;
      reactiveQuestion.id = questionRef.value.id;
      reactiveQuestion.image = questionRef.value.image;
      reactiveQuestion.options = questionRef.value.options;
      reactiveQuestion.placeholder = questionRef.value.placeholder;
      reactiveQuestion.settings = questionRef.value.settings;
      reactiveQuestion.type = questionRef.value.type;
      reactiveQuestion.match = questionRef.value.match;
      reactiveQuestion.data = questionRef.value.data;
      reactiveQuestion.itemType = questionRef.value.itemType;
      reactiveQuestion.explanation = questionRef.value.explanation;
      reactiveQuestion.questionMedia = questionRef.value.questionMedia;
      reactiveQuestion.questionMediaBlob = null;
      setPossibleAnswers();
    });

    const addNewDataItem = (type: "answer" | "text") => {
      reactiveQuestion.data.push({
        content: "",
        type,
        value: "",
      });
    };

    const removeItemFormData = (index: number) => {
      reactiveQuestion.data = reactiveQuestion.data.filter(
        (item, itemindex) => {
          return index != itemindex;
        }
      );
    };

    const setQuestionOptions = (count: number) => {
      const existingOptions = reactiveQuestion.options;

      if (existingOptions.length >= count) {
        if (existingOptions.length > count) {
          reactiveQuestion.options = questionRef.value.options.slice(0, count);
        }
      } else {
        const availableShapes = ["circle", "triangle", "square", "kite"];

        const amountToAdd = count - reactiveQuestion.options.length;

        for (let step = 0; step < amountToAdd; step++) {
          const newOption = {
            shape:
              availableShapes[
                Math.floor(Math.random() * availableShapes.length)
              ],
            text: "Enter answer",
            shapeSize: "h-[23px]",
            isRadio: true,
            id: Logic.Common.makeid(8),
            value: "new",
            answer: "",
          };
          existingOptions.push(newOption);
        }

        // reactiveQuestion.options = JSON.parse(JSON.stringify(existingOptions));
      }
    };

    watch(reactiveQuestion, () => {
      Logic.Common.debounce(() => {
        if (
          reactiveQuestion.itemType == "writeAnswer" ||
          reactiveQuestion.itemType == "sequence" ||
          reactiveQuestion.itemType == "match"
        ) {
          reactiveQuestion.options.forEach((option) => {
            option.answer = option.value;
          });
        }

        if (reactiveQuestion.itemType == "match") {
          reactiveQuestion.match.forEach((option) => {
            option.answer = option.value;
          });
        }
        Logic.Study.UpdateQuestionForm = Logic.Study.convertQuestionToInput(
          reactiveQuestion,
          reactiveQuestion.itemType
        );

        Logic.Study.UpdateQuestionForm["timeLimit"] =
          reactiveQuestion.timeLimit;

        if (reactiveQuestion.questionMediaBlob) {
          Logic.Study.UpdateQuestionForm["questionMedia"] =
            reactiveQuestion.questionMediaBlob;
        }

        if (reactiveQuestion.explanation) {
          Logic.Study.UpdateQuestionForm["explanation"] =
            reactiveQuestion.explanation;
        }

        Logic.Study.UpdateQuestionForm.id = reactiveQuestion.id;

        Logic.Study.UpdateQuestion(true, Logic.Study.SingleQuiz.id);
      }, 500);
    });

    watch(questionSettings, () => {
      Logic.Common.debounce(() => {
        // update time limit
        const timeLimitSetting = questionSettings.value.filter((item) => {
          return item.type == "time-limit";
        });

        if (timeLimitSetting.length) {
          if (
            reactiveQuestion.timeLimit !=
            Logic.Common.timeEquivalentsInSeconds[timeLimitSetting[0].value]
          ) {
            reactiveQuestion.timeLimit =
              Logic.Common.timeEquivalentsInSeconds[timeLimitSetting[0].value];
          }
        }

        // update multiple choice optons
        const optionSettings = questionSettings.value.filter((item) => {
          return item.type == "total-options";
        });

        if (optionSettings.length) {
          const totalOptions = parseInt(optionSettings[0].value);

          if (reactiveQuestion.options.length != totalOptions) {
            setQuestionOptions(totalOptions);
          }
        }

        // possible answers
        const answersSettings = questionSettings.value.filter((item) => {
          return item.type == "correct-anwsers";
        });

        if (answersSettings.length) {
          const answerOptions = parseInt(answersSettings[0].value);

          if (possibleAnswers.value != answerOptions) {
            setPossibleAnswers(answersSettings);
          }
        }

        reactiveQuestion.settings = questionSettings.value;
      });
    });

    onMounted(() => {
      Logic.Study.watchProperty("questionSettings", questionSettings);
    });
    return {
      reactiveQuestion,
      possibleAnswers,
      setAnswers,
      addNewDataItem,
      removeItemFormData,
    };
  },
});
</script>