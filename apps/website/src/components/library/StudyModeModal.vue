<template>
	<sofa-modal v-if="showStudyMode" :close="() => showStudyMode = false">
		<div class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
			@click.stop="() => {
				//
			}
				">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
				<div
					class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4">
					<sofa-normal-text :customClass="'!font-bold !text-base'">
						{{
							selectedQuizMode == "game"
							? "Start quiz game"
							: "Choose Study Mode"
						}} -- {{ selectedQuizMode }}
					</sofa-normal-text>
					<sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showStudyMode = false" />
				</div>

				<div class="w-full flex flex-col gap-3 px-4 py-4" v-if="selectedQuizMode != 'game'">
					<sofa-icon-card :data="item" v-for="(item, index) in otherTasks" :key="index"
						@click="item.actionFn(selectedQuizId, item.key)"
						:customClass="'!bg-[#F1F6FA] !w-full !shadow-none'">
						<template v-slot:title>
							<sofa-normal-text :customClass="'!font-bold'">
								{{ item.title }}
							</sofa-normal-text>
						</template>
					</sofa-icon-card>

					<div class="w-full flex flex-col">
						<sofa-button :customClass="'w-full'" :padding="'py-3'" v-if="Logic.Auth.AuthUser?.id ==
							AllQuzzies?.results.find(
								(item) => item.id == selectedQuizId
							)?.user.id
							" @click="goToEdit">Edit Quiz</sofa-button>
					</div>
				</div>

				<div class="w-full flex flex-col gap-3 py-4 px-4" v-else>
					<div @click="
						userIsParticipating
							? (userIsParticipating = false)
							: (userIsParticipating = true)
						" class="w-full custom-border py-4 px-4 bg-backgroundGray flex flex-row cursor-pointer items-center justify-between">
						<sofa-normal-text>Participate</sofa-normal-text>
						<sofa-icon :customClass="'h-[22px] z-50'"
							:name="userIsParticipating ? 'toggle-on' : 'toggle-off'" />
					</div>

					<div class="w-full flex flex-col items-center justify-between pt-3">
						<div class="w-full flex flex-col">
							<sofa-button :padding="'py-3'" :customClass="'w-full'" @click="createQuizGame(selectedQuizId)">
								Start
							</sofa-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</sofa-modal>
</template>

<script lang="ts">
import {
	AllQuzzies,
	moreOptions,
	openQuiz,
	showMoreOptionHandler,
	showMoreOptions,
	showStudyMode,
} from "@/composables/library"
import {
	createQuizGame,
	goToStudyMode,
	otherTasks,
	selectedQuizId,
	selectedQuizMode,
	userIsParticipating,
} from "@/composables/quiz"
import { Logic } from "sofa-logic"
import {
	SofaButton,
	SofaIcon,
	SofaIconCard,
	SofaModal,
	SofaNormalText
} from "sofa-ui-components"
import { defineComponent } from "vue"

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		SofaModal,
		SofaIconCard,
		SofaButton,
	},
	name: "StudyModeModal",
	setup () {
		const goToEdit = () => {
			showStudyMode.value = false
			Logic.Common.GoToRoute(`/quiz/create?id=${selectedQuizId}`)
		}

		return {
			goToEdit,
			Logic,
			showStudyMode,
			selectedQuizId,
			goToStudyMode,
			otherTasks,
			selectedQuizMode,
			userIsParticipating,
			createQuizGame,
			AllQuzzies,
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			openQuiz,
		}
	},
})
</script>