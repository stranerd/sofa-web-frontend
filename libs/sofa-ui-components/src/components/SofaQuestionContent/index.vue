<template>
  <div class="w-full flex flex-col h-full overflow-y-auto gap-4" v-if="question">
    <div v-if="!factory.isFillOrDrag" class="w-full flex items-start p-3 rounded-custom bg-[#F1F6FA] text-grayColor gap-3">
      <SofaIcon name="question-input" class="h-[23px] w-[24px] hidden lg:inline" />
      <SofaTextarea :hasTitle="false"
        textAreaStyle="bg-transparent h-[130px] w-ull resize-none"
        placeholder="factory.questionPlaceholder" :richEditor="true" v-model="factory.question" />
    </div>

    <div class="w-full flex items-center flex-wrap gap-1 md:gap-2" v-if="factory.isFillOrDrag">
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
            :class="`bg-transparent focus:outline-none w-auto placeholder:text-grayColor !text-bodyBlack  border-2 answerText border-[#E1E6EB] rounded-[8px] px-2 py-2`"
            placeholder="Answer here" v-if="item.type == 'answer'" v-model="item.value"
            :updateValue="item.value"></sofa-custom-input>
          <sofa-icon :customClass="'h-[14px]  cursor-pointer'" :name="'circle-close'" @click="removeItemFormData(index)"
            v-if="item.type == 'answer'" />
        </span>
      </template>

      <sofa-button @click="addNewDataItem('text')">Add text</sofa-button>
      <sofa-button @click="addNewDataItem('answer')">Add answer</sofa-button>
    </div>

    <div class="w-full hidden md:flex items-center justify-center gap-3 bg-primaryPurple text-white rounded-custom p-5">
      <SofaNormalText color="text-inherit" content="Choose image to add to this question (optional)" />
      <SofaFileAttachment :isWrapper="true" accept="image/*" class="!w-auto" v-model:localFileUrl="localFileUrl" v-model="factory.questionMedia">
        <template v-slot:content>
          <SofaButton bgColor="bg-white" textColor="text-bodyBlack">Add Image</SofaButton>
        </template>
      </SofaFileAttachment>
    </div>

    <div class="w-full flex md:hidden flex-col">
      <SofaFileAttachment :isWrapper="true" accept="image/*" class="!w-full flex flex-col" v-model:local-file-url="localFileUrl" v-model="factory.questionMedia">
        <template v-slot:content>
          <div class="w-full flex flex-col">
            <SofaButton customClass="w-full" padding="py-3">Add image (optional)</SofaButton>
          </div>
        </template>
      </SofaFileAttachment>
    </div>

    <div class="w-full flex flex-col items-center justify-center" v-if="localFileUrl">
      <SofaImageLoader :photoUrl="localFileUrl" customClass="h-[250px] mdlg:w-[70%] w-full rounded-custom" />
    </div>

    <div class="w-full grid grid-cols-2 gap-4 pt-4">
      <div class="flex flex-col gap-4" :class="factory.type !== 'match' ? 'col-span-2' : 'col-span-1'" v-if="!factory.isFillOrDrag">
        <Draggable :list="reactiveQuestion.options" class="w-full flex flex-col gap-4" item-key="id"
          group="question-options" :disabled="questionTypeMain == 'write_answer'">
          <template #item="{ element, index }">
            <div class="w-full flex items-center justify-between rounded-[12px] p-3 border-2 border-b-4 border-lightBorderColor bg-white gap-3"
              @mouseenter="element.showRemove = true"
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
                <sofa-icon
                  v-if="element.isRadio && (questionTypeMain == 'multiple_choice' || questionTypeMain == 'true_false')"
                  @click="element.isRadio ? setAnswers(element) : null"
                  :name="element.answer ? 'selected' : 'not-selected'" :custom-class="'w-[23px] cursor-pointer'" />
              </div>
            </div>
          </template>
        </Draggable>
      </div>

      <template v-if="questionTypeMain == 'match'">
        <div class="col-span-1 flex flex-col gap-4">
          <Draggable :list="reactiveQuestion.match" class="w-full flex flex-col gap-4" item-key="id"
            :group="{ name: 'question-match' }">
            <template #item="{ element, index }">
              <div
                :class="`w-full flex items-center justify-between rounded-[12px] p-3 border-lightBorderColor bg-white gap-3`"
                style="border-width: 2px 2px 4px 2px" @mouseenter="element.showRemove = true"
                @mouseleave="element.showRemove = false">
                <sofa-icon :name="element.shape" :custom-class="`${element.shapeSize}`" />
                <sofa-textarea :rows="1" :richEditor="true"
                  textAreaStyle="focus:outline-none bg-transparent placeholder:text-grayColor text-bodyBlack w-full"
                  :placeholder="element.text" v-model="element.value" />
              </div>
            </template>
          </Draggable>
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

    <div class="w-full flex flex-col border-t border-[#F1F6FA] pt-4">
      <div class="w-full flex items-start rounded-custom bg-[#F1F6FA] text-grayColor p-3 gap-3">
        <SofaIcon name="question-input" class="h-[23px] w-[24px] hidden lg:block" />
        <SofaTextarea :hasTitle="false"
          textAreaStyle="bg-transparent h-[130px] w-full !p-0 resize-none"
          placeholder="Explanation" :richEditor="true" v-model="factory.explanation" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Logic, QuestionFactory } from "sofa-logic"
import { PropType, defineProps, onMounted, reactive, ref, watch } from "vue"
import Draggable from "vuedraggable"
import SofaButton from "../SofaButton"
import { SofaCustomInput, SofaFileAttachment, SofaTextarea } from "../SofaForm"
import SofaIcon from "../SofaIcon"
import SofaImageLoader from "../SofaImageLoader"
import { SofaNormalText } from "../SofaTypography"

const props = defineProps({
  factory: {
    type: Object as PropType<QuestionFactory>,
    required: true
  }
})

const localFileUrl = ref(props.factory.questionMedia?.link ?? '')

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

      Logic.Study.AllQuestions?.results.forEach((questionItem) => {
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
</script>
