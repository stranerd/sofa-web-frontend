<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4 overflow-hidden">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="title" content="Select a quiz" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaHeading content="Select a quiz" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<SofaInput v-model="searchQuery" placeholder="Search for quiz" type="search" class="!bg-white flex-1">
			<template #prefix>
				<SofaIcon name="search-black" class="h-[17px]" />
			</template>
		</SofaInput>
		<div class="h-full max-h-[300px] overflow-y-auto flex flex-col gap-2">
			<a
				v-for="quiz in filteredQuizzes"
				:key="quiz.id"
				:class="selectedQuiz === quiz ? 'bg-lightBlue' : 'bg-lightGray'"
				class="p-4 flex items-center gap-2 rounded-custom"
				@click="selectedQuiz = quiz">
				<SofaRadio v-model="selectedQuiz" name="quiz" :value="quiz" />
				<SofaText :content="quiz.title" />
			</a>
			<SofaHeading v-if="!filteredQuizzes.length" class="!text-center" content="No quizzes found" />
		</div>
		<div class="w-full flex items-center justify-between">
			<SofaButton color="gray" padding="py-3 px-6" class="hidden mdlg:block" @click="close"> Cancel </SofaButton>
			<SofaButton
				type="submit"
				:disabled="!selectedQuiz"
				padding="py-3 px-6"
				class="w-full mdlg:w-auto"
				@click="select(selectedQuiz)">
				Done
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMyQuizzes } from '@app/composables/study/quizzes-list'
import { QuizEntity, QuizModes } from '@modules/study'

const props = defineProps<{
	close: () => void
	mode: QuizModes
	onSelected: (quiz: QuizEntity) => void
}>()

const searchQuery = ref('')
const selectedQuiz = ref<QuizEntity | null>(null)

const select = (quiz: QuizEntity | null) => {
	if (quiz) {
		props.onSelected(quiz)
		props.close()
	}
}

const { published: quizzes } = useMyQuizzes()
const filteredQuizzes = computed(() => quizzes.value.filter((q) => [q.search(searchQuery.value), q.modes[props.mode]].every(Boolean)))
</script>
