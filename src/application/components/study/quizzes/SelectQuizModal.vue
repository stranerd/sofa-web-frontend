<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4 overflow-hidden">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Select a quiz" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Select a quiz" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<SofaTextField
			v-model="searchQuery"
			class="bg-white border border-darkLightGray rounded-custom flex-1"
			customClass="!border-none w-full"
			placeholder="Search for quiz">
			<template #inner-prefix>
				<SofaIcon name="search-black" class="h-[17px]" />
			</template>
		</SofaTextField>
		<div class="h-full max-h-[300px] overflow-y-auto flex flex-col gap-2">
			<a
				v-for="quiz in filteredQuizzes"
				:key="quiz.id"
				:class="selectedQuiz === quiz ? 'bg-lightBlue' : 'bg-lightGray'"
				class="p-4 flex items-center gap-2 rounded-custom"
				@click="selectedQuiz = quiz">
				<SofaRadio v-model="selectedQuiz" name="quiz" :value="quiz" />
				<SofaNormalText :content="quiz.title" />
			</a>
		</div>
		<div class="w-full flex items-center justify-between">
			<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" customClass="hidden mdlg:block" @click="close">
				Cancel
			</SofaButton>
			<SofaButton
				bgColor="bg-primaryBlue"
				type="submit"
				:disabled="!selectedQuiz"
				textColor="text-white"
				padding="py-3 px-6"
				customClass="w-full mdlg:w-auto"
				@click="select(selectedQuiz)">
				Done
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { QuizEntity } from '@modules/study'
import { useMyQuizzes } from '@app/composables/study/quizzes-list'

const props = defineProps<{
	close: () => void
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
const filteredQuizzes = computed(() => {
	if (!searchQuery.value) return quizzes.value
	return quizzes.value.filter((q) => q.title.includes(searchQuery.value))
})
</script>
