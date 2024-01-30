<template>
	<div v-if="hasAccess(quiz)" class="w-full flex flex-col md:gap-4 gap-2 mdlg:p-6 md:p-4 items-center justify-center">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-3 border-lightGray border-b px-4">
			<SofaNormalText customClass="!font-bold !text-base">
				{{ showGame ? 'Start quiz game' : 'Choose Study Mode' }}
			</SofaNormalText>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div v-if="showGame" class="w-full flex flex-col gap-3 p-4">
			<a class="w-full rounded-custom p-4 bg-lightGray flex items-center justify-between" @click="joinGame = !joinGame">
				<SofaNormalText>Participate</SofaNormalText>
				<SofaIcon customClass="h-[22px] z-50" :name="joinGame ? 'toggle-on' : 'toggle-off'" />
			</a>

			<div class="w-full flex flex-col items-center justify-between pt-3">
				<div class="w-full flex flex-col">
					<SofaButton padding="py-3" customClass="w-full" @click="createQuizGame">Start</SofaButton>
				</div>
			</div>
		</div>

		<div v-else class="w-full flex flex-col gap-3 px-4 py-2 md:p-0">
			<SofaIconCard
				v-for="item in otherTasks"
				:key="item.title"
				:data="{ ...item, iconSize: 'h-[46px]' }"
				customClass="!bg-lightGray !w-full !shadow-none"
				@click="chooseMode(item.value)">
				<template #title>
					<SofaNormalText customClass="!font-bold">
						{{ item.title }}
					</SofaNormalText>
				</template>
			</SofaIconCard>

			<SofaButton v-if="id === quiz.user.id" class="w-full" padding="p-3" @click="goToEdit"> Edit Quiz </SofaButton>
		</div>
	</div>
	<SofaEmptyState
		v-else
		title="You have no access to this quiz"
		subTitle="Get the course it is in to use"
		actionLabel="Go to course"
		:action="() => Logic.Common.GoToRoute(`/marketplace/${quiz.courseId}?type=course`)"
		:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useHasAccess } from '@app/composables/study'
import { QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { ref } from 'vue'

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
		icon: 'learn-quiz' as const,
		value: 'practice',
	},
	{
		title: 'Test',
		subTitle: 'Evaluate your level of knowledge',
		icon: 'test' as const,
		value: 'test',
	},
	{
		title: 'Flashcards',
		subTitle: 'Digital cards to memorize answers',
		icon: 'study-flashcard' as const,
		value: 'flashcards',
	},
	{
		title: 'Game',
		subTitle: 'Battle friends for the highest score',
		icon: 'play-quiz' as const,
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
		?.then(async (game) => {
			await Logic.Common.GoToRoute(`/games/${game.id}`)
			props.close()
		})
		.finally(() => {
			Logic.Common.hideLoading()
		})
}
</script>
