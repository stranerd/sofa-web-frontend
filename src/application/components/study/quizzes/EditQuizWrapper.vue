<template>
	<slot v-if="fetched && quiz" :quiz="quiz" :questions="questions" :extras="extras" :members="members" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useEditQuiz } from '@app/composables/study/quizzes'
import { UserEntity, UsersUseCases } from '@modules/users'

const props = withDefaults(
	defineProps<{
		id: string
		selectedQuestion?: string
	}>(),
	{
		selectedQuestion: '',
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
} = useEditQuiz(props.id)

const selectedQuestionId = ref(props.selectedQuestion)
const currentQuestionById = computed(() => questions.value.find((q) => q.id === selectedQuestionId.value))

const saveCurrentQuestion = async () => {
	if (!currentQuestionById.value || !questionFactory.valid) return
	await saveQuestion(currentQuestionById.value.id, questionFactory)
}

const updateQuiz = async () => {
	if (!quizFactory.valid) return
	return await update()
}

const extras = computed(() => ({
	get selectedQuestionId() {
		return selectedQuestionId.value
	},
	set selectedQuestionId(v) {
		selectedQuestionId.value = v
	},
	get usersByQuestions() {
		const allMembers = quiz.value?.access.members.concat(quiz.value.user.id) ?? []
		const online = members.value.filter((u) => u.id !== authId.value && u.status.connections.length > 0 && allMembers.includes(u.id))
		return questions.value.reduce(
			(acc, cur) => {
				acc[cur.id] = online.filter((m) => m.account.editing.quizzes?.questionId === cur.id)
				return acc
			},
			{} as Record<string, UserEntity[]>,
		)
	},
	currentQuestionById: currentQuestionById.value,
	questionFactory,
	quizFactory,
	sortedQuestions: quiz.value?.questions.map((qId) => questions.value.find((q) => q.id === qId)).filter(Boolean) ?? [],
	reorderQuestions,
	deleteQuestion,
	addQuestion,
	duplicateQuestion,
	deleteQuiz,
	saveCurrentQuestion,
	updateQuiz,
	publishQuiz,
	requestAccess,
	grantAccess,
	manageMembers,
	isMine: quiz.value?.user.id === authId.value,
	canEdit: quiz.value?.access.members.concat(quiz.value.user.id).includes(authId.value),
}))

watch(
	quiz,
	async () => {
		const q = quiz.value
		if (!q) return
		quizFactory.loadEntity(q)
	},
	{ immediate: true },
)

watch(
	[currentQuestionById, questions],
	() => {
		const question = currentQuestionById.value
		if (question) questionFactory.loadEntity(question)
		else if (questions.value.length > 0) extras.value.selectedQuestionId = questions.value[0].id
	},
	{ immediate: true },
)

watch(
	[currentQuestionById, questions, quiz],
	() => {
		if (!extras.value.canEdit || !currentQuestionById.value) return
		const quizPath = `/quizzes/${props.id}/edit`
		if (route.path !== quizPath) return
		const q = route.query.q as string
		const v = selectedQuestionId.value
		router[q ? 'push' : 'replace'](`${quizPath}?q=${v}`).catch()
		const edit = user.value?.account.editing.quizzes
		if (edit?.id !== props.id || edit?.questionId !== v) UsersUseCases.updateEditingQuizzes({ id: props.id, questionId: v }).catch()
	},
	{ immediate: true },
)
</script>
