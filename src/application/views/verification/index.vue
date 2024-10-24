<template>
	<FullLayout
		:wrap="true"
		:topbarOptions="{
			type: 'sub',
			title: 'Account verification',
			actions: [
				{
					label: 'Exit',
					handler: $utils.goBack,
					outlined: true,
				},
				{
					label: 'Submit',
					disabled: !profileFactory.valid || !socialsFactory.valid || !verificationFactory.valid,
					outlined: false,
					handler: submit,
				},
			],
		}">
		<template #left-session>
			<form class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4" @submit.prevent="submit">
				<div class="w-full flex flex-col">
					<SofaHeading size="title"> Personal information </SofaHeading>
					<SofaText>Edit your profile</SofaText>
				</div>

				<SofaImageLoader class="size-[96px] bg-grayColor rounded-full mx-auto" :photoUrl="profileFactory.photo?.link">
					<SofaIcon v-if="!profileFactory.photo" class="h-[50px]" name="user" />
					<SofaFileInput
						v-model="profileFactory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px] fill-white" name="camera" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaFormGroup>
					<SofaLabel>First Name</SofaLabel>

					<SofaInput v-model="profileFactory.first" placeholder="Enter first name" :error="profileFactory.errors.first" />
				</SofaFormGroup>

				<SofaFormGroup>
					<SofaLabel>Last Name</SofaLabel>

					<SofaInput v-model="profileFactory.last" placeholder="Enter last name" :error="profileFactory.errors.last" />
				</SofaFormGroup>

				<SofaFormGroup>
					<SofaLabel>Bio</SofaLabel>

					<SofaTextarea
						v-model="profileFactory.description"
						placeholder="Description of yourself"
						:error="profileFactory.errors.description" />
				</SofaFormGroup>
			</form>
		</template>

		<template #middle-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex flex-col items-start">
					<SofaHeading size="title"> Page content </SofaHeading>
					<SofaText>Add at least 1 course and 3 quizzes you’ve published. </SofaText>
				</div>

				<div class="w-full flex flex-col gap-4">
					<StudyMaterialCard
						v-for="material in [...content.courses, ...content.quizzes]"
						:key="material.hash"
						:material="material"
						:hasBookmark="false"
						:isRoute="false"
						class="!bg-lightGray">
						<template #side-icons>
							<SofaIcon
								class="h-[20px]"
								name="circle-close"
								@click="verificationFactory[material.isCourse() ? 'removeCourse' : 'removeQuiz'](material.id)" />
						</template>
					</StudyMaterialCard>

					<SofaButton padding="p-4" @click="showAddNewHandler">
						<SofaIcon name="add" class="h-[18px] fill-white" />
						Add Content
					</SofaButton>
				</div>
			</div>
		</template>

		<template #right-session>
			<form class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4" @submit.prevent="submit">
				<div class="w-full flex flex-col">
					<SofaHeading size="title"> Add links (optional) </SofaHeading>
					<SofaText>Your educational website and socials</SofaText>
				</div>

				<SocialMediaUpdate :factory="socialsFactory" />

				<SofaButton
					:disabled="!profileFactory.valid || !socialsFactory.valid || !verificationFactory.valid"
					padding="p-3"
					class="mdlg:hidden w-full sticky bottom-0"
					type="submit">
					Submit
				</SofaButton>
			</form>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useModals } from '@app/composables/core/modals'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { useCreateVerification } from '@app/composables/users/verifications'

export default defineComponent({
	name: 'VerificationIndexPage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async () => {
				const { auth } = useAuth()
				if (auth.value?.roles.isVerified) return '/dashboard'
			},
		],
	},
	setup() {
		useHead({
			title: 'Become a verified creator',
		})

		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()
		const { factory: verificationFactory, content, createVerification } = useCreateVerification()

		const showAddNewHandler = () =>
			useModals().users.choosePublishedStudyMaterial.open({
				selected: { courses: verificationFactory.courses, quizzes: verificationFactory.quizzes },
				onAdd: (materials) => {
					verificationFactory.courses = materials.courses
					verificationFactory.quizzes = materials.quizzes
				},
			})

		const submit = async () => {
			const res = await Promise.all([updateProfile(), updateSocials()])
			if (res.every(Boolean)) await createVerification()
		}

		return {
			profileFactory,
			submit,
			socialsFactory,
			verificationFactory,
			content,
			showAddNewHandler,
		}
	},
})
</script>
