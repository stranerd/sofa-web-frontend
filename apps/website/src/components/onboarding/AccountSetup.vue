<template>
	<form class="w-full flex flex-col gap-4" @submit.prevent="handleAccountSetup">
		<div v-if="!isProfileEducation && !isProfilePhone" class="w-full flex gap-3">
			<a
				v-for="option in accountSetupOptions.filter((o) => !o.hide)"
				:key="option.id"
				class="p-3 rounded-custom flex items-center gap-2 justify-center w-full"
				:class="tab === option.id ? 'bg-primaryPurple' : option.done ? 'bg-primaryGreen' : 'bg-lightGray'"
				@click="tab = option.id">
				<sofa-normal-text :color="option.done || tab === option.id ? 'text-white' : 'text-grayColor'">
					{{ option.name }}
				</sofa-normal-text>
				<sofa-icon v-if="option.done" :custom-class="'h-[14px]'" :name="'done'" />
			</a>
		</div>

		<div v-if="tab === 'profile'" class="w-full flex flex-col gap-4 py-3">
			<div class="w-full flex flex-col items-center justify-center pt-3">
				<sofa-image-loader
					:custom-class="`w-[90px] h-[90px] flex items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
					:photo-url="profileFactory.photo?.link">
					<sofa-icon v-if="!profileFactory.photo" :custom-class="'h-[50px]'" :name="'user'" />
					<SofaFileInput
						v-model="profileFactory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</sofa-image-loader>
			</div>

			<SofaTextField
				v-model="profileFactory.first"
				custom-class="rounded-custom !bg-lightGray"
				type="text"
				placeholder="First Name"
				:error="profileFactory.errors.first"
				border-color="border-transparent" />

			<SofaTextField
				v-model="profileFactory.last"
				custom-class="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Last Name"
				:error="profileFactory.errors.last"
				border-color="border-transparent" />

			<SofaTextField
				v-if="typeFactory.isOrganization"
				v-model="typeFactory.name"
				custom-class="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Organization name"
				:error="typeFactory.errors.name"
				border-color="border-transparent" />

			<SofaTextarea
				v-model="profileFactory.description"
				text-area-style="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="profileFactory.errors.description"
				:placeholder="typeFactory.isOrganization ? 'About the organization' : 'Bio'" />

			<SofaTextField
				v-if="typeFactory.isOrganization"
				v-model="typeFactory.code"
				custom-class="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Set organization code"
				:error="typeFactory.errors.code"
				border-color="border-transparent" />

			<div class="w-full grid grid-cols-2 gap-4">
				<SofaSelect
					v-model="locationFactory.country"
					custom-class="rounded-custom !bg-lightGray col-span-1"
					placeholder="Country"
					:error="locationFactory.errors.country"
					border-color="border-transparent"
					:options="countries.map((c) => ({ key: c, value: c }))" />

				<SofaSelect
					v-model="locationFactory.state"
					custom-class="rounded-custom !bg-lightGray col-span-1"
					placeholder="State"
					:error="locationFactory.errors.state"
					border-color="border-transparent"
					:options="states.map((s) => ({ key: s, value: s }))" />
			</div>
		</div>

		<div v-if="tab === 'type'" class="w-full flex flex-col gap-4 py-3">
			<SofaTextField
				v-if="typeFactory.isTeacher"
				v-model="typeFactory.school"
				custom-class="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Where do you teach at the moment?"
				:error="typeFactory.errors.school"
				border-color="border-transparent" />

			<SofaSelect
				v-if="typeFactory.isStudent"
				v-model="typeFactory.schoolType"
				custom-class="rounded-custom !bg-lightGray"
				placeholder="Select education level"
				:error="typeFactory.errors.schoolType"
				border-color="border-transparent"
				:options="Object.values(UserSchoolType).map((s) => ({ key: s, value: s }))" />

			<template v-if="typeFactory.isStudent && typeFactory.isCollegeType">
				<SofaSelect
					v-model="typeFactory.institutionId"
					custom-class="rounded-custom !bg-lightGray"
					placeholder="Select school"
					:error="typeFactory.errors.institutionId"
					border-color="border-transparent"
					:options="schools.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					v-model="typeFactory.facultyId"
					custom-class="rounded-custom !bg-lightGray"
					placeholder="Select faculty"
					:error="typeFactory.errors.facultyId"
					border-color="border-transparent"
					:options="filteredFaculties.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					v-model="typeFactory.departmentId"
					custom-class="rounded-custom !bg-lightGray"
					placeholder="Select department"
					:error="typeFactory.errors.departmentId"
					border-color="border-transparent"
					:options="filteredDepartments.map((s) => ({ key: s.id, value: s.title }))" />
			</template>
			<template v-if="typeFactory.isStudent && typeFactory.isAspirantType">
				<div class="w-full flex flex-col gap-4">
					<SofaNormalText class="!font-semibold" content="Your exams" />

					<SofaSelect
						v-model="typeFactory.institutions"
						custom-class="rounded-custom !bg-lightGray"
						placeholder="Select exams"
						border-color="border-transparent"
						:is-multiple="true"
						:options="gatewayExams.map((s) => ({ key: s.id, value: s.title }))" />

					<div class="w-full flex flex-wrap gap-3">
						<SofaBadge
							v-for="institution in typeFactory.institutions
								.map((id) => gatewayExams.find((i) => i.id === id))
								.filter(Boolean)"
							:key="institution.id"
							:color="typeFactory.activeInst === institution.id ? 'purple' : 'gray'"
							custom-class="flex items-center gap-2"
							as="a"
							@click.prevent="typeFactory.activeInst = institution.id">
							{{ institution.title }}
							<SofaIcon
								:name="typeFactory.activeInst === institution.id ? 'circle-close-white' : 'circle-close'"
								class="h-[17px]" />
						</SofaBadge>
					</div>

					<SofaSelect
						v-if="typeFactory.activeInst"
						v-model="typeFactory.getInstitution(typeFactory.activeInst).courseIds"
						custom-class="rounded-custom !bg-lightGray"
						placeholder="Select exam subjects"
						border-color="border-transparent"
						:is-multiple="true"
						:options="
							courses.filter((c) => c.institutionId === typeFactory.activeInst).map((s) => ({ key: s.id, value: s.title }))
						" />
				</div>
			</template>
		</div>

		<div v-if="tab === 'phone'" class="w-full flex flex-col py-5">
			<SofaPhoneInput v-model="phoneFactory.phone" class="rounded-custom bg-lightGray py-2" />
		</div>

		<div v-if="tab === 'phone-verify'" class="w-full flex flex-col items-center justify-center gap-4 py-5">
			<SofaNormalText color="text-grayColor" class="pb-3">
				Enter the 6-digit code sent to {{ phoneFactory.phone.code + phoneFactory.phone.number }}
			</SofaNormalText>
			<div class="w-full md:!w-[60%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" :number-of-input="6" />
			</div>

			<div class="w-full flex items-center justify-center gap-1 pt-3">
				<SofaNormalText color="text-grayColor" content="Didn't receive code?" />
				<SofaNormalText color="text-primaryBlue" as="a" content="Resend code" @click="sendVerificationText" />
			</div>

			<SofaNormalText color="text-primaryBlue" class="mx-auto" as="a" content="Change number" @click="tab = 'phone'" />
		</div>

		<div class="w-full flex flex-col items-center md:py-0 py-4">
			<div v-if="isProfileEducation || isProfilePhone" class="w-full flex justify-end">
				<SofaButton :disabled="isDisabled" class="w-full" padding="px-4 py-3" type="submit">
					{{ isProfilePhone && tab === 'phone' ? 'Send OTP' : 'Save changes' }}
				</SofaButton>
			</div>
			<div v-else class="flex flex-col w-full">
				<SofaButton :disabled="isDisabled" class="w-full" padding="md:py-4 py-3" type="submit"> Continue </SofaButton>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { usePhoneUpdate, useProfileUpdate } from '@/composables/auth/profile'
import { useChooseSchool } from '@/composables/school'
import { useCourseList } from '@/composables/school/courses'
import { useUserLocationUpdate, useUserTypeUpdate } from '@/composables/users/profile'
import { UserSchoolType } from '@modules/users'
import { Logic } from 'sofa-logic'
import {
	SofaBadge,
	SofaButton,
	SofaFileInput,
	SofaIcon,
	SofaImageLoader,
	SofaNormalText,
	SofaOtpInput,
	SofaPhoneInput,
	SofaSelect,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'AccountSetup',
	components: {
		SofaNormalText,
		SofaIcon,
		SofaTextField,
		SofaTextarea,
		SofaButton,
		SofaSelect,
		SofaFileInput,
		SofaImageLoader,
		SofaOtpInput,
		SofaBadge,
		SofaPhoneInput,
	},
	props: {
		isProfileEducation: {
			type: Boolean,
			default: false,
		},
		isProfilePhone: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const { auth, user } = useAuth()
		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: locationFactory, countries, states, updateLocation } = useUserLocationUpdate()
		const { factory: typeFactory, updateType } = useUserTypeUpdate()
		const { factory: phoneFactory, token, sendVerificationText, completeVerification } = usePhoneUpdate()

		const tab = ref(props.isProfileEducation ? 'type' : props.isProfilePhone ? 'phone' : 'profile')
		const isDisabled = computed(() => {
			if (tab.value === 'profile')
				return !profileFactory.valid || !locationFactory.valid || (typeFactory.isOrganization && !typeFactory.valid)
			else if (tab.value === 'type') return !typeFactory.isOrganization && !typeFactory.valid
			else if (tab.value === 'phone') return !phoneFactory.valid
			else if (tab.value === 'phone-verify') return !token.value
			return false
		})

		const accountSetupOptions = computed(() => [
			{
				name: 'Profile',
				id: 'profile',
				hide: false,
				done:
					!!auth.value?.description && !!user.value?.location && (typeFactory.isOrganization ? user.value?.userType.isOrg : true),
			},
			{
				name: typeFactory.isTeacher ? 'Experience' : 'Education',
				id: 'type',
				hide: typeFactory.isOrganization,
				done: !!user.value?.type,
			},
			{
				name: 'Phone',
				id: 'phone',
				hide: false,
				done: !!auth.value?.phone,
			},
		])

		const handleAccountSetup = async () => {
			if (isDisabled.value) return
			if (tab.value === 'profile')
				await Promise.all([typeFactory.isOrganization ? updateType() : true, updateProfile(), updateLocation()]).then((res) => {
					if (res.every(Boolean)) tab.value = typeFactory.isOrganization ? 'phone' : 'type'
				})
			else if (tab.value === 'type')
				await updateType().then((res) => {
					if (res && !props.isProfileEducation) tab.value = 'phone'
				})
			else if (tab.value === 'phone')
				await sendVerificationText().then((res) => {
					if (res) tab.value = 'phone-verify'
				})
			else if (tab.value === 'phone-verify')
				await completeVerification().then(async (res) => {
					if (!res) return
					if (props.isProfilePhone) tab.value = 'phone'
					else await Logic.Common.GoToRoute(await Logic.Common.getRedirectToRoute())
				})
		}

		const { courses, fetchInstitutionCourses } = useCourseList()
		const { schools, gatewayExams, filteredFaculties, filteredDepartments } = useChooseSchool(typeFactory)

		watch(
			() => typeFactory.exams,
			async () => {
				await Promise.all(typeFactory.exams.map(async (exam) => fetchInstitutionCourses(exam.institutionId)))
			},
			{ immediate: true },
		)

		return {
			profileFactory,
			locationFactory,
			typeFactory,
			countries,
			states,
			UserSchoolType,
			schools,
			gatewayExams,
			filteredFaculties,
			filteredDepartments,
			courses,
			tab,
			isDisabled,
			accountSetupOptions,
			phoneFactory,
			token,
			handleAccountSetup,
			sendVerificationText,
		}
	},
})
</script>
