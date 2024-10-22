<template>
	<div class="flex flex-col gap-6 h-full">
		<div class="flex items-center gap-3">
			<SofaInput :modelValue="factory.title" disabled>
				<template v-if="factory.type === 'document'" #prefix>
					<SofaIcon name="file-document" class="fill-current h-[20px]" />
				</template>
			</SofaInput>
			<SofaButton padding="py-3 px-4" :disabled="fetchQuestionsLoading || submitLoading" @click="fetchQuestions">Refresh</SofaButton>
		</div>

		<div v-if="fetchQuestionsLoading || submitLoading" class="flex flex-col justify-center items-center gap-4 p-4 h-full min-h-[400px]">
			<SofaIcon name="pen" class="fill-primaryPurple" />
			<div class="w-4/5 bg-lightGray rounded-full h-2 mdlg:h-3">
				<div class="bg-primaryPurple h-full rounded-full animate-load" />
			</div>
			<SofaText content="Generating questions, this could take a minute..." size="sub" />
		</div>

		<div v-else class="flex flex-col gap-4 h-fit max-h-full overflow-y-auto">
			<template v-for="(question, index) in questions" :key="index">
				<div v-if="question.data.type === QuestionTypes.multipleChoice" class="bg-lightGray rounded-lg p-3 flex flex-col gap-2">
					<div class="flex items-center gap-4">
						<SofaText :content="question.question" size="sub" class="grow" />
						<SofaIcon
							name="chevron-down"
							class="h-[7px] transition"
							:class="{ 'rotate-180': openQuestions.includes(question.hash) }"
							@click="toggleOpenQuestion(question.hash)" />
						<SofaButton padding="py-2 px-3" @click="toggleSelectedQuestion(question.hash)">
							{{ selectedQuestions.includes(question.hash) ? 'Remove' : 'Add' }}
						</SofaButton>
					</div>
					<template v-if="openQuestions.includes(question.hash)">
						<div
							v-for="(option, index) in question.data.options"
							:key="option"
							class="bg-white p-2 rounded-lg flex items-center gap-2">
							<SofaIcon :name="QuestionEntity.getShape(index)" class="h-[15px]" />
							<SofaText :content="option" size="sub" class="grow" />
							<SofaIcon v-if="question.data.answers.includes(index)" name="selected" class="w-[23px]" />
						</div>
					</template>
				</div>
			</template>
		</div>

		<SofaButton
			color="green"
			padding="py-3 px-4"
			class="mt-auto"
			:disabled="!factory.valid || !selectedQuestions.length || fetchQuestionsLoading || submitLoading"
			:class="$screen.desktop ? 'w-auto ml-auto' : 'w-full'"
			@click="submit">
			Done
		</SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '@app/composables/core/hooks'
import {
	AiGenResult,
	CreateQuestionFactory,
	QuestionEntity,
	QuestionFactory,
	QuestionsUseCases,
	QuestionTypes,
	QuizFactory,
	QuizzesUseCases,
} from '@modules/study'

const props = defineProps<{
	factory: CreateQuestionFactory
	quizId?: string
}>()

const router = useRouter()
const quiz = ref<AiGenResult['quiz'] | null>(null)
const questions = ref<(AiGenResult['questions'][number] & { hash: string })[]>([])
const openQuestions = ref<string[]>([])
const selectedQuestions = ref<string[]>([])
const currentlySelectedQuestions = computed(() =>
	selectedQuestions.value.map((hash) => questions.value.find((q) => q.hash === hash)).filter(Boolean),
)

const { loading: fetchQuestionsLoading, asyncFn: fetchQuestions } = useAsyncFn(
	async () => {
		props.factory.questionType = QuestionTypes.multipleChoice
		props.factory.amount = 10
		const result = await QuizzesUseCases.aiGen(props.factory)
		if (!quiz.value || Object.keys(selectedQuestions.value).length === 0) quiz.value = result.quiz
		questions.value = [...currentlySelectedQuestions.value, ...result.questions.map((q) => ({ ...q, hash: $utils.getRandomValue() }))]
	},
	{ hideLoading: true },
)

const { loading: submitLoading, asyncFn: submit } = useAsyncFn(
	async () => {
		const quizId =
			!props.quizId && quiz.value ? await QuizzesUseCases.add(new QuizFactory().loadEntity(quiz.value)).then((quiz) => quiz.id) : null
		if (!quizId) return await router.push('/library/quizzes')
		const questions = await Promise.all(
			currentlySelectedQuestions.value
				.map((question) => new QuestionFactory().loadEntity(question))
				.map((factory) => QuestionsUseCases.add(quizId, factory)),
		)
		const question = questions.at(0)
		if (question) await router.push(question ? question.editPage : `/library/quizzes`)
	},
	{ hideLoading: true },
)

const toggleSelectedQuestion = (hash: string) => {
	const isSelected = selectedQuestions.value.includes(hash)
	if (isSelected) selectedQuestions.value = selectedQuestions.value.filter((i) => i !== hash)
	else selectedQuestions.value = selectedQuestions.value.concat(hash)
}

const toggleOpenQuestion = (hash: string) => {
	const isOpen = openQuestions.value.includes(hash)
	if (isOpen) openQuestions.value = openQuestions.value.filter((i) => i !== hash)
	else openQuestions.value = openQuestions.value.concat(hash)
}

onMounted(fetchQuestions)
</script>

<style scoped>
@keyframes load {
	0%,
	100% {
		width: 0;
	}

	25%,
	75% {
		width: 50%;
	}

	50% {
		width: 100%;
	}
}

.animate-load {
	animation: load 5s infinite linear;
}
</style>
