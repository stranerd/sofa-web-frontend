<template>
  <div class="w-full flex flex-col h-full gap-4" v-if="question">
    <div v-if="questionTypeMain != 'fill_in_blank' && questionTypeMain != 'drag_answer'
      " class="w-full flex flex-row items-start custom-border bg-[#F1F6FA] gap-3">
      <div class="hidden lg:block pt-4 pl-4">
        <sofa-icon :name="'question-input'" :custom-class="'h-[23px] w-[24px]'" />
      </div>
      <sofa-textarea :hasTitle="false"
        :textAreaStyle="'!bg-[#F1F6FA] h-[130px] w-full placeholder:text-grayColor !px-0 !py-0 resize-none'"
        :placeholder="question.placeholder" :richEditor="true" v-model="reactiveQuestion.content" />
    </div>
    <div class="w-full flex flex-row items-center flex-wrap gap-1 md:!gap-2" v-if="questionTypeMain == 'fill_in_blank' || questionTypeMain == 'drag_answer'
      ">
      <template v-for="(item, index) in reactiveQuestion.data" :key="index">
        <span class="flex flex-row items-center gap-1">
          <sofa-custom-input
            :customClass="`bg-transparent focus:outline-none w-auto !text-bodyBlack  placeholder:text-grayColor py-2 px-2 questionText`"
            placeholder="Text here" v-if="item.type == 'text'" v-model="item.value"
            :updateValue="item.value"></sofa-custom-input>
          <sofa-icon :customClass="'h-[14px] cursor-pointer'" :name="'circle-close'" v-if="item.type == 'text'"
            @click="removeItemFormData(index)" />
        </span>
        <span class="flex flex-row items-center gap-1">
          <sofa-custom-input
            :class="`bg-transparent focus:outline-none w-auto placeholder:text-grayColor !text-bodyBlack  border-[2px] answerText border-[#E1E6EB] rounded-[8px] px-2 py-2`"
            placeholder="Answer here" v-if="item.type == 'answer'" v-model="item.value"
            :updateValue="item.value"></sofa-custom-input>
          <sofa-icon :customClass="'h-[14px]  cursor-pointer'" :name="'circle-close'" @click="removeItemFormData(index)"
            v-if="item.type == 'answer'" />
        </span>
      </template>

      <sofa-button @click="addNewDataItem('text')">Add text</sofa-button>
      <sofa-button @click="addNewDataItem('answer')">Add answer</sofa-button>
    </div>

    <div
      class="w-full md:!flex flex-row items-center justify-center gap-3 bg-primaryPurple custom-border px-5 py-5 hidden">
      <sofa-normal-text :color="'text-white'">Choose image to add to this question (optional)</sofa-normal-text>
      <sofa-file-attachment :is-wrapper="true" :accept="'image/png, image/gif, image/jpeg'"
        :custom-class="'!w-auto z-[100]'" v-model:local-file-url="reactiveQuestion.questionMedia"
        v-model="reactiveQuestion.questionMediaBlob">
        <template v-slot:content>
          <sofa-button :bgColor="'bg-white'" :textColor="'text-bodyBlack'" :custom-class="'!z-50'">Add Image</sofa-button>
        </template>
      </sofa-file-attachment>
    </div>

    <div class="w-full flex md:!hidden flex-col">
      <sofa-file-attachment :is-wrapper="true" :accept="'image/png, image/gif, image/jpeg'"
        :custom-class="'!w-full flex flex-col z-[100]'" v-model:local-file-url="reactiveQuestion.questionMedia"
        v-model="reactiveQuestion.questionMediaBlob">
        <template v-slot:content>
          <div class="w-full flex flex-col">
            <sofa-button :customClass="'w-full !z-50'" :padding="'py-3'">Add image (optional)</sofa-button>
          </div>
        </template>
      </sofa-file-attachment>
    </div>

    <div class="w-full flex flex-col items-center justify-center" v-if="reactiveQuestion.questionMedia">
      <sofa-image-loader :photoUrl="reactiveQuestion.questionMedia"
        :customClass="'h-[250px] lg:w-[70%] mdlg:w-[70%] w-full custom-border'" />
    </div>

    <div class="w-full grid grid-cols-2 gap-4 pt-4">
      <div :class="`${questionTypeMain != 'match' ? 'col-span-2' : 'col-span-1'} flex flex-col gap-4`"
        v-if="questionTypeMain != 'fill_in_blank' && questionTypeMain != 'drag_answer'">
        <draggable :list="reactiveQuestion.options" class="w-full flex flex-col gap-4" item-key="id"
          :group="{ name: 'question-options' }" :disabled="questionTypeMain == 'write_answer'">
          <template #item="{ element, index }">
            <div
              :class="`w-full flex flex-row items-center justify-between rounded-[12px] border-lightBorderColor bg-white gap-3`"
              style="border-width: 2px 2px 4px 2px" @mouseenter="element.showRemove = true"
              @mouseleave="element.showRemove = false">
              <sofa-icon :name="element.shape" :custom-class="`${element.shapeSize}`"
                v-if="questionTypeMain != 'write_answer'" class="hidden lg:block" />
              <sofa-textarea :rows="1" :disabled="questionTypeMain == 'true_false'" :richEditor="true"
                class="!w-[200px] flex-1 focus:outline-none bg-transparent placeholder:text-grayColor text-bodyBlack"
                textAreaStyle="bg-grey100 p-0" :placeholder="element.text" v-model="element.value" />
              <div class="flex items-center gap-2 pr-2 py-2">
                <sofa-icon :name="'remove'" :custom-class="'w-[23px] cursor-pointer'"
                  v-if="element.showRemove && questionTypeMain != 'true_false' && reactiveQuestion.options.length > optionLimitSettings.min"
                  @click="removeOption(index)" />
                <sofa-icon v-if="element.isRadio && (questionTypeMain == 'multiple_choice' || questionTypeMain == 'true_false')"
                  @click="element.isRadio ? setAnswers(element) : null" :name="element.answer ? 'selected' : 'not-selected'"
                  :custom-class="'w-[23px] cursor-pointer'" />
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <template v-if="questionTypeMain == 'match'">
        <div class="col-span-1 flex flex-col gap-4">
          <draggable :list="reactiveQuestion.match" class="w-full gap-4" item-key="id"
            :group="{ name: 'question-match' }">
            <template #item="{ element, index }">
              <div
                :class="`w-full flex flex-row items-center justify-between rounded-[12px] px-3 py-3 border-lightBorderColor bg-white gap-3`"
                style="border-width: 2px 2px 4px 2px" @mouseenter="element.showRemove = true"
                @mouseleave="element.showRemove = false">
                <div class="flex-grow flex flex-row gap-3">
                  <sofa-icon :name="element.shape" :custom-class="`${element.shapeSize}`" />
                  <input class="focus:outline-none bg-transparent placeholder:text-grayColor text-bodyBlack w-full"
                    :placeholder="element.text" v-model="element.value" />
                </div>
                <div class="flex flex-row items-center gap-2">
                  <sofa-icon :name="'remove'" :custom-class="'h-[23px] cursor-pointer'" v-if="element.showRemove &&
                    reactiveQuestion.match.length > optionLimitSettings.min
                    " @click="removeOption(index)" />
                  <div class="w-[26px]" v-if="element.isRadio">
                    <sofa-icon :name="'not-selected'" :custom-class="'h-[23px]'" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </template>
    </div>

    <div class="self-end flex justify-end gap-2 items-center cursor-pointer" v-if="(questionTypeMain == 'multiple_choice' ||
      questionTypeMain == 'sequence' ||
      questionTypeMain == 'match' ||
      questionTypeMain == 'write_answer') &&
      reactiveQuestion.options.length < optionLimitSettings.max
      " @click="setQuestionOptions(reactiveQuestion.options.length + 1)">
      <sofa-icon :name="'box-plus'" :custom-class="'h-[24px]'" />
      <sofa-normal-text :color="'text-grayColor'">Add option</sofa-normal-text>
    </div>

    <div class="w-full flex flex-col border-t-[1px] border-[#F1F6FA] pt-4">
      <div class="w-full flex flex-row items-start custom-border bg-[#F1F6FA]">
        <div class="hidden lg-block pt-4 pl-4">
          <sofa-icon :name="'question-input'" :custom-class="'h-[23px] w-[24px]'" />
        </div>
        <sofa-textarea :hasTitle="false"
          :textAreaStyle="'!bg-[#F1F6FA] h-[130px] w-full placeholder:text-grayColor !px-0 !py-0 resize-none'"
          :placeholder="'Explanation'" :richEditor="true" v-model="reactiveQuestion.explanation" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue"
import draggable from "vuedraggable"
import { Logic } from "../../composable"
import SofaButton from "../SofaButton"
import { SofaCustomInput, SofaFileAttachment, SofaTextarea } from "../SofaForm"
import SofaIcon from "../SofaIcon"
import SofaImageLoader from "../SofaImageLoader"
import { SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaButton,
    SofaTextarea,
    SofaCustomInput,
    SofaFileAttachment,
    SofaImageLoader,
    draggable,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
  },
  name: "SofaQuestionContent",
  setup (props) {
    const question = ref()

    const questionTypeMain = ref("")

    const possibleAnswers = ref(0)

    const optionLimitSettings = reactive({
      max: 6,
      min: 2,
    })

    const questionSettings = ref(Logic.Study.questionSettings)

    const selectedQuestion = ref(Logic.Study.selectedQuestion)

    const setPossibleAnswers = (answerSettingsDefault: any[] = []) => {
      const answerSettings =
        answerSettingsDefault?.length == 0
          ? question.value.settings?.filter(
            (item) => item.type == "correct-anwsers"
          )
          : answerSettingsDefault

      if (answerSettings?.length) {
        possibleAnswers.value = parseInt(answerSettings[0].value)
      } else {
        possibleAnswers.value = 1
      }

      if (questionTypeMain.value == "multiple_choice") {
        possibleAnswers.value = 6
      }

      if (questionTypeMain.value == "true_false") {
        possibleAnswers.value = 1
      }
    }

    const reactiveQuestion = reactive<any>({})

    const setAnswers = (answer: any) => {
      let currentlySelectedAnswer = reactiveQuestion.options.filter(
        (item) => item.isRadio && item.answer
      )

      const alreadySelected = currentlySelectedAnswer.filter((item) => {
        return item.id == answer.id
      })

      if (alreadySelected.length) {
        currentlySelectedAnswer = currentlySelectedAnswer.filter((item) => {
          return item.id != answer.id
        })
      } else {
        if (currentlySelectedAnswer.length >= possibleAnswers.value) {
          currentlySelectedAnswer.pop()
        }

        currentlySelectedAnswer.push(answer)
      }

      reactiveQuestion.options.forEach((answer) => {
        if (currentlySelectedAnswer.includes(answer)) {
          answer.answer = answer.value
        } else {
          answer.answer = ""
        }
      })
    }

    const saveQuizData = (mounted = false) => {
      Logic.Common.debounce(() => {
        if (
          reactiveQuestion.itemType == "writeAnswer" ||
          reactiveQuestion.itemType == "sequence" ||
          reactiveQuestion.itemType == "match"
        ) {
          reactiveQuestion.options.forEach((option) => {
            option.answer = option.value
          })
        }

        if (reactiveQuestion.itemType == "match") {
          reactiveQuestion.match?.forEach((option) => {
            option.answer = option.value
          })
        }

        Logic.Study.UpdateQuestionForm = Logic.Study.convertQuestionToInput(
          reactiveQuestion,
          reactiveQuestion.itemType
        )

        Logic.Study.UpdateQuestionForm["timeLimit"] =
          reactiveQuestion.timeLimit

        if (reactiveQuestion.questionMediaBlob) {
          Logic.Study.UpdateQuestionForm["questionMedia"] =
            reactiveQuestion.questionMediaBlob
        }

        if (reactiveQuestion.explanation) {
          Logic.Study.UpdateQuestionForm["explanation"] =
            reactiveQuestion.explanation
        } else {
          Logic.Study.UpdateQuestionForm["explanation"] = ""
        }

        Logic.Study.UpdateQuestionForm.id = reactiveQuestion.id

        if (!mounted) {
          Logic.Study.quizDataUpdate = Math.random() * 100000

          Logic.Study.SaveQuizChangesToLocal(
            Logic.Study.SingleQuiz.id,
            reactiveQuestion.id,
            Logic.Study.UpdateQuestionForm
          )

          Logic.Study.AllQuestions.results.forEach((questionItem) => {
            if (questionItem.id == Logic.Study.UpdateQuestionForm.id) {
              questionItem.data = Logic.Study.UpdateQuestionForm.data
              questionItem.explanation =
                Logic.Study.UpdateQuestionForm.explanation
              questionItem.question = Logic.Study.UpdateQuestionForm.question
              questionItem.timeLimit = Logic.Study.UpdateQuestionForm.timeLimit
            }
          })
        }
      }, 500)
    }

    const setDefaults = () => {
      if (question.value) {
        reactiveQuestion.active = question.value.active
        reactiveQuestion.content = question.value.content
        reactiveQuestion.id = question.value.id
        reactiveQuestion.image = question.value.image
        reactiveQuestion.options = question.value.options
        reactiveQuestion.placeholder = question.value.placeholder
        reactiveQuestion.settings = question.value.settings
        reactiveQuestion.type = question.value.type
        reactiveQuestion.timeLimit = question.value.timeLimit
        reactiveQuestion.match = question.value.match || [
          {
            shape: "circle",
            text: "Enter match",
            shapeSize: "h-[23px]",
            isRadio: false,
            id: "",
            value: "1",
            answer: "1",
            showRemove: false,
          },
          {
            shape: "triangle",
            text: "Enter match",
            shapeSize: "h-[20px]",
            isRadio: false,
            id: "",
            value: "2",
            answer: "2",
            showRemove: false,
          },
          {
            shape: "square",
            text: "Enter match",
            shapeSize: "h-[20px]",
            isRadio: false,
            id: "",
            value: "3",
            answer: "3",
            showRemove: false,
          },
          {
            shape: "kite",
            text: "Enter match",
            shapeSize: "h-[24px]",
            isRadio: false,
            id: "",
            value: "4",
            answer: "4",
            showRemove: false,
          },
        ]
        reactiveQuestion.data = question.value.data
        reactiveQuestion.itemType = question.value.itemType
        reactiveQuestion.explanation = question.value.explanation
        reactiveQuestion.questionMedia = question.value.questionMedia
        reactiveQuestion.questionMediaBlob = null
        questionTypeMain.value = question.value.image

        setPossibleAnswers()
        saveQuizData()

        if (questionTypeMain.value == "write_answer") {
          optionLimitSettings.min = 1
        } else {
          optionLimitSettings.min = 2
        }
      }
    }

    watch(question, () => {
      setDefaults()
    })

    const addNewDataItem = (type: "answer" | "text") => {
      reactiveQuestion.data.push({
        content: "",
        type,
        value: "",
      })
    }

    const removeItemFormData = (index: number) => {
      reactiveQuestion.data = reactiveQuestion.data.filter(
        (item, itemindex) => {
          return index != itemindex
        }
      )
    }

    const setQuestionOptions = (count: number) => {
      const existingOptions = reactiveQuestion.options

      if (existingOptions.length >= count) {
        if (existingOptions.length > count) {
          reactiveQuestion.options = question.value.options.slice(0, count)
        }
      } else {
        const availableShapes = ["circle", "triangle", "square", "kite"]

        const amountToAdd = count - reactiveQuestion.options.length

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
            showRemove: false,
          }
          existingOptions.push(newOption)
        }

        // reactiveQuestion.options = JSON.parse(JSON.stringify(existingOptions));
      }

      if (questionTypeMain.value == "match") {
        const existingOptions = reactiveQuestion.match

        if (existingOptions.length >= count) {
          if (existingOptions.length > count) {
            reactiveQuestion.match = question.value.match.slice(0, count)
          }
        } else {
          const availableShapes = ["circle", "triangle", "square", "kite"]

          const amountToAdd = count - reactiveQuestion.match.length

          for (let step = 0; step < amountToAdd; step++) {
            const newOption = {
              shape:
                availableShapes[
                Math.floor(Math.random() * availableShapes.length)
                ],
              text: "Enter answer",
              shapeSize: "h-[23px]",
              isRadio: false,
              id: Logic.Common.makeid(8),
              value: "new",
              answer: "",
              showRemove: false,
            }
            existingOptions.push(newOption)
          }

          // reactiveQuestion.options = JSON.parse(JSON.stringify(existingOptions));
        }
      }
    }

    watch(reactiveQuestion, () => {
      saveQuizData(false)
    })

    watch(questionSettings, () => {
      // update question type

      const questionTypeSetting = questionSettings.value.filter((item) => {
        return item.type == "question-type"
      })

      if (questionTypeSetting.length) {
        reactiveQuestion.options = question.value.options
        if (
          questionTypeMain.value != "match" &&
          questionTypeSetting[0].questionType == "match"
        ) {
          reactiveQuestion.options = [
            {
              shape: "circle",
              text: "Enter 1st word/sentence",
              shapeSize: "h-[23px]",
              isRadio: false,
              id: "",
              value: "a",
              answer: "a",
              showRemove: false,
            },
            {
              shape: "triangle",
              text: "Enter 2nd word/sentence",
              shapeSize: "h-[20px]",
              isRadio: false,
              id: "",
              value: "b",
              answer: "b",
              showRemove: false,
            },
            {
              shape: "square",
              text: "Enter 3rd word/sentence",
              shapeSize: "h-[20px]",
              isRadio: false,
              id: "",
              value: "c",
              answer: "c",
              showRemove: false,
            },
            {
              shape: "kite",
              text: "Enter 4th word/sentence",
              shapeSize: "h-[24px]",
              isRadio: false,
              id: "",
              value: "d",
              answer: "d",
              showRemove: false,
            },
          ]
        }

        if (questionTypeSetting[0].questionType == "true_false") {
          question.value.options = [
            {
              shape: "circle",
              text: "True",
              shapeSize: "h-[23px]",
              isRadio: true,
              id: Logic.Common.makeid(6),
              value: "True",
              answer: "true",
              showRemove: false,
            },
            {
              shape: "triangle",
              text: "False",
              shapeSize: "h-[20px]",
              isRadio: true,
              id: Logic.Common.makeid(6),
              value: "False",
              answer: "",
              showRemove: false,
            },
          ]
        }

        if (questionTypeSetting[0].questionType == "write_answer") {
          optionLimitSettings.min = 1
        } else {
          optionLimitSettings.min = 2
        }

        reactiveQuestion.itemType = questionTypeSetting[0].itemType
        questionTypeMain.value = questionTypeSetting[0].questionType

        setPossibleAnswers()
      }

      // update time limit
      const timeLimitSetting = questionSettings.value.filter((item) => {
        return item.type == "time-limit"
      })

      if (timeLimitSetting.length) {
        if (
          reactiveQuestion.timeLimit !=
          Logic.Common.timeEquivalentsInSeconds[timeLimitSetting[0].value]
        ) {
          reactiveQuestion.timeLimit =
            Logic.Common.timeEquivalentsInSeconds[timeLimitSetting[0].value]
        }
      }

      // update multiple choice optons
      const optionSettings = questionSettings.value.filter((item) => {
        return item.type == "total-options"
      })

      if (optionSettings.length) {
        const totalOptions = parseInt(optionSettings[0].value)

        if (reactiveQuestion.options.length != totalOptions) {
          setQuestionOptions(totalOptions)
        }
      }

      if (questionTypeSetting[0].questionType == "true_false") {
        setQuestionOptions(2)
      }

      // possible answers
      const answersSettings = questionSettings.value.filter((item) => {
        return item.type == "correct-anwsers"
      })

      if (answersSettings.length) {
        const answerOptions = parseInt(answersSettings[0].value)

        if (possibleAnswers.value != answerOptions) {
          setPossibleAnswers(answersSettings)
        }
      }

      reactiveQuestion.settings = questionSettings.value
    })

    const removeOption = (index: number) => {
      reactiveQuestion.options = reactiveQuestion.options.filter(
        (item, eachIndex) => eachIndex != index
      )

      if (questionTypeMain.value == "match") {
        reactiveQuestion.match = reactiveQuestion.match.filter(
          (item, eachIndex) => eachIndex != index
        )
      }
    }

    watch(selectedQuestion, () => {
      question.value = selectedQuestion.value
    })

    onMounted(() => {
      Logic.Study.watchProperty("questionSettings", questionSettings)
      Logic.Study.watchProperty("selectedQuestion", selectedQuestion)
      question.value = Logic.Study.selectedQuestion
      setDefaults()
    })

    return {
      reactiveQuestion,
      possibleAnswers,
      questionTypeMain,
      question,
      optionLimitSettings,
      setAnswers,
      addNewDataItem,
      removeItemFormData,
      setQuestionOptions,
      removeOption,
    }
  },
})
</script>
