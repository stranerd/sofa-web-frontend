<template>
	<slot v-if="!started" name="prestart" :extras="extras" :questions="questions" />
	<slot v-else :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { divideByZero } from 'valleyed'
import { computed, onMounted, ref } from 'vue'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { useCountdown } from '@app/composables/core/time'
import { QuestionEntity, QuestionTypes } from '@modules/study'
import { PlayTiming } from '@modules/plays/domain/types'

const props = withDefaults(
	defineProps<{
		questions: QuestionEntity[]
		showAnswer?: boolean
		isAnswerRight?: boolean
		useTimer?: boolean
		timing?: PlayTiming
		totalTime?: number
		start?: () => Promise<number | null>
		submit?: (data: { questionId: string; answer: any }, isLast: boolean) => Promise<boolean | undefined>
	}>(),
	{
		showAnswer: false,
		isAnswerRight: false,
		useTimer: false,
		totalTime: undefined,
		timing: PlayTiming.perQuestion,
		submit: undefined,
		access: undefined,
		start: undefined,
	},
)

const reorderedQuestions = ref<QuestionEntity[] | null>(null)
const questions = computed(() => reorderedQuestions.value ?? props.questions)

const started = ref(false)
const { time: startTime, countdown: startCountdown } = useCountdown()
const { time: runTime, countdown: runCountdown } = useCountdown()
const index = ref(0)
const answers = defineModel<Record<string, any>>('answers', { default: {} })
const currentQuestionByIndex = computed(() => questions.value.at(index.value))
const answer = computed({
	get: () =>
		currentQuestionByIndex.value ? answers.value[currentQuestionByIndex.value.id] ?? currentQuestionByIndex.value.defaultAnswer : [],
	set: (val) => {
		answers.value[currentQuestionByIndex.value?.id ?? ''] = val
		// for deep reactive, seems models are not deeply reactive
		answers.value = { ...answers.value }
	},
})
const startAt = computed(() => {
	const allAnswers = answers.value
	if (questions.value.length === Object.keys(allAnswers).length) return questions.value.length - 1
	return questions.value.findIndex((q) => !(q.id in allAnswers))
})

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	const question = currentQuestionByIndex.value
	if (!question) return null
	if (props.showAnswer && question.data) {
		if (question.data.type === QuestionTypes.multipleChoice) {
			if (question.data.answers.includes(index ?? -1)) return 'right'
			if (answer.value.includes(index)) return 'wrong'
		}
		if (question.data.type === QuestionTypes.trueOrFalse) {
			if (question.data.answer === val) return 'right'
			if (answer.value === val) return 'wrong'
		}
		if (question.data.type === QuestionTypes.writeAnswer) return props.isAnswerRight ? 'right' : 'wrong'
		if (
			question.data.type === QuestionTypes.dragAnswers ||
			question.data.type === QuestionTypes.fillInBlanks ||
			question.data.type === QuestionTypes.sequence
		) {
			if (props.isAnswerRight) return 'right'
			return question.data.answers[index ?? -1] === val ? 'right' : 'wrong'
		}
		if (question.data.type === QuestionTypes.match) {
			if (props.isAnswerRight) return 'right'
			return question.data.set[index ?? -1]?.a === val ? 'right' : 'wrong'
		}
	}
	if (question.strippedData.type === QuestionTypes.trueOrFalse && answer.value === val) return 'selected'
	if (question.strippedData.type === QuestionTypes.multipleChoice && answer.value.includes(index)) return 'selected'
	return null
}

const moveCurrrentQuestionToEnd = () => {
	if (!reorderedQuestions.value) reorderedQuestions.value = [...questions.value]
	reorderedQuestions.value = reorderedQuestions.value.concat(reorderedQuestions.value.splice(index.value, 1))
}

const nextQ = async (newIndex: number) => {
	index.value = newIndex
	if (extras.value.usesSingleQuestionTimer && currentQuestionByIndex.value)
		runCountdown({ time: currentQuestionByIndex.value.timeLimit }).then(() => submitAnswer('right'))
}

const submitAnswer = async (dir: 'left' | 'right', skipChange = false) => {
	if (!currentQuestionByIndex.value) return
	const isLast = !extras.value.canNext
	const res = await props.submit?.(
		{
			questionId: currentQuestionByIndex.value.id,
			answer: answer.value ?? null,
		},
		isLast && dir === 'right',
	)
	if (!res || skipChange) return
	if (!isLast && dir === 'right') await nextQ(index.value + 1)
	if (extras.value.canPrev && dir === 'left') await nextQ(index.value - 1)
}

const extras = computed(() => ({
	get index() {
		return index.value
	},
	set index(v) {
		index.value = v
	},
	get answer() {
		return answer.value
	},
	set answer(v) {
		answer.value = v
	},
	get fractionTimeLeft() {
		if (this.usesSingleQuestionTimer) return divideByZero(runTime.value, currentQuestionByIndex.value?.timeLimit ?? 0)
		if (this.usesGeneralTimer) return divideByZero(runTime.value, props.totalTime ?? 0)
		return 0
	},
	usesGeneralTimer: props.useTimer && props.timing === PlayTiming.general,
	usesSingleQuestionTimer: props.useTimer && props.timing === PlayTiming.perQuestion,
	started: started.value,
	startCountdown: startTime.value,
	question: currentQuestionByIndex.value,
	optionState,
	submitAnswer,
	moveCurrrentQuestionToEnd,
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
</script>
