<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="$route.params.id as string">
			<template #default="{ quiz, questions, extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:title="isDone ? 'Flashcards completed' : quiz.title"
					:questions="questions"
					:optionState="extras.optionState"
					:rightButton="{
						label: isDone ? 'Continue' : 'Mastered',
						bgColor: isDone ? 'bg-primaryBlue' : 'bg-primaryGreen',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (extras.canNext) return extras.next()
							return (isDone = true)
						},
					}"
					:leftButton="{
						label: isDone ? 'Restart' : 'Show later',
						bgColor: isDone ? 'bg-white border border-gray-100' : 'bg-primaryBlue',
						textColor: isDone ? 'text-grayColor' : 'text-white',
						click: () => {
							if (isDone) {
								extras.reset()
								return (isDone = false)
							}
							return extras.moveCurrrentQuestionToEnd()
						},
					}">
					<template #default>
						<div v-if="isDone" class="flex flex-col gap-1">
							<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
							<SofaNormalText color="text-inherit" content="You have mastered all flashcards" />
						</div>
						<Flashcard v-else-if="extras.question" :key="extras.question.id" :question="extras.question" :isDark="false" />
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</ExpandedLayout>
	<SofaModal v-if="showInfoModal">
		<div class="flex flex-col p-4 mdlg:p-6 gap-6 items-center justify-center">
			<div class="w-full flex flex-col gap-2 items-start">
				<div class="w-full flex gap-2 justify-between md:justify-center items-center">
					<SofaHeaderText class="text-xl" content="Flashcards" />
					<SofaIcon class="h-[19px] md:hidden" name="circle-close" @click="close" />
				</div>
				<SofaNormalText content="Learning quiz questions and answers" />
			</div>
			<div class="w-full h-full flex flex-col items-center gap-4">
				<div class="bg-primaryPurple text-white rounded-custom p-4 w-full flex flex-col gap-2">
					<div
						v-for="(item, index) in [
							'Click on the card to flip it',
							'Mastered makes card not reappear',
							'Show later sends card to end of deck',
							'Both buttons take you to next card',
						]"
						:key="index"
						class="flex items-center justify-start gap-2">
						<span class="w-1 aspect-square rounded-full bg-white" />
						<SofaNormalText color="text-inherit" :content="item" />
					</div>
				</div>
				<SofaCheckbox v-model="dontShowAgain" class="!w-auto">
					<SofaNormalText color="text-inherit" content="Don't show again" />
				</SofaCheckbox>
				<div class="w-full flex mdlg:flex-row flex-col mdlg:items-center justify-between mt-auto gap-4">
					<SofaButton
						padding="px-5 py-2"
						bgColor="bg-white"
						textColor="text-grayColor"
						class="hidden mdlg:inline-block"
						customClass="border border-gray-100"
						@click="close">
						Exit
					</SofaButton>

					<SofaButton padding="px-5 py-3 mdlg:py-2" class="mdlg:w-auto w-full" @click="close">Start</SofaButton>
				</div>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts">
import Flashcard from '@app/components/study/quizzes/FlashcardDisplay.vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { storage } from '@utils/storage'
import { Logic } from 'sofa-logic'
import { defineComponent, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdFlashcardPage',
	components: {
		QuizWrapper,
		Quiz,
		Flashcard,
	},
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	async setup() {
		useMeta({
			title: 'Flashcards',
		})

		const storageKey = 'flashcards-info'

		const isDone = ref(false)
		const showInfoModal = ref(false)
		const dontShowAgain = ref(false)

		const close = () => (showInfoModal.value = false)

		storage.get<'true'>(storageKey).then((value) => {
			showInfoModal.value = !value
		})

		watch(
			dontShowAgain,
			async () => {
				if (dontShowAgain.value) await storage.set(storageKey, 'true')
				else await storage.remove(storageKey)
			},
			{ immediate: true },
		)

		return { isDone, showInfoModal, dontShowAgain, Logic, close }
	},
})
</script>
