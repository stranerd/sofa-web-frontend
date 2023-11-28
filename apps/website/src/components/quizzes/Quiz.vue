<template>
	<slot name="header">
		<div class="p-4 md:py-8 w-full flex justify-center" :class="{ 'md:bg-white': !isDark }"
			style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-between">
				<SofaIcon class="md:hidden" :customClass="'h-[19px]'" :name="'circle-close'"
					@click="Logic.Common.goBack()" />
				<SofaHeaderText :size="'xl'" customClass="!font-bold !text-sm truncate" color="text-inherit"
					:content="title" />
				<SofaNormalText class="md:hidden whitespace-nowrap" :content="`${questionIndex + 1}/${questions.length}`"
					color="text-inherit" />
				<SofaNormalText class="hidden md:inline" :customClass="'!text-base cursor-pointer whitespace-nowrap'"
					color="text-inherit" content="Exit" @click="Logic.Common.goBack()" />
			</div>
		</div>
	</slot>

	<slot>
		<div
			class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex-grow h-full overflow-y-auto flex flex-col gap-2 items-center justify-center px-6">
			<QuestionDisplay v-if="currentQuestion" :key="questionIndex" v-model="answer" :questionData="currentQuestion"
				:title="title" :optionState="optionState" />

			<div class="w-full flex flex-col gap-2 items-start justify-start" v-if="answerState == 'wrong'">
				<SofaHeaderText :size="'xl'" content="Correct answer" color="text-inherit" />
				<SofaNormalText :content="answer" color="text-inherit" />
			</div>
		</div>
	</slot>

	<slot name="footer">
		<div v-if="leftButton || rightButton" class="px-4 py-2 w-full flex justify-center"
			:class="{ 'md:bg-white': !isDark }" style="box-shadow: 0px -4px 4px rgba(8, 0, 24, 0.05)">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-between">
				<SofaButton class="!w-full md:!w-auto" customClass="w-full md:font-semibold whitespace-nowrap"
					padding="py-3 md:px-6" v-if="leftButton" :disabled="leftButton.disabled" :bgColor="leftButton.bgColor"
					:textColor="leftButton.textColor" @click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>

				<span class="px-4 py-2 rounded-lg font-semibold hidden md:inline">
					{{ questionIndex + 1 }}/{{ questions.length }}
				</span>

				<SofaButton class="!w-full md:!w-auto" customClass="w-full md:font-semibold whitespace-nowrap"
					padding="py-3 md:px-6" v-if="rightButton" :disabled="rightButton.disabled"
					:bgColor="rightButton.bgColor" :textColor="rightButton.textColor" @click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
		</div>
	</slot>
</template>

<script lang="ts" setup>
import QuestionDisplay from '@/components/quizzes/QuestionDisplay.vue'
import { Logic, Question } from 'sofa-logic'
import { SofaButton, SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps, reactive, ref } from 'vue'

type ButtonConfig = {
	label: string,
	bgColor: string,
	textColor: string,
	disabled?: boolean,
	click: () => void
}

const props = defineProps({
	index: {
		type: Number,
		required: true
	},
	questions: {
		type: Array as PropType<Question[]>,
		required: true
	},
	isDark: {
		type: Boolean,
		required: false,
		default: false
	},
	title: {
		type: String,
		required: true
	},
	rightButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
	},
	leftButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
	}
})

const emits = defineEmits(['update:index'])

const questionIndex = computed({
	get: () => props.index,
	set: (val) => {
		emits('update:index', val)
	}
})

const answerState = ref('')
const answers = reactive<Record<string, any>>({})
const currentQuestion = computed(() => props.questions.at(questionIndex.value))
const answer = computed({
	get: () => currentQuestion.value ? answers[currentQuestion.value.id] ?? Logic.Study.transformQuestion(currentQuestion.value).defaultAnswer : [],
	set: (val) => {
		answers[currentQuestion.value?.id] = val
	}
})

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	if (currentQuestion.value.strippedData.type === 'trueOrFalse' && answer.value === val) return 'selected'
	if (currentQuestion.value.strippedData.type === 'multipleChoice' && answer.value.includes(index)) return 'selected'
	return null
}
</script>