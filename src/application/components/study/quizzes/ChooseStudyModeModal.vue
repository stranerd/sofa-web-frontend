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
				v-for="item in filteredModes"
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

			<SofaHeaderText v-if="filteredModes.length === 0" content="No modes supported for this quiz" />

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
import { computed, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCreatePlay } from '@app/composables/plays/plays'
import { useHasAccess } from '@app/composables/study'
import { PlayTypes } from '@modules/plays'
import { QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
}>()

const goToEdit = () => {
	props.close()
	Logic.Common.GoToRoute(`/quizzes/${props.quiz.id}/edit`)
}

const { id } = useAuth()
const { hasAccess } = useHasAccess()
const { createPlay } = useCreatePlay({}, { start: false, nav: true })

const showGame = ref(false)
const joinGame = ref(false)

const chooseMode = async (mode: PlayTypes) => {
	const quizId = props.quiz.id
	if (mode === PlayTypes.games) return (showGame.value = true)
	if (mode === PlayTypes.practice || mode === PlayTypes.flashcards) await Logic.Common.GoToRoute(`/quizzes/${quizId}/${mode}`)
	if (mode === PlayTypes.tests) await createPlay({ quizId, data: { type: PlayTypes.tests } })

	props.close()
}

const modes = [
	{
		title: 'Practice',
		subTitle: 'Interactive and comfortable learning',
		icon: 'learn-quiz',
		value: PlayTypes.practice,
	},
	{
		title: 'Test',
		subTitle: 'Evaluate your level of knowledge',
		icon: 'test',
		value: PlayTypes.tests,
	},
	{
		title: 'Flashcards',
		subTitle: 'Digital cards to memorize answers',
		icon: 'study-flashcard',
		value: PlayTypes.flashcards,
	},
	{
		title: 'Game',
		subTitle: 'Battle friends for the highest score',
		icon: 'play-quiz',
		value: PlayTypes.games,
	},
] as const

const filteredModes = computed(() => modes.filter((t) => props.quiz.modes[t.value]))

const createQuizGame = async () => {
	await createPlay({ quizId: props.quiz.id, data: { type: PlayTypes.games, join: joinGame.value } })
}
</script>
