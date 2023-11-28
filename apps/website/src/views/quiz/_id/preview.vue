<template>
	<QuizComp v-model:index="questionIndex" :title="quiz?.title ?? 'Unknown'" :questions="questions"
		:rightButton="{
			label: 'Next',
			bgColor: 'bg-primaryBlue',
			textColor: 'text-white',
			disabled: questionIndex === questions.length - 1,
			click: () => {
				if (questionIndex < questions.length - 1) questionIndex++
			}
		}" :leftButton="{
			label: 'Prev',
			bgColor: 'bg-white border-[1px] border-gray-100',
			textColor: 'text-grayColor',
			disabled: questionIndex === 0,
			click: () => {
				if (questionIndex > 0) questionIndex--
			}
		}" />
</template>

<script lang="ts">
import QuizComp from '@/components/quizzes/Quiz.vue'
import { Logic, Question, Quiz } from 'sofa-logic'
import { defineComponent, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	components: { QuizComp },
	setup () {
		useMeta({
			title: "Preview",
		})

		const route = useRoute()
		const { id } = route.params

		const quiz = ref<Quiz | null>(null)
		const questions = ref<Question[]>([])
		const questionIndex = ref(0)

		onMounted(async () => {
			quiz.value = await Logic.Study.GetQuiz(id as string).catch(() => null) as any
			questions.value = (await Logic.Study.GetQuestions(id as string))?.results ?? []
		})

		return { quiz, questions, questionIndex }
	}
})
</script>