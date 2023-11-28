<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0" :hasTopBar="false" :hasBottomBar="false"
		:bottomPadding="false">
		<QuizWrapper :id="($route.params.id as string)">
			<template v-slot="{ quiz, questions }">
				<Quiz v-model:index="questionIndex" :title="isDone ? 'Practice completed' : quiz.title" :questions="questions"
					:rightButton="{
						label: showSolution ? 'Continue' : 'Check',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (!showSolution) return showSolution = true
							if (questionIndex < questions.length - 1) {
								showSolution = false
								questionIndex++
								return
							}
							return isDone = true
						}
					}" :leftButton="{
						label: isDone ? 'Restart' : 'Skip',
						bgColor: 'bg-white border-[1px] border-gray-100',
						textColor: 'text-grayColor',
						disabled: !isDone && questionIndex === questions.length - 1,
						click: () => {
							if (isDone) {
								questionIndex = 0
								isDone = false
								return
							}
							else if (questionIndex < questions.length - 1) return questionIndex++
						}
					}">
					<template v-if="showSolution" v-slot:header>

					</template>
					<template v-if="isDone" v-slot>
						<div class="flex flex-col gap-1">
							<SofaHeaderText :customClass="'!font-bold md:!text-2xl text-lg'" content="Congratulations!" />
							<SofaNormalText :color="'text-grayColor'" content="You have mastered this quiz" />
						</div>
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdPracticePage',
	components: { QuizWrapper, Quiz, SofaHeaderText, SofaNormalText },
	setup () {
		useMeta({
			title: "Practice",
		})

		const questionIndex = ref(0)
		const showSolution = ref(false)
		const isDone = ref(false)

		return { questionIndex, showSolution, isDone, Logic }
	}
})
</script>