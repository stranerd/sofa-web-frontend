<template>
	<div v-if="auth" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<SofaHeaderText size="xl" customClass="text-left"> Personal info </SofaHeaderText>
			<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
				<SofaImageLoader
					customClass="w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full"
					:photoUrl="factory.photo?.link">
					<SofaIcon v-if="!factory.photo" customClass="h-[50px]" name="user" />
					<SofaFileInput
						v-model="factory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full h-[40px] w-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaButton padding="px-5 py-2" @click="Logic.Common.GoToRoute('/profile')">View profile</SofaButton>
			</div>

			<SofaTextField
				v-model="factory.first"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="First name"
				placeholder="First Name"
				:error="factory.errors.first"
				borderColor="border-transparent" />

			<SofaTextField
				v-model="factory.last"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="Last name"
				placeholder="Last Name"
				:error="factory.errors.last"
				borderColor="border-transparent" />

			<SofaTextarea
				v-model="factory.description"
				:error="factory.errors.description"
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3"
				placeholder="Bio" />
		</div>

		<div id="contact" class="w-full flex flex-col bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<SofaHeaderText size="xl" customClass="text-left mb-4"> Contact info </SofaHeaderText>

			<SofaTextField
				ref="name.first"
				v-model="auth.email"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="Email"
				placeholder="Email"
				:disabled="true"
				borderColor="border-transparent" />

			<AccountSetup v-if="false" :isProfilePhone="true" />
		</div>

		<div v-if="!userType.isOrg" id="type" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<SofaHeaderText size="xl" customClass="text-left">
				{{ userType.isTeacher ? 'Experience' : 'Education' }}
			</SofaHeaderText>

			<AccountSetup :isProfileEducation="true" />
		</div>

		<div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<SofaHeaderText size="xl" customClass="text-left"> Social links </SofaHeaderText>

			<SocialMediaUpdate :factory="socialsFactory" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import AccountSetup from '../onboarding/AccountSetup.vue'
import SocialMediaUpdate from '@app/components/onboarding/SocialMediaUpdate.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { Logic } from 'sofa-logic'

const { auth, userType } = useAuth()
const { factory, updateProfile } = useProfileUpdate()
const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()

watch(factory.values, () => {
	Logic.Common.debounce(() => {
		updateProfile()
	}, 1000)
})

watch(socialsFactory.values, () => {
	Logic.Common.debounce(() => {
		updateSocials()
	}, 1000)
})
</script>
