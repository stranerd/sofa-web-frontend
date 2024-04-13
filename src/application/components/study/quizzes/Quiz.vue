<template>
	<div class="w-full h-full flex flex-col mdlg:gap-5" :class="{ 'gap-4': isInModal }">
		<slot name="header">
			<div
				v-if="!isInModal"
				class="p-4 md:py-8 w-full flex justify-center shadow-custom"
				:class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
				<div class="lg:w-[50%] mdlg:w-[70%] md:w-[80%] w-full flex items-center gap-4 justify-between">
					<SofaIcon class="md:hidden" customClass="h-[19px]" name="circle-close" @click="Logic.Common.goBack()" />
					<SofaHeaderText size="xl" customClass="!font-bold !text-sm truncate" color="text-inherit" :content="title" />
					<SofaNormalText
						class="md:hidden whitespace-nowrap"
						:content="`${index + 1}/${questions.length}`"
						color="text-inherit" />
					<SofaNormalText
						as="a"
						class="hidden md:inline"
						customClass="!text-base whitespace-nowrap"
						color="text-inherit"
						content="Exit"
						@click="Logic.Common.goBack()" />
				</div>
			</div>
			<div v-else />
		</slot>

		<div class="w-full h-full grow overflow-y-auto px-4 flex flex-col items-center" :class="{ 'text-white': isDark }">
			<div
				class="w-full flex flex-col gap-8 my-auto"
				:class="{ 'lg:w-[50%] mdlg:w-[70%] md:w-[80%]': !isInModal, 'flex-1': growMid }">
				<slot>
					<QuestionDisplay
						v-if="question"
						:key="question.id"
						v-model="answer"
						:question="question"
						:isDark="isDark"
						:title="title"
						:optionState="optionState" />
					<slot name="postBody" />
				</slot>
			</div>
		</div>

		<slot name="footer">
			<div
				v-if="leftButton || rightButton"
				class="px-4 py-2 md:py-4 w-full flex justify-center"
				:class="{ 'md:bg-white': !isDark && !isInModal, 'text-white': isDark, 'shadow-customInverted': !isInModal }">
				<div class="w-full flex items-center gap-4 justify-center" :class="{ 'lg:w-[50%] mdlg:w-[70%] md:w-[80%]': !isInModal }">
					<SofaButton
						v-if="leftButton && !isInModal"
						class="w-full md:w-auto mr-auto"
						customClass="md:font-semibold"
						padding="py-3 md:px-6"
						:disabled="leftButton.disabled"
						:bgColor="leftButton.bgColor"
						:textColor="leftButton.textColor"
						@click="leftButton.click">
						{{ leftButton.label }}
					</SofaButton>
					<SofaIcon
						v-else-if="leftButton && isInModal"
						name="round-arrow-left"
						class="h-[40px]"
						:class="leftButton.disabled ? 'fill-grayColor' : 'fill-black'"
						@click="leftButton.click" />

					<span v-if="showCounter" class="px-4 py-2 rounded-lg font-semibold hidden md:inline mx-auto">
						{{ index + 1 }}/{{ questions.length }}
					</span>

					<SofaButton
						v-if="rightButton && !isInModal"
						class="w-full md:w-auto ml-auto"
						customClass="md:font-semibold"
						padding="py-3 md:px-6"
						:disabled="rightButton.disabled"
						:bgColor="rightButton.bgColor"
						:textColor="rightButton.textColor"
						@click="rightButton.click">
						{{ rightButton.label }}
					</SofaButton>
					<SofaIcon
						v-else-if="rightButton && isInModal"
						name="round-arrow-right"
						class="h-[40px]"
						:class="rightButton.disabled ? 'fill-grayColor' : 'fill-black'"
						@click="rightButton.click" />
				</div>
			</div>
		</slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { QuestionEntity, QuestionTypes } from '@modules/study'
import { Logic } from 'sofa-logic'

type ButtonConfig = {
	label: string
	bgColor: string
	textColor: string
	disabled?: boolean
	click: () => void
}

const props = withDefaults(
	defineProps<{
		index: number
		questions: QuestionEntity[]
		isDark?: boolean
		title: string
		rightButton?: ButtonConfig | null
		leftButton?: ButtonConfig | null
		showCounter?: boolean
		isInModal?: boolean
		growMid?: boolean
		showAnswer?: boolean
		isAnswerRight?: boolean
	}>(),
	{
		isDark: false,
		rightButton: null,
		leftButton: null,
		showCounter: true,
		isInModal: false,
		growMid: false,
		showAnswer: false,
		isAnswerRight: false,
	},
)

const answer = defineModel<any>('answer')

const question = computed(() => props.questions.at(props.index))

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	const q = question.value
	if (!q) return null
	if (props.showAnswer && q.data) {
		if (q.data.type === QuestionTypes.multipleChoice) {
			if (q.data.answers.includes(index ?? -1)) return 'right'
			if (answer.value.includes(index)) return 'wrong'
		}
		if (q.data.type === QuestionTypes.trueOrFalse) {
			if (q.data.answer === val) return 'right'
			if (answer.value === val) return 'wrong'
		}
		if (q.data.type === QuestionTypes.writeAnswer) return props.isAnswerRight ? 'right' : 'wrong'
		if (
			q.data.type === QuestionTypes.dragAnswers ||
			q.data.type === QuestionTypes.fillInBlanks ||
			q.data.type === QuestionTypes.sequence
		) {
			if (props.isAnswerRight) return 'right'
			return q.data.answers[index ?? -1] === val ? 'right' : 'wrong'
		}
		if (q.data.type === QuestionTypes.match) {
			if (props.isAnswerRight) return 'right'
			return q.data.set[index ?? -1]?.a === val ? 'right' : 'wrong'
		}
	}
	if (q.strippedData.type === QuestionTypes.trueOrFalse && answer.value === val) return 'selected'
	if (q.strippedData.type === QuestionTypes.multipleChoice && answer.value.includes(index)) return 'selected'
	return null
}
</script>
