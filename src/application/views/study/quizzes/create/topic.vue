<template>
	<QuizCreateLayout
		:title="showPreview ? 'Add questions' : 'Enter topic'"
		:onBack="showPreview ? () => (showPreview = false) : undefined">
		<template v-if="!showPreview">
			<SofaInput v-model="factory.topic" placeholder="Write your topic in short detail" />
			<SofaButton padding="py-3 px-3" class="w-full mt-auto" :disabled="!factory.isValid('topic')" @click="showPreview = true"
			>Continue</SofaButton
			>
		</template>
		<template v-if="showPreview">
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
		const factory = new AiGenFactory('topic')
		const showPreview = ref(false)
		return { factory, showPreview }
	},
})
</script>
