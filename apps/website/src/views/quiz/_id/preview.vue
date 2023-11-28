<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0" :hasTopBar="false" :hasBottomBar="false"
		:bottomPadding="false">
		<QuizWrapper :id="quizId">
			<template v-slot="{ quiz, questions }">
				<Quiz v-model:index="questionIndex" :title="quiz.title" :questions="questions"
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
					}"
				/>
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	components: { QuizWrapper, Quiz },
	setup () {
		useMeta({
			title: "Preview",
		})

		const route = useRoute()
		const questionIndex = ref(0)

		return { quizId: route.params.id as string, questionIndex }
	}
})
</script>