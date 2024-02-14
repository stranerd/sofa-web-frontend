<template>
	<slot v-if="quiz && !started" name="prestart" :quiz="quiz" :extras="extras" :questions="quizQuestions" :members="members" />
	<slot v-else-if="fetched && quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" :members="members" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCountdown } from '@app/composables/core/time'
import { useQuiz } from '@app/composables/study/quizzes'
import { CoursableAccess, QuestionEntity, QuestionTypes } from '@modules/study'
import { UserEntity, UsersUseCases } from '@modules/users'

const props = withDefaults(
	defineProps<{
		id: string
		selectedQuestion?: string
		questions?: QuestionEntity[]
		showAnswer?: boolean
		isAnswerRight?: boolean
		useTimer?: boolean
		submit?: (data?: { questionId: string; answer: any }) => Promise<boolean | undefined>
		skipMembers?: boolean
		skipCreateView?: boolean
		access?: CoursableAccess['access']
	}>(),
	{
		selectedQuestion: '',
		questions: undefined,
		showAnswer: false,
		isAnswerRight: false,
		useTimer: false,
		submit: undefined,
		skipMembers: true,
		access: undefined,
	},
)

const router = useRouter()
const route = useRoute()
const { id: authId, user } = useAuth()
const {
	quiz,
	questions,
	fetched,
	quizFactory,
	questionFactory,
	deleteQuiz,
	saveQuestion,
	updateQuiz: update,
	publishQuiz,
	reorderQuestions,
	deleteQuestion,
	addQuestion,
	duplicateQuestion,
	members,
	requestAccess,
	grantAccess,
	manageMembers,
} = useQuiz(props.id, { questions: !!props.questions, members: props.skipMembers, createView: props.skipCreateView }, props.access)
const reorderedQuestions = ref<QuestionEntity[] | null>(null)
const quizQuestions = computed(() => reorderedQuestions.value ?? props.questions ?? questions.value ?? [])

const started = ref(!props.useTimer)
const { time: startTime, countdown: startCountdown } = useCountdown()
const { time: runTime, countdown: runCountdown } = useCountdown()
const index = ref(0)
const selectedQuestionId = ref(props.selectedQuestion)
const answers = reactive<Record<string, any>>({})
const currentQuestionByIndex = computed(() => quizQuestions.value.at(index.value))
const currentQuestionById = computed(() => quizQuestions.value.find((q) => q.id === selectedQuestionId.value))
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
	const res = await props.submit?.({
		questionId: currentQuestionByIndex.value.id,
		answer: answer.value ?? false,
	})
	if (!res) return
	if (extras.value.canNext) await nextQ(index.value + 1)
	else await props.submit?.()
}

const saveCurrentQuestion = async () => {
	if (!currentQuestionById.value || !questionFactory.valid) return
	await saveQuestion(currentQuestionById.value.id, questionFactory)
}

const updateQuiz = async () => {
	if (!quizFactory.valid) return
	return await update(quizFactory)
}

const extras = computed(() => ({
	get index() {
		return index.value
	},
	set index(v) {
		index.value = v
	},
	get selectedQuestionId() {
		return selectedQuestionId.value
	},
	set selectedQuestionId(v) {
		selectedQuestionId.value = v
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
	get usersByQuestions() {
		const allMembers = quiz.value?.access.members.concat(quiz.value.user.id) ?? []
		const online = members.value.filter((u) => u.id !== authId.value && u.status.connections.length > 0 && allMembers.includes(u.id))
		return quizQuestions.value.reduce(
			(acc, cur) => {
				acc[cur.id] = online.filter((m) => m.account.editing.quizzes?.questionId === cur.id)
				return acc
			},
			{} as Record<string, UserEntity[]>,
		)
	},
	currentQuestionById: currentQuestionById.value,
	started: started.value,
	startCountdown: startTime.value,
	question: currentQuestionByIndex.value,
	questionFactory,
	quizFactory,
	sortedQuestions: quiz.value?.questions.map((qId) => quizQuestions.value.find((q) => q.id === qId)).filter(Boolean) ?? [],
	reorderQuestions,
	deleteQuestion,
	addQuestion,
	duplicateQuestion,
	deleteQuiz,
	optionState,
	submitAnswer,
	moveCurrrentQuestionToEnd,
	saveCurrentQuestion,
	updateQuiz,
	publishQuiz,
	requestAccess,
	grantAccess,
	manageMembers,
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
		quizFactory.loadEntity(q)
		if (!started.value)
			startCountdown({ time: 3 }).then(() => {
				started.value = true
				nextQ(0)
			})
	},
	{ immediate: true },
)

watch(
	[currentQuestionById, quizQuestions],
	() => {
		const question = currentQuestionById.value
		if (question) questionFactory.loadEntity(question)
		else if (quizQuestions.value.length > 0) extras.value.selectedQuestionId = quizQuestions.value[0].id
	},
	{ immediate: true },
)

watch(
	[currentQuestionById, quizQuestions, quiz],
	() => {
		if (!extras.value.canEdit || !currentQuestionById.value) return
		const quizPath = `/quizzes/${props.id}/edit`
		if (route.path !== quizPath) return
		const v = selectedQuestionId.value
		router.push(`${quizPath}?q=${v}`).catch()
		const edit = user.value?.account.editing.quizzes
		if (edit?.id !== props.id || edit?.questionId !== v) UsersUseCases.updateEditingQuizzes({ id: props.id, questionId: v }).catch()
	},
	{ immediate: true },
)
</script>
