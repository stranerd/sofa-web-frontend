<template>
	<Quiz
		v-bind="quizProps"
		:title="isDone ? 'Flashcards completed' : quizProps.title"
		:growMid="true"
		:rightButtonConfig="
			(extras) => ({
				label: isDone ? 'Continue' : 'Mastered',
				bgColor: isDone ? 'bg-primaryBlue' : 'bg-primaryGreen',
				textColor: 'text-white',
				click: () => {
					if (isDone) return $utils.goBack()
					if (extras.canNext) return extras.next()
					return (isDone = true)
				},
			})
		"
		:leftButtonConfig="
			(extras) => ({
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
			})
		">
		<template #default="{ extras }">
			<div v-if="isDone" class="flex flex-col gap-1 w-full h-full items-center justify-center">
				<SofaHeading size="title2" color="text-inherit" content="Congratulations!" />
				<SofaText content="You have mastered all flashcards" />
			</div>
			<FlashcardDisplay v-else-if="extras.question" :key="extras.question.id" :question="extras.question" :isDark="false" />

			<SofaModal v-if="showInfoModal">
				<div class="flex flex-col p-4 mdlg:p-6 gap-6 items-center justify-center">
					<div class="w-full flex flex-col gap-2 items-start">
						<div class="w-full flex gap-2 justify-between md:justify-center items-center">
							<SofaHeading size="title" content="Flashcards" />
							<SofaIcon class="h-[19px] md:hidden" name="circle-close" @click="close" />
						</div>
						<SofaText content="Learning quiz questions and answers" />
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
								<SofaText :content="item" />
							</div>
						</div>
						<SofaCheckbox v-model="dontShowAgain" class="!w-auto">
							<SofaText content="Don't show again" />
						</SofaCheckbox>
						<div class="w-full flex mdlg:flex-row flex-col mdlg:items-center justify-between mt-auto gap-4">
							<SofaButton
								padding="px-5 py-2"
								bgColor="bg-white"
								textColor="text-grayColor"
								class="hidden mdlg:inline-block border border-gray-100"
								@click="close">
								Exit
							</SofaButton>

							<SofaButton padding="px-5 py-3 mdlg:py-2" class="mdlg:w-auto w-full" @click="close">Start</SofaButton>
						</div>
					</div>
				</div>
			</SofaModal>
		</template>
	</Quiz>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import { PlayEntity } from '@modules/plays'
import { storage } from '@utils/storage'

type QuizProps = InstanceType<typeof Quiz>['$props']

defineProps<{
	play: PlayEntity
	quizProps: QuizProps
}>()

const storageKey = 'flashcards-info'
const isDone = ref(false)
const showInfoModal = ref(false)
const dontShowAgain = ref(false)

const close = () => (showInfoModal.value = false)

storage.get<true>(storageKey).then((value) => {
	showInfoModal.value = !value
})

watch(dontShowAgain, async () => {
	if (dontShowAgain.value) await storage.set(storageKey, true)
	else await storage.remove(storageKey)
})
</script>
