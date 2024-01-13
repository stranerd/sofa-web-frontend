<template>
	<div v-if="hasAccess(quiz)" class="w-full flex flex-col md:gap-4 gap-2 mdlg:p-6 md:p-4 items-center justify-center">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-3 border-lightGray border-b px-4">
			<sofa-normal-text :custom-class="'!font-bold !text-base'">
				{{ showGame ? 'Start quiz game' : 'Choose Study Mode' }}
			</sofa-normal-text>
			<sofa-icon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div v-if="showGame" class="w-full flex flex-col gap-3 p-4">
			<a class="w-full rounded-custom p-4 bg-lightGray flex items-center justify-between" @click="joinGame = !joinGame">
				<sofa-normal-text>Participate</sofa-normal-text>
				<sofa-icon :custom-class="'h-[22px] z-50'" :name="joinGame ? 'toggle-on' : 'toggle-off'" />
			</a>

			<div class="w-full flex flex-col items-center justify-between pt-3">
				<div class="w-full flex flex-col">
					<sofa-button :padding="'py-3'" :custom-class="'w-full'" @click="createQuizGame">Start</sofa-button>
				</div>
			</div>
		</div>

		<div v-else class="w-full flex flex-col gap-3 px-4 py-2 md:p-0">
			<sofa-icon-card
				v-for="item in otherTasks"
				:key="item.title"
				:data="{ ...item, iconSize: 'h-[46px]' }"
				:custom-class="'!bg-lightGray !w-full !shadow-none'"
				@click="chooseMode(item.value)">
				<template #title>
					<sofa-normal-text :custom-class="'!font-bold'">
						{{ item.title }}
					</sofa-normal-text>
				</template>
			</sofa-icon-card>

			<sofa-button v-if="id === quiz.user.id" class="w-full" padding="p-3" @click="goToEdit"> Edit Quiz </sofa-button>
		</div>
	</div>
	<SofaEmptyState
		v-else
		title="You have no access to this quiz"
		sub-title="Get the course it is in to use"
		action-label="Go to course"
		:action="() => Logic.Common.GoToRoute(`/marketplace/${quiz.courseId}?type=course`)"
		:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
</template>

<script lang="ts" setup>
import { useHasAccess } from '@/composables/study/study'
import { Logic } from 'sofa-logic'
import { QuizEntity } from '@modules/study'
import { SofaButton, SofaEmptyState, SofaIcon, SofaIconCard, SofaNormalText } from 'sofa-ui-components'
import { defineProps, ref } from 'vue'
import { useAuth } from '@/composables/auth/auth'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
}>()

const goToEdit = () => {
	props.close()
	Logic.Common.GoToRoute(`/quiz/${props.quiz?.id}/edit`)
}

const { id } = useAuth()
const { hasAccess } = useHasAccess()

const showGame = ref(false)
const joinGame = ref(false)

const chooseMode = async (mode: string) => {
	if (mode == 'game') return (showGame.value = true)
	await Logic.Study.GoToStudyMode(mode, props.quiz.id)
	props.close()
}

const otherTasks = [
	{
		title: 'Practice',
		subTitle: 'Interactive and comfortable learning',
		icon: 'learn-quiz',
		value: 'practice',
	},
	{
		title: 'Test',
		subTitle: 'Evaluate your level of knowledge',
		icon: 'test',
		value: 'test',
	},
	{
		title: 'Flashcards',
		subTitle: 'Digital cards to memorize answers',
		icon: 'study-flashcard',
		iconSize: 'h-[46px]',
		value: 'flashcards',
	},
	{
		title: 'Game',
		subTitle: 'Battle friends for the highest score',
		icon: 'play-quiz',
		value: 'game',
	},
]

const createQuizGame = async () => {
	Logic.Common.showLoading()

	Logic.Plays.CreateGameForm = {
		quizId: props.quiz.id,
		join: joinGame.value,
	}

	await Logic.Plays.CreateGame(true)
		.then(async (game) => {
			await Logic.Common.GoToRoute(`/games/${game.id}`)
			props.close()
		})
		.finally(() => {
			Logic.Common.hideLoading()
		})
}
</script>
