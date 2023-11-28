<template>
  <div class="flex flex-col justify-center items-start w-full gap-4">
    <SofaHeaderText v-if="!Logic.Common.isOnlyMobile" class="text-left !font-bold border-b-2 border-[#E1E6EB] pb-2"
      color="text-inherit" :content="title" />
    <SofaHeaderText v-if="question.data.type !== 'fillInBlanks' && question.data.type !== 'dragAnswers'"
      class="!font-bold md:!text-2xl text-base w-full text-left justify-start flex" color="text-inherit"
      :content="question.question" />

    <SofaNormalText color="text-inherit" class="pb-2" :content="question.instruction" />

    <template v-if="question.strippedData.type === 'multipleChoice'">
      <a v-for="(option, index) in question.strippedData.options" :key="index"
        class="w-full flex items-center border-2 justify-between rounded-xl p-3 bg-white border-[#E1E6EB] hover:bg-[#E2F3FD] hover:border-[#7DC8FA] gap-3" :class="{
          '!bg-[#E1F5EB] !border-primaryGreen': optionState(option, index) === 'correct',
          '!bg-[#FAEBEB] !border-primaryRed': optionState(option, index) === 'wrong',
          '!bg-[#E2F3FD] !border-primaryBlue shake': optionState(option, index) === 'selected',
        }"
        @click="answer.value.includes(index) ? answer.value.splice(answer.value.indexOf(index), 1) : answer.value.push(index)">
        <div class="flex-grow flex gap-3 items-center">
          <SofaIcon
            :name="Logic.Study.getShape(index) + ({ 'correct': '-green', 'wrong': '-red' }[optionState(option, index)] ?? '')"
            :custom-class="Logic.Study.getShapeSize(Logic.Study.getShape(index))" />
          <SofaHeaderText :content="option" class="md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex" />
        </div>
      </a>
    </template>

    <template v-if="question.strippedData.type === 'trueOrFalse'">
      <a v-for="(option, index) in [true, false]" :key="index"
        class="w-full flex items-center border-2 justify-between rounded-[12px] p-3 bg-white border-[#E1E6EB] hover:bg-[#E2F3FD] hover:border-[#7DC8FA] gap-3"
        :class="{
          '!bg-[#E1F5EB] !border-primaryGreen': optionState(option) === 'correct',
          '!bg-[#FAEBEB] !border-primaryRed': optionState(option) === 'wrong',
          '!bg-[#E2F3FD] !border-primaryBlue shake': optionState(option) === 'selected',
        }" @click="answer.value = option">
        <div class="flex-grow flex gap-3 items-center">
          <SofaIcon
            :name="Logic.Study.getShape(index) + ({ 'correct': '-green', 'wrong': '-red' }[optionState(option, index)] ?? '')"
            :custom-class="Logic.Study.getShapeSize(Logic.Study.getShape(index))" />
          <SofaHeaderText :content="option.toString()" class="capitalize md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex" />
        </div>
      </a>
    </template>

    <template v-if="question.strippedData.type === 'writeAnswer'">
      <div class="w-full flex items-center justify-between rounded-xl border-[#E1E6EB] bg-white gap-3 border-2">
        <SofaTextarea placeholder="Write your answer here" v-model="answer.value"
          text-area-style="focus:outline-none bg-transparent !text-bodyBlack p-3 !bg-white placeholder:text-grayColor w-full placeholder:font-semibold text-base placeholder:text-base" />
      </div>
    </template>

    <template v-if="question.strippedData.type === 'fillInBlanks'">
      <div class="w-full flex md:!gap-3 gap-2 items-center flex-wrap">
        <template v-for="(content, index) in question.splitQuestions" :key="index">
          <div v-if="index !== 0"
            class="min-w-[160px] rounded-xl p-3 bg-white flex items-center justify-center border-2 border-b-4">
            <input placeholder="answer here"
              class="w-full focus:outline-none placeholder:md:!text-2xl !text-bodyBlack !bg-white placeholder:text-base placeholder:text-grayColor md:!text-2xl text-base"
              v-model="answer.value[index]" />
          </div>
          <SofaHeaderText class="!font-semibold md:!text-2xl text-base" color="text-inherit" :content="content" />
        </template>
      </div>
    </template>

    <template v-if="question.strippedData.type === 'dragAnswers'">
      <div class="w-full flex md:!gap-3 gap-2 items-center flex-wrap">
        <template v-for="(content, index) in question.splitQuestions" :key="index">
          <Draggable v-if="index !== 0" :list="answer.drag[index - 1]" itemKey="" group="dragAnswers" :move="move"
            :id="`drag-answer-${index - 1}`"
            :class="`md:min-w-[160px] md:!h-[70px] min-w-[140px] h-[48px] rounded-xl md:p-4 px-2 bg-white flex items-center justify-center border-2 border-b-4`">
            <template #item="{ element }">
              <div
                :class="`md:p-4 p-2 flex items-center cursor-move justify-center touch-none bg-skyBlue rounded-xl border-2 border-b-4`">
                <SofaHeaderText class="!font-bold md:!text-2xl text-base" :content="element" />
              </div>
            </template>
          </Draggable>
          <SofaHeaderText class="!font-semibold md:!text-2xl text-base" color="text-inherit" :content="content" />
        </template>

        <Draggable :list="answer.dragOptions" itemKey="" group="dragAnswers" :move="move" id="drag-options"
          class="w-full flex items-center gap-3 pt-6 md:!h-[90px] h-[40px]">
          <template #item="{ element }">
            <div
              :class="`md:p-4 p-2 flex items-center cursor-move justify-center touch-none bg-skyBlue rounded-xl border-2 border-b-4`">
              <SofaHeaderText class="!font-bold md:!text-2xl text-base" :content="element" />
            </div>
          </template>
        </Draggable>
      </div>
    </template>

    <template v-if="question.strippedData.type === 'sequence'">
      <Draggable v-model="answer.value" group="sequence" class="flex flex-col gap-4" itemKey="">
        <template #item="{ element, index }">
          <div class="w-full flex items-center gap-3">
            <div class="p-3 rounded-xl flex items-center justify-center bg-white border-[#E1E6EB] border-2 border-b-4">
              <SofaHeaderText :content="(index + 1).toString()"
                class="md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex" />
            </div>
            <div
              class="w-full flex items-center cursor-move justify-between rounded-xl flex-grow p-3 border-[#E1E6EB] bg-white gap-3 border-2 border-b-4">
              <SofaHeaderText
                class="'md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex !line-clamp-1"
                :content="element" />
            </div>
          </div>
        </template>
      </Draggable>
    </template>

    <div class="w-full grid grid-cols-2 gap-4" v-if="question.type === 'match'">
      <Draggable v-model="question.matchQuestions" group="match-questions" class="col-span-1 flex flex-col gap-2"
        itemKey="" :disabled="true">
        <template #item="{ element, index }">
          <div
            class="w-full flex items-center justify-between rounded-xl flex-grow p-3 border-[#E1E6EB] border-2 border-b-4 bg-white gap-3">
            <SofaIcon :name="Logic.Study.getShape(index)"
              :custom-class="Logic.Study.getShapeSize(Logic.Study.getShape(index))" />
            <SofaHeaderText class="md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex line-clamp-1"
              :content="element" />
          </div>
        </template>
      </Draggable>

      <Draggable v-model="answer.value" group="match-answers" class="col-span-1 flex flex-col gap-2" itemKey="">
        <template #item="{ element, index }">
          <div
            class="w-full flex items-center justify-between rounded-xl flex-grow p-3 border-[#E1E6EB] border-2 border-b-4 bg-white gap-3">
            <SofaIcon :name="Logic.Study.getShape(index)"
              :custom-class="Logic.Study.getShapeSize(Logic.Study.getShape(index))" />
            <SofaHeaderText class="md:!text-lg mdlg:!text-xl text-xs w-full text-left justify-start flex line-clamp-1"
              :content="element" />
          </div>
        </template>
      </Draggable>
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
    type: Function as PropType<(val: boolean | string, index?: number) => 'selected' | 'correct' | 'wrong' | null>,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const question = computed(() => Logic.Study.transformQuestion(props.questionData))

const answer = reactive({
  value: props.modelValue,
  dragOptions: question.value.dragAnswers.filter((x) => !props.modelValue.includes(x)),
  drag: Array.from({ length: question.value.dragAnswers.length }, (_, idx) => props.modelValue[idx] ? [props.modelValue[idx]] : []),
})

watch(answer, () => {
  if (question.value.type === 'dragAnswers') emits('update:modelValue', answer.drag.flat(1))
  else emits('update:modelValue', answer.value)
})

const move = (e: { from: HTMLElement, to: HTMLElement, draggedContext: { element: string } }) => {
  const optionsId = 'drag-options'
  const answersId = 'drag-answer-'
  if (e.to.id === optionsId) return true
  const toId = Number(e.to.id.split(answersId)[1])
  if (answer.drag[toId].length) return false
}
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
