<template>
	<expanded-layout :hide="{ bottom: true }" width="mdlg:!w-[60%] lg:!w-[45%]">
		<div
			class="w-full flex mdlg:!hidden flex-row items-center gap-3 z-50 justify-between bg-lightGray py-4 px-4 sticky top-0 left-0">
			<sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<sofa-normal-text :customClass="'!font-bold !text-base'">
				Become a tutor</sofa-normal-text>
			<div class="invisible">Hello</div>
		</div>
		<div class="w-full flex flex-col flex-grow overflow-y-auto gap-5 mdlg:px-0 px-4 pb-4">
			<!-- Top bar for larger screens -->
			<div class="w-full hidden flex-row items-center justify-between mdlg:!flex pt-4">
				<sofa-header-text :customClass="'!text-2xl !font-bold'">
					Become a tutor
				</sofa-header-text>
				<div class="flex flex-row items-center gap-2">
					<sofa-button :padding="'px-5 py-2'" @click="handleNextAction">Next</sofa-button>
				</div>
			</div>

			<div class="w-full grid grid-cols-2 gap-2">
				<div class="col-span-1 h-[8px] rounded-[99px] bg-deepGray"></div>
				<div :class="`col-span-1 h-[8px] rounded-[99px] ${currentStep === 'test' ? 'bg-deepGray' : 'bg-darkLightGray'}`">
				</div>
			</div>

			<!-- Profile -->
			<template v-if="currentStep == 'profile'">
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :customClass="'text-left'">
						Profile
					</sofa-header-text>
					<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
						<sofa-image-loader
							:customClass="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
							:photoUrl="profileImageUrl ?? ''">
							<sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!profileImageUrl" />
							<sofa-file-attachment :isWrapper="true"
								:customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
								:accept="'image/png, image/gif, image/jpeg'" v-model="updateProfileForm.photo"
								v-model:localFileUrl="profileImageUrl">
								<template v-slot:content>
									<sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
								</template>
							</sofa-file-attachment>
						</sofa-image-loader>
					</div>

					<sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '"
						:padding="'md:!py-3 md:!px-3 px-3 py-3'" type="text" :name="'First name'" ref="name.first"
						:placeholder="'First Name'" :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.first"
						:borderColor="'border-transparent'" />

					<sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '"
						:padding="'md:!py-3 md:!px-3 px-3 py-3'" type="text" :name="'Last name'" ref="name.last"
						:placeholder="'Last Name'" :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.last"
						:borderColor="'border-transparent'" />

					<sofa-textarea :hasTitle="false"
						:textAreaStyle="'h-[90px] rounded-custom !bg-lightGray !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
						:placeholder="'Bio'" v-model="updateProfileForm.description" />
				</div>

				<!-- Qualifications -->

				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :customClass="'text-left'">
						Qualification
					</sofa-header-text>

					<sofa-file-attachment :isWrapper="true"
						:customClass="'rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2'"
						v-model="tutorRequestForm.qualification" accept="application/pdf, image/*" :is-multiple="true">
						<template v-slot:content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<sofa-icon :name="'upload-purple'" :customClass="'h-[16px]'" />

								<sofa-normal-text :color="'text-primaryPurple'" :customClass="'text-center'">
									{{
										tutorRequestForm.qualification.length
											? `${tutorRequestForm.qualification
												.map((item) => item.name)
												.join(", ")}`
											: " Upload PDFs or images of your degree, results, transcripts, e.t.c."
									}}
								</sofa-normal-text>
							</div>
						</template>
					</sofa-file-attachment>
				</div>

				<!-- Verification -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :customClass="'text-left'">
						Verification
					</sofa-header-text>

					<sofa-file-attachment :isWrapper="true"
						:customClass="'rounded-custom border-2 border-dashed border-primaryPurple  bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2'"
						v-model="tutorRequestForm.verification" accept="image/*">
						<template v-slot:content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<sofa-icon :name="'upload-purple'" :customClass="'h-[16px]'" />
								<sofa-normal-text :color="'text-primaryPurple'">
									{{
										tutorRequestForm.verification
											? `${tutorRequestForm.verification.name}`
											: "Upload a valid ID"
									}}
								</sofa-normal-text>
							</div>
						</template>
					</sofa-file-attachment>
				</div>

				<!-- Location -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :customClass="'text-left'">
						Location
					</sofa-header-text>

					<sofa-select :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '"
						:padding="'  px-3 py-3'" :name="'Country'" ref="country" :placeholder="'Country'"
						:rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :auto-complete="true"
						@on-option-selected="countryIsSelected" v-model="updateProfileForm.country" :options="allCountries" />

					<sofa-select :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '" :padding="'px-3 py-3'"
						:name="'State'" ref="state" :placeholder="'State'" :rules="[FormValidations.RequiredRule]"
						:borderColor="'border-transparent'" :auto-complete="true" v-model="updateProfileForm.state"
						:options="allStates" />
				</div>
			</template>

			<!-- Test -->

			<template v-if="currentStep == 'test'">
				<!-- Select subject -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<sofa-header-text :size="'xl'" :customClass="'text-left'">
							Subject
						</sofa-header-text>
						<sofa-normal-text>
							Choose the subject you want to teach
						</sofa-normal-text>
					</div>

					<sofa-select :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '"
						:padding="'  px-3 py-3'" :name="'Subject'" ref="Subject" :placeholder="'Select subject'"
						:rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :auto-complete="true"
						:options="allTopics" v-model="tutorRequestForm.topicId" />
				</div>

				<!-- Subject test -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<sofa-header-text :size="'xl'" :customClass="'text-left'">
							Test
						</sofa-header-text>
						<sofa-normal-text>
							Pass a test on the subject you selected
						</sofa-normal-text>
					</div>
				</div>
			</template>
		</div>
		<!-- Button for smaller screens -->
		<div class="w-full flex flex-col bg-white px-4 py-4 mdlg:hidden">
			<sofa-button :padding="'py-3'" :customClass="'!w-full'" @click="handleNextAction()">
				Next
			</sofa-button>
		</div>
	</expanded-layout>
</template>

<script lang="ts">
import { FormValidations } from '@/composables'
import { useAuth } from '@/composables/auth/auth'
import { allTopics, getTopics } from '@/composables/course'
import {
	Countries,
	UpdateProfile,
	allCountries,
	allStates,
	countryIsSelected,
	createTutorRequest,
	setCountry,
	tutorRequestForm,
	updateProfileForm,
	updateUserLocation,
} from '@/composables/profile'
import { Conditions, Logic } from 'sofa-logic'
import {
	SofaButton,
	SofaFileAttachment,
	SofaHeaderText,
	SofaIcon,
	SofaImageLoader,
	SofaNormalText,
	SofaSelect,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: {
		SofaNormalText,
		SofaHeaderText,
		SofaIcon,
		SofaButton,
		SofaTextField,
		SofaTextarea,
		SofaFileAttachment,
		SofaImageLoader,
		SofaSelect,
	},
	middlewares: {
		fetchRules: [
			{
				domain: 'Users',
				property: 'AllTutorRequests',
				method: 'GetTutorRequests',
				params: [
					{
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Auth.AuthUser?.id,
							},
						],
					},
					true,
				],
				requireAuth: true,
			},
			{
				domain: 'Study',
				property: 'Tags',
				method: 'GetTags',
				params: [],
			}
		],
	},
	name: 'BecomeATutorPage',
	setup () {
		useMeta({
			title: 'Become a tutor',
		})

		const { user } = useAuth()
		const currentStep = ref('profile')

		const profileImageUrl = ref('')
		const SingleTutorRequest = ref(Logic.Users.SingleTutorRequest)
		const SingleQuiz = ref(Logic.Study.SingleQuiz)
		const TestQuiz = ref()

		const selectedTopic = ref('')

		const setDefault = () => {
			if (!user.value) return
			profileImageUrl.value = user.value.bio.photo?.link || null
			updateProfileForm.description = user.value.bio.description
			updateProfileForm.name = user.value.bio.name
			if (user.value.location) {
				updateProfileForm.state = user.value.location.state
				updateProfileForm.country = user.value.location.country
			}
		}

		watch(updateProfileForm, () => {
			UpdateProfile(undefined, false)
		})

		onMounted(() => {
			Logic.Users.watchProperty('Countries', Countries)
			Logic.Study.watchProperty('SingleQuiz', SingleQuiz)
			if (!Countries.value) {
				Logic.Users.GetCountries().then(() => {
					setCountry()
				})
			}
			setDefault()
			getTopics(true)
		})

		watch(Countries, () => {
			setCountry()
		})

		const handleNextAction = () => {
			if (currentStep.value == 'profile') {
				if (
					tutorRequestForm.qualification.length &&
          tutorRequestForm.verification
				) {
					updateUserLocation()?.then(() => {
						currentStep.value = 'test'
					})
				} else {
					Logic.Common.showAlert({
						message: 'Please upload the required documents',
						type: 'warning',
					})
				}
			}

			if (currentStep.value == 'test') {
				if (tutorRequestForm.topicId) {
					createTutorRequest()
				}
			}
		}

		return {
			Logic,
			profileImageUrl,
			updateProfileForm,
			FormValidations,
			currentStep,
			selectedTopic,
			allTopics,
			allCountries,
			allStates,
			tutorRequestForm,
			SingleTutorRequest,
			SingleQuiz,
			TestQuiz,
			countryIsSelected,
			handleNextAction,
		}
	},
})
</script>
