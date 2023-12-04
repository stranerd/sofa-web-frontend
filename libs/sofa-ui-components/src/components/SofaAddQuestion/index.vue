<template>
  <div class="w-full hidden mdlg:flex flex-col gap-4 h-full overflow-y-auto scrollbar-none">
    <Draggable :list="reactiveQuestions" class="w-full flex flex-col gap-4" item-key="id" group="question-list-lg">
      <template #item="{ element, index }">
        <a class="w-full p-4 group rounded-lg gap-2 flex flex-col" :class="selectedQuestionId == element.id ? 'bg-[#E6F5FF]' : 'bg-lightGrayVaraint'" @click="selectQuestion(element)">
          <div class="flex items-center gap-2">
            <SofaNormalText class="!font-bold" :content="`${index + 1}`" />
            <span class="w-[4px] h-[4px] rounded-full bg-deepGray" />
            <SofaNormalText class="!font-bold" :content="element.type" />
          </div>

          <div class="w-full h-[144px] bg-cover" :style="`background-image: url('/images/${Logic.Study.getQuestionTypeImage(element.type)}.svg')`">
            <div class="h-full w-full hidden group-hover:flex gap-3 items-center justify-center">
              <a @click.stop="duplicateQuestion(element)" class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-lg flex items-center justify-center">
                <SofaIcon name="duplicate-quiz" class="h-[24px]" />
              </a>
              <a @click.stop="toDeleteId = element.id; showDeleteQuestion = true" class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-lg flex items-center justify-center">
                <SofaIcon name="delete-quiz" class="h-[24px]" />
              </a>
            </div>
          </div>
        </a>
      </template>
    </Draggable>

    <a class="h-[144px] w-full rounded-xl border-2 border-[#E1E6EB] flex items-center justify-center" @click="showAddQuestionModal = true">
      <SofaIcon name="add-item" class="h-[30px]" />
    </a>
  </div>

  <!-- Smaller screens bottom bar -->
  <div class="w-full flex mdlg:!hidden items-center py-3 gap-2 px-4 border-t justify-between bg-white border-[#F1F6FA]">
    <Draggable class="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 items-center whitespace-nowrap" :list="reactiveQuestions"
      group="question-list-mobile" item-key="id" direction="horizontal" :disabled="true">
      <template #item="{ element, index }">
        <a class="w-[48px] h-[48px] rounded-custom items-center justify-center flex" :class="selectedQuestionId === element.id ? 'bg-primaryPurple' : 'bg-lightGrayVaraint'" @click="selectQuestion(element)">
          <SofaNormalText :color="selectedQuestionId === element.id ? 'text-white' : 'text-bodyBlack'" :content="`${index + 1}`" />
        </a>
      </template>
    </Draggable>

    <a class="w-[55px] flex flex-col justify-end" @click="showAddQuestionModal = true">
      <SofaIcon class="h-[44px]" name="faded-plus" />
    </a>
  </div>

  <!-- Add question modal -->
  <SofaModal v-if="showAddQuestionModal" :close="() => showAddQuestionModal = false">
    <div class="md:w-[70%] mdlg:w-[50%] mdlg:h-full h-[95%] w-full flex flex-col justify-end md:justify-start items-center">
      <div class="bg-white w-full flex flex-col mdlg:p-6 gap-4 p-4 md:rounded-2xl rounded-t-[20px] items-center justify-center">
        <div class="w-full text-center hidden md:inline-block">
          <SofaHeaderText class="!text-xl !font-bold" content="Choose question type" />
        </div>

        <div class="w-full flex justify-between items-center md:!hidden">
          <SofaNormalText class="!font-bold !text-base" content="Choose question type" />
          <SofaIcon class="h-[16px]" name="circle-close" @click="showAddQuestionModal = false" />
        </div>

        <div class="w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 gap-4">
          <a class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center hover:bg-[#E6F5FF] bg-[#F2F5F8] rounded-lg"
            v-for="item in Logic.Study.questionTypes" :key="item.key" @click="add(item.key)">
            <SofaIcon :name="item.icon" class="h-[50px]" />
            <SofaNormalText :content="Logic.Study.getQuestionTypeLabel(item.key)" />
          </a>
        </div>
      </div>
    </div>
  </SofaModal>

  <SofaDeletePrompt v-if="showDeleteQuestion" title="Are you sure?"
    subTitle="This action is permanent. You won't be able to undo this." :close="() => showDeleteQuestion = false"
    :buttons="[
      {
        label: 'No',
        isClose: true,
        action: () => showDeleteQuestion = false
      },
      {
        label: 'Yes, delete',
        isClose: false,
        action: del
      },
    ]" />
</template>

<script lang="ts" setup>
import { Logic, Question, TransformedQuestion } from "sofa-logic"
import { computed, defineEmits, defineProps, PropType, reactive, ref, toRef, watch } from "vue"
import Draggable from "vuedraggable"
import SofaDeletePrompt from "../SofaDeletePrompt"
import SofaIcon from "../SofaIcon"
import SofaModal from "../SofaModal"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

const props = defineProps({
  questionId: {
    type: String,
    required: true
  },
  questions: {
    type: Array as PropType<TransformedQuestion[]>,
    default: [],
  },
  reorderQuestions: {
    type: Function as PropType<(questions: string[]) => Promise<void>>,
    required: true
  },
  deleteQuestion: {
    type: Function as PropType<(questionId: string) => Promise<void>>,
    required: true
  },
  addQuestion: {
    type: Function as PropType<(type: Question['strippedData']['type']) => Promise<void>>,
    required: true
  },
  duplicateQuestion: {
    type: Function as PropType<(question: Question) => Promise<void>>,
    required: true
  },
})

const emits = defineEmits(['update:questionId'])

const selectedQuestionId = computed({
  get: () => props.questionId,
  set: (v) => {
    emits('update:questionId', v)
  }
})

const showAddQuestionModal = ref(false)
const showDeleteQuestion = ref(false)
const reactiveQuestions = reactive([...props.questions])

const toDeleteId = ref('')

const selectQuestion = (question: Question) => {
  selectedQuestionId.value = question.id
}

const add = async (type: Question['strippedData']['type']) => {
  await props.addQuestion(type)
  showAddQuestionModal.value = false
}

const del = async () => {
  await props.deleteQuestion(toDeleteId.value)
  showDeleteQuestion.value = false
}

watch(reactiveQuestions, () => {
  Logic.Study.debounce(async () => {
    await props.reorderQuestions(reactiveQuestions.map((q) => q.id))
  }, 500)
})
</script>
