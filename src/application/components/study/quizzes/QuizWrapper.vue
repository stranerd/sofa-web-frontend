<template>
	<slot v-if="quiz && !started" name="prestart" :quiz="quiz" :extras="extras" :questions="questions" />
	<slot v-else-if="fetched && quiz" :quiz="quiz" :questions="questions" :extras="extras" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCountdown } from '@app/composables/core/time'
import { useQuiz } from '@app/composables/study/quizzes'
import { CoursableAccess, QuestionEntity, QuestionTypes } from '@modules/study'

const props = withDefaults(
	defineProps<{
		id: string
		questions?: QuestionEntity[]
		showAnswer?: boolean
		isAnswerRight?: boolean
		useTimer?: boolean
		submit?: (data: { questionId: string; answer: any }, isLast: boolean) => Promise<boolean | undefined>
		access?: CoursableAccess['access']
	}>(),
	{
		questions: undefined,
		showAnswer: false,
		isAnswerRight: false,
		useTimer: false,
		submit: undefined,
		access: undefined,
	},
)

const { id: authId } = useAuth()
const { quiz, questions: backup, fetched } = useQuiz(props.id, { questions: !!props.questions, members: true }, props.access)
const reorderedQuestions = ref<QuestionEntity[] | null>(null)
const questions = computed(() => reorderedQuestions.value ?? props.questions ?? backup.value ?? [])

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
	if (props.useTimer) runCountdown({ time: currentQuestionByIndex.value?.timeLimit }).then(() => submitAnswer())
}

const submitAnswer = async (skipNext = false) => {
	if (!currentQuestionByIndex.value) return
	const isLast = !extras.value.canNext
	const res = await props.submit?.(
		{
			questionId: currentQuestionByIndex.value.id,
			answer: answer.value ?? null,
		},
		isLast,
	)
	if (!res || skipNext) return
	if (!isLast) await nextQ(index.value + 1)
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
		const duration = currentQuestionByIndex.value?.timeLimit ?? 0
		if (duration === 0) return 0
		return runTime.value / duration
	},
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
	isMine: quiz.value?.user.id === authId.value,
	canEdit: quiz.value?.access.members.concat(quiz.value.user.id).includes(authId.value),
}))

watch(
	quiz,
	async () => {
		const q = quiz.value
		if (!q) return
		if (started.value) return
		const justStarted = startAt.value === -1
		if (props.useTimer && justStarted) await startCountdown({ time: 3 })
		started.value = true
		nextQ(justStarted ? 0 : startAt.value)
	},
	{ immediate: true },
)
</script>
