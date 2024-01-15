<template>
	<ExpandedLayout :hide="{ bottom: true }" width="mdlg:!w-[60%] lg:!w-[45%]">
		<div class="w-full flex mdlg:!hidden flex-row items-center gap-3 z-50 justify-between bg-lightGray py-4 px-4 sticky top-0 left-0">
			<SofaIcon customClass="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
			<SofaNormalText customClass="!font-bold !text-base"> Become a tutor</SofaNormalText>
			<div class="invisible">Hello</div>
		</div>
		<div class="w-full flex flex-col flex-grow overflow-y-auto gap-5 mdlg:px-0 px-4 pb-4">
			<!-- Top bar for larger screens -->
			<div class="w-full hidden flex-row items-center justify-between mdlg:!flex pt-4">
				<SofaHeaderText customClass="!text-2xl !font-bold"> Become a tutor </SofaHeaderText>
				<div class="flex flex-row items-center gap-2">
					<SofaButton padding="px-5 py-2" @click="handleNextAction">Next</SofaButton>
				</div>
			</div>

			<div class="w-full grid grid-cols-2 gap-2">
				<div class="col-span-1 h-[8px] rounded-[99px] bg-deepGray"></div>
				<div :class="`col-span-1 h-[8px] rounded-[99px] ${currentStep === 'test' ? 'bg-deepGray' : 'bg-darkLightGray'}`"></div>
			</div>

			<!-- Profile -->
			<template v-if="currentStep == 'profile'">
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" customClass="text-left"> Profile </SofaHeaderText>
					<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
						<SofaImageLoader
							customClass="w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full"
							:photoUrl="profileFactory.photo?.link">
							<SofaIcon v-if="!profileFactory.photo" customClass="h-[50px]" name="user" />
							<SofaFileInput
								v-model="profileFactory.photo"
								class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full h-[40px] w-[40px] flex items-center justify-center"
								accept="image/*">
								<SofaIcon class="h-[18px]" name="camera-white" />
							</SofaFileInput>
						</SofaImageLoader>
					</div>

					<SofaTextField
						v-model="profileFactory.first"
						customClass="rounded-custom !bg-lightGray"
						type="text"
						placeholder="First Name"
						:error="profileFactory.errors.first"
						borderColor="border-transparent" />

					<SofaTextField
						v-model="profileFactory.last"
						customClass="rounded-custom !bg-lightGray"
						type="text"
						placeholder="Last Name"
						:error="profileFactory.errors.last"
						borderColor="border-transparent" />

					<SofaTextarea
						v-model="profileFactory.description"
						:hasTitle="false"
						textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
						placeholder="Bio" />
				</div>

				<!-- Qualifications -->

				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" customClass="text-left"> Qualification </SofaHeaderText>

					<SofaFileAttachment
						v-model="tutorRequestForm.qualification"
						:isWrapper="true"
						customClass="rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2"
						accept="application/pdf, image/*"
						:isMultiple="true">
						<template #content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<SofaIcon name="upload-purple" customClass="h-[16px]" />

								<SofaNormalText color="text-primaryPurple" customClass="text-center">
									{{
										tutorRequestForm.qualification.length
											? `${tutorRequestForm.qualification.map((item) => item.name).join(', ')}`
											: 'Upload PDFs or images of your degree, results, transcripts, e.t.c.'
									}}
								</SofaNormalText>
							</div>
						</template>
					</SofaFileAttachment>
				</div>

				<!-- Verification -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" customClass="text-left"> Verification </SofaHeaderText>

					<SofaFileAttachment
						v-model="tutorRequestForm.verification"
						:isWrapper="true"
						customClass="rounded-custom border-2 border-dashed border-primaryPurple  bg-lightGray py-4 px-4 items-center jusify-center flex !flex-row gap-2"
						accept="image/*">
						<template #content>
							<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
								<SofaIcon name="upload-purple" customClass="h-[16px]" />
								<SofaNormalText color="text-primaryPurple">
									{{ tutorRequestForm.verification?.name ?? 'Upload a valid ID' }}
								</SofaNormalText>
							</div>
						</template>
					</SofaFileAttachment>
				</div>

				<!-- Location -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" customClass="text-left"> Location </SofaHeaderText>

					<SofaSelect
						v-model="locationFactory.country"
						customClass="rounded-custom !bg-lightGray"
						placeholder="Country"
						:error="locationFactory.errors.country"
						borderColor="border-transparent"
						:options="countries.map((c) => ({ key: c, value: c }))" />

					<SofaSelect
						v-model="locationFactory.state"
						customClass="rounded-custom !bg-lightGray"
						placeholder="State"
						:error="locationFactory.errors.state"
						borderColor="border-transparent"
						:options="states.map((s) => ({ key: s, value: s }))" />
				</div>
			</template>

			<!-- Test -->

			<template v-if="currentStep == 'test'">
				<!-- Select subject -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<SofaHeaderText size="xl" customClass="text-left"> Subject </SofaHeaderText>
						<SofaNormalText> Choose the subject you want to teach </SofaNormalText>
					</div>

					<SofaSelect
						ref="Subject"
						v-model="tutorRequestForm.topicId"
						customClass="rounded-custom !bg-lightGray"
						name="Subject"
						placeholder="Select subject"
						:rules="[Logic.Form.RequiredRule]"
						borderColor="border-transparent"
						:options="topics.map((t) => ({ key: t.id, value: t.title }))" />
				</div>

				<!-- Subject test -->
				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<SofaHeaderText size="xl" customClass="text-left"> Test </SofaHeaderText>
						<SofaNormalText> Pass a test on the subject you selected </SofaNormalText>
					</div>
				</div>
			</template>
		</div>
		<!-- Button for smaller screens -->
		<div class="w-full flex flex-col bg-white px-4 py-4 mdlg:hidden">
			<SofaButton padding="py-3" customClass="!w-full" @click="handleNextAction"> Next </SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useTopicsList } from '@app/composables/interactions/tags'
import { createTutorRequest, tutorRequestForm } from '@app/composables/profile'
import { useUserLocationUpdate } from '@app/composables/users/profile'
import { Logic } from 'sofa-logic'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'BecomeATutorPage',
	setup() {
		useMeta({ title: 'Become a tutor' })

		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: locationFactory, countries, states, updateLocation } = useUserLocationUpdate()
		const { topics } = useTopicsList()

		const currentStep = ref('profile')

		const handleNextAction = async () => {
			if (currentStep.value == 'profile') {
				if (tutorRequestForm.qualification.length && tutorRequestForm.verification)
					await Promise.all([updateProfile(), updateLocation()]).then((res) => {
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
			currentStep,
			tutorRequestForm,
			handleNextAction,
		}
	},
})
</script>
