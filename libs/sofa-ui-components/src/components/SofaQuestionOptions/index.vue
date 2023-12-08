<template>
  <div class="w-full flex flex-col flex-grow mdlg:gap-0 gap-4 relative overflow-y-auto scrollbar-none">
    <div class="flex flex-col gap-6 h-full overflow-y-auto px-4 mdlg:px-0">
      <div class="w-full flex flex-col gap-4">
        <a class="w-full flex items-center gap-2" @click="toggleOpen('type')">
          <SofaIcon class="h-[18px]" name="question-type" />
          <SofaNormalText class="!font-bold" content="Question type" />
          <SofaNormalText :content="Logic.Study.getQuestionTypeLabel(factory.type)" class="ml-auto" />
          <SofaIcon class="h-[7px]" :name="isOpen('type') ? 'chevron-up' : 'chevron-down'" />
        </a>

        <div v-if="isOpen('type')" class="w-full grid grid-cols-2 gap-3">
          <a v-for="type in Logic.Study.getAllQuestionTypes()" :key="type.value" @click="factory.type = type.value"
            class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center rounded-lg"
            :class="factory.type === type.value ? 'bg-[#E6F5FF]' : 'bg-[#F2F5F8]'">
            <SofaIcon :name="type.icon" class="h-[50px]" />
            <SofaNormalText class="text-center" :content="type.label" />
          </a>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4">
        <a class="w-full flex items-center gap-2" @click="toggleOpen('timeLimit')">
          <SofaIcon class="h-[18px]" name="time-limit" />
          <SofaNormalText class="!font-bold" content="Time limit" />
          <SofaNormalText :content="formatTime(factory.timeLimit)" class="ml-auto" />
          <SofaIcon class="h-[7px]" :name="isOpen('timeLimit') ? 'chevron-up' : 'chevron-down'" />
        </a>

        <div v-if="isOpen('timeLimit')" class="w-full flex flex-wrap gap-3">
          <a v-for="time in [5, 10, 20, 30, 60, 90, 120, 180, 240, 300]" :key="time" @click="factory.timeLimit = time"
            class="rounded-lg flex px-4 py-2 items-center justify-center gap-1"
            :class="factory.timeLimit === time ? 'bg-primaryPurple text-white' : 'bg-[#EFF2F5] text-deepGray'">
            <SofaNormalText class="text-center" color="text-inherit" :content="formatTime(time)" />
          </a>
        </div>
      </div>
    </div>

    <div class="rounded-b-xl w-full p-4 mdlg:px-0 border-t-2 border-[#F2F5F8] flex flex-col gap-4">
      <a :class="{'pointer-events-none !text-grayColor': !factory.valid || !factory.hasChanges}" class="text-primaryGreen w-full flex md:hidden items-center justify-start gap-3"
        @click="emits('saveQuestion')">
        <SofaIcon name="save" class="h-[16px] stroke-current" />
        <SofaNormalText color="text-inherit" content="Save question" />
      </a>
      <a class="w-full flex md:hidden items-center justify-start gap-3" @click="emits('duplicateQuestion', question)">
        <SofaIcon name="copy" class="h-[16px]" />
        <SofaNormalText content="Duplicate question" />
      </a>
      <a v-if="quiz.status !== 'published'" class="w-full flex md:hidden items-center justify-start gap-3" @click="emits('deleteQuestion', question.id)">
        <SofaIcon name="trash" class="h-[16px]" />
        <SofaNormalText color="text-primaryRed" content="Delete question" />
      </a>
      <a v-if="quiz.status !== 'published'" class="w-full flex items-center justify-start gap-3" @click="emits('deleteQuiz')">
        <SofaIcon name="trash" class="h-[16px]" />
        <SofaNormalText color="text-primaryRed" content="Delete quiz" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Logic, Quiz, QuestionFactory, TransformedQuestion } from "sofa-logic"
import { PropType, defineProps, ref } from "vue"
import SofaIcon from "../SofaIcon"
import { SofaNormalText } from "../SofaTypography"

defineProps({
  quiz: {
    type: Object as PropType<Quiz>,
    required: true
  },
  question: {
    type: Object as PropType<TransformedQuestion>,
    required: true
  },
  factory: {
    type: Object as PropType<QuestionFactory>,
    required: true
  }
})

const emits = defineEmits(['duplicateQuestion', 'saveQuestion', 'deleteQuestion', 'deleteQuiz'])

const formatTime = (v: number) => {
  const min = Math.floor(v / 60)
  const sec = v % 60
  return `${min > 0 ? `${min}m` : ''}${sec > 0 ? `${sec}s` : ''}`
}

const openOptions = ref(['type', 'timeLimit'])

const isOpen = (key: string) => openOptions.value.includes(key)
const toggleOpen = (key: string) => {
  if (isOpen(key)) openOptions.value = openOptions.value.filter((k) => k !== key)
  else openOptions.value.push(key)
}
</script>
