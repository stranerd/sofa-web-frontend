<template>
	<div v-if="auth" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'">
				Personal info
			</sofa-header-text>
			<div class="w-full flex flex-row items-center justify-start py-2 gap-4">
				<sofa-image-loader
					:customClass="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
					:photoUrl="factory.localPhotoLink">
					<sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!factory.localPhotoLink" />
					<sofa-file-attachment :isWrapper="true"
						:customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
						accept="image/*" v-model="factory.photo" v-model:localFileUrl="factory.localPhotoLink">
						<template v-slot:content>
							<sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
						</template>
					</sofa-file-attachment>
				</sofa-image-loader>

				<sofa-button :padding="'px-5 py-2'" @click="Logic.Common.GoToRoute('/profile')">View profile</sofa-button>
			</div>

			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				type="text" :name="'First name'" :placeholder="'First Name'" :error="factory.errors.first"
				v-model="factory.first" :borderColor="'border-transparent'" />

			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				type="text" :name="'Last name'" :placeholder="'Last Name'" :error="factory.errors.last"
				v-model="factory.last" :borderColor="'border-transparent'" />

			<sofa-textarea :hasTitle="false" :error="factory.errors.description"
				:textAreaStyle="'h-[90px] rounded-custom !bg-lightGray md:p-4 p-3'"
				:placeholder="'Bio'" v-model="factory.description" />
		</div>

		<div id="contact" class="w-full flex flex-col bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left mb-4'">
				Contact info
			</sofa-header-text>

			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				type="text" :name="'Email'" ref="name.first" :placeholder="'Email'" v-model="auth.email" :disabled="true"
				:borderColor="'border-transparent'" />

			<account-setup :isProfilePhone="true" />
		</div>

		<div id="type" v-if="!userType.isOrg"
			class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'">
				{{ userType.isTeacher ? 'Experience' : 'Education' }}
			</sofa-header-text>

			<account-setup :isProfileEducation="true" />
		</div>

		<div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'">
				Social links
			</sofa-header-text>

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
import {
	SofaButton,
	SofaFileAttachment,
	SofaHeaderText,
	SofaIcon,
	SofaImageLoader,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { watch } from 'vue'
import AccountSetup from '../onboarding/AccountSetup.vue'

const { auth, userType } = useAuth()
const { factory, updateProfile } = useProfileUpdate()
const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()

watch(factory.values, () => {
	Logic.Common.debounce(() => {
		updateProfile(true)
	}, 1000)
})

watch(socialsFactory.values, () => {
	Logic.Common.debounce(() => {
		updateSocials(true)
	}, 1000)
})
</script>
