<template>
	<div class="w-full flex flex-col gap-4 text-bodyBlack text-left">
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

		<SofaTextarea
			v-else
			v-model="factory.question"
			class="h-[130px] mdlg:h-[180px] shrink-0 !bg-white"
			:placeholder="factory.questionPlaceholder"
			:error="factory.errors.question"
			:richEditor="true">
			<template v-if="!$screen.mobile" #prefix>
				<SofaIcon name="question-input" class="h-[23px]" />
			</template>
		</SofaTextarea>

		<div class="w-full hidden md:flex items-center justify-center gap-3 bg-primaryPurple text-white rounded-custom p-5">
			<SofaText content="Choose image to add to this question (optional)" />
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
				<SofaTextarea
					v-for="(_, index) in factory.multipleOptions"
					:key="index"
					v-model="factory.multipleOptions[index]"
					:rows="1"
					:richEditor="true"
					class="w-full !rounded-xl !bg-white group"
					:placeholder="`Enter answer ${index + 1}`">
					<template v-if="!$screen.mobile" #prefix>
						<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
					</template>
					<template #suffix>
						<SofaIcon
							v-if="factory.canRemoveOption"
							name="remove"
							class="w-[23px] hidden group-hover:inline group-focus-within:inline"
							@click="factory.removeOption(index)" />
						<SofaIcon
							:name="factory.multipleAnswers.includes(index) ? 'selected' : 'not-selected'"
							class="w-[23px]"
							@click="factory.toggleMultipleChoicAnswer(index)" />
					</template>
				</SofaTextarea>
			</template>
			<template v-if="factory.isTrueOrFalse">
				<SofaInput
					v-for="(option, index) in [true, false]"
					:key="index"
					:modelValue="capitalize(option.toString())"
					disabled
					class="!rounded-xl !bg-white">
					<template v-if="!$screen.mobile" #prefix>
						<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
					</template>
					<template #suffix>
						<SofaIcon
							:name="factory.trueOrFalseAnswer === option ? 'selected' : 'not-selected'"
							class="w-[23px]"
							@click="factory.trueOrFalseAnswer = option" />
					</template>
				</SofaInput>
			</template>
			<template v-if="factory.isWriteAnswer">
				<SofaTextarea
					v-for="(_, index) in factory.writeAnswerAnswers"
					:key="index"
					v-model="factory.writeAnswerAnswers[index]"
					:rows="index === 0 ? 3 : 1"
					:richEditor="true"
					class="!rounded-xl !bg-white"
					:placeholder="index === 0 ? 'Enter answer' : `Add optional answer ${index}`">
					<template v-if="!$screen.mobile" #prefix>
						<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
					</template>
					<template v-if="factory.canRemoveOption" #suffix>
						<SofaIcon
							name="remove"
							class="w-[23px] hidden group-hover:inline group-focus-within:inline"
							@click="factory.removeOption(index)" />
					</template>
				</SofaTextarea>
			</template>
			<template v-if="factory.isMatch">
				<div v-for="(_, index) in factory.matchSet" :key="index" class="flex items-center gap-4 group">
					<SofaTextarea
						v-model="factory.matchSet[index].q"
						:rows="1"
						:richEditor="true"
						class="!rounded-xl !bg-white"
						:placeholder="`Enter word/sentence ${index + 1}`">
						<template v-if="!$screen.mobile" #prefix>
							<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
						</template>
					</SofaTextarea>
					<SofaTextarea
						v-model="factory.matchSet[index].a"
						:rows="1"
						:richEditor="true"
						class="!bg-white !rounded-xl"
						placeholder="Enter answer">
						<template v-if="!$screen.mobile" #prefix>
							<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
						</template>
					</SofaTextarea>
					<SofaIcon
						v-if="factory.canRemoveOption"
						name="remove"
						class="w-[23px] cursor-pointer hidden group-hover:inline group-focus-within:inline"
						@click="factory.removeOption(index)" />
				</div>
			</template>
			<VueDraggable v-if="factory.isSequence" v-model="factory.sequenceAnswers" class="w-full flex flex-col gap-4">
				<SofaTextarea
					v-for="(_, index) in factory.sequenceAnswers"
					:key="index"
					v-model="factory.sequenceAnswers[index]"
					:rows="1"
					:richEditor="true"
					class="!rounded-xl !bg-white"
					:placeholder="`Enter word/sentence ${index + 1}`">
					<template v-if="!$screen.mobile" #prefix>
						<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[20px] mdlg:h-[23px]" />
					</template>
					<template v-if="factory.canRemoveOption" #suffix>
						<SofaIcon
							name="remove"
							class="w-[23px] hidden group-hover:inline group-focus-within:inline"
							@click="factory.removeOption(index)" />
					</template>
				</SofaTextarea>
			</VueDraggable>
		</div>

		<a v-if="factory.canAddOption" class="self-end flex justify-end gap-2 items-center" @click="factory.addOption">
			<SofaIcon name="add" class="h-[24px] fill-current" />
			<SofaText content="Add option" />
		</a>

		<div class="w-full flex flex-col border-t border-lightGray pt-4">
			<SofaTextarea
				v-model="factory.explanation"
				:error="factory.errors.explanation"
				class="!bg-white h-[130px]"
				placeholder="Explanation"
				:richEditor="true">
				<template v-if="!$screen.mobile" #prefix>
					<SofaIcon name="question-input" class="h-[23px]" />
				</template>
			</SofaTextarea>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { capitalize } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { QuestionEntity, QuestionFactory } from '@modules/study'

defineProps<{
	factory: QuestionFactory
}>()
</script>
