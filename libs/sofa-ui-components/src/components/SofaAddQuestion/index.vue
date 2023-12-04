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
              <a @click.stop="emits('duplicateQuestion', element)" class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-lg flex items-center justify-center">
                <SofaIcon name="duplicate-quiz" class="h-[24px]" />
              </a>
              <a @click.stop="emits('deleteQuestion', element.id)" class="w-[40px] h-[40px] bg-[#E1E6EB80] rounded-lg flex items-center justify-center">
                <SofaIcon name="delete-quiz" class="h-[24px]" />
              </a>
            </div>
          </div>
        </a>
      </template>
    </Draggable>

    <a class="h-[144px] w-full rounded-xl border-2 border-[#E1E6EB] flex items-center justify-center" @click="emits('addQuestion')">
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

    <a class="w-[55px] flex flex-col justify-end" @click="emits('addQuestion')">
      <SofaIcon class="h-[44px]" name="faded-plus" />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { Logic, Question, TransformedQuestion } from "sofa-logic"
import { computed, defineEmits, defineProps, PropType, reactive, toRef, watch } from "vue"
import Draggable from "vuedraggable"
import SofaIcon from "../SofaIcon"
import { SofaNormalText } from "../SofaTypography"

const props = defineProps({
  questionId: {
    type: String,
    required: true
  },
  questions: {
    type: Array as PropType<TransformedQuestion[]>,
    required: true
  },
})

const emits = defineEmits(['update:questionId', 'addQuestion', 'duplicateQuestion', 'deleteQuestion', 'reorderQuestions'])

const selectedQuestionId = computed({
  get: () => props.questionId,
  set: (v) => {
    emits('update:questionId', v)
  }
})

const questionsRef = toRef(props, 'questions')
const reactiveQuestions = reactive([...questionsRef.value])

const selectQuestion = (question: Question) => {
  selectedQuestionId.value = question.id
}

watch(questionsRef, () => {
  reactiveQuestions.splice(0, reactiveQuestions.length, ...questionsRef.value)
})

watch(reactiveQuestions, () => {
  emits('reorderQuestions', reactiveQuestions.map((q) => q.id))
})
</script>
