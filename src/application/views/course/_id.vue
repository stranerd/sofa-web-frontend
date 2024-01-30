<template>
	<ExpandedLayout v-if="SingleCourse" width="mdlg:!w-[90%] lg:!w-[77%]" layoutStyle="mdlg:py-5" :hide="{ bottom: true }">
		<!-- Display for larger screens -->
		<div v-if="!Logic.Common.isOnlyMobile" class="w-full mdlg:grid grid-cols-11 gap-4 flex-grow">
			<div class="mdlg:col-span-3 flex flex-col col-span-full lg:max-h-[600px] mdlg:max-h-[600px]">
				<div class="w-full shadow-custom bg-white rounded-[16px] h-full flex flex-col pb-4">
					<div
						class="flex flex-col h-full overflow-y-auto relative scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin">
						<div
							class="w-full px-4 py-4 sticky top-0 left-0 bg-white z-30 rounded-t-[16px] flex flex-row items-center justify-between">
							<SofaHeaderText customClass="!font-bold !text-left !line-clamp-1">
								{{ SingleCourse?.title }}
							</SofaHeaderText>

							<div v-if="!CourseReview && Logic.Common.AuthUser?.id != SingleCourse?.user.id">
								<SofaButton customClass="" padding="px-4 py-1" @click="showRateCourse">Rate</SofaButton>
							</div>
						</div>

						<SofaCourseContent
							v-model="selectedMaterial"
							:lockContent="!isUnlocked(SingleCourse)"
							@onMaterialSelected="handleItemSelected" />
					</div>
				</div>
			</div>
			<div :class="`mdlg:col-span-8 flex flex-col col-span-full ${selectedMaterial?.type == 'document' ? 'h-full' : 'h-fit'} `">
				<CourseContent
					:buyCourse="buyCourse"
					:isUnlocked="isUnlocked(SingleCourse)"
					:selectedMaterial="selectedMaterial"
					:singleCourse="SingleCourse" />
			</div>
		</div>

		<div class="w-full flex flex-col gap-2 fixed top-0 left-0 h-full bg-white mdlg:hidden overflow-y-auto">
			<!-- Top bar for smaller screens -->
			<div
				class="w-full flex flex-row mdlg:!hidden justify-between items-center z-[100] bg-white px-4 py-4 sticky top-0 left-0 overflow-y-auto">
				<SofaIcon customClass="h-[15px]" name="back-arrow" @click="handleMobileGoback()" />
			</div>

			<!-- Content for smaller screens -->
			<div class="w-full flex flex-col gap-2 overflow-y-auto relative flex-grow">
				<template v-if="!showCourseContent">
					<div class="w-full flex flex-col gap-2 px-4 pb-3 items-start justify-start sticky top-0 left-0">
						<SofaHeaderText customClass="!font-bold !text-xl !text-left">
							{{ SingleCourse.title }}
						</SofaHeaderText>
						<SofaNormalText customClass="text-left">
							{{ SingleCourse.description }}
						</SofaNormalText>
					</div>

					<SofaCourseContent
						v-model="selectedMaterial"
						:lockContent="!isUnlocked(SingleCourse)"
						@onMaterialSelected="handleItemSelected"
						@onCourseContentSet="handleCourseContentSet" />
				</template>

				<template v-else>
					<div class="flex flex-col w-full">
						<div :class="`w-full flex flex-col col-span-full  ${selectedMaterial?.type == 'document' ? 'h-full' : 'h-fit'} `">
							<CourseContent
								:buyCourse="buyCourse"
								:isUnlocked="isUnlocked(SingleCourse)"
								:selectedMaterial="selectedMaterial"
								:singleCourse="SingleCourse" />
						</div>
					</div>
				</template>
			</div>

			<!-- Course content slider -->
			<div
				v-if="selectedMaterial && showCourseContent"
				class="absolute bottom-0 left-0 pl-4 py-4 bg-white drop-shadow-2xl rounded-t-[16px] flex flex-col gap-2 items-center justify-center w-full">
				<SofaNormalText customClass="!font-bold">
					{{ SingleCourse.title }}
				</SofaNormalText>
				<div class="w-full flex flex-row gap-3 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<div
						id="sm-materials-container"
						class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
						<template v-for="(section, index) in courseContents" :key="index">
							<template v-for="(item, itemIndex) in section.materials" :key="itemIndex">
								<div
									:id="`sm-material-${item.id}`"
									:class="`w-[280px] rounded-custom px-3 py-3 ${
										selectedMaterial.id == item.id ? 'bg-primaryPurple' : 'bg-white border-2 border-grayColor'
									}  flex flex-col gap-1`"
									@click="selectItem(item)">
									<SofaNormalText
										:color="`${selectedMaterial.id == item.id ? '!text-white' : '!text-bodyBlack'} `"
										customClass="!text-left">
										{{ section.name }} - {{ item.name }}
									</SofaNormalText>

									<div class="w-full flex flex-row items-center gap-2">
										<SofaIcon
											:name="`${item.type}${selectedMaterial.id == item.id ? '-white' : ''}` as any"
											customClass="h-[15px]" />
										<SofaNormalText
											:color="`${selectedMaterial.id == item.id ? '!text-white' : '!text-bodyBlack'} `"
											customClass="!text-left">
											{{ item.type.split('-')[0] }}
										</SofaNormalText>
									</div>
								</div>
							</template>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- Small screen course info -->

		<SofaModalOld
			v-if="showCourseInfo"
			:close="
				() => {
					showCourseInfo = false
				}
			">
			<div
				class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-[80%] md:w-[70%] flex flex-col items-center relative"
				@click.stop="
					() => {
						//
					}
				">
				<div
					class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 overflow-y-auto h-full lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
					<div
						class="w-full flex flex-row justify-between items-center sticky bg-white z-40 top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
						<SofaNormalText customClass="!font-bold !text-base"> Course details </SofaNormalText>
						<SofaIcon customClass="h-[19px]" name="circle-close" @click="showCourseInfo = false" />
					</div>

					<SofaCourseSummary :data="SingleCourse" />
				</div>
			</div>
		</SofaModalOld>

		<!--  Payment modal -->
		<SofaModalOld
			v-if="showMakePaymentModal"
			:close="
				() => {
					showMakePaymentModal = false
				}
			">
			<div
				class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative"
				@click.stop="
					() => {
						//
					}
				">
				<div
					class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center">
					<div class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
						<SofaHeaderText customClass="text-xl"> Choose payment method </SofaHeaderText>
					</div>

					<div
						class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-lightGray border-b px-4">
						<SofaNormalText customClass="!font-bold !text-base"> Choose payment method </SofaNormalText>
						<SofaIcon customClass="h-[19px]" name="circle-close" @click="showMakePaymentModal = false" />
					</div>

					<div class="w-full flex flex-col gap-3 mdlg:!px-0 px-4">
						<!-- Wallet -->
						<div
							:class="`w-full flex flex-row items-center gap-3 px-3 py-3  bg-lightGray ${
								selectedMethodId == 'payWithWallet' ? 'border-primaryBlue border-2' : ''
							}  rounded-custom cursor-pointer `"
							@click="selectedMethodId = 'payWithWallet'">
							<SofaIcon customClass="h-[20px]" name="wallet" />
							<SofaNormalText v-if="UserWallet">
								Wallet (<span class="!font-semibold">{{
									Logic.Common.formatPrice(UserWallet.balance.amount, UserWallet.balance.currency)
								}}</span
								>)
							</SofaNormalText>
						</div>

						<!-- Pay online -->

						<div
							class="w-full flex flex-row items-center gap-3 px-3 py-3 cursor-pointer"
							@click="Logic.Payment.initialPayment()">
							<SofaIcon customClass="h-[18px]" name="add-card" />
							<SofaNormalText color="text-grayColor">Add credit or debit card</SofaNormalText>
						</div>

						<div
							v-for="(method, index) in PaymentMethods?.results ?? []"
							:key="index"
							:class="`w-full flex flex-row items-center gap-3 px-3 py-3 bg-lightGray  ${
								selectedMethodId == method.id ? 'border-primaryBlue border-2' : ''
							}  rounded-custom cursor-pointer `"
							@click="selectedMethodId = method.id">
							<SofaIcon customClass="h-[20px]" name="card" />
							<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
						</div>
					</div>

					<div
						class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4">
						<div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
							<SofaButton
								textColor="text-grayColor"
								bgColor="bg-white"
								padding="px-4 py-1"
								customClass="border-2 border-gray-100 md:!min-w-[100px] md:!w-auto w-full"
								@click="showMakePaymentModal = false">
								Exit
							</SofaButton>
						</div>

						<div class="md:!w-auto col-span-2 flex flex-col">
							<SofaButton
								textColor="text-white"
								bgColor="bg-primaryBlue"
								padding="px-4 md:!py-1 py-3"
								customClass="border-2 border-transparent md:!min-w-[100px] md:!w-auto w-full"
								@click="buyCourse()">
								Make payment
							</SofaButton>
						</div>
					</div>
				</div>
			</div>
		</SofaModalOld>

		<!-- Rating floating button sm -->
		<Teleport v-if="!CourseReview && Logic.Common.AuthUser?.id != SingleCourse?.user.id && !Logic.Common.isLarge" to="body">
			<span class="absolute bottom-[3%] right-[2%] z-[1000] flex flex-row items-center justify-center h-[70px] w-[70px]">
				<span
					class="h-[60px] w-[60px] flex flex-col justify-center items-center rounded-full shadow-custom bg-primaryBlue cursor-pointer"
					@click="showRateCourse">
					<SofaIcon name="star-white" customClass="h-[15px]"></SofaIcon>
					<SofaNormalText color="text-white"> Rate </SofaNormalText>
				</span>
			</span>
		</Teleport>
	</ExpandedLayout>
</template>

<script lang="ts">
import CourseContent from '@app/components/study/courses/content.vue'
import { useModals } from '@app/composables/core/modals'
import { useCreateView } from '@app/composables/interactions/views'
import { useHasAccess } from '@app/composables/study'
import { InteractionEntities } from '@modules/interactions'
import { Conditions, Logic } from 'sofa-logic'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'CourseDetailsPage',
	components: { CourseContent },
	routeConfig: {
		fetchRules: [
			{
				domain: 'Study',
				property: 'SingleCourse',
				method: 'GetCourse',
				params: [],
				useRouteId: true,
				ignoreProperty: true,
			},
			{
				domain: 'Study',
				property: 'Tags',
				method: 'GetTags',
				params: [],
				requireAuth: true,
				ignoreProperty: false,
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
				property: 'SingleReview',
				method: 'GetSingleReview',
				params: ['courses'],
				useRouteId: true,
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
			mobileTitle: 'Course Details',
		})

		const SingleCourse = ref(Logic.Study.SingleCourse)

		const mobileTitle = ref(Logic.Study.SingleCourse?.title ?? '')

		const UserWallet = ref(Logic.Payment.UserWallet)
		const PaymentMethods = ref(Logic.Payment.PaymentMethods)
		const selectedMethodId = ref('')
		const showMakePaymentModal = ref(false)

		const CourseReview = ref(Logic.Study.SingleReview)

		const selectedMaterial = ref<any>()

		const showCourseContent = ref(false)

		const courseContents = reactive<any[]>([])

		const showCourseInfo = ref(false)

		const { hasAccess: isUnlocked } = useHasAccess()

		const handleItemSelected = (data: any) => {
			if (data) {
				selectedMaterial.value = data

				if (Logic.Common.isOnlyMobile) {
					showCourseContent.value = true

					setTimeout(() => {
						const materialContianer = document.getElementById('sm-materials-container')

						if (materialContianer) {
							document.getElementById(`sm-material-${selectedMaterial.value.id}`)?.scrollIntoView({
								behavior: 'smooth',
							})
						}
					}, 500)
				} else {
					if (!data.isMounted) {
						showCourseContent.value = false
					}
				}
			}
		}

		const selectItem = (material: any) => {
			if (isUnlocked.value(SingleCourse.value ?? null)) {
				selectedMaterial.value = {
					id: material.id,
					data: material.data,
					details: material.details,
					type: material.type.split('-')[0],
					name: material.name,
				}
			}
		}

		const handleMobileGoback = () => {
			if (showCourseContent.value) {
				showCourseContent.value = false
			} else {
				Logic.Common.goBack()
			}
		}

		const showRateCourse = () =>
			useModals().interactions.createReview.open({
				id: SingleCourse.value?.id ?? '',
				type: InteractionEntities.courses,
			})

		const buyCourse = () => {
			if (Logic.Common.loaderSetup.loading || !SingleCourse.value) return

			if (SingleCourse.value.price.amount > 0 && selectedMethodId.value == '') {
				showMakePaymentModal.value = true
				return
			}

			Logic.Payment.MakePurchaseForm = {
				id: SingleCourse.value.id,
				methodId: selectedMethodId.value,
				type: 'courses',
			}

			Logic.Payment.MakePurchase()?.then((data) => {
				if (data) {
					showMakePaymentModal.value = false
					Logic.Payment.GetUserPurchases(false)
					Logic.Study.GetCourse(SingleCourse.value!.id)
				}
			})
		}

		const handleCourseContentSet = (data: any) => {
			courseContents.length = 0
			courseContents.push(...data)
		}

		const { createView } = useCreateView()

		onMounted(() => {
			Logic.Payment.watchProperty('PaymentMethods', PaymentMethods)
			Logic.Payment.watchProperty('UserWallet', UserWallet)
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			Logic.Study.watchProperty('SingleReview', CourseReview)

			if (SingleCourse.value?.isPublished) createView({ id: SingleCourse.value.id, type: InteractionEntities.courses })
		})

		return {
			Logic,
			SingleCourse,
			handleMobileGoback,
			mobileTitle,
			selectedMaterial,
			handleItemSelected,
			showCourseContent,
			showCourseInfo,
			buyCourse,
			isUnlocked,
			PaymentMethods,
			showMakePaymentModal,
			selectedMethodId,
			UserWallet,
			courseContents,
			showRateCourse,
			CourseReview,
			handleCourseContentSet,
			selectItem,
		}
	},
})
</script>
