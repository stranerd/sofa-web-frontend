<template>
	<slot v-if="quiz && !started" name="prestart" :quiz="quiz" :extras="extras" :questions="quizQuestions" />
	<slot v-else-if="fetched && quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
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
		startAt?: string
	}>(),
	{
		questions: undefined,
		showAnswer: false,
		isAnswerRight: false,
		useTimer: false,
		submit: undefined,
		access: undefined,
		startAt: undefined,
	},
)

const { id: authId } = useAuth()
const { quiz, questions, fetched } = useQuiz(props.id, { questions: !!props.questions, members: true }, props.access)
const reorderedQuestions = ref<QuestionEntity[] | null>(null)
const quizQuestions = computed(() => reorderedQuestions.value ?? props.questions ?? questions.value ?? [])

const started = ref(!props.useTimer)
const { time: startTime, countdown: startCountdown } = useCountdown()
const { time: runTime, countdown: runCountdown } = useCountdown()
const startAtQuestionIndex = quizQuestions.value.findIndex((q) => q.id === props.startAt)
const index = ref(startAtQuestionIndex > -1 ? startAtQuestionIndex : 0)
const answers = reactive<Record<string, any>>({})
const currentQuestionByIndex = computed(() => quizQuestions.value.at(index.value))
const answer = computed({
	get: () => (currentQuestionByIndex.value ? answers[currentQuestionByIndex.value.id] ?? currentQuestionByIndex.value.defaultAnswer : []),
	set: (val) => {
		answers[currentQuestionByIndex.value?.id ?? ''] = val
	},
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
	if (!reorderedQuestions.value) reorderedQuestions.value = [...quizQuestions.value]
	reorderedQuestions.value = reorderedQuestions.value.concat(reorderedQuestions.value.splice(index.value, 1))
}

const nextQ = async (newIndex: number) => {
	index.value = newIndex
	if (props.useTimer) runCountdown({ time: currentQuestionByIndex.value?.timeLimit }).then(submitAnswer)
}

const submitAnswer = async () => {
	if (!currentQuestionByIndex.value) return
	const isLast = !extras.value.canNext
	const res = await props.submit?.(
		{
			questionId: currentQuestionByIndex.value.id,
			answer: answer.value ?? false,
		},
		isLast,
	)
	if (!res) return
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
	canNext: index.value < quizQuestions.value.length - 1,
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
		if (!started.value)
			startCountdown({ time: 3 }).then(() => {
				started.value = true
				nextQ(0)
			})
	},
	{ immediate: true },
)
</script>
