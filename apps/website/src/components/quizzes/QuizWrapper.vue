<template>
	<slot v-if="quiz && !started" name="prestart" :quiz="quiz" :extras="extras" :questions="quizQuestions" :members="members" />
	<slot v-else-if="fetched && quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" :members="members" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useCountdown } from '@/composables/core/time'
import { useQuiz } from '@/composables/study/quizzes'
import { Logic, Question, QuestionFactory, QuizFactory, SingleUser } from 'sofa-logic'
import { PropType, computed, defineProps, reactive, ref, watch } from 'vue'
import QuestionDisplay from './QuestionDisplay.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	selectedQuestion: {
		type: String,
		required: false,
		default: ''
	},
	questions: {
		type: Array as PropType<Question[]>,
		required: false,
	},
	showAnswer: {
		type: Boolean,
		required: false,
		default: false
	},
	isAnswerRight: {
		type: Boolean,
		required: false,
		default: false
	},
	useTimer: {
		type: Boolean,
		required: false,
		default: false
	},
	submit: {
		type: Function as PropType<(data?: { questionId: string, answer: any }) => Promise<boolean>>,
		required: false
	},
	skipMembers: {
		type: Boolean,
		required: false,
		default: true
	}
})

const router = useRouter()
const route = useRoute()
const { id, user } = useAuth()
const {
	quiz, questions, fetched, deleteQuiz, saveQuestion, updateQuiz: update, publishQuiz,
	reorderQuestions, deleteQuestion, addQuestion, duplicateQuestion, members,
	requestAccess, grantAccess, manageMembers
} = useQuiz(props.id, { questions: !!props.questions, members: props.skipMembers })
const reorderedQuestions = ref<Question[] | null>(null)
const quizQuestions = computed(() => (reorderedQuestions.value ?? props.questions ?? questions.value ?? []).map(Logic.Study.transformQuestion))

const started = ref(!props.useTimer)
const { time: startTime, countdown: startCountdown } = useCountdown()
const { time: runTime, countdown: runCountdown } = useCountdown()
const index = ref(0)
const selectedQuestionId = ref(props.selectedQuestion)
const answers = reactive<Record<string, any>>({})
const currentQuestionByIndex = computed(() => quizQuestions.value.at(index.value))
const currentQuestionById = computed(() => quizQuestions.value.find((q) => q.id === selectedQuestionId.value))
const answer = computed({
	get: () => currentQuestionByIndex.value ? answers[currentQuestionByIndex.value.id] ?? currentQuestionByIndex.value.defaultAnswer : [],
	set: (val) => {
		answers[currentQuestionByIndex.value?.id] = val
	}
})
const quizFactory = new QuizFactory()
const questionFactory = new QuestionFactory()

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	const question = currentQuestionByIndex.value
	if (!question) return null
	if (props.showAnswer && question.data) {
		if (question.strippedData.type === 'multipleChoice') {
			if (question.data.answers.includes(index)) return 'right'
			if (answer.value.includes(index)) return 'wrong'
		}
		if (question.strippedData.type === 'trueOrFalse') {
			if (question.data.answer === val) return 'right'
			if (answer.value === val) return 'wrong'
		}
		if (question.data.type === 'writeAnswer') return props.isAnswerRight ? 'right' : 'wrong'
		if (['fillInBlanks', 'dragAnswers', 'sequence'].includes(question.data.type)) {
			if (props.isAnswerRight) return 'right'
			return question.data.answers[index] === val ? 'right' : 'wrong'
		}
		if (question.data.type === 'match') {
			if (props.isAnswerRight) return 'right'
			return question.data.set[index]?.a === val ? 'right' : 'wrong'
		}
	}
	if (question.strippedData.type === 'trueOrFalse' && answer.value === val) return 'selected'
	if (question.strippedData.type === 'multipleChoice' && answer.value.includes(index)) return 'selected'
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
	const res = await props.submit?.({
		questionId: currentQuestionByIndex.value.id,
		answer: answer.value
	})
	if (!res) return
	if (extras.value.canNext) await nextQ(index.value + 1)
	else await props.submit?.()
}

const saveCurrentQuestion = async () => {
	if (!currentQuestionById.value || !questionFactory.valid) return
	await saveQuestion(currentQuestionById.value.id, await questionFactory.toModel())
}

const updateQuiz = async () => {
	if (!quizFactory.valid) return
	return await update(await quizFactory.toModel())
}

const extras = computed(() => ({
	get index () {
		return index.value
	},
	set index (v) {
		index.value = v
	},
	get selectedQuestionId () {
		return selectedQuestionId.value
	},
	set selectedQuestionId (v) {
		selectedQuestionId.value = v
	},
	get answer () {
		return answer.value
	},
	set answer (v) {
		answer.value = v
	},
	get fractionTimeLeft () {
		const duration = currentQuestionByIndex.value?.timeLimit ?? 0
		if (duration === 0) return 0
		return runTime.value / duration
	},
	get usersByQuestions () {
		const allMembers = quiz.value?.access.members.concat(quiz.value.user.id) ?? []
		const online = members.value.filter((u) => u.id !== id.value && u.status.connections.length > 0 && allMembers.includes(u.id))
		return quizQuestions.value.reduce((acc, cur) => {
			acc[cur.id] = online.filter((m) => m.account.editing.quizzes?.questionId === cur.id)
			return acc
		}, {} as Record<string, SingleUser[]>)
	},
	currentQuestionById: currentQuestionById.value,
	started: started.value,
	startCountdown: startTime.value,
	question: currentQuestionByIndex.value,
	questionFactory, quizFactory,
	sortedQuestions: quiz.value?.questions.map((qId) => quizQuestions.value.find((q) => q.id === qId)).filter(Boolean) ?? [],
	reorderQuestions, deleteQuestion, addQuestion, duplicateQuestion, deleteQuiz,
	optionState, submitAnswer, moveCurrrentQuestionToEnd, saveCurrentQuestion,
	updateQuiz, publishQuiz, requestAccess, grantAccess, manageMembers,
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
	isMine: quiz.value?.user.id === id.value,
	canEdit: quiz.value?.access.members.concat(quiz.value.user.id).includes(id.value),
}))

watch(quiz, async () => {
	const q = quiz.value
	if (!q) return
	quizFactory.loadEntity(q)
	if (!started.value) startCountdown({ time: 3 })
		.then(() => {
			started.value = true
			nextQ(0)
		})
}, { immediate: true })

watch([currentQuestionById, quizQuestions], () => {
	const question = currentQuestionById.value
	if (question) questionFactory.loadEntity(question)
	else if (quizQuestions.value.length > 0) extras.value.selectedQuestionId = quizQuestions.value[0].id
}, { immediate: true })

watch([currentQuestionById, quizQuestions, quiz], () => {
	if (!extras.value.canEdit || !currentQuestionById.value) return
	const quizPath = `/quiz/${props.id}/edit`
	if (route.path !== quizPath) return
	const v = selectedQuestionId.value
	router.push(`${quizPath}?q=${v}`).catch()
	const edit = user.value?.account.editing.quizzes
	if (edit?.id !== props.id || edit?.questionId !== v) Logic.Users.updateUserEditingQuizzes({ id: props.id, questionId: v }).catch()
}, { immediate: true })
</script>