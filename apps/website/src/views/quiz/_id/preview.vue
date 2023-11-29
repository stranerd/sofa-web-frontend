<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0" :hasTopBar="false" :hasBottomBar="false"
		:bottomPadding="false">
		<QuizWrapper :id="($route.params.id as string)">
			<template v-slot="{ quiz, questions, extras }">
				<Quiz v-model:index="extras.index" :title="quiz.title" :questions="questions" v-model:answer="extras.answer"
					:optionState="extras.optionState"
					:rightButton="{
						label: 'Next',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						disabled: !extras.canNext,
						click: extras.next
					}" :leftButton="{
						label: 'Prev',
						bgColor: 'bg-white border-[1px] border-gray-100',
						textColor: 'text-grayColor',
						disabled: !extras.canPrev,
						click: extras.previous
					}"
				/>
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	components: { QuizWrapper, Quiz },
	setup () {
		useMeta({
			title: "Preview",
		})
	}
})
</script>