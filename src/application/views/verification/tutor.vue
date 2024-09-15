<template>
	<ExpandedLayout width="mdlg:!w-[60%] lg:!w-[45%]">
		<div class="w-full flex mdlg:hidden items-center gap-3 justify-between bg-lightGray p-4 sticky top-0">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading> Become a tutor</SofaHeading>
			<span />
		</div>
		<div class="w-full flex flex-col grow overflow-y-auto gap-5 mdlg:px-0 px-4 mdlg:py-4">
			<div class="w-full hidden items-center justify-between mdlg:flex">
				<SofaHeading size="title"> Become a tutor </SofaHeading>
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
					<SofaHeading size="title"> Profile </SofaHeading>
					<SofaImageLoader class="size-[90px] bg-grayColor rounded-full" :photoUrl="profileFactory.photo?.link">
						<SofaIcon v-if="!profileFactory.photo" class="h-[50px]" name="user" />
						<SofaFileInput
							v-model="profileFactory.photo"
							class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
							accept="image/*">
							<SofaIcon class="h-[18px] fill-white" name="camera" />
						</SofaFileInput>
					</SofaImageLoader>

					<SofaInput v-model="profileFactory.first" placeholder="First Name" :error="profileFactory.errors.first" />

					<SofaInput v-model="profileFactory.last" placeholder="Last Name" :error="profileFactory.errors.last" />

					<SofaTextarea v-model="profileFactory.description" placeholder="Bio" />
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeading size="title"> Qualification </SofaHeading>

					<SofaFileInput
						v-model="tutorRequestFactory.qualification"
						class="rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray text-primaryPurple p-4"
						accept="application/pdf, image/*"
						multiple>
						<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
							<SofaIcon name="upload" class="h-[16px] fill-current" />

							<SofaText class="text-center">
								{{
									tutorRequestFactory.qualification.length
										? tutorRequestFactory.qualification.map((item) => item.name).join(', ')
										: 'Upload PDFs or images of your degree, results, transcripts, e.t.c.'
								}}
							</SofaText>
						</div>
					</SofaFileInput>
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeading size="title"> Verification </SofaHeading>

					<SofaFileInput
						v-model="tutorRequestFactory.verification"
						class="rounded-custom border-2 border-dashed border-primaryPurple bg-lightGray text-primaryPurple p-4"
						accept="image/*">
						<div class="w-full flex mdlg:flex-row mdlg:gap-3 flex-col gap-1 items-center justify-center">
							<SofaIcon name="upload" class="h-[16px] fill-current" />
							<SofaText>
								{{ tutorRequestFactory.verification?.name ?? 'Upload a valid ID' }}
							</SofaText>
						</div>
					</SofaFileInput>
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<SofaHeading size="title"> Location </SofaHeading>

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
						<SofaHeading size="title"> Subject </SofaHeading>
						<SofaText> Choose the subject you want to teach </SofaText>
						<SofaText v-if="currentlyTeaching.length">
							You are already teaching the following:
							{{
								topics
									.filter((t) => currentlyTeaching.includes(t.id))
									.map((t) => t.title)
									.join(', ')
							}}
						</SofaText>
					</div>

					<SofaSelect
						v-model="tutorRequestFactory.topicId"
						placeholder="Subject"
						:error="tutorRequestFactory.errors.topicId"
						:options="topics.filter((t) => !currentlyTeaching.includes(t.id)).map((t) => ({ key: t.id, value: t.title }))" />
				</div>

				<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
					<div class="w-full flex flex-col gap-1">
						<SofaHeading size="title"> Test </SofaHeading>
						<SofaText> Pass a test on the subject you selected </SofaText>
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
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useTopicsList } from '@app/composables/interactions/tags'
import { useUserLocationUpdate } from '@app/composables/users/profile'
import { useCreateTutorRequest } from '@app/composables/users/tutorRequests'

export default defineComponent({
	name: 'VerificationTutorPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useHead({ title: 'Become a tutor' })

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
