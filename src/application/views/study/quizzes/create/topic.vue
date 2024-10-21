<template>
	<QuizCreateLayout
		:title="state === 'questions' ? 'Add questions' : 'Enter topic'"
		:onBack="state === 'questions' ? () => (state = 'select') : undefined">
		<template v-if="state === 'select'">
			<SofaInput v-model="factory.topic" placeholder="Write your topic in short detail" />
			<SofaButton
				padding="py-3 px-3"
				class="mt-auto"
				:class="$screen.desktop ? 'w-auto ml-auto' : 'w-full'"
				:disabled="!factory.isValid('topic')"
				@click="state = 'questions'">
				Continue
			</SofaButton>
		</template>
		<template v-if="state === 'questions'">
			<AiGen :factory="factory" />
		</template>
	</QuizCreateLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AiGenFactory } from '@modules/study'

export default defineComponent({
	name: 'StudyQuizzesCreateTopicPage',
	routeConfig: {
		goBackRoute: '/study/quizzes/create',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const state = ref<'select' | 'questions'>('select')
		const factory = new AiGenFactory('topic')
		return { factory, state }
	},
})
</script>
