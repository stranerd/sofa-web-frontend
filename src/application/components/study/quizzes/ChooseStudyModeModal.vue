<template>
	<form
		v-if="hasAccess(quiz)"
		class="w-full flex flex-col mdlg:gap-6 gap-4 mdlg:p-6 p-4 items-center justify-center"
		@submit.prevent="submit">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">
				{{ factory.isGames ? 'Start quiz game' : 'Choose Study Mode' }}
			</SofaNormalText>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<template v-if="factory.type && !(factory.isFlashcards || factory.isPractice)">
			<SofaTextField
				v-model="factory.title"
				:error="factory.errors.title"
				customClass="w-full rounded-custom !bg-lightGray"
				placeholder="Title"
				:hasTitle="true"
				borderColor="border-transparent">
				<template #title>Title</template>
			</SofaTextField>

			<SofaCheckbox v-if="factory.isGames" v-model="factory.gamesJoin" type="switch" class="w-full justify-between p-4 bg-lightGray">
				<SofaNormalText content="Participate" />
			</SofaCheckbox>

			<SofaTextField
				v-if="factory.isAssessments"
				v-model="factory.assessmentsEndedAtDate"
				:error="factory.errors.assessmentsEndedAt"
				:min="factory.minAssessmentsEndedAt"
				customClass="w-full rounded-custom !bg-lightGray"
				type="datetime-local"
				placeholder="Ends at"
				:hasTitle="true"
				borderColor="border-transparent">
				<template #title>Ends at</template>
			</SofaTextField>

			<SofaButton :disabled="!factory.valid" padding="py-3" class="w-full" type="submit">Start</SofaButton>
		</template>

		<div v-else class="w-full flex flex-col gap-3">
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
	</form>
	<SofaEmptyState
		v-else
		title="You have no access to this quiz"
		subTitle="Get the course it is in to use"
		actionLabel="Go to course"
		:action="() => $router.push(quiz.noAccessPage)"
		:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useCreatePlay } from '@app/composables/plays/plays'
import { useHasAccess } from '@app/composables/study'
import { PlayTypes } from '@modules/plays'
import { QuizEntity } from '@modules/study'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
}>()

const { id } = useAuth()
const { hasAccess } = useHasAccess()
const router = useRouter()
const { factory, createPlay } = useCreatePlay({}, { start: false, nav: true })

const goToEdit = () => {
	props.close()
	router.push(`/study/quizzes/${props.quiz.id}/edit`)
}

const chooseMode = async (type: PlayTypes) => {
	const quizId = props.quiz.id
	factory.load(type, props.quiz)
	if (factory.isPractice) return await createPlay({ start: true }).then(() => props.close())
	if (factory.isFlashcards) return await router.push(`/study/quizzes/${quizId}/flashcards`).then(() => props.close())
}

const submit = async () => await createPlay({ start: false })

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
	{
		title: 'Assessment',
		subTitle: 'Homework/test with a deadline to share to students',
		icon: 'assessment',
		value: PlayTypes.assessments,
	},
] as const

const filteredModes = computed(() => modes.filter((t) => props.quiz.modes[t.value]))
</script>
