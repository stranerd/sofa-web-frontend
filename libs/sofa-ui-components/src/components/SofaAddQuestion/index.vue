<template>
  <div :class="`w-full mdlg:!flex hidden flex-col gap-4 h-full overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${showScrollBar ? 'mdlg:!scrollbar-thin' : 'scrollbar-none'
    }`" @mouseover="showScrollBar = true" @mouseleave="showScrollBar = false">
    <draggable :list="questions" class="w-full gap-4" item-key="id" :group="{ name: 'question-list-lg' }"
      @end="handleDrag">
      <template #item="{ element, index }">
        <div :class="`w-full px-4 py-4 rounded-[12px] cursor-pointer ${selectedQuestion == index ? 'bg-[#E6F5FF]' : 'bg-[#F1F6FA]'
          } gap-2 flex flex-col`" @click="selectQuestion(element, index)" @mouseenter="element.hover = true"
          @mouseleave="element.hover = false">
          <div class="flex flex-row items-center gap-2">
            <sofa-normal-text :customClass="'!font-bold'">{{
              index + 1
            }}</sofa-normal-text>
            <span class="w-[4px] h-[4px] rounded-full bg-deepGray"> </span>
            <sofa-normal-text :customClass="'!font-bold'">{{
              element.type
            }}</sofa-normal-text>
          </div>

          <div class="w-full h-[144px] bg-cover relative">
            <img :src="`/images/${element.image}.svg`" class="w-full h-full" />
            <div class="absolute top-0 left-0 h-full w-full flex flex-row gap-3 items-center justify-center"
              v-if="element.hover">
              <div @click.stop="
                selectedQuestionData = element
              duplicateQuestion();
              " class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-[8px] flex flex-row items-center justify-center">
                <sofa-icon :name="'duplicate-quiz'" :customClass="'h-[24px]'" />
              </div>
              <div @click.stop="
                selectedQuestionData = element
              showDeleteQuestion = true;
              " class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-[8px] flex flex-row items-center justify-center">
                <sofa-icon :name="'delete-quiz'" :customClass="'h-[24px]'" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div class="w-full py-3 px-3">
      <div
        class="h-[144px] w-full rounded-[12px] border-[2px] border-[#E1E6EB] flex flex-row items-center justify-center cursor-pointer"
        @click="showAddQuestionModal = true">
        <sofa-icon :name="'add-item'" :custom-class="'h-[30px]'"></sofa-icon>
      </div>
    </div>
  </div>

  <!-- Smaller screens bottom bar -->

  <div
    class="w-full !flex flex-row fixed bottom-0 left-0 items-center py-3 px-4 border-t-[1px] justify-between mdlg:!hidden bg-white border-[#F1F6FA] z-[100]">
    <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
      <draggable class="flex flex-row gap-2 items-center flex-nowrap whitespace-nowrap pr-4" v-model="questions"
        v-if="questions" :group="'add-question-mobile'" item-key="id" @end="handleDrag" :direction="'horizontal'"
        :disabled="true">
        <template #item="{ element, index }">
          <div :class="`w-[48px] h-[48px] custom-border ${selectedQuestion == index
            ? 'bg-primaryPurple'
            : 'bg-lightGrayVaraint'
            }  items-center justify-center flex`" @click="selectQuestion(element, index)">
            <sofa-normal-text :color="selectedQuestion == index ? 'text-white' : 'text-bodyBlack'
              ">
              {{ index + 1 }}
            </sofa-normal-text>
          </div>
        </template>
      </draggable>
    </div>

    <div class="w-[55px] flex flex-col justify-end" @click="showAddQuestionModal = true">
      <span class="pl-2">
        <sofa-icon :customClass="'h-[44px]'" :name="'faded-plus'" />
      </span>
    </div>
  </div>

  <!-- Add question modal -->
  <sofa-modal v-if="showAddQuestionModal" :close="() => {
    showAddQuestionModal = false
  }
    ">
    <div
      class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
        <div class="w-full text-center hidden md:!inline-block">
          <sofa-header-text :customClass="'!text-xl !font-bold '">Choose question type</sofa-header-text>
        </div>

        <div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Choose question type
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[16px]'" :name="'circle-close'" @click="showAddQuestionModal = false" />
        </div>

        <div class="w-full grid md:!grid-cols-3 mdlg:!grid-cols-4 grid-cols-2 gap-4">
          <div
            :class="`col-span-1 px-3 py-3 flex flex-col gap-2 cursor-pointer items-center justify-center hover:bg-[#E6F5FF]  bg-[#F2F5F8] rounded-[8px] `"
            v-for="(item, index) in questionTypes" :key="index" @click="addQuestion(index.toString())">
            <sofa-icon :name="item.icon" :custom-class="'h-[50px]'" />
            <sofa-normal-text>{{ item.type }}</sofa-normal-text>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>

  <sofa-delete-prompt v-if="showDeleteQuestion" :title="'Are you sure you?'"
    :subTitle="`This action is permanent. You won't be able to undo this.`" :close="() => {
      showDeleteQuestion = false
    }
      " :buttons="[
    {
      label: 'No',
      isClose: true,
      action: () => {
        showDeleteQuestion = false
      },
    },
    {
      label: 'Yes, delete',
      isClose: false,
      action: () => {
        deleteQuestion()
      },
    },
  ]" />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from "vue"
import draggable from "vuedraggable"
import { Logic } from "../../composable"
import { Question } from "../../types/domains/study"
import SofaDeletePrompt from "../SofaDeletePrompt"
import SofaIcon from "../SofaIcon"
import SofaModal from "../SofaModal"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    draggable,
    SofaModal,
    SofaHeaderText,
    SofaDeletePrompt,
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
  setup (props, context) {
    const showScrollBar = ref(false)
    const selectedQuestion = ref(0)
    const hideQuestions = ref(false)

    const questionIsSelected = ref(false)

    const showAddQuestionModal = ref(false)

    const showDeleteQuestion = ref(false)

    const questionSettings = ref(Logic.Study.questionSettings)
    const quizQuestionDeleted = ref(Logic.Study.quizQuestionDeleted)

    const dataRef = toRef(props, "data")

    const questionTypes = Logic.Study.questionTypes

    const UpdatedQuestion = ref(Logic.Study.UpdatedQuestion)

    const selectedQuestionData = ref()

    const questions = ref([])

    const selectQuestion = (question: any, index: number) => {
      selectedQuestion.value = index
      questionIsSelected.value = true

      const baseQuestion = Logic.Study.AllQuestions.results.filter(
        (eachQuestion) => eachQuestion.id == question.id
      )

      const questionData = Logic.Study.ProcessQuestionData(baseQuestion[0])

      Logic.Study.selectedQuestion = JSON.parse(JSON.stringify(questionData))
      context.emit("OnQuestionSelected", questionData)
    }

    const setQuestions = (
      autoSelectQuestion = true,
      index = 0,
      reorder = false
    ) => {
      questions.value.length = 0
      const allQuestionData = []

      if (reorder) {
        const questionOrder = Logic.Study.SingleQuiz.questions
        questionOrder.forEach((item) => {
          const quiz = props.data?.filter((eachItem) => eachItem.id == item)

          if (quiz.length) {
            const questionData = Logic.Study.ProcessQuestionData(quiz[0])
            allQuestionData.push(questionData)
          }
        })
      } else {
        props.data?.forEach((question, index) => {
          const questionData = Logic.Study.ProcessQuestionData(question)
          allQuestionData.push(questionData)
        })
      }

      questions.value = allQuestionData

      if (questions.value.length > 0 && autoSelectQuestion) {
        selectQuestion(questions.value[index], index)
      }
    }

    watch(dataRef, () => {
      setQuestions(true, dataRef.value.length - 1)
    })

    const handleDrag = () => {
      setTimeout(() => {
        const allQuestions = questions.value
        questions.value = allQuestions
        if (questions.value) {
          const allQuestionIds = questions.value.map((question) => question.id)

          Logic.Study.ReorderQuizQuestionsForm = {
            questions: allQuestionIds,
          }
          Logic.Study.ReorderQuizQuestions(Logic.Study.SingleQuiz.id)
        }
      }, 500)
    }

    const updateQuestionFromBase = (item: any) => {
      const questionTypeSetting = questionSettings.value.filter((item) => {
        return item.type == "question-type"
      })

      const baseQuestion = Logic.Study.AllQuestions.results.filter(
        (eachQuestion) => eachQuestion.id == item.id
      )

      const questionData = Logic.Study.ProcessQuestionData(baseQuestion[0])

      item.active = questionData.active
      item.content = questionData.content
      item.explanation = questionData.explanation
      item.icon = questionData.icon
      item.itemType = questionData.itemType
      item.options = questionData.options
      item.placeholder = questionData.placeholder
      item.questionMedia = questionData.questionMedia
      item.questionMediaBlob = questionData.questionMediaBlob
      item.settings = questionData.settings
      item.timeLimit = questionData.timeLimit

      item.type = questionTypeSetting[0].value
      item.image = questionTypeSetting[0].questionType
      item.key = questionTypeSetting[0].itemType
    }

    watch(questionSettings, () => {
      questions.value.forEach((item, index) => {
        if (index == selectedQuestion.value) {
          updateQuestionFromBase(item)
        }
      })
    })

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
      Logic.Study.saveQuizLocalChanges(true).then(() => {
        const newQuestionData = questionTypes[type]

        showAddQuestionModal.value = false

        Logic.Study.CreateQuestionForm = Logic.Study.convertQuestionToInput(
          newQuestionData,
          type
        )

        Logic.Study.CreateQuestionForm.explanation = ""

        if (type == "writeAnswer") {
          Logic.Study.CreateQuestionForm.data.options = [
            Logic.Study.CreateQuestionForm.data.options[0],
          ]
        }

        Logic.Study.CreateQuestion(true, Logic.Study.SingleQuiz.id)
      })
    }

    const deleteQuestion = () => {
      if (Logic.Study.SingleQuiz.status == "published") {
        Logic.Common.showLoader({
          show: true,
          loading: false,
          message: "You cannot delete questions from published quiz",
          type: "warning",
        })
        return
      }

      Logic.Study.saveQuizLocalChanges(true).then(() => {
        Logic.Study.DeleteQuestion(
          selectedQuestionData.value.id,
          Logic.Study.SingleQuiz.id
        )
          .then((data) => {
            if (data) {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: "Question has been deleted.",
                type: "success",
              })
              showDeleteQuestion.value = false
            }
          })
          .catch(() => {
            Logic.Common.showLoader({
              show: true,
              loading: false,
              message: "Unable to delete question. Please try again",
              type: "error",
            })
          })
      })
    }

    const duplicateQuestion = () => {
      Logic.Study.saveQuizLocalChanges(true).then(() => {
        const newQuestionData = questionTypes[selectedQuestionData.value.key]

        Logic.Study.CreateQuestionForm = Logic.Study.convertQuestionToInput(
          newQuestionData,
          selectedQuestionData.value.key
        )

        if (selectedQuestionData.value.key == "writeAnswer") {
          console.log(newQuestionData)
        }

        Logic.Study.CreateQuestionForm["explanation"] = ""

        if (selectedQuestionData.value.key == "writeAnswer") {
          Logic.Study.CreateQuestionForm.data.options = [
            Logic.Study.CreateQuestionForm.data.options[0],
          ]
        }

        Logic.Study.CreateQuestion(true, Logic.Study.SingleQuiz.id).then(() => {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Question duplicated",
            type: "success",
          })
        })
      })
    }

    onMounted(() => {
      if (dataRef.value) {
        setQuestions(true, 0, true)
      }

      Logic.Study.watchProperty("UpdatedQuestion", UpdatedQuestion)
      Logic.Study.watchProperty("questionSettings", questionSettings)
      Logic.Study.watchProperty("quizQuestionDeleted", quizQuestionDeleted)
    })

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
      showDeleteQuestion,
      duplicateQuestion,
      deleteQuestion,
      selectedQuestionData,
    }
  },
})
</script>
