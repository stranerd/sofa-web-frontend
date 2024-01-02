<template>
	<SofaModal v-if="showStudyMode" :close="() => showStudyMode = false">
		<div v-if="hasAccess(selectedQuiz)"
			class="w-full flex flex-col md:gap-4 gap-2 mdlg:p-6 md:p-4 items-center justify-center">
			<div
				class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-3 border-lightGray border-b px-4">
				<sofa-normal-text :customClass="'!font-bold !text-base'">
					{{
						selectedQuizMode == "game" ? "Start quiz game" : "Choose Study Mode"
					}}
				</sofa-normal-text>
				<sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showStudyMode = false" />
			</div>

			<div class="w-full flex flex-col gap-3 px-4 py-2 md:p-0" v-if="selectedQuizMode != 'game'">
				<sofa-icon-card :data="item" v-for="(item, index) in otherTasks" :key="index"
					@click="item.actionFn(selectedQuiz, item.key)" :customClass="'!bg-lightGray !w-full !shadow-none'">
					<template v-slot:title>
						<sofa-normal-text :customClass="'!font-bold'">
							{{ item.title }}
						</sofa-normal-text>
					</template>
				</sofa-icon-card>

				<sofa-button :customClass="'w-full'" :padding="'py-3'"
					v-if="Logic.Common.AuthUser?.id == selectedQuiz?.user.id" @click="goToEdit">Edit Quiz</sofa-button>
			</div>

			<div class="w-full flex flex-col gap-3 p-4" v-else>
				<a @click="userIsParticipating = !userIsParticipating"
					class="w-full rounded-custom p-4 bg-lightGray flex items-center justify-between">
					<sofa-normal-text>Participate</sofa-normal-text>
					<sofa-icon :customClass="'h-[22px] z-50'" :name="userIsParticipating ? 'toggle-on' : 'toggle-off'" />
				</a>

				<div class="w-full flex flex-col items-center justify-between pt-3">
					<div class="w-full flex flex-col">
						<sofa-button :padding="'py-3'" :customClass="'w-full'" @click="createQuizGame">
							Start
						</sofa-button>
					</div>
				</div>
			</div>
		</div>
		<SofaEmptyState v-else title="You have no access to this quiz" subTitle="Get the course it is in to use"
			actionLabel="Go to course"
			:action="() => Logic.Common.GoToRoute(`/marketplace/${selectedQuiz.courseId}?type=course`)"
			:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
	</SofaModal>
</template>

<script lang="ts">
import {
	AllQuzzies,
	moreOptions,
	openQuiz,
	showMoreOptionHandler,
	showMoreOptions,
	showStudyMode,
} from '@/composables/library'
import {
	createQuizGame,
	otherTasks,
	selectedQuiz,
	selectedQuizMode,
	userIsParticipating,
} from '@/composables/quiz'
import { useHasAccess } from '@/composables/study/study'
import { Logic } from 'sofa-logic'
import {
	SofaButton,
	SofaEmptyState,
	SofaIcon,
	SofaIconCard,
	SofaModal2 as SofaModal,
	SofaNormalText
} from 'sofa-ui-components'
import { defineComponent } from 'vue'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		SofaModal,
		SofaIconCard,
		SofaButton,
		SofaEmptyState
	},
	name: 'StudyModeModal',
	setup () {
		const goToEdit = () => {
			showStudyMode.value = false
			Logic.Common.GoToRoute(`/quiz/${selectedQuiz.value?.id}/edit`)
		}

		const { hasAccess } = useHasAccess()

		return {
			goToEdit,
			Logic,
			showStudyMode,
			selectedQuiz,
			otherTasks,
			selectedQuizMode,
			userIsParticipating,
			createQuizGame,
			AllQuzzies,
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			openQuiz,
			hasAccess,
		}
	},
})
</script>