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
          @click="answer.value.includes(index) ? answer.value.splice(answer.value.indexOf(index), 1) : answer.value.push(index)">
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
          }" @click="answer.value = option">
          <div class="flex-grow flex gap-3 items-center">
            <SofaIcon
              :name="`${Logic.Study.getShape(index)}${optionState(option) == 'hover' ? '-blue' : ''}${optionState(option) == 'correct' ? '-green' : ''}${optionState(option) == 'wrong' ? '-red' : ''}`"
              :custom-class="`${Logic.Study.getShapeSize(Logic.Study.getShape(index))}`" />
            <SofaHeaderText :content="option.toString()"
              :customClass="'capitalize md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex'" />
          </div>
        </a>
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'writeAnswer'">
        <div
          class="w-full flex items-center justify-between rounded-[12px] md:!px-3 md:!py-3 px-3 py-1 border-[#E1E6EB] bg-white gap-3 border-2">
          <div class="flex-grow flex gap-3 py-3 items-center">
            <SofaTextarea placeholder="Write your answer here" v-model="answer.value"
              text-area-style="focus:outline-none bg-transparent !text-bodyBlack !bg-white placeholder:text-grayColor w-full placeholder:font-semibold text-base placeholder:text-base" />
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'fillInBlanks'">
        <div class="w-full flex md:!gap-3 gap-2 items-center flex-wrap">
          <template v-for="(content, index) in question.question.split(question.data.indicator)" :key="index">
            <div v-if="index !== 0"
              class="min-w-[160px] rounded-xl md:p-3 p-1 bg-white flex items-center justify-center border-2 border-b-4">
              <input placeholder="answer here"
                class="w-full focus:outline-none placeholder:md:!text-2xl !text-bodyBlack !bg-white placeholder:text-base placeholder:text-grayColor md:!text-2xl text-base"
                v-model="answer.value[index]" />
            </div>
            <SofaHeaderText :customClass="'!font-semibold md:!text-2xl text-base'" color="text-inherit"
              :content="content" />
          </template>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'dragAnswers'">
        <div class="w-full flex md:!gap-3 gap-2 items-center flex-wrap">
          <template v-for="(content, index) in question.question.split(question.data.indicator)" :key="index">
            <draggable v-if="index !== 0" :list="answer.value[index]" itemKey=""
              :group="{ name: 'drag-and-drop-question' }"
              :class="`md:!w-[160px] md:!h-[70px] w-[140px] h-[48px] rounded-xl md:p-4 px-2 bg-white flex items-center justify-center border-2 border-b-4`"
              @end="dropHandler">
              <template #item="{ element, index }">
                <div :key="index"
                  :class="`md:p-4 p-2 flex items-center cursor-move justify-center touch-none bg-skyBlue rounded-xl border-2 border-b-4`">
                  <SofaHeaderText :customClass="'!font-bold md:!text-2xl text-base'" :content="element" />
                </div>
              </template>
            </draggable>
            <SofaHeaderText :customClass="'!font-semibold md:!text-2xl text-base'" color="text-inherit"
              :content="content" />
          </template>

          <draggable class="w-full flex items-center gap-3 pt-6 md:!h-[90px] h-[40px]"
            :list="question.data.answers.filter((o) => !answer.value.includes(o))" itemKey=""
            :group="{ name: 'drag-and-drop-question' }" @end="dropHandler">
            <template #item="{ element, index }">
              <div :key="index"
                :class="`md:p-4 p-2 flex items-center cursor-move justify-center touch-none bg-skyBlue rounded-xl border-2 border-b-4`">
                <SofaHeaderText :customClass="'!font-bold md:!text-2xl text-base'" :content="element" />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4" v-if="question.type === 'sequence'">
        <draggable v-model="answer.value" class="flex flex-col gap-4" itemKey="">
          <template #item="{ element, index }">
            <div class="w-full flex items-center gap-3">
              <div
                class="px-6 py-3 rounded-xl flex items-center justify-center bg-white border-[#E1E6EB] border-2 border-b-4">
                <SofaHeaderText :content="(index + 1).toString()"
                  customClass="md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex" />
              </div>
              <div
                class="w-full flex items-center cursor-move justify-between rounded-xl flex-grow p-4 border-[#E1E6EB] bg-white gap-3 border-2 border-b-4">
                <SofaHeaderText
                  customClass="'md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex !line-clamp-1"
                  :content="element" />
              </div>
            </div>
          </template>
        </draggable>
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
import { PropType, computed, defineEmits, defineProps, reactive, watch } from "vue"
import Draggable from "vuedraggable"

const props = defineProps({
  questionData: {
    type: Object as PropType<Question>,
    required: true
  },
  modelValue: {
    type: [Array, String, Boolean] as PropType<any>,
    required: true,
    validator: () => true
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

const answer = reactive({ value: props.modelValue })

const dropHandler = () => {
  console.log(answer.value)
  console.log(question.value)
}

watch(answer, () => {
  console.log(answer.value)
  emits('update:modelValue', answer.value)
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
  animation: shake 0.5s 1;
}
</style>
