<template>
	<SettingsLayout title="Profile">
		<div v-if="auth" class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl"> Personal info </SofaHeaderText>
				<div class="w-full flex items-center justify-start py-2 gap-4">
					<SofaImageLoader
						class="size-[90px] flex items-center justify-center relative bg-grayColor border border-grayColor rounded-full"
						:photoUrl="factory.photo?.link">
						<SofaIcon v-if="!factory.photo" class="h-[50px]" name="user" />
						<SofaFileInput
							v-model="factory.photo"
							class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
							accept="image/*">
							<SofaIcon class="h-[18px]" name="camera-white" />
						</SofaFileInput>
					</SofaImageLoader>

					<SofaButton padding="px-5 py-2" @click="$router.push('/profile')">View profile</SofaButton>
				</div>

				<SofaTextField
					v-model="factory.first"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="First Name"
					:error="factory.errors.first"
					borderColor="border-transparent" />

				<SofaTextField
					v-model="factory.last"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Last Name"
					:error="factory.errors.last"
					borderColor="border-transparent" />

				<SofaTextarea
					v-model="factory.description"
					:error="factory.errors.description"
					textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3"
					placeholder="Bio" />
			</div>

			<div id="contact" class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl"> Contact info </SofaHeaderText>

				<SofaTextField
					ref="name.first"
					v-model="auth.email"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Email"
					:disabled="true"
					borderColor="border-transparent" />

				<AccountSetup v-if="false" :isProfilePhone="true" />
			</div>

			<div v-if="!userType.isOrg" id="type" class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl">
					{{ userType.isTeacher ? 'Experience' : 'Education' }}
				</SofaHeaderText>

				<AccountSetup :isProfileEducation="true" />
			</div>

			<div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl"> Social links </SofaHeaderText>

				<SocialMediaUpdate :factory="socialsFactory" />
			</div>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useMeta } from 'vue-meta'
import AccountSetup from '@app/components/onboarding/AccountSetup.vue'
import SocialMediaUpdate from '@app/components/onboarding/SocialMediaUpdate.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'SettingsProfilePage',
	components: { AccountSetup, SocialMediaUpdate },
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Profile',
		})

		const { auth, userType } = useAuth()
		const { factory, updateProfile } = useProfileUpdate()
		const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()

		watch(factory.values, () => {
			Logic.Common.debounce(() => {
				if (factory.valid) updateProfile()
			}, 1000)
		})

		watch(socialsFactory.values, () => {
			Logic.Common.debounce(() => {
				if (socialsFactory.valid) updateSocials()
			}, 1000)
		})

		return { auth, userType, factory, socialsFactory }
	},
})
</script>
