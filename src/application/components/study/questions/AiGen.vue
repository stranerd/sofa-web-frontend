<template>
	<div class="flex flex-col gap-6 h-full">
		<div class="flex items-center gap-3">
			<SofaInput :modelValue="factory.title" disabled>
				<template v-if="factory.type === 'document'" #prefix>
					<SofaIcon name="file-document" class="fill-current h-[20px]" />
				</template>
			</SofaInput>
			<SofaButton padding="py-3 px-4">Refresh</SofaButton>
		</div>
		<div class="flex flex-col gap-4 h-fit max-h-full overflow-y-auto">
			<div v-for="(question, index) in questions" :key="index" class="bg-lightGray rounded-lg px-2 py-4">
				<SofaText>{{ JSON.stringify(question) }}</SofaText>
				<!-- <div class="flex items-center justify-between cursor-pointer gap-4" @click="toggleOptions(question.id)">
					<SofaText :content="question.question" size="sub" />
					<SofaIcon name="angle-small-down" class="h-[7px] transition" :class="question.isVisible ? 'rotate-180' : 'rotate-0'" />
					<SofaButton padding="py-2 px-3">Add</SofaButton>
				</div>
				<div v-if="question.isVisible">
					<div
						v-for="(option, index) in question.options"
						:key="option"
						class="bg-white p-2 rounded-lg mt-2 flex items-center gap-2">
						<SofaIcon :name="optionIcons[index]" class="h-[15px]" />
						<SofaText :content="option" size="sub" />
					</div>
				</div> -->
			</div>
		</div>

		<SofaButton color="green" padding="p-3" class="mt-auto" :class="$screen.desktop ? 'w-auto ml-auto' : 'w-full'">Done</SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '@app/composables/core/hooks'
import { AiGenFactory, AiGenResult, QuestionFactory, QuestionsUseCases, QuestionTypes, QuizFactory, QuizzesUseCases } from '@modules/study'

const props = defineProps<{
	factory: AiGenFactory
	quizId?: string
}>()

const router = useRouter()
const quiz = ref<AiGenResult['quiz'] | null>(null)
const questions = ref<AiGenResult['questions']>([])
const selectedQuestionsIndex = ref<number[]>([])
const currentlySelectedQuestions = computed(() => selectedQuestionsIndex.value.map((index) => questions.value[index]).filter(Boolean))

const { asyncFn: fetchQuestions } = useAsyncFn(async () => {
	props.factory.questionType = QuestionTypes.multipleChoice
	props.factory.amount = 5
	const result = await QuizzesUseCases.aiGen(props.factory)
	if (!quiz.value || Object.keys(selectedQuestionsIndex.value).length === 0) quiz.value = result.quiz
	const selected = currentlySelectedQuestions.value
	questions.value = [...currentlySelectedQuestions.value, ...result.questions]
	selectedQuestionsIndex.value = selected.map((_, index) => index)
})

const { asyncFn: submit } = useAsyncFn(async () => {
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
})

const toggleQuestion = (index: number) => {
	const isSelected = selectedQuestionsIndex.value.includes(index)
	if (isSelected) selectedQuestionsIndex.value = selectedQuestionsIndex.value.filter((i) => i !== index)
	else selectedQuestionsIndex.value = selectedQuestionsIndex.value.concat(index)
}

// TODO: remove after
;[submit, toggleQuestion]

onMounted(fetchQuestions)
</script>
