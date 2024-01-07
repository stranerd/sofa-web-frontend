<template>
	<expanded-layout :hide="{ bottom: true }" width="mdlg:!w-[60%] lg:!w-[45%]">
		<div class="w-full flex mdlg:!hidden flex-row items-center gap-3 z-50 justify-between bg-lightGray py-4 px-4 sticky top-0 left-0">
			<sofa-icon :custom-class="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<sofa-normal-text :custom-class="'!font-bold !text-base'"> Become a tutor</sofa-normal-text>
			<div class="invisible">Hello</div>
		</div>
		<div class="w-full flex flex-col flex-grow overflow-y-auto gap-5 mdlg:px-0 px-4 pb-4">
			<!-- Top bar for larger screens -->
			<div class="w-full hidden flex-row items-center justify-between mdlg:!flex pt-4">
				<sofa-header-text :custom-class="'!text-2xl !font-bold'"> Become a tutor </sofa-header-text>
				<div class="flex flex-row items-center gap-2">
					<sofa-button :padding="'px-5 py-2'" @click="handleNextAction">Next</sofa-button>
				</div>
			</div>

			<div class="w-full grid grid-cols-2 gap-2">
				<div class="col-span-1 h-[8px] rounded-[99px] bg-deepGray"></div>
				<div :class="`col-span-1 h-[8px] rounded-[99px] ${currentStep === 'test' ? 'bg-deepGray' : 'bg-darkLightGray'}`"></div>
			</div>

			<!-- Profile -->
			<template v-if="currentStep == 'profile'">
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Profile </sofa-header-text>
					<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
						<sofa-image-loader
							:custom-class="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
							:photo-url="profileFactory.localPhotoLink">
							<sofa-icon v-if="!profileFactory.localPhotoLink" :custom-class="'h-[50px]'" :name="'user'" />
							<sofa-file-attachment
								v-model="profileFactory.photo"
								v-model:localFileUrl="profileFactory.localPhotoLink"
								:is-wrapper="true"
								:custom-class="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
								:accept="'image/*'">
								<template #content>
									<sofa-icon :custom-class="'h-[18px]'" :name="'camera-white'" />
								</template>
							</sofa-file-attachment>
						</sofa-image-loader>
					</div>

					<sofa-text-field
						v-model="profileFactory.first"
						:custom-class="'rounded-custom !bg-lightGray'"
						type="text"
						placeholder="First Name"
						:error="profileFactory.errors.first"
						border-color="border-transparent" />

					<sofa-text-field
						v-model="profileFactory.last"
						:custom-class="'rounded-custom !bg-lightGray'"
						type="text"
						placeholder="Last Name"
						:error="profileFactory.errors.last"
						border-color="border-transparent" />

					<sofa-textarea
						v-model="profileFactory.description"
						:has-title="false"
						text-area-style="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
						placeholder="Bio" />
				</div>

				<!-- Qualifications -->

				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Qualification </sofa-header-text>

					<sofa-file-attachment
						v-model="tutorRequestForm.qualification"
						:is-wrapper="true"
						:custom-class="'rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2'"
						accept="application/pdf, image/*"
						:is-multiple="true">
						<template #content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<sofa-icon :name="'upload-purple'" :custom-class="'h-[16px]'" />

								<sofa-normal-text :color="'text-primaryPurple'" :custom-class="'text-center'">
									{{
										tutorRequestForm.qualification.length
											? `${tutorRequestForm.qualification.map((item) => item.name).join(', ')}`
											: 'Upload PDFs or images of your degree, results, transcripts, e.t.c.'
									}}
								</sofa-normal-text>
							</div>
						</template>
					</sofa-file-attachment>
				</div>

				<!-- Verification -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Verification </sofa-header-text>

					<sofa-file-attachment
						v-model="tutorRequestForm.verification"
						:is-wrapper="true"
						:custom-class="'rounded-custom border-2 border-dashed border-primaryPurple  bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2'"
						accept="image/*">
						<template #content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<sofa-icon :name="'upload-purple'" :custom-class="'h-[16px]'" />
								<sofa-normal-text :color="'text-primaryPurple'">
									{{ tutorRequestForm.verification?.name ?? 'Upload a valid ID' }}
								</sofa-normal-text>
							</div>
						</template>
					</sofa-file-attachment>
				</div>

				<!-- Location -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Location </sofa-header-text>

					<SofaSelect
						v-model="locationFactory.country"
						custom-class="rounded-custom !bg-lightGray"
						placeholder="Country"
						:error="locationFactory.errors.country"
						border-color="border-transparent"
						:options="countries.map((c) => ({ key: c, value: c }))" />

					<SofaSelect
						v-model="locationFactory.state"
						custom-class="rounded-custom !bg-lightGray"
						placeholder="State"
						:error="locationFactory.errors.state"
						border-color="border-transparent"
						:options="states.map((s) => ({ key: s, value: s }))" />
				</div>
			</template>

			<!-- Test -->

			<template v-if="currentStep == 'test'">
				<!-- Select subject -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Subject </sofa-header-text>
						<sofa-normal-text> Choose the subject you want to teach </sofa-normal-text>
					</div>

					<sofa-select
						ref="Subject"
						v-model="tutorRequestForm.topicId"
						:custom-class="'rounded-custom !bg-lightGray'"
						:name="'Subject'"
						:placeholder="'Select subject'"
						:rules="[FormValidations.RequiredRule]"
						:border-color="'border-transparent'"
						:options="topics.map((t) => ({ key: t.id, value: t.title }))" />
				</div>

				<!-- Subject test -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Test </sofa-header-text>
						<sofa-normal-text> Pass a test on the subject you selected </sofa-normal-text>
					</div>
				</div>
			</template>
		</div>
		<!-- Button for smaller screens -->
		<div class="w-full flex flex-col bg-white px-4 py-4 mdlg:hidden">
			<sofa-button :padding="'py-3'" :custom-class="'!w-full'" @click="handleNextAction"> Next </sofa-button>
		</div>
	</expanded-layout>
</template>

<script lang="ts">
import { FormValidations } from '@/composables'
import { useProfileUpdate } from '@/composables/auth/profile'
import { useTopicsList } from '@/composables/interactions/tags'
import { createTutorRequest, tutorRequestForm } from '@/composables/profile'
import { useUserLocationUpdate } from '@/composables/users/profile'
import { Logic } from 'sofa-logic'
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
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'BecomeATutorPage',
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
	setup() {
		useMeta({ title: 'Become a tutor' })

		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: locationFactory, countries, states, updateLocation } = useUserLocationUpdate()
		const { topics } = useTopicsList()

		const currentStep = ref('profile')

		const handleNextAction = async () => {
			if (currentStep.value == 'profile') {
				if (tutorRequestForm.qualification.length && tutorRequestForm.verification)
					await Promise.all([updateProfile(true), updateLocation(true)]).then((res) => {
						if (res.every(Boolean)) currentStep.value = 'test'
					})
				else Logic.Common.showAlert({ message: 'Please upload the required documents', type: 'warning' })
			}

			if (currentStep.value == 'test' && tutorRequestForm.topicId) await createTutorRequest()
		}

		return {
			profileFactory,
			locationFactory,
			countries,
			states,
			topics,
			Logic,
			FormValidations,
			currentStep,
			tutorRequestForm,
			handleNextAction,
		}
	},
})
</script>
