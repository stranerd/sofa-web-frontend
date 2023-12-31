<template>
	<QuizWrapper :id="$route.params.id as string" :selected-question="$route.query.q as string" :skip-members="false">
		<template #default="{ quiz, extras, members }">
			<dashboard-layout
				v-if="extras.canEdit"
				:hide="{ bottom: true, top: true }"
				bg-color="mdlg:bg-lightGray bg-white"
				:topbar-options="{
					type: 'subpage',
					title: quiz.title,
					actions: [
						{
							isIcon: true,
							data: [
								{
									name: 'Share',
									icon: 'share-option',
									handler: () => (showShareModal = true),
									size: 'h-[20px]',
									hide: !extras.isMine,
								},
								{
									name: 'Preview',
									icon: 'preview',
									handler: () => Logic.Common.GoToRoute(`/quiz/${quiz.id}/preview`),
									size: 'h-[17px]',
								},
								{
									name: 'Settings',
									icon: 'cog',
									handler: () => (showSettingModal = true),
									size: 'h-[20px]',
									hide: !extras.isMine,
								},
							],
						},
						{
							IsOutlined: true,
							name: 'Exit',
							handler: () => Logic.Common.goBack(),
						},
						{
							IsOutlined: false,
							hide: !extras.currentQuestionById,
							disabled: !extras.questionFactory.valid || !extras.questionFactory.hasChanges,
							name: 'Save',
							handler: () => extras.saveCurrentQuestion(),
						},
					],
					badges: [{ text: quiz.status, color: quiz.status === 'published' ? 'green' : 'gray' }],
				}">
				<template #left-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<SofaAddQuestion
							v-model:questionId="extras.selectedQuestionId"
							:quiz="quiz"
							:users="extras.usersByQuestions"
							:questions="extras.sortedQuestions"
							:factory="extras.questionFactory"
							@addQuestion="showAddQuestionModal = true"
							@duplicateQuestion="(question) => extras.duplicateQuestion(question)"
							@deleteQuestion="(id) => extras.deleteQuestion(id)"
							@reorderQuestions="(ids) => extras.reorderQuestions(ids)" />
					</div>
				</template>

				<template #right-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto justify-between">
						<SofaQuestionOptions
							v-if="extras.currentQuestionById"
							:quiz="quiz"
							:question="extras.currentQuestionById"
							:factory="extras.questionFactory"
							:users="extras.usersByQuestions"
							:close="() => (showMoreOptions = false)"
							@showCurrentlyEditing="showCurrentlyEditingModal = true"
							@saveQuestion="extras.saveCurrentQuestion()"
							@duplicateQuestion="
								(question) => {
									showMoreOptions = false
									extras.duplicateQuestion(question)
								}
							"
							@deleteQuestion="
								(id) => {
									showMoreOptions = false
									extras.deleteQuestion(id)
								}
							"
							@deleteQuiz="
								() => {
									showMoreOptions = false
									extras.deleteQuiz()
								}
							" />
					</div>
				</template>

				<template #middle-session>
					<!-- Top bar for smaller screens -->
					<div class="w-full flex mdlg:!hidden justify-between items-center bg-lightGray p-4">
						<SofaIcon class="h-[19px]" name="circle-close" @click="handleMobileGoback" />

						<SofaNormalText
							class="!font-bold !text-sm"
							:content="showSettingModal ? 'Update quiz' : QuestionEntity.getLabel(extras.currentQuestionById?.type)" />

						<div class="flex items-center gap-3" :class="{ invisible: showSettingModal }">
							<SofaIcon class="h-[18px]" name="share-option" @click="showShareModal = true" />
							<SofaIcon class="h-[18px]" name="cog" @click="showSettingModal = true" />
							<SofaIcon class="h-[14px]" name="preview" @click="() => Logic.Common.GoToRoute(`/quiz/${quiz.id}/preview`)" />
							<SofaIcon class="h-[6px]" name="more-options-horizontal" @click="showMoreOptions = true" />
						</div>
					</div>

					<div
						class="w-full flex flex-col bg-white px-4 mdlg:py-4 flex-grow h-full overflow-y-auto"
						:class="{ 'mdlg:shadow-custom mdlg:rounded-2xl gap-4': !showSettingModal }">
						<SofaQuestionContent
							v-if="!showSettingModal && extras.currentQuestionById"
							:key="extras.currentQuestionById.id"
							:factory="extras.questionFactory" />
						<QuizSettings
							v-if="showSettingModal && !Logic.Common.isLarge"
							:quiz="quiz"
							:factory="extras.quizFactory"
							:close="() => (showSettingModal = false)"
							@updateQuiz="extras.updateQuiz().then(handleSettingSaved)"
							@publishQuiz="extras.publishQuiz().then(handleSettingSaved)" />
					</div>

					<!-- Add question for smaller screens -->
					<SofaAddQuestion
						v-if="!Logic.Common.isLarge && !showSettingModal"
						v-model:questionId="extras.selectedQuestionId"
						:quiz="quiz"
						:users="extras.usersByQuestions"
						:factory="extras.questionFactory"
						:questions="extras.sortedQuestions"
						@addQuestion="showAddQuestionModal = true"
						@duplicateQuestion="(question) => extras.duplicateQuestion(question)"
						@deleteQuestion="(id) => extras.deleteQuestion(id)"
						@reorderQuestions="(ids) => extras.reorderQuestions(ids)" />
				</template>
			</dashboard-layout>

			<RequestAccessModal v-else-if="quiz" :quiz="quiz" @requestAccess="extras.requestAccess" />

			<ManageAccessModal
				v-if="showShareModal"
				:quiz="quiz"
				:users="members"
				@grantAccess="extras.grantAccess"
				@manageMembers="extras.manageMembers"
				@close="showShareModal = false" />

			<!-- Larger screen setings modal -->
			<SofaModal v-if="showSettingModal && Logic.Common.isLarge">
				<div class="bg-white w-full flex flex-col gap-4 mdlg:p-6 p-4 rounded-2xl items-center justify-center">
					<SofaHeaderText class="!text-xl !font-bold" content="Update quiz" />
					<QuizSettings
						:quiz="quiz"
						:factory="extras.quizFactory"
						:close="() => (showSettingModal = false)"
						@updateQuiz="extras.updateQuiz().then(handleSettingSaved)"
						@publishQuiz="extras.publishQuiz().then(handleSettingSaved)" />
				</div>
			</SofaModal>

			<!-- More option / settings for smaller screens -->
			<SofaModal v-if="showMoreOptions" :close="() => (showMoreOptions = false)">
				<div class="flex flex-col gap-4 justify-between">
					<div class="mdlg:hidden flex gap-2 justify-between items-center p-4 border-b bg-white border-[#F2F5F8]">
						<SofaNormalText class="!text-sm !font-bold" content="Options" />
						<SofaIcon class="h-[19px]" name="circle-close" @click="showMoreOptions = false" />
					</div>

					<SofaQuestionOptions
						v-if="extras.currentQuestionById"
						:quiz="quiz"
						:question="extras.currentQuestionById"
						:users="extras.usersByQuestions"
						:factory="extras.questionFactory"
						:close="() => (showMoreOptions = false)"
						@showCurrentlyEditing="showCurrentlyEditingModal = true"
						@saveQuestion="extras.saveCurrentQuestion()"
						@duplicateQuestion="
							(question) => {
								showMoreOptions = false
								extras.duplicateQuestion(question)
							}
						"
						@deleteQuestion="
							(id) => {
								showMoreOptions = false
								extras.deleteQuestion(id)
							}
						"
						@deleteQuiz="
							() => {
								showMoreOptions = false
								extras.deleteQuiz()
							}
						" />
				</div>
			</SofaModal>

			<SofaModal v-if="showCurrentlyEditingModal" :close="() => (showCurrentlyEditingModal = false)">
				<div class="flex flex-col p-6 gap-6 justify-between">
					<div class="mdlg:hidden flex gap-2 justify-between items-center">
						<SofaHeaderText content="Currently editing" />
						<SofaIcon class="h-[19px]" name="circle-close" @click="showCurrentlyEditingModal = false" />
					</div>
					<div class="flex flex-col gap-4 w-full">
						<div
							v-for="(user, index) in extras.usersByQuestions[extras.currentQuestionById?.id] ?? []"
							:key="user.id"
							class="flex items-center gap-2">
							<SofaAvatar v-if="index < 3" :photo-url="user.bio.photo?.link" size="36" class="-ml-1" />
							<SofaNormalText :content="user.bio.name.full" size="lg" />
						</div>
						<SofaNormalText
							v-if="!(extras.usersByQuestions[extras.currentQuestionById?.id] ?? []).length"
							content="No users currently editing this question"
							size="xl" />
					</div>
				</div>
			</SofaModal>

			<SofaModal v-if="showAddQuestionModal" :close="() => (showAddQuestionModal = false)">
				<div class="w-full flex flex-col mdlg:p-6 gap-4 p-4 items-center justify-center">
					<div class="w-full text-center hidden md:inline-block">
						<SofaHeaderText class="!text-xl !font-bold" content="Choose question type" />
					</div>

					<div class="w-full flex justify-between items-center md:!hidden">
						<SofaNormalText class="!font-bold !text-base" content="Choose question type" />
						<SofaIcon class="h-[16px]" name="circle-close" @click="showAddQuestionModal = false" />
					</div>

					<div class="w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 gap-4">
						<a
							v-for="type in QuestionEntity.getAllTypes()"
							:key="type.value"
							class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center hover:bg-skyBlue bg-[#F2F5F8] rounded-lg"
							@click="extras.addQuestion(type.value).then(() => (showAddQuestionModal = false))">
							<SofaIcon :name="type.icon" class="h-[50px]" />
							<SofaNormalText :content="type.label" />
						</a>
					</div>
				</div>
			</SofaModal>
		</template>

		<template #notfound>
			<div class="w-full flex flex-col items-center justify-center p-4">
				<div class="mdlg:w-[60%] w-full h-full flex flex-col">
					<SofaEmptyState
						title="Quiz not found"
						sub-title="Quiz doesn't exist. Check out other materials in the marketplace"
						action-label="Go to marketplace"
						:action="() => Logic.Common.GoToRoute('/marketplace')"
						title-style="mdlg:!text-xl" />
				</div>
			</div>
		</template>
	</QuizWrapper>
</template>

<script lang="ts">
import ManageAccessModal from '@/components/quizzes/ManageAccessModal.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import RequestAccessModal from '@/components/quizzes/RequestAccessModal.vue'
import QuizSettings from '@/components/quizzes/Settings.vue'
import { generateMiddlewares } from '@/middlewares'
import { QuestionEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import {
	SofaAddQuestion,
	SofaAvatar,
	SofaEmptyState,
	SofaHeaderText,
	SofaIcon,
	SofaModal2 as SofaModal,
	SofaNormalText,
	SofaQuestionContent,
	SofaQuestionOptions,
} from 'sofa-ui-components'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdEdit',
	components: {
		QuizWrapper,
		SofaIcon,
		SofaAvatar,
		SofaEmptyState,
		SofaNormalText,
		SofaQuestionOptions,
		SofaModal,
		QuizSettings,
		SofaAddQuestion,
		SofaQuestionContent,
		SofaHeaderText,
		RequestAccessModal,
		ManageAccessModal,
	},
	middlewares: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		useMeta({
			title: 'Edit Quiz',
		})

		const showAddQuestionModal = ref(false)

		const interactingQuestionId = ref('')

		const showSettingModal = ref(false)
		const showMoreOptions = ref(false)
		const showShareModal = ref(false)
		const showCurrentlyEditingModal = ref(false)

		const handleSettingSaved = (status: boolean) => {
			if (status) showSettingModal.value = false
		}

		const handleMobileGoback = () => {
			if (showSettingModal.value) showSettingModal.value = false
			else Logic.Common.goBack()
		}

		return {
			QuestionEntity,
			showAddQuestionModal,
			showCurrentlyEditingModal,
			showShareModal,
			showMoreOptions,
			showSettingModal,
			interactingQuestionId,
			handleSettingSaved,
			Logic,
			handleMobileGoback,
		}
	},
})
</script>
