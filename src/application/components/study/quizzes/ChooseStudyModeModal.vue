<template>
	<form
		v-if="hasAccess(quiz)"
		class="w-full flex flex-col mdlg:gap-6 gap-4 mdlg:p-6 p-4 items-center justify-center"
		@submit.prevent="submit">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden border-lightGray border-b">
			<SofaHeading>
				{{ factory.isGames ? 'Start quiz game' : 'Choose Study Mode' }}
			</SofaHeading>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<template v-if="factory.type && !factory.canAutoStart">
			<SofaFormGroup>
				<SofaLabel>Title</SofaLabel>
				<SofaInput v-model="factory.title" :error="factory.errors.title" placeholder="Title" />
			</SofaFormGroup>

			<SofaCheckbox v-if="factory.isGames" v-model="factory.gamesJoin" type="switch" class="w-full justify-between p-4 bg-lightGray">
				<SofaText content="Participate" />
			</SofaCheckbox>

			<SofaFormGroup v-if="factory.isAssessments">
				<SofaLabel>Ends at</SofaLabel>
				<SofaInput
					v-model="factory.assessmentsEndedAtDate"
					:error="factory.errors.assessmentsEndedAt"
					:min="factory.minAssessmentsEndedAt"
					type="datetime-local"
					placeholder="Ends at" />
			</SofaFormGroup>

			<SofaButton :disabled="!factory.valid" padding="py-3" class="w-full" type="submit">Start</SofaButton>
		</template>

		<div v-else class="w-full flex flex-col gap-3">
			<a
				v-for="item in filteredModes"
				:key="item.title"
				class="w-full mdlg:p-4 p-3 flex items-center mdlg:bg-lightGray bg-white gap-3 rounded-custom"
				@click="chooseMode(item.value)">
				<div class="flex size-[46px] items-center justify-center rounded-custom" :style="`background-color: ${item.color};`">
					<SofaIcon class="w-[20px] fill-white" :name="item.icon" />
				</div>
				<div class="w-full flex flex-col">
					<SofaHeading :content="item.title" />
					<SofaText clamp :content="item.subTitle" />
				</div>
			</a>

			<SofaHeading v-if="filteredModes.length === 0" size="mid" content="No modes supported for this quiz" />

			<SofaButton v-if="id === quiz.user.id" class="w-full" padding="p-3" @click="goToEdit"> Edit Quiz </SofaButton>
		</div>
	</form>
	<SofaEmptyState
		v-else
		title="You have no access to this quiz"
		subTitle="Get the course it is in to use"
		actionLabel="Go to course"
		:action="() => $router.push(quiz.noAccessPage)"
		:icon="{ name: 'lock', size: 'h-[28px] fill-white' }" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useRouter } from '@app/composables/core/routes'
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
const { factory, createPlay } = useCreatePlay(
	computed(() => ({})),
	{ start: false, nav: true },
)

const goToEdit = () => {
	props.close()
	router.push(`/study/quizzes/${props.quiz.id}/edit`)
}

const chooseMode = async (type: PlayTypes) => {
	factory.loadFrom(type, props.quiz)
	if (factory.canAutoStart) return await createPlay({ start: true }).then(() => props.close())
}

const submit = async () => await createPlay({ start: false })

const modes = [
	{
		title: 'Practice',
		subTitle: 'Interactive and comfortable learning',
		icon: 'quiz-practice',
		value: PlayTypes.practice,
		color: '#FF4BC8',
	},
	{
		title: 'Test',
		subTitle: 'Evaluate your level of knowledge',
		icon: 'quiz-tests',
		value: PlayTypes.tests,
		color: '#6419C8',
	},
	{
		title: 'Flashcards',
		subTitle: 'Digital cards to memorize answers',
		icon: 'quiz-flashcards',
		value: PlayTypes.flashcards,
		color: '#4BAF7D',
	},
	{
		title: 'Game',
		subTitle: 'Battle friends for the highest score',
		icon: 'quiz-games',
		value: PlayTypes.games,
		color: '#FA9632',
	},
	{
		title: 'Assessment',
		subTitle: 'Homework/test with a deadline to share to students',
		icon: 'quiz-assessments',
		value: PlayTypes.assessments,
		color: '#3296C8',
	},
] as const

const filteredModes = computed(() => modes.filter((t) => props.quiz.modes[t.value]))
</script>
