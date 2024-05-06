<template>
	<ExpandedLayout width="mdlg:!w-[60%] lg:!w-[45%]">
		<div class="w-full flex mdlg:hidden items-center gap-3 justify-between bg-lightGray p-4 sticky top-0">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaNormalText class="!font-bold !text-base"> Become a tutor</SofaNormalText>
			<span />
		</div>
		<div class="w-full flex flex-col grow overflow-y-auto gap-5 mdlg:px-0 px-4 mdlg:py-4">
			<div class="w-full hidden items-center justify-between mdlg:flex">
				<SofaHeaderText class="!text-2xl !font-bold"> Become a tutor </SofaHeaderText>
				<SofaButton :disabled="buttonProps.disabled" padding="px-5 py-2" @click="buttonProps.handler">
					{{ buttonProps.label }}
				</SofaButton>
			</div>

			<div class="w-full grid grid-cols-2 gap-2">
				<div class="col-span-1 h-2 rounded-full bg-deepGray" />
				<div class="col-span-1 h-2 rounded-full" :class="currentStep === 'test' ? 'bg-deepGray' : 'bg-darkLightGray'" />
			</div>

			<template v-if="currentStep === 'profile'">
				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl"> Profile </SofaHeaderText>
					<SofaImageLoader class="size-[90px] bg-grayColor rounded-full" :photoUrl="profileFactory.photo?.link">
						<SofaIcon v-if="!profileFactory.photo" class="h-[50px]" name="user" />
						<SofaFileInput
							v-model="profileFactory.photo"
							class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
							accept="image/*">
							<SofaIcon class="h-[18px] fill-white" name="camera" />
						</SofaFileInput>
					</SofaImageLoader>

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

					<SofaTextarea v-model="profileFactory.description" placeholder="Bio" />
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl"> Qualification </SofaHeaderText>

					<SofaFileInput
						v-model="tutorRequestFactory.qualification"
						class="rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray p-4"
						accept="application/pdf, image/*"
						multiple>
						<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
							<SofaIcon name="upload" class="h-[16px] fill-primaryPurple" />

							<SofaNormalText color="text-primaryPurple" class="text-center">
								{{
									tutorRequestFactory.qualification.length
										? tutorRequestFactory.qualification.map((item) => item.name).join(', ')
										: 'Upload PDFs or images of your degree, results, transcripts, e.t.c.'
								}}
							</SofaNormalText>
						</div>
					</SofaFileInput>
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl"> Verification </SofaHeaderText>

					<SofaFileInput
						v-model="tutorRequestFactory.verification"
						class="rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray p-4"
						accept="image/*">
						<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
							<SofaIcon name="upload" class="h-[16px] fill-primaryPurple" />
							<SofaNormalText color="text-primaryPurple">
								{{ tutorRequestFactory.verification?.name ?? 'Upload a valid ID' }}
							</SofaNormalText>
						</div>
					</SofaFileInput>
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl"> Location </SofaHeaderText>

					<SofaSelect
						v-model="locationFactory.country"
						placeholder="Country"
						:error="locationFactory.errors.country"
						:options="countries.map((c) => ({ key: c, value: c }))" />

					<SofaSelect
						v-model="locationFactory.state"
						placeholder="State"
						:error="locationFactory.errors.state"
						:options="states.map((s) => ({ key: s, value: s }))" />
				</div>
			</template>

			<template v-if="currentStep === 'test'">
				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<SofaHeaderText size="xl"> Subject </SofaHeaderText>
						<SofaNormalText> Choose the subject you want to teach </SofaNormalText>
						<SofaNormalText v-if="currentlyTeaching.length">
							You are already teaching the following:
							{{
								topics
									.filter((t) => currentlyTeaching.includes(t.id))
									.map((t) => t.title)
									.join(', ')
							}}
						</SofaNormalText>
					</div>

					<SofaSelect
						v-model="tutorRequestFactory.topicId"
						placeholder="Subject"
						:error="tutorRequestFactory.errors.topicId"
						:options="topics.filter((t) => !currentlyTeaching.includes(t.id)).map((t) => ({ key: t.id, value: t.title }))" />
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<SofaHeaderText size="xl"> Test </SofaHeaderText>
						<SofaNormalText> Pass a test on the subject you selected </SofaNormalText>
					</div>
				</div>
			</template>

			<SofaButton :disabled="buttonProps.disabled" padding="py-3" class="w-full mdlg:hidden" @click="buttonProps.handler">
				{{ buttonProps.label }}
			</SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useTopicsList } from '@app/composables/interactions/tags'
import { useUserLocationUpdate } from '@app/composables/users/profile'
import { useCreateTutorRequest } from '@app/composables/users/tutorRequests'

export default defineComponent({
	name: 'VerificationTutorPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({ title: 'Become a tutor' })

		const { user } = useAuth()
		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: locationFactory, countries, states, updateLocation } = useUserLocationUpdate()
		const { topics } = useTopicsList()
		const { factory: tutorRequestFactory, createTutorRequest } = useCreateTutorRequest()
		const currentlyTeaching = computed(() => user.value?.tutor.topics ?? [])

		const currentStep = ref<'profile' | 'test'>('profile')

		const buttonProps = computed(() => {
			if (currentStep.value === 'profile')
				return {
					label: 'Next',
					disabled:
						!profileFactory.valid ||
						!locationFactory.valid ||
						!tutorRequestFactory.isValid('qualification') ||
						!tutorRequestFactory.isValid('verification'),
					handler: async () => {
						const res = await Promise.all([updateProfile(), updateLocation()])
						if (res.every(Boolean)) currentStep.value = 'test'
					},
				}
			return {
				label: 'Submit',
				disabled: !tutorRequestFactory.valid,
				handler: createTutorRequest,
			}
		})

		return {
			profileFactory,
			locationFactory,
			countries,
			states,
			topics,
			currentStep,
			tutorRequestFactory,
			buttonProps,
			currentlyTeaching,
		}
	},
})
</script>
