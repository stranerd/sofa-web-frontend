<template>
	<FullLayout
		:wrap="true"
		:topbarOptions="{
			type: 'sub',
			title: 'Account verification',
			actions: [
				{
					label: 'Exit',
					handler: Logic.Common.goBack,
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
					<SofaHeaderText class="!font-bold"> Personal information </SofaHeaderText>
					<SofaNormalText>Edit your profile</SofaNormalText>
				</div>

				<SofaImageLoader class="size-[96px] bg-grayColor rounded-full mx-auto" :photoUrl="profileFactory.photo?.link">
					<SofaIcon v-if="!profileFactory.photo" class="h-[50px]" name="user" />
					<SofaFileInput
						v-model="profileFactory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaTextField
					v-model="profileFactory.first"
					placeholder="Enter first name"
					:hasTitle="true"
					customClass="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.first">
					<template #title>First Name</template>
				</SofaTextField>

				<SofaTextField
					v-model="profileFactory.last"
					placeholder="Enter last name"
					:hasTitle="true"
					customClass="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.last">
					<template #title>Last Name</template>
				</SofaTextField>

				<SofaTextarea
					v-model="profileFactory.description"
					placeholder="Description of yourself"
					:hasTitle="true"
					textAreaStyle="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.description">
					<template #title>Bio</template>
				</SofaTextarea>
			</form>
		</template>

		<template #middle-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex flex-col items-start">
					<SofaHeaderText class="!font-bold"> Page content </SofaHeaderText>
					<SofaNormalText>Add at least 1 course and 3 quizzes you’ve published. </SofaNormalText>
				</div>

				<div class="w-full flex flex-col gap-4">
					<StudyMaterialCard
						v-for="material in [...content.courses, ...content.quizzes]"
						:key="material.hash"
						type="activity"
						:material="material"
						:isWrapped="!Logic.Common.isLarge"
						:hasBookmark="false"
						:isRoute="false">
						<template #side-icons>
							<SofaIcon
								class="h-[20px]"
								name="circle-close"
								@click="verificationFactory[material.isCourse() ? 'removeCourse' : 'removeQuiz'](material.id)" />
						</template>
					</StudyMaterialCard>

					<SofaButton padding="p-4" @click="showAddNewHandler">
						<SofaIcon name="box-add" class="h-[18px] fill-white" />
						Add Content
					</SofaButton>
				</div>
			</div>
		</template>

		<template #right-session>
			<form class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4" @submit.prevent="submit">
				<div class="w-full flex flex-col">
					<SofaHeaderText class="!font-bold"> Add links (optional) </SofaHeaderText>
					<SofaNormalText>Your educational website and socials</SofaNormalText>
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
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import SocialMediaUpdate from '@app/components/onboarding/SocialMediaUpdate.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useModals } from '@app/composables/core/modals'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { useCreateVerification } from '@app/composables/users/verifications'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'VerificationIndexPage',
	components: { SocialMediaUpdate },
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
		useMeta({
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
			Logic,
			showAddNewHandler,
		}
	},
})
</script>
