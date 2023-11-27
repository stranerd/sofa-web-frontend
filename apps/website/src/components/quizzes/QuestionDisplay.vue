<template>
  <div class="w-full flex justify-center items-center px-6">
    <div class="flex flex-col lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full gap-4">
      <div class="w-full flex flex-col border-b-2 border-[#E1E6EB] pb-2 justify-start" v-if="!Logic.Common.isOnlyMobile">
        <SofaHeaderText :custom-class="'text-left !font-bold'" color="text-inherit" :content="title" />
      </div>
      <SofaHeaderText v-if="question.data.type !== 'fillInBlanks' && question.data.type !== 'dragAnswers'"
        :customClass="'!font-bold md:!text-2xl text-base w-full text-left justify-start flex'" color="text-inherit"
        :content="question.question" />

      <div class="w-full flex flex-col justify-start pb-2">
        <SofaNormalText color="text-inherit" :content="question.instruction" />
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'multipleChoice'">
        <a v-for="(option, index) in question.data.options" :key="index"
          class="w-full flex items-center border-2 justify-between rounded-xl p-3 bg-white border-[#E1E6EB] gap-3" :class="{
            '!bg-[#E1F5EB] !border-primaryGreen': optionState(index) === 'correct',
            '!bg-[#FAEBEB] !border-primaryRed': optionState(index) === 'wrong',
            '!bg-[#E2F3FD] !border-primaryBlue shake': optionState(index) === 'selected',
            '!bg-[#E2F3FD] border-[#7DC8FA]': optionState(index) === 'hover'
          }"
          @click="multipleChoiceAnswers.includes(index) ? multipleChoiceAnswers = multipleChoiceAnswers.filter((x) => x === index) : multipleChoiceAnswers.push(index)">
          <div class="flex-grow flex gap-3 items-center">
            <SofaIcon
              :name="`${Logic.Study.getShape(index)}${optionState(index) == 'hover' ? '-blue' : ''}${optionState(index) == 'correct' ? '-green' : ''}${optionState(index) == 'wrong' ? '-red' : ''}`"
              :custom-class="`${Logic.Study.getShapeSize(Logic.Study.getShape(index))}`" />
            <SofaHeaderText :content="option"
              :customClass="'md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex'" />
          </div>
        </a>
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'trueOrFalse'">
        <a v-for="(option, index) in [true, false]" :key="index"
          class="w-full flex items-center border-2 justify-between rounded-[12px] p-3 bg-white border-[#E1E6EB] gap-3"
          :class="{
            '!bg-[#E1F5EB] !border-primaryGreen': optionState(option) === 'correct',
            '!bg-[#FAEBEB] !border-primaryRed': optionState(option) === 'wrong',
            '!bg-[#E2F3FD] !border-primaryBlue shake': optionState(option) === 'selected',
            '!bg-[#E2F3FD] border-[#7DC8FA]': optionState(option) === 'hover'
          }" @click="trueOrFalseAnswer = option">
          <div class="flex-grow flex gap-3 items-center">
            <SofaIcon
              :name="`${Logic.Study.getShape(index)}${optionState(option) == 'hover' ? '-blue' : ''}${optionState(option) == 'correct' ? '-green' : ''}${optionState(option) == 'wrong' ? '-red' : ''}`"
              :custom-class="`${Logic.Study.getShapeSize(Logic.Study.getShape(index))}`" />
            <SofaHeaderText :content="option.toString()"
              :customClass="'capitalize md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex'" />
          </div>
        </a>
      </div>

      <div class="w-full flex flex-col gap-4 pt-4" v-if="question.type === 'writeAnswer'">
        <div
          class="w-full flex items-center justify-between rounded-[12px] md:!px-3 md:!py-3 px-3 py-1 border-[#E1E6EB] bg-white gap-3 border-2">
          <div class="flex-grow flex gap-3 py-3 items-center">
            <SofaTextarea placeholder="Write your answer here" v-model="writeAnswerAnswer"
              text-area-style="focus:outline-none bg-transparent  !text-bodyBlack !bg-white placeholder:text-grayColor w-full placeholder:font-semibold text-base placeholder:text-base" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Logic, Question } from "sofa-logic"
import {
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaTextarea,
} from "sofa-ui-components"
import { PropType, computed, defineEmits, defineProps, reactive, ref, watch } from "vue"

const props = defineProps({
  questionData: {
    type: Object as PropType<Question>,
    required: true
  },
  modelValue: {
    type: Object as PropType<any>,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  optionState: {
    type: Function as PropType<(val: number | boolean) => 'selected' | 'correct' | 'wrong' | 'hover' | null>,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const question = computed(() => Logic.Study.transformQuestion(props.questionData))

const multipleChoiceAnswers = reactive<number[]>(Array.isArray(props.modelValue) ? props.modelValue : [])
const trueOrFalseAnswer = ref<boolean>()
const writeAnswerAnswer = ref('')

watch(writeAnswerAnswer, () => {
  emits('update:modelValue', writeAnswerAnswer.value.trim())
})

watch(multipleChoiceAnswers, () => {
  emits('update:modelValue', multipleChoiceAnswers)
})

watch(trueOrFalseAnswer, () => {
  emits('update:modelValue', trueOrFalseAnswer.value)
})
</script>

<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25%,
  75% {
    transform: translateX(-5px);
  }

  50%,
  100% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s infinite;
}</style>
