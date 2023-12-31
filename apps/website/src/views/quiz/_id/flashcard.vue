<template>
	<expanded-layout layout-style="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="$route.params.id as string">
			<template #default="{ quiz, questions, extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:title="isDone ? 'Flashcards completed' : quiz.title"
					:questions="questions"
					:option-state="extras.optionState"
					:right-button="{
						label: isDone ? 'Continue' : 'Mastered',
						bgColor: isDone ? 'bg-primaryBlue' : 'bg-primaryGreen',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (extras.canNext) return extras.next()
							return (isDone = true)
						},
					}"
					:left-button="{
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
						<Flashcard v-else-if="extras.question" :key="extras.question.id" :question="extras.question" :is-dark="false" />
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</expanded-layout>
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
						bg-color="bg-white"
						text-color="text-grayColor"
						class="hidden mdlg:inline-block"
						custom-class="border border-gray-100"
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
import Flashcard from '@/components/quizzes/FlashcardDisplay.vue'
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaCheckbox, SofaHeaderText, SofaIcon, SofaModal2 as SofaModal, SofaNormalText } from 'sofa-ui-components'
import { defineComponent, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdFlashcardPage',
	middlewares: { goBackRoute: '/library' },
	components: {
		QuizWrapper,
		Quiz,
		Flashcard,
		SofaHeaderText,
		SofaNormalText,
		SofaButton,
		SofaIcon,
		SofaModal,
		SofaCheckbox,
	},
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		useMeta({
			title: 'Flashcards',
		})

		const storageKey = 'flashcards-info'

		const isDone = ref(false)
		const showInfoModal = ref(!localStorage.getItem(storageKey))
		const dontShowAgain = ref(false)

		const close = () => (showInfoModal.value = false)

		watch(
			dontShowAgain,
			() => {
				if (dontShowAgain.value) localStorage.setItem(storageKey, 'true')
				else localStorage.removeItem(storageKey)
			},
			{ immediate: true },
		)

		return { isDone, showInfoModal, dontShowAgain, Logic, close }
	},
})
</script>
