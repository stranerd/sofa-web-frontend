<template>
	<SofaModal v-if="showStudyMode" :close="() => (showStudyMode = false)">
		<div v-if="hasAccess(selectedQuiz)" class="w-full flex flex-col md:gap-4 gap-2 mdlg:p-6 md:p-4 items-center justify-center">
			<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-3 border-lightGray border-b px-4">
				<sofa-normal-text :custom-class="'!font-bold !text-base'">
					{{ selectedQuizMode == 'game' ? 'Start quiz game' : 'Choose Study Mode' }}
				</sofa-normal-text>
				<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showStudyMode = false" />
			</div>

			<div v-if="selectedQuizMode != 'game'" class="w-full flex flex-col gap-3 px-4 py-2 md:p-0">
				<sofa-icon-card
					v-for="(item, index) in otherTasks"
					:key="index"
					:data="item"
					:custom-class="'!bg-lightGray !w-full !shadow-none'"
					@click="item.actionFn(selectedQuiz, item.key)">
					<template #title>
						<sofa-normal-text :custom-class="'!font-bold'">
							{{ item.title }}
						</sofa-normal-text>
					</template>
				</sofa-icon-card>

				<sofa-button
					v-if="Logic.Common.AuthUser?.id == selectedQuiz?.user.id"
					:custom-class="'w-full'"
					:padding="'py-3'"
					@click="goToEdit">
					Edit Quiz
				</sofa-button>
			</div>

			<div v-else class="w-full flex flex-col gap-3 p-4">
				<a
					class="w-full rounded-custom p-4 bg-lightGray flex items-center justify-between"
					@click="userIsParticipating = !userIsParticipating">
					<sofa-normal-text>Participate</sofa-normal-text>
					<sofa-icon :custom-class="'h-[22px] z-50'" :name="userIsParticipating ? 'toggle-on' : 'toggle-off'" />
				</a>

				<div class="w-full flex flex-col items-center justify-between pt-3">
					<div class="w-full flex flex-col">
						<sofa-button :padding="'py-3'" :custom-class="'w-full'" @click="createQuizGame"> Start </sofa-button>
					</div>
				</div>
			</div>
		</div>
		<SofaEmptyState
			v-else
			title="You have no access to this quiz"
			sub-title="Get the course it is in to use"
			action-label="Go to course"
			:action="() => Logic.Common.GoToRoute(`/marketplace/${selectedQuiz.courseId}?type=course`)"
			:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
	</SofaModal>
</template>

<script lang="ts">
import { moreOptions, openQuiz, showMoreOptionHandler, showMoreOptions, showStudyMode } from '@/composables/library'
import { createQuizGame, otherTasks, selectedQuiz, selectedQuizMode, userIsParticipating } from '@/composables/quiz'
import { useHasAccess } from '@/composables/study/study'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaEmptyState, SofaIcon, SofaIconCard, SofaModal2 as SofaModal, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'StudyModeModal',
	components: {
		SofaIcon,
		SofaNormalText,
		SofaModal,
		SofaIconCard,
		SofaButton,
		SofaEmptyState,
	},
	setup() {
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
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			openQuiz,
			hasAccess,
		}
	},
})
</script>
