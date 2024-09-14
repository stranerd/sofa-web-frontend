<template>
	<FullLayout :hide="{ left: true, right: true }">
		<template #middle-session>
			<SofaModal>
				<div class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6">
					<SofaHeading size="title">Create Quiz</SofaHeading>
					<QuizForm :factory="factory" :submit="createQuiz" :cancel="() => $router.replace('/library')" />
				</div>
			</SofaModal>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateQuiz } from '@app/composables/study/quizzes'

export default defineComponent({
	name: 'StudyQuizzesCreatePage',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { factory, createQuiz } = useCreateQuiz()
		return { factory, createQuiz }
	},
})
</script>
