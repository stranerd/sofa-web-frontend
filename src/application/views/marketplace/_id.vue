<template>
	<ExpandedLayout :hide="{ bottom: true }" width="mdlg:!w-[85%] lg:!w-[75%]" layout-style="mdlg:py-4">
		<div class="mdlg:!flex hidden flex-row justify-between items-center w-full">
			<SofaNormalText :color="'text-grayColor w-full flex flex-row justify-start gap-1'">
				<span class="cursor-pointer" @click="Logic.Common.goBack()">{{ 'Marketplace ' }}</span>
				<span> / {{ contentDetails.title }}</span>
			</SofaNormalText>
		</div>
		<div
			class="w-full flex mdlg:!hidden flex-row items-center z-[100] gap-3 justify-between bg-lightGray py-4 px-4 sticky top-0 left-0">
			<SofaIcon :custom-class="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<SofaNormalText :custom-class="'!font-bold !text-base'">
				{{ contentType == 'course' ? 'Course details' : 'Quiz details' }}</SofaNormalText
			>
			<div>
				<SofaIcon :custom-class="'h-[15px] invisible'" :name="'back-arrow'" />
			</div>
		</div>
		<div class="w-full bg-white rounded-[16px] flex flex-col flex-grow overflow-y-auto">
			<SofaContentDetails
				:content="contentDetails"
				:custom-class="'!rounded-none'"
				:show-buy-button="true"
				:buy-action="buyCourse"
				:has-access="userHasAccess(contentDetails.original)"
				:similar-contents="similarContents"
				:type="contentType"
				:content-id="contentDetails.id"
				:open-quiz="() => openQuiz(contentDetails as any)"
				:actions="{
					report: () => reportMaterial(contentDetails.original!),
					share: () => shareMaterialLink(contentDetails.original!),
					save: () => saveToFolder(contentDetails.original!),
				}" />
		</div>

		<!--  Payment modal -->
		<SofaModalOld v-if="showMakePaymentModal" :close="() => (showMakePaymentModal = false)">
			<div class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative">
				<div
					class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center">
					<div class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
						<SofaHeaderText :custom-class="'text-xl'"> Choose payment method </SofaHeaderText>
					</div>

					<div
						class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-lightGray border-b px-4">
						<SofaNormalText :custom-class="'!font-bold !text-base'"> Choose payment method </SofaNormalText>
						<SofaIcon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showMakePaymentModal = false" />
					</div>

					<div class="w-full flex flex-col gap-3 mdlg:!px-0 px-4">
						<!-- Wallet -->
						<a
							:class="`w-full flex flex-row items-center gap-3 px-3 py-3  bg-lightGray ${
								selectedMethodId == 'payWithWallet' ? 'border-primaryBlue  border-2' : ''
							} rounded-custom`"
							@click="selectedMethodId = 'payWithWallet'">
							<SofaIcon :custom-class="'h-[20px]'" :name="'wallet'" />
							<SofaNormalText v-if="UserWallet">
								Wallet (<span class="!font-semibold">{{
									Logic.Common.formatPrice(UserWallet.balance.amount, UserWallet.balance.currency)
								}}</span
								>)
							</SofaNormalText>
						</a>

						<!-- Pay online -->

						<div
							class="w-full flex flex-row items-center gap-3 px-3 py-3 cursor-pointer"
							@click="Logic.Payment.initialPayment()">
							<SofaIcon :custom-class="'h-[18px]'" :name="'add-card'" />
							<SofaNormalText :color="'text-grayColor'">Add credit or debit card</SofaNormalText>
						</div>

						<a
							v-for="(method, index) in PaymentMethods?.results"
							:key="index"
							:class="`w-full flex flex-row items-center gap-3 px-3 py-3 bg-lightGray  ${
								selectedMethodId == method.id ? 'border-primaryBlue border-2' : ''
							}  rounded-custom`"
							@click="selectedMethodId = method.id">
							<SofaIcon :custom-class="'h-[20px]'" :name="'card'" />
							<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
						</a>
					</div>

					<div
						class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4">
						<div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
							<SofaButton
								:text-color="'text-grayColor'"
								:bg-color="'bg-white'"
								:padding="'px-4 py-1'"
								:custom-class="`border-2 border-gray-100 md:!min-w-[100px] md:!w-auto w-full`"
								@click="showMakePaymentModal = false">
								Exit
							</SofaButton>
						</div>

						<div class="md:!w-auto col-span-2 flex flex-col">
							<SofaButton
								:text-color="'text-white'"
								:bg-color="'bg-primaryBlue'"
								:padding="'px-4 md:!py-1 py-3'"
								:custom-class="`border-2 border-transparent md:!min-w-[100px] md:!w-auto w-full`"
								@click="buyCourse()">
								Make payment
							</SofaButton>
						</div>
					</div>
				</div>
			</div>
		</SofaModalOld>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useCreateView } from '@app/composables/interactions/views'
import { extractResource, openQuiz, reportMaterial, shareMaterialLink } from '@app/composables/library'
import { useHasAccess } from '@app/composables/study'
import { saveToFolder } from '@app/composables/study/folders'
import { InteractionEntities } from '@modules/interactions'
import { QuestionEntity, QuestionsUseCases } from '@modules/study'
import { formatTime } from '@utils/dates'
import { Conditions, Logic } from 'sofa-logic'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'MarketplaceInfoPage',
	routeConfig: {
		fetchRules: [
			{
				domain: 'Study',
				property: 'SingleCourse',
				method: 'GetCourse',
				params: [],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'course',
				},
			},
			{
				domain: 'Study',
				property: 'AllReviews',
				method: 'GetReviews',
				params: ['courses'],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'course',
				},
			},
			{
				domain: 'Study',
				property: 'SingleQuiz',
				method: 'GetQuiz',
				params: [],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'quiz',
				},
			},
			{
				domain: 'Study',
				property: 'AllReviews',
				method: 'GetReviews',
				params: ['quizzes'],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'quiz',
				},
			},
			{
				domain: 'Payment',
				property: 'UserWallet',
				method: 'GetUserWallet',
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: 'Study',
				property: 'Tags',
				method: 'GetTags',
				params: [],
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: 'Payment',
				property: 'PaymentMethods',
				method: 'GetPaymentMethods',
				params: [
					{
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
	},
	setup() {
		useMeta({
			title: 'Course Info',
		})

		const selectedTab = ref('start')

		const contentType = ref('course')

		const UserWallet = ref(Logic.Payment.UserWallet)

		const { hasAccess: userHasAccess } = useHasAccess()

		const tabItems = [
			{
				id: 'start',
				name: 'Start',
			},
			{
				id: 'questions',
				name: 'Questions',
			},
			{
				id: 'results',
				name: 'Results',
			},
		]

		const contentList = [
			{
				title: 'Alkanes',
				content: '4 materials',
			},
		]

		const SingleCourse = ref(Logic.Study.SingleCourse)
		const SingleCourseFiles = ref(Logic.Study.SingleCourseFiles)
		const SingleCourseQuizzes = ref(Logic.Study.SingleCourseQuizzes)

		const SingleQuiz = ref(Logic.Study.SingleQuiz)

		const PaymentMethods = ref(Logic.Payment.PaymentMethods)

		const AllReviews = ref(Logic.Study.AllReviews)

		const similarContents = ref<any[]>([])

		const selectedMethodId = ref('')

		const showMakePaymentModal = ref(false)

		const contentDetails = reactive(Logic.Study.contentDetails)

		const setCourseData = () => {
			if (SingleCourse.value) {
				contentDetails.original = SingleCourse.value
				contentType.value = 'course'
				contentDetails.id = SingleCourse.value.id
				contentDetails.route = `/marketplace/${SingleCourse.value.id}?type=course`
				contentDetails.type = 'course'
				contentDetails.title = SingleCourse.value.title
				contentDetails.price = SingleCourse.value.price.amount
				contentDetails.currency = SingleCourse.value.price.currency
				contentDetails.status = SingleCourse.value.status
				contentDetails.image = SingleCourse.value.photo?.link ?? '/images/default.png'
				contentDetails.info = SingleCourse.value.description
				contentDetails.lastUpdated = `Last updated ${formatTime(SingleCourse.value.createdAt)}`
				contentDetails.labels.color = 'orange'
				contentDetails.labels.main = 'Course'
				contentDetails.labels.sub = `${SingleCourse.value.sections.length} materials`
				contentDetails.tags = SingleCourse.value.tagIds.map((id) => {
					return Logic.Study.GetTagName(id)
				})
				contentDetails.user.name = SingleCourse.value.user.bio.name.full
				contentDetails.user.photoUrl = SingleCourse.value.user.bio.photo ? SingleCourse.value.user.bio.photo.link : ''
				contentDetails.user.id = SingleCourse.value.user.id
				contentDetails.user.roles = SingleCourse.value.user.roles

				contentDetails.content.materialsCount = SingleCourse.value.coursables.length

				contentDetails.ratings.label = `${SingleCourse.value.ratings.count} rating${
					SingleCourse.value.ratings.count > 1 ? 's' : ''
				}`
				contentDetails.ratings.avg = SingleCourse.value.ratings.avg
				contentDetails.ratings.count = SingleCourse.value.ratings.count

				// set reviews
				contentDetails.ratings.stats['1'] = 0
				contentDetails.ratings.stats['2'] = 0
				contentDetails.ratings.stats['3'] = 0
				contentDetails.ratings.stats['4'] = 0
				contentDetails.ratings.stats['5'] = 0

				AllReviews.value?.results.forEach((review) => {
					contentDetails.ratings.stats[`${review.rating}`]++
					contentDetails.ratings.reviews.push({
						rating: review.rating,
						review: review.message,
						user: {
							name: review.user.bio.name.full,
							photoUrl: review.user.bio.photo?.link || '',
							id: review.user.id,
						},
					})
				})

				// set sections

				contentDetails.content.sections.length = 0

				SingleCourse.value.sections.forEach((section, index) => {
					contentDetails.content.sections.push({
						title: section.label,
						opened: index == 0,
						data: [],
					})

					section.items.forEach((item) => {
						if (item.type == 'quiz') {
							const quizData = SingleCourseQuizzes.value?.filter((quiz) => quiz.id == item.id)
							if (quizData?.length) {
								contentDetails.content.sections[index].data.push({
									isLocked: true,
									sub: `${quizData[0].questions.length} question${quizData[0].questions.length > 1 ? 's' : ''}`,
									title: quizData[0].title,
									type: 'Quiz',
								})
							}
						} else {
							const fileData = SingleCourseFiles.value?.filter((file) => file.id == item.id)

							if (fileData?.length) {
								if (fileData[0].type == 'video') {
									contentDetails.content.sections[index].data.push({
										isLocked: true,
										sub: fileData[0].description,
										title: fileData[0].title,
										type: 'Video',
									})
								} else {
									contentDetails.content.sections[index].data.push({
										isLocked: true,
										sub: fileData[0].description,
										title: fileData[0].title,
										type: 'Document',
									})
								}
							}
						}
					})
				})
			}
		}

		const setQuizData = () => {
			if (SingleQuiz.value) {
				contentDetails.original = SingleQuiz.value
				contentType.value = 'quiz'
				contentDetails.type = 'quiz'
				contentDetails.id = SingleQuiz.value.id
				contentDetails.route = `/marketplace/${SingleQuiz.value.id}?type=quiz`
				contentDetails.title = SingleQuiz.value.title
				contentDetails.price = 0
				contentDetails.status = SingleQuiz.value.status
				contentDetails.image = SingleQuiz.value.photo ? SingleQuiz.value.photo.link : '/images/default.png'
				contentDetails.info = SingleQuiz.value.description
				contentDetails.lastUpdated = `Last updated ${formatTime(SingleQuiz.value.createdAt)}`
				contentDetails.labels.sub = `${SingleQuiz.value.questions.length} questions`
				contentDetails.labels.color = 'pink'
				contentDetails.labels.main = 'Quiz'
				contentDetails.tags = SingleQuiz.value.tagIds.map((id) => {
					return Logic.Study.GetTagName(id)
				})

				contentDetails.user.name = SingleQuiz.value.user?.bio.name.full
				contentDetails.user.photoUrl = SingleQuiz.value.user.bio.photo ? SingleQuiz.value.user.bio.photo.link : ''
				contentDetails.user.id = SingleQuiz.value.user.id
				contentDetails.user.roles = SingleQuiz.value.user.roles

				contentDetails.ratings.label = `${SingleQuiz.value.ratings.count} rating${SingleQuiz.value.ratings.count > 1 ? 's' : ''}`
				contentDetails.ratings.avg = SingleQuiz.value.ratings.avg
				contentDetails.ratings.count = SingleQuiz.value.ratings.count

				contentDetails.hasCourse = SingleQuiz.value.courseId ? true : false
				contentDetails.courseId = SingleQuiz.value.courseId || ''

				// set reviews
				contentDetails.ratings.stats['1'] = 0
				contentDetails.ratings.stats['2'] = 0
				contentDetails.ratings.stats['3'] = 0
				contentDetails.ratings.stats['4'] = 0
				contentDetails.ratings.stats['5'] = 0

				AllReviews.value?.results.forEach((review) => {
					contentDetails.ratings.stats[`${review.rating}`]++
					contentDetails.ratings.reviews.push({
						rating: review.rating,
						review: review.message,
						user: {
							name: review.user.bio.name.full,
							photoUrl: review.user.bio.photo?.link || '',
							id: review.user.id,
						},
					})
				})

				contentDetails.questions.length = 0
				QuestionsUseCases.getAllQuestions(SingleQuiz.value.id).then((questions) => {
					questions.results.forEach((question) => {
						contentDetails.questions.push({
							type: QuestionEntity.getLabel(question.type),
							content: question.question,
							duration: Logic.Common.prettifyTime(question.timeLimit),
							answer: '',
						})
					})
				})
			}
		}

		const buyCourse = () => {
			if (Logic.Common.loaderSetup.loading) return

			if ((SingleCourse.value?.price.amount ?? 0) > 0 && selectedMethodId.value == '') {
				showMakePaymentModal.value = true
				return
			}

			Logic.Payment.MakePurchaseForm = {
				id: SingleCourse.value?.id ?? '',
				methodId: selectedMethodId.value,
				type: 'courses',
			}

			Logic.Payment.MakePurchase()?.then((data) => {
				if (data) {
					showMakePaymentModal.value = false
					Logic.Payment.GetUserPurchases(false)
					Logic.Common.GoToRoute('/course/' + SingleCourse.value?.id)
				}
			})
		}

		const setSimilarContents = () => {
			if (SingleQuiz.value) {
				Logic.Study.GetSimilarQuizzes(SingleQuiz.value.id).then((data) => {
					similarContents.value.length = 0
					if (data) {
						data.forEach((quiz) => {
							similarContents.value.push(extractResource(quiz))
						})
					}
				})
			}

			if (SingleCourse.value) {
				Logic.Study.GetSimilarCourses(SingleCourse.value.id).then((data) => {
					similarContents.value.length = 0
					if (data) {
						data.forEach((course) => {
							similarContents.value.push(extractResource(course))
						})
					}
				})
			}
		}

		const { createView } = useCreateView()

		watch(SingleCourse, () => {
			if (SingleCourse.value) {
				setCourseData()
				setSimilarContents()
			}
		})

		watch(SingleQuiz, () => {
			if (SingleQuiz.value) {
				setQuizData()
				setSimilarContents()
			}
		})

		onMounted(() => {
			if (Logic.Common.route.query?.type?.toString()) {
				contentType.value = Logic.Common.route.query?.type?.toString()
			}
			Logic.Payment.watchProperty('PaymentMethods', PaymentMethods)
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			Logic.Study.watchProperty('SingleCourseFiles', SingleCourseFiles)
			Logic.Study.watchProperty('SingleCourseQuizzes', SingleCourseQuizzes)
			Logic.Payment.watchProperty('UserWallet', UserWallet)
			Logic.Study.watchProperty('SingleQuiz', SingleQuiz)
			Logic.Study.watchProperty('AllReviews', AllReviews)

			if (contentType.value == 'course') {
				setCourseData()
				setSimilarContents()
				if (SingleCourse.value?.isPublished) createView({ id: SingleCourse.value.id, type: InteractionEntities.courses })
			}

			if (contentType.value == 'quiz') {
				setQuizData()
				setSimilarContents()
				if (SingleQuiz.value?.isPublished) createView({ id: SingleQuiz.value.id, type: InteractionEntities.quizzes })
			}
		})

		return {
			tabItems,
			Logic,
			selectedTab,
			contentList,
			contentDetails,
			PaymentMethods,
			showMakePaymentModal,
			selectedMethodId,
			UserWallet,
			similarContents,
			SingleQuiz,
			contentType,
			saveToFolder,
			userHasAccess,
			openQuiz,
			reportMaterial,
			shareMaterialLink,
			buyCourse,
		}
	},
})
</script>
