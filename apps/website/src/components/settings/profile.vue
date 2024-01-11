<template>
	<div v-if="auth" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Personal info </sofa-header-text>
			<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
				<sofa-image-loader
					:custom-class="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
					:photo-url="factory.photo?.link">
					<sofa-icon v-if="!factory.photo" :custom-class="'h-[50px]'" :name="'user'" />
					<SofaFileInput
						v-model="factory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full h-[40px] w-[40px] flex items-center justify-center"
						accept="image/*">
						<sofa-icon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</sofa-image-loader>

				<sofa-button :padding="'px-5 py-2'" @click="Logic.Common.GoToRoute('/profile')">View profile</sofa-button>
			</div>

			<sofa-text-field
				v-model="factory.first"
				:custom-class="'rounded-custom !bg-lightGray'"
				type="text"
				:name="'First name'"
				:placeholder="'First Name'"
				:error="factory.errors.first"
				:border-color="'border-transparent'" />

			<sofa-text-field
				v-model="factory.last"
				:custom-class="'rounded-custom !bg-lightGray'"
				type="text"
				:name="'Last name'"
				:placeholder="'Last Name'"
				:error="factory.errors.last"
				:border-color="'border-transparent'" />

			<sofa-textarea
				v-model="factory.description"
				:has-title="false"
				:error="factory.errors.description"
				:text-area-style="'h-[90px] rounded-custom !bg-lightGray md:p-4 p-3'"
				:placeholder="'Bio'" />
		</div>

		<div id="contact" class="w-full flex flex-col bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :custom-class="'text-left mb-4'"> Contact info </sofa-header-text>

			<sofa-text-field
				ref="name.first"
				v-model="auth.email"
				:custom-class="'rounded-custom !bg-lightGray'"
				type="text"
				:name="'Email'"
				:placeholder="'Email'"
				:disabled="true"
				:border-color="'border-transparent'" />

			<account-setup :is-profile-phone="true" />
		</div>

		<div v-if="!userType.isOrg" id="type" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :custom-class="'text-left'">
				{{ userType.isTeacher ? 'Experience' : 'Education' }}
			</sofa-header-text>

			<account-setup :is-profile-education="true" />
		</div>

		<div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :custom-class="'text-left'"> Social links </sofa-header-text>

			<SocialMediaUpdate :factory="socialsFactory" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import SocialMediaUpdate from '@/components/onboarding/SocialMediaUpdate.vue'
import { useAuth } from '@/composables/auth/auth'
import { useProfileUpdate } from '@/composables/auth/profile'
import { useUserSocialsUpdate } from '@/composables/users/profile'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaFileInput, SofaHeaderText, SofaIcon, SofaImageLoader, SofaTextField, SofaTextarea } from 'sofa-ui-components'
import { watch } from 'vue'
import AccountSetup from '../onboarding/AccountSetup.vue'

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
		updateSocials(true)
	}, 1000)
})
</script>
