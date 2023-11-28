<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0" :hasTopBar="false" :hasBottomBar="false"
		:bottomPadding="false">
		<QuizWrapper :id="($route.params.id as string)">
			<template v-slot="{ quiz, questions, extras }">
				<Quiz v-model:index="extras.index" :title="isDone ? 'Practice completed' : quiz.title" v-model:answer="extras.answer"
					:questions="questions" :rightButton="{
						label: showSolution ? 'Continue' : 'Check',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (!showSolution) return showSolution = true
							if (extras.index < questions.length - 1) {
								showSolution = false
								extras.index++
								return
							}
							return isDone = true
						}
					}" :leftButton="{
						label: isDone ? 'Restart' : 'Skip',
						bgColor: 'bg-white border-[1px] border-gray-100',
						textColor: 'text-grayColor',
						disabled: showSolution || (!isDone && extras.index === questions.length - 1),
						click: () => {
							if (isDone) {
								extras.index = 0
								isDone = false
								return
							}
							else if (extras.index < questions.length - 1) return extras.index++
						}
					}">
					<template v-if="showSolution" v-slot:header>
						<div class="w-full p-4 md:py-8 flex items-center justify-center gap-2" :class="correct ? 'bg-primaryGreen' : 'bg-primaryRed'">
							<SofaIcon class="h-[22px]" :name="correct ? 'white-checkbox' : 'white-wrong'" />
							<SofaHeaderText :size="'xl'" :color="'text-white'" :content="correct ? 'Correct!' : 'Wrong!'" />
						</div>
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
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdPracticePage',
	components: { QuizWrapper, Quiz, SofaHeaderText, SofaIcon, SofaNormalText },
	setup () {
		useMeta({
			title: "Practice",
		})

		const showSolution = ref(false)
		const isDone = ref(false)
		const correct = ref(false)

		return { showSolution, isDone, Logic, correct }
	}
})
</script>