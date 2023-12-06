<template>
  <div class="w-full flex flex-col h-full overflow-y-auto gap-4 text-bodyBlack placeholder:text-grayColor text-left">
    <div class="w-full flex items-center flex-wrap gap-1 md:gap-2" v-if="factory.isFillInBlanks">
      <span v-for="(item, index) in factory.fillInBlanksAnswers" :key="index" class="flex items-center gap-1">
        <SofaCustomInput :trim="false"
          class="bg-transparent focus:outline-none w-auto p-2"
          :class="item.type === 'q' ? 'questionText' : 'border-2 answerText border-[#E1E6EB] rounded-lg'"
          :placeholder="item.type === 'q' ? 'Text here' : 'Answer here'" v-model="factory.fillInBlanksAnswers[index].value" />
        <SofaIcon class="h-[14px] cursor-pointer" name="circle-close" @click="factory.fillInBlanksAnswers.splice(index, 1)" />
      </span>

      <SofaButton @click="factory.fillInBlanksAnswers.push({ type: 'q', value: '' })">Add text</SofaButton>
      <SofaButton @click="factory.fillInBlanksAnswers.push({ type: 'a', value: '' })">Add answer</SofaButton>
    </div>

    <div class="w-full flex items-center flex-wrap gap-1 md:gap-2" v-else-if="factory.isDragAnswers">
      <span v-for="(item, index) in factory.dragAnswersAnswers" :key="index" class="flex items-center gap-1">
        <SofaCustomInput :trim="false"
          class="bg-transparent focus:outline-none w-auto p-2"
          :class="item.type === 'q' ? 'questionText' : 'border-2 answerText border-[#E1E6EB] rounded-lg'"
          :placeholder="item.type === 'q' ? 'Text here' : 'Answer here'" v-model="factory.dragAnswersAnswers[index].value" />
        <SofaIcon class="h-[14px] cursor-pointer" name="circle-close" @click="factory.dragAnswersAnswers.splice(index, 1)" />
      </span>

      <SofaButton @click="factory.dragAnswersAnswers.push({ type: 'q', value: '' })">Add text</SofaButton>
      <SofaButton @click="factory.dragAnswersAnswers.push({ type: 'a', value: '' })">Add answer</SofaButton>
    </div>

    <div v-else class="w-full flex items-start p-3 rounded-custom bg-[#F1F6FA] gap-3">
        <SofaIcon name="question-input" class="h-[23px] w-[24px] hidden md:inline" />
        <SofaTextarea textAreaStyle="bg-transparent h-[130px] w-full resize-none" :placeholder="factory.questionPlaceholder"
          :richEditor="true" v-model="factory.question" />
      </div>

    <div class="w-full hidden md:flex items-center justify-center gap-3 bg-primaryPurple text-white rounded-custom p-5">
      <SofaNormalText color="text-inherit" content="Choose image to add to this question (optional)" />
      <SofaFileAttachment :isWrapper="true" accept="image/*" class="!w-auto" v-model:localFileUrl="localFileUrl"
        v-model="factory.questionMedia">
        <template v-slot:content>
          <SofaButton bgColor="bg-white" textColor="text-bodyBlack">Add Image</SofaButton>
        </template>
      </SofaFileAttachment>
    </div>

    <div class="w-full flex md:hidden flex-col">
      <SofaFileAttachment :isWrapper="true" accept="image/*" class="!w-full flex flex-col"
        v-model:local-file-url="localFileUrl" v-model="factory.questionMedia">
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

    <div v-if="!factory.isFillInBlanks && !factory.isDragAnswers" class="flex flex-col gap-4">
      <template v-if="factory.isMultipleChoice">
        <div v-for="(_, index) in factory.multipleOptions" :key="index"
          class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
          <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
            class="hidden md:inline" />
          <SofaTextarea :rows="1" :richEditor="true"
            class="flex-1" textAreaStyle="p-0" :placeholder="`Enter answer ${index + 1}`"
            v-model="factory.multipleOptions[index]" />
          <SofaIcon name="remove" class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline" v-if="factory.canRemoveOption"
            @click="factory.removeOption(index)" />
          <SofaIcon @click="factory.toggleMultipleChoicAnswer(index)"
            :name="factory.multipleAnswers.includes(index) ? 'selected' : 'not-selected'"
            class="w-[23px] cursor-pointer" />
        </div>
      </template>
      <template v-if="factory.isTrueOrFalse">
        <div v-for="(option, index) in [true, false]" :key="index"
          class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
          <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
            class="hidden md:inline" />
          <SofaNormalText color="text-inherit" class="flex-1 capitalize" :content="option.toString()" />
          <SofaIcon @click="factory.trueOrFalseAnswer = option"
            :name="factory.trueOrFalseAnswer === option ? 'selected' : 'not-selected'" class="w-[23px] cursor-pointer" />
        </div>
      </template>
      <template v-if="factory.isWriteAnswer">
        <div v-for="(_, index) in factory.writeAnswerAnswers" :key="index"
          class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
          <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
            class="hidden md:inline" />
          <SofaTextarea :rows="1" :richEditor="true"
            class="flex-1" textAreaStyle="p-0" :placeholder="index === 0 ? 'Enter answer' : `Add optional answer ${index}`"
            v-model="factory.writeAnswerAnswers[index]" />
          <SofaIcon name="remove" class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline" v-if="factory.canRemoveOption"
            @click="factory.removeOption(index)" />
        </div>
      </template>
      <template v-if="factory.isMatch">
        <div v-for="(_, index) in factory.matchSet" :key="index" class="flex items-center gap-4 group">
          <div
            class="flex-1 flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
            <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
              class="hidden md:inline" />
            <SofaTextarea :rows="1" :richEditor="true"
              class="flex-1" textAreaStyle="p-0" :placeholder="`Enter word/sentence ${index + 1}`"
              v-model="factory.matchSet[index].q" />
          </div>
          <div
            class="flex-1 flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
            <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
              class="hidden md:inline" />
            <SofaTextarea :rows="1" :richEditor="true"
              class="flex-1" textAreaStyle="p-0" placeholder="Enter answer"
              v-model="factory.matchSet[index].a" />
          </div>
          <SofaIcon name="remove" class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline" v-if="factory.canRemoveOption"
            @click="factory.removeOption(index)" />
        </div>
      </template>
      <Draggable v-if="factory.isSequence" :list="factory.sequenceAnswers" class="w-full flex flex-col gap-4" itemKey="">
        <template #item="{ index }">
          <div class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-lightBorderColor bg-white gap-3">
            <SofaIcon :name="Logic.Study.getShape(index)" :class="Logic.Study.getShapeSize(Logic.Study.getShape(index))"
              class="hidden md:inline" />
            <SofaTextarea :rows="1" :richEditor="true"
              class="flex-1" textAreaStyle="p-0" :placeholder="`Enter word/sentence ${index + 1}`"
              v-model="factory.sequenceAnswers[index]" />
            <SofaIcon name="remove" class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline" v-if="factory.canRemoveOption"
              @click="factory.removeOption(index)" />
          </div>
        </template>
      </Draggable>
    </div>

    <a class="self-end flex justify-end gap-2 items-center" v-if="factory.canAddOption" @click="factory.addOption">
      <SofaIcon name="box-plus" class="h-[24px]" />
      <SofaNormalText color="text-inherit" content="Add option" />
    </a>

    <div class="w-full flex flex-col border-t border-[#F1F6FA] pt-4">
      <div class="w-full flex items-start p-3 rounded-custom bg-[#F1F6FA] gap-3">
        <SofaIcon name="question-input" class="h-[23px] w-[24px] hidden md:inline" />
        <SofaTextarea textAreaStyle="bg-transparent h-[130px] w-full !p-0 resize-none" placeholder="Explanation"
          :richEditor="true" v-model="factory.explanation" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Logic, QuestionFactory } from "sofa-logic"
import { PropType, defineProps, ref, toRef, watch } from "vue"
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

const factoryWatcher = toRef(props, 'factory')

watch(factoryWatcher, () => {
  localFileUrl.value = factoryWatcher.value.questionMedia?.link ?? ''
})

</script>
