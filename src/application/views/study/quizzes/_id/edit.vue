<template>
	<EditQuizWrapper :id="$route.params.id as string" :selectedQuestion="$route.query.q as string">
		<template #default="{ quiz, extras, members }">
			<FullLayout
				v-if="extras.canEdit"
				:hide="{ bottom: true, top: true }"
				bgColor="mdlg:bg-lightGray bg-white"
				:topbarOptions="{
					type: 'subpage',
					title: quiz.title,
					actions: [
						{
							isIcon: true,
							data: [
								{
									name: 'Share',
									icon: 'share-option',
									handler: () =>
										openAccessModal({
											quiz,
											users: members,
											grantAccess: extras.grantAccess,
											manageMembers: extras.manageMembers,
										}),
									size: 'h-[20px]',
									hide: !extras.isMine,
								},
								{
									name: 'Preview',
									icon: 'preview',
									handler: () => $router.push(`/study/quizzes/${quiz.id}/preview`),
									size: 'h-[17px]',
								},
								{
									name: 'Settings',
									icon: 'cog',
									handler: () => openEditModal(quiz),
									size: 'h-[20px]',
									hide: !extras.isMine,
								},
							],
						},
						{
							IsOutlined: true,
							name: 'Exit',
							handler: () => $router.push('/library/quizzes'),
						},
						{
							IsOutlined: false,
							hide: !extras.currentQuestionById,
							disabled: !extras.questionFactory.valid || !extras.questionFactory.hasChanges,
							name: 'Save',
							handler: () => extras.saveCurrentQuestion(),
						},
					],
					badges: [{ text: quiz.status, color: quiz.isPublished ? 'green' : 'gray' }],
				}">
				<template #left-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditQuestionsList
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
						<EditQuestionOptions
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
						<SofaIcon class="h-[19px]" name="circle-close" @click="Logic.Common.goBack()" />

						<SofaNormalText
							class="!font-bold !text-sm"
							:content="extras.currentQuestionById ? QuestionEntity.getLabel(extras.currentQuestionById.type) : ''" />

						<div class="flex items-center gap-3">
							<SofaIcon
								class="h-[18px]"
								name="share-option"
								@click="
									openAccessModal({
										quiz,
										users: members,
										grantAccess: extras.grantAccess,
										manageMembers: extras.manageMembers,
									})
								" />
							<SofaIcon class="h-[18px]" name="cog" @click="openEditModal(quiz)" />
							<SofaIcon class="h-[14px]" name="preview" @click="() => $router.push(`/study/quizzes/${quiz.id}/preview`)" />
							<SofaIcon class="h-[6px]" name="more-options-horizontal" @click="showMoreOptions = true" />
						</div>
					</div>

					<EditQuestionBody
						v-if="extras.currentQuestionById"
						:key="extras.currentQuestionById.id"
						class="w-full flex flex-col bg-white px-4 mdlg:py-4 mdlg:shadow-custom mdlg:rounded-2xl gap-4 flex-grow h-full overflow-y-auto"
						:factory="extras.questionFactory" />

					<!-- Question list for smaller screens -->
					<EditQuestionsList
						v-if="!Logic.Common.isLarge"
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
			</FullLayout>

			<SofaModal v-else-if="quiz">
				<RequestAccess :quiz="quiz" :requestAccess="extras.requestAccess" />
			</SofaModal>

			<!-- More option / settings for smaller screens -->
			<SofaModal v-if="showMoreOptions" :close="() => (showMoreOptions = false)">
				<div class="flex flex-col gap-4 justify-between">
					<div class="mdlg:hidden flex gap-2 justify-between items-center p-4 border-b border-[#F2F5F8]">
						<SofaNormalText class="!text-sm !font-bold" content="Options" />
						<SofaIcon class="h-[19px]" name="circle-close" @click="showMoreOptions = false" />
					</div>

					<EditQuestionOptions
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
							v-for="(user, index) in extras.usersByQuestions[extras.currentQuestionById?.id ?? ''] ?? []"
							:key="user.id"
							class="flex items-center gap-2">
							<SofaAvatar v-if="index < 3" :photoUrl="user.bio.photo?.link" size="36" class="-ml-1" />
							<SofaNormalText :content="user.publicName" size="lg" />
						</div>
						<SofaNormalText
							v-if="!(extras.usersByQuestions[extras.currentQuestionById?.id ?? ''] ?? []).length"
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
							class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center hover:bg-lightBlue bg-[#F2F5F8] rounded-lg"
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
						subTitle="Quiz doesn't exist. Check out other materials in the marketplace"
						actionLabel="Go to marketplace"
						:action="() => $router.push('/marketplace')"
						titleStyle="mdlg:!text-xl" />
				</div>
			</div>
		</template>
	</EditQuizWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import EditQuestionBody from '@app/components/study/questions/EditQuestionBody.vue'
import EditQuestionOptions from '@app/components/study/questions/EditQuestionOptions.vue'
import EditQuestionsList from '@app/components/study/questions/EditQuestionsList.vue'
import EditQuizWrapper from '@app/components/study/quizzes/EditQuizWrapper.vue'
import RequestAccess from '@app/components/study/quizzes/RequestAccess.vue'
import { useModals } from '@app/composables/core/modals'
import { QuestionEntity, QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'QuizIdEdit',
	components: {
		EditQuizWrapper,
		EditQuestionsList,
		EditQuestionOptions,
		EditQuestionBody,
		RequestAccess,
	},
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Edit Quiz',
		})

		const showAddQuestionModal = ref(false)

		const interactingQuestionId = ref('')

		const showMoreOptions = ref(false)
		const showCurrentlyEditingModal = ref(false)

		const openEditModal = (quiz: QuizEntity) => useModals().study.editQuiz.open({ quiz })

		const openAccessModal = useModals().study.manageAccess.open

		return {
			QuestionEntity,
			showAddQuestionModal,
			showCurrentlyEditingModal,
			showMoreOptions,
			interactingQuestionId,
			openAccessModal,
			openEditModal,
			Logic,
		}
	},
})
</script>
