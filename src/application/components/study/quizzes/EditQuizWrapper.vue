<template>
	<slot v-if="fetched && quiz" :quiz="quiz" :questions="questions" :extras="extras" :members="members" />
	<slot v-if="fetched && !quiz" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useDeleteQuiz, useEditQuiz } from '@app/composables/study/quizzes'
import { UserEntity, UsersUseCases } from '@modules/users'
import { QuestionEntity } from '@modules/study'

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
	questionFactory,
	aiGenFactory,
	saveQuestion,
	reorderQuestions,
	deleteQuestion,
	addQuestions,
	duplicateQuestion,
	members,
	requestAccess,
	grantAccess,
	manageMembers,
} = useEditQuiz(props.id)
const { deleteQuiz } = useDeleteQuiz()

const selectedQuestionId = ref(props.selectedQuestion)
const secondarySelectedQuestionId = ref<string | null>(null)
const currentQuestionById = computed(() => questions.value.find((q) => q.id === selectedQuestionId.value))

const saveCurrentQuestion = async () => {
	if (!currentQuestionById.value || !questionFactory.valid) return
	await saveQuestion(currentQuestionById.value.id, questionFactory)
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
	aiGenFactory,
	sortedQuestions: quiz.value?.questions.map((qId) => questions.value.find((q) => q.id === qId)).filter(Boolean) ?? [],
	reorderQuestions,
	deleteQuestion,
	addQuestion: async () => {
		const questions = await addQuestions()
		if (questions?.at(0)) secondarySelectedQuestionId.value = questions[0].id
	},
	duplicateQuestion: async (original: QuestionEntity) => {
		const question = await duplicateQuestion(original)
		if (question) secondarySelectedQuestionId.value = question.id
	},
	deleteQuiz: async () => (quiz.value ? deleteQuiz(quiz.value) : undefined),
	saveCurrentQuestion,
	requestAccess,
	grantAccess,
	manageMembers,
	isMine: quiz.value?.user.id === authId.value,
	canEdit: quiz.value?.access.members.concat(quiz.value.user.id).includes(authId.value),
}))

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
		const quizPath = `/study/quizzes/${props.id}/edit`
		if (route.path !== quizPath) return
		const q = route.query.q as string
		const v = selectedQuestionId.value
		router[q ? 'push' : 'replace'](`${quizPath}?q=${v}`).catch()
		const edit = user.value?.account.editing.quizzes
		if (edit?.id !== props.id || edit?.questionId !== v) UsersUseCases.updateEditingQuizzes({ id: props.id, questionId: v }).catch()
	},
	{ immediate: true },
)

watch(
	[questions, secondarySelectedQuestionId],
	() => {
		const id = secondarySelectedQuestionId.value
		if (!id) return
		if (questions.value.some((q) => q.id === id)) {
			selectedQuestionId.value = id
			secondarySelectedQuestionId.value = null
		}
	},
	{ immediate: true },
)
</script>
