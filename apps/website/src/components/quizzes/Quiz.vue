<template>
	<template v-if="true">
		<div class="py-8 w-full md:!flex hidden items-center justify-center sticky top-0 left-0"
			:class="{ 'md:bg-white': !isDark }" style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-3 justify-between">
				<SofaHeaderText :size="'xl'" color="text-inherit">Quiz preview</SofaHeaderText>
				<SofaNormalText :customClass="'!text-base cursor-pointer'" color="text-inherit"
					@click="Logic.Common.goBack()">
					Exit
				</SofaNormalText>
			</div>
		</div>

		<div class="w-full flex md:!hidden justify-between items-center z-50 p-4 sticky top-0 left-0"
			:class="{ 'bg-backgroundGray': !isDark }">
			<SofaIcon :customClass="'h-[19px]'" :name="'circle-close'" @click="Logic.Common.goBack()" />
			<SofaNormalText :customClass="'!font-bold !text-sm !line-clamp-1'" color="text-inherit" :content="title" />
			<SofaNormalText :content="`${questionIndex + 1}/${questions.length}`" color="text-inherit" />
		</div>
	</template>

	<div class="w-full flex-grow flex flex-col items-center justify-center">
		<QuestionDisplay v-if="currentQuestion" :key="questionIndex" v-model="answer" :questionData="currentQuestion"
			:title="title" :optionState="optionState" />

		<div class="w-full flex flex-col gap-2 items-start justify-start pt-2" v-if="answerState == 'wrong'">
			<SofaHeaderText :size="'xl'" content="Correct answer" color="text-inherit" />
			<SofaNormalText :content="answer" color="text-inherit" />
		</div>
	</div>

	<template v-if="true">
		<div class="md:!py-5 py-4 w-full sticky flex items-center justify-center bottom-0 left-0" :class="{
			'bg-backgroundGray md:bg-white': !isDark,
			'md:!invisible': answerState,
			'!invisible': !leftButton && !rightButton
		}" style="box-shadow: 0px -4px 4px rgba(8, 0, 24, 0.05)">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full md:!flex hidden items-center justify-between">
				<SofaButton :customClass="'!font-semibold'" padding="py-2 px-6" v-if="leftButton"
					:disabled="leftButton.disabled" :bgColor="leftButton.bgColor" :textColor="leftButton.textColor"
					@click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>

				<span class="px-4 py-2 rounded-lg !font-semibold ">
					{{ questionIndex + 1 }}/{{ questions.length }}
				</span>

				<SofaButton :customClass="'!font-semibold'" padding="py-2 px-6" v-if="rightButton"
					:disabled="rightButton.disabled" :bgColor="rightButton.bgColor" :textColor="rightButton.textColor"
					@click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
			<div class="w-full flex gap-3 px-4 md:!hidden">
				<SofaButton class="!w-full" customClass="w-full" padding="py-3" v-if="leftButton"
					:disabled="leftButton.disabled" :bgColor="leftButton.bgColor" :textColor="leftButton.textColor"
					@click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>
				<SofaButton class="!w-full" customClass="w-full" padding="py-3" v-if="rightButton"
					:disabled="rightButton.disabled" :bgColor="rightButton.bgColor" :textColor="rightButton.textColor"
					@click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
		</div>
	</template>
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

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val: number | boolean) => {
	if (Array.isArray(answer.value) && answer.value.includes(val)) return 'selected'
	if (typeof (answer.value) === 'boolean' && answer.value === val) return 'selected'
	return null
}
</script>