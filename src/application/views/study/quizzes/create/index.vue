<template>
	<QuizCreateLayout title="New quiz">
		<div class="flex flex-col mdlg:flex-row justify-between items-center gap-6">
			<router-link
				v-for="quizType in createTypes"
				:key="quizType.type"
				:to="`/study/quizzes/create/${quizType.type}`"
				class="bg-lightGray w-full flex flex-col justify-center items-center text-center gap-2 rounded-lg p-6">
				<SofaIcon :name="quizType.icon" />
				<SofaHeading :content="quizType.title" />
				<SofaText :content="quizType.description" class="text-grayColor" size="sub" />
			</router-link>
		</div>
	</QuizCreateLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const createTypes: { type: string; icon: IconName; title: string; description: string }[] = [
	{
		type: 'document',
		icon: 'question-from-document',
		title: 'Get questions from a document',
		description: 'AI generated',
	},
	{
		type: 'topic',
		icon: 'question-from-topic',
		title: 'Get questions from a topic',
		description: 'AI generated',
	},
	{
		type: 'scratch',
		icon: 'question-from-scratch',
		title: 'Create questions from scratch',
		description: 'Type your questions',
	},
]

export default defineComponent({
	name: 'StudyQuizzesCreateIndexPage',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		return { createTypes }
	},
})
</script>
