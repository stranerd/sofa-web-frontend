<template>
	<slot v-if="!started" name="prestart" :extras="extras" />
	<div v-else class="w-full h-full flex flex-col mdlg:gap-5" :class="{ 'gap-4': isInModal }">
		<slot name="header" :extras="extras">
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
				<slot :extras="extras">
					<QuestionDisplay
						v-if="question"
						:key="question.id"
						v-model="answer"
						:question="question"
						:isDark="isDark"
						:title="title"
						:optionState="optionState" />
					<slot name="postBody" :extras="extras" />
				</slot>
			</div>
		</div>

		<slot name="footer" :extras="extras">
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
						@click="rightButton.click()">
						{{ rightButton.label }}
					</SofaButton>
					<SofaIcon
						v-else-if="rightButton && isInModal"
						name="round-arrow-right"
						class="h-[40px]"
						:class="rightButton.disabled ? 'fill-grayColor' : 'fill-black'"
						@click="rightButton.click()" />
				</div>
			</div>
		</slot>
	</div>
</template>

<script lang="ts" setup>
import { divideByZero } from 'valleyed'
import { computed, onMounted, ref, watch } from 'vue'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { useCountdown } from '@app/composables/core/time'
import { PlayTiming } from '@modules/plays'
import { QuestionEntity, QuestionTypes } from '@modules/study'
import { Logic } from 'sofa-logic'

type ButtonConfig = (extras: ExtraTypes) => {
	label: string
	bgColor: string
	textColor: string
	disabled?: boolean
	click: () => void
}

const props = withDefaults(
	defineProps<{
		title: string
		questions: QuestionEntity[]

		answers?: Record<string, any>
		rightButtonConfig?: ButtonConfig
		leftButtonConfig?: ButtonConfig
		isDark?: boolean
		showCounter?: boolean
		isInModal?: boolean
		growMid?: boolean
		showAnswer?: boolean
		isAnswerRight?: boolean
		useTimer?: boolean
		timing?: PlayTiming
		totalTime?: number
		start?: () => Promise<number | null>
		submit?: (data: { questionId: string; answer: any }, isLast: boolean) => Promise<boolean | undefined>
	}>(),
	{
		answers: () => ({}),
		rightButtonConfig: undefined,
		leftButtonConfig: undefined,
		isDark: false,
		showCounter: true,
		isInModal: false,
		growMid: false,
		showAnswer: false,
		isAnswerRight: false,
		useTimer: false,
		totalTime: undefined,
		timing: PlayTiming.perQuestion,
		start: undefined,
		submit: undefined,
	},
)

const index = ref(0)
const started = ref(false)
const { time: startTime, countdown: startCountdown } = useCountdown()
const { time: runTime, countdown: runCountdown } = useCountdown()

const reorderedQuestions = ref<QuestionEntity[] | null>(null)
const questions = computed(() => reorderedQuestions.value ?? props.questions)
const answers = ref<Record<string, any>>(props.answers ?? {})
const question = computed(() => questions.value.at(index.value))
const answer = computed({
	get: () => (question.value ? answers.value[question.value.id] ?? question.value.defaultAnswer : []),
	set: (val) => {
		if (question.value) answers.value[question.value.id] = val
	},
})
const startAt = computed(() => {
	const allAnswers = answers.value
	if (questions.value.length === Object.keys(allAnswers).length) return questions.value.length - 1
	return questions.value.findIndex((q) => !(q.id in allAnswers))
})

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

const nextQ = async (newIndex: number) => {
	index.value = newIndex
	if (extras.value.usesSingleQuestionTimer && question.value)
		runCountdown({ time: question.value.timeLimit }).then(() => submitAnswer('right'))
}

const submitAnswer = async (dir: 'left' | 'right', skipChange = false) => {
	if (!question.value) return
	const isLast = !extras.value.canNext
	const res = await props.submit?.(
		{
			questionId: question.value.id,
			answer: answer.value ?? null,
		},
		isLast && dir === 'right',
	)
	if (!res || skipChange) return
	if (!isLast && dir === 'right') await nextQ(index.value + 1)
	if (extras.value.canPrev && dir === 'left') await nextQ(index.value - 1)
}

const extras = computed(() => ({
	get fractionTimeLeft() {
		if (this.usesSingleQuestionTimer) return divideByZero(runTime.value, question.value?.timeLimit ?? 0)
		if (this.usesGeneralTimer) return divideByZero(runTime.value, props.totalTime ?? 0)
		return 0
	},
	index: index.value,
	answer: answer.value,
	usesGeneralTimer: props.useTimer && props.timing === PlayTiming.general,
	usesSingleQuestionTimer: props.useTimer && props.timing === PlayTiming.perQuestion,
	started: started.value,
	startCountdown: startTime.value,
	question: question.value,
	submitAnswer,
	moveCurrrentQuestionToEnd: () => {
		if (!reorderedQuestions.value) reorderedQuestions.value = [...questions.value]
		reorderedQuestions.value = reorderedQuestions.value.concat(reorderedQuestions.value.splice(index.value, 1))
	},
	next: () => {
		if (extras.value.canNext) index.value++
	},
	previous: () => {
		if (extras.value.canPrev) index.value--
	},
	canPrev: index.value > 0,
	canNext: index.value < questions.value.length - 1,
	reset: () => {
		reorderedQuestions.value = null
		index.value = 0
	},
}))

onMounted(async () => {
	if (started.value) return
	const justStarted = startAt.value === -1
	if (props.useTimer && justStarted) await startCountdown({ time: 3 })
	if (props.start) {
		const timedOutAt = await props.start()
		const endsIn = (timedOutAt ?? 0) - Date.now()
		if (extras.value.usesGeneralTimer && endsIn > 0) runCountdown({ time: endsIn / 1000 })
	}
	nextQ(justStarted ? 0 : startAt.value)
	started.value = true
})

watch(props.answers, () => {
	if (props.answers)
		answers.value = {
			...answers.value,
			...props.answers,
		}
})

type ExtraTypes = (typeof extras)['value']
const leftButton = computed(() => props.leftButtonConfig?.(extras.value))
const rightButton = computed(() => props.rightButtonConfig?.(extras.value))
</script>
