<template>
	<div class="w-full flex flex-col h-full overflow-y-auto gap-4 text-bodyBlack text-left">
		<div v-if="factory.isFillInBlanks" class="w-full flex items-center flex-wrap gap-1 md:gap-2">
			<span v-for="(item, index) in factory.fillInBlanksAnswers" :key="index" class="flex items-center gap-1">
				<SofaCustomInput
					v-model="factory.fillInBlanksAnswers[index].value"
					:class="item.type === 'q' ? 'questionText' : 'border-2 answerText border-darkLightGray rounded-lg'"
					:placeholder="item.type === 'q' ? 'Text here' : 'Answer here'" />
				<SofaIcon class="h-[14px] cursor-pointer" name="circle-close" @click="factory.fillInBlanksAnswers.splice(index, 1)" />
			</span>

			<SofaButton @click="factory.fillInBlanksAnswers.push({ type: 'q', value: '' })">Add text</SofaButton>
			<SofaButton @click="factory.fillInBlanksAnswers.push({ type: 'a', value: '' })">Add answer</SofaButton>
		</div>

		<div v-else-if="factory.isDragAnswers" class="w-full flex items-center flex-wrap gap-1 md:gap-2">
			<span v-for="(item, index) in factory.dragAnswersAnswers" :key="index" class="flex items-center gap-1">
				<SofaCustomInput
					v-model="factory.dragAnswersAnswers[index].value"
					:class="item.type === 'q' ? 'questionText' : 'border-2 answerText border-darkLightGray rounded-lg'"
					:placeholder="item.type === 'q' ? 'Text here' : 'Answer here'" />
				<SofaIcon class="h-[14px] cursor-pointer" name="circle-close" @click="factory.dragAnswersAnswers.splice(index, 1)" />
			</span>

			<SofaButton @click="factory.dragAnswersAnswers.push({ type: 'q', value: '' })">Add text</SofaButton>
			<SofaButton @click="factory.dragAnswersAnswers.push({ type: 'a', value: '' })">Add answer</SofaButton>
		</div>

		<div v-else class="w-full flex items-start p-4 rounded-custom bg-lightGray gap-3">
			<SofaIcon name="question-input" class="h-[23px] w-[24px] hidden md:inline self-start" />
			<SofaTextarea
				v-model="factory.question"
				class="!bg-transparent h-[130px] w-full resize-none"
				:placeholder="factory.questionPlaceholder"
				:richEditor="true" />
		</div>

		<div class="w-full hidden md:flex items-center justify-center gap-3 bg-primaryPurple text-white rounded-custom p-5">
			<SofaNormalText color="text-inherit" content="Choose image to add to this question (optional)" />
			<SofaFileInput v-model="factory.questionMedia" accept="image/*" class="w-auto">
				<SofaButton bgColor="bg-white" textColor="text-bodyBlack">Add Image</SofaButton>
			</SofaFileInput>
		</div>

		<div class="w-full flex md:hidden flex-col">
			<SofaFileInput v-model="factory.questionMedia" accept="image/*" class="w-full flex flex-col">
				<SofaButton class="w-full" padding="py-3">Add image (optional)</SofaButton>
			</SofaFileInput>
		</div>

		<div v-if="factory.questionMedia" class="w-full flex flex-col items-center justify-center">
			<SofaImageLoader :photoUrl="factory.questionMedia.link" class="mdlg:w-[70%] w-full rounded-custom" />
		</div>

		<div v-if="!factory.isFillInBlanks && !factory.isDragAnswers" class="flex flex-col gap-4">
			<template v-if="factory.isMultipleChoice">
				<div
					v-for="(_, index) in factory.multipleOptions"
					:key="index"
					class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
					<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] mdlg:h-[23px] self-start" />
					<SofaTextarea
						v-model="factory.multipleOptions[index]"
						:rows="1"
						:richEditor="true"
						class="flex-1 !p-0 mdlg:!p-0 !bg-transparent"
						:placeholder="`Enter answer ${index + 1}`" />
					<SofaIcon
						v-if="factory.canRemoveOption"
						name="remove"
						class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline"
						@click="factory.removeOption(index)" />
					<SofaIcon
						:name="factory.multipleAnswers.includes(index) ? 'selected' : 'not-selected'"
						class="w-[23px] cursor-pointer"
						@click="factory.toggleMultipleChoicAnswer(index)" />
				</div>
			</template>
			<template v-if="factory.isTrueOrFalse">
				<div
					v-for="(option, index) in [true, false]"
					:key="index"
					class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
					<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] mdlg:h-[23px] self-start" />
					<SofaNormalText color="text-inherit" class="flex-1 capitalize" :content="option.toString()" />
					<SofaIcon
						:name="factory.trueOrFalseAnswer === option ? 'selected' : 'not-selected'"
						class="w-[23px] cursor-pointer"
						@click="factory.trueOrFalseAnswer = option" />
				</div>
			</template>
			<template v-if="factory.isWriteAnswer">
				<div
					v-for="(_, index) in factory.writeAnswerAnswers"
					:key="index"
					class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
					<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] mdlg:h-[23px] self-start" />
					<SofaTextarea
						v-model="factory.writeAnswerAnswers[index]"
						:rows="index === 0 ? 3 : 1"
						:richEditor="true"
						class="flex-1 !p-0 mdlg:!p-0 !bg-transparent"
						:placeholder="index === 0 ? 'Enter answer' : `Add optional answer ${index}`" />
					<SofaIcon
						v-if="factory.canRemoveOption"
						name="remove"
						class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline"
						@click="factory.removeOption(index)" />
				</div>
			</template>
			<template v-if="factory.isMatch">
				<div v-for="(_, index) in factory.matchSet" :key="index" class="flex items-center gap-4 group">
					<div class="flex-1 flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
						<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] mdlg:h-[23px] self-start" />
						<SofaTextarea
							v-model="factory.matchSet[index].q"
							:rows="1"
							:richEditor="true"
							class="flex-1 !p-0 mdlg:!p-0 !bg-transparent"
							:placeholder="`Enter word/sentence ${index + 1}`" />
					</div>
					<div class="flex-1 flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
						<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] mdlg:h-[23px] self-start" />
						<SofaTextarea
							v-model="factory.matchSet[index].a"
							:rows="1"
							:richEditor="true"
							class="flex-1 !p-0 mdlg:!p-0 !bg-transparent"
							placeholder="Enter answer" />
					</div>
					<SofaIcon
						v-if="factory.canRemoveOption"
						name="remove"
						class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline"
						@click="factory.removeOption(index)" />
				</div>
			</template>
			<VueDraggable v-if="factory.isSequence" v-model="factory.sequenceAnswers" class="w-full flex flex-col gap-4">
				<div
					v-for="(_, index) in factory.sequenceAnswers"
					:key="index"
					class="w-full group flex items-center rounded-xl px-3 py-5 border-2 border-darkLightGray bg-white gap-3">
					<SofaIcon :name="QuestionEntity.getShape(index)" class="hidden md:inline h-[20px] md:h-[23px] self-start" />
					<SofaTextarea
						v-model="factory.sequenceAnswers[index]"
						:rows="1"
						:richEditor="true"
						class="flex-1 !p-0 mdlg:!p-0 !bg-transparent"
						:placeholder="`Enter word/sentence ${index + 1}`" />
					<SofaIcon
						v-if="factory.canRemoveOption"
						name="remove"
						class="w-[23px] hidden group-hover:inline group-focus-within:inline"
						@click="factory.removeOption(index)" />
				</div>
			</VueDraggable>
		</div>

		<a v-if="factory.canAddOption" class="self-end flex justify-end gap-2 items-center" @click="factory.addOption">
			<SofaIcon name="add" class="h-[24px] fill-current" />
			<SofaNormalText color="text-inherit" content="Add option" />
		</a>

		<div class="w-full flex flex-col border-t border-lightGray pt-4">
			<div class="w-full flex items-start p-4 rounded-custom bg-lightGray gap-3">
				<SofaIcon name="question-input" class="h-[23px] w-[24px] hidden md:inline self-start" />
				<SofaTextarea
					v-model="factory.explanation"
					class="!p-0 mdlg:!p-0 !bg-transparent h-[130px] resize-none w-full"
					placeholder="Explanation"
					:richEditor="true" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import { QuestionEntity, QuestionFactory } from '@modules/study'

defineProps<{
	factory: QuestionFactory
}>()
</script>
