<template>
	<form @submit.prevent="handleAccountSetup" class="w-full flex flex-col gap-4">
		<div class="w-full flex gap-3" v-if="!isProfileEducation && !isProfilePhone">
			<a
				v-for="option in accountSetupOptions.filter((o) => !o.hide)"
				:key="option.id"
				class="p-3 rounded-custom flex items-center gap-2 justify-center w-full"
				:class="tab === option.id ? 'bg-primaryPurple' : option.done ? 'bg-primaryGreen' : 'bg-lightGray'"
				@click="tab = option.id">
				<sofa-normal-text :color="option.done || tab === option.id ? 'text-white' : 'text-grayColor'">
					{{ option.name }}
				</sofa-normal-text>
				<sofa-icon v-if="option.done" :customClass="'h-[14px]'" :name="'done'" />
			</a>
		</div>

		<div v-if="tab === 'profile'" class="w-full flex flex-col gap-4 py-3">
			<div class="w-full flex flex-col items-center justify-center pt-3">
				<sofa-image-loader
					:customClass="`w-[90px] h-[90px] flex items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
					:photoUrl="profileFactory.localPhotoLink">
					<sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!profileFactory.localPhotoLink" />
					<sofa-file-attachment
						:isWrapper="true"
						:customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
						:accept="'image/png, image/gif, image/jpeg'"
						v-model="profileFactory.photo"
						v-model:localFileUrl="profileFactory.localPhotoLink">
						<template v-slot:content>
							<SofaIcon class="h-[18px]" name="camera-white" />
						</template>
					</sofa-file-attachment>
				</sofa-image-loader>
			</div>

			<SofaTextField
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="First Name"
				:error="profileFactory.errors.first"
				v-model="profileFactory.first"
				borderColor="border-transparent" />

			<SofaTextField
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Last Name"
				:error="profileFactory.errors.last"
				v-model="profileFactory.last"
				borderColor="border-transparent" />

			<SofaTextField
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Organization name"
				:error="typeFactory.errors.name"
				v-model="typeFactory.name"
				borderColor="border-transparent"
				v-if="typeFactory.isOrganization" />

			<SofaTextarea
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="profileFactory.errors.description"
				:placeholder="typeFactory.isOrganization ? 'About the organization' : 'Bio'"
				v-model="profileFactory.description" />

			<SofaTextField
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Set organization code"
				:error="typeFactory.errors.code"
				v-model="typeFactory.code"
				borderColor="border-transparent"
				v-if="typeFactory.isOrganization" />

			<div class="w-full grid grid-cols-2 gap-4">
				<SofaSelect
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Country"
					:error="locationFactory.errors.country"
					borderColor="border-transparent"
					v-model="locationFactory.country"
					:options="countries.map((c) => ({ key: c, value: c }))" />

				<SofaSelect
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="State"
					:error="locationFactory.errors.state"
					borderColor="border-transparent"
					v-model="locationFactory.state"
					:options="states.map((s) => ({ key: s, value: s }))" />
			</div>
		</div>

		<div v-if="tab === 'type'" class="w-full flex flex-col gap-4 py-3">
			<SofaTextField
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Where do you teach at the moment?"
				:error="typeFactory.errors.school"
				v-model="typeFactory.school"
				borderColor="border-transparent"
				v-if="typeFactory.isTeacher" />

			<SofaSelect
				customClass="rounded-custom !bg-lightGray"
				placeholder="Select education level"
				:error="typeFactory.errors.schoolType"
				borderColor="border-transparent"
				v-model="typeFactory.schoolType"
				v-if="typeFactory.isStudent"
				:options="Object.values(UserSchoolType).map((s) => ({ key: s, value: s }))" />

			<template v-if="typeFactory.isStudent && typeFactory.isCollegeType">
				<SofaSelect
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select school"
					:error="typeFactory.errors.institutionId"
					borderColor="border-transparent"
					v-model="typeFactory.institutionId"
					:options="schools.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select faculty"
					:error="typeFactory.errors.facultyId"
					borderColor="border-transparent"
					v-model="typeFactory.facultyId"
					:options="filteredFaculties.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select department"
					:error="typeFactory.errors.departmentId"
					borderColor="border-transparent"
					v-model="typeFactory.departmentId"
					:options="filteredDepartments.map((s) => ({ key: s.id, value: s.title }))" />
			</template>
			<template v-if="typeFactory.isStudent && typeFactory.isAspirantType">
				<div class="w-full flex flex-col gap-4">
					<SofaNormalText class="!font-semibold" content="Your exams" />

					<SofaSelect
						customClass="rounded-custom !bg-lightGray"
						v-model="typeFactory.institutions"
						placeholder="Select exams"
						borderColor="border-transparent"
						:isMultiple="true"
						:options="gatewayExams.map((s) => ({ key: s.id, value: s.title }))" />

					<div class="w-full flex flex-wrap gap-3">
						<SofaBadge
							v-for="institution in typeFactory.institutions
								.map((id) => gatewayExams.find((i) => i.id === id))
								.filter(Boolean)"
							:key="institution.id"
							:color="typeFactory.activeInst === institution.id ? 'purple' : 'gray'"
							customClass="flex items-center gap-2"
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
						customClass="rounded-custom !bg-lightGray"
						placeholder="Select exam subjects"
						borderColor="border-transparent"
						:isMultiple="true"
						:options="
							courses.filter((c) => c.institutionId === typeFactory.activeInst).map((s) => ({ key: s.id, value: s.title }))
						"
						v-model="typeFactory.getInstitution(typeFactory.activeInst).courseIds" />
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
				<SofaOtpInput :numberOfInput="6" v-model="token" />
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
	SofaFileAttachment,
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
	components: {
		SofaNormalText,
		SofaIcon,
		SofaTextField,
		SofaTextarea,
		SofaButton,
		SofaSelect,
		SofaFileAttachment,
		SofaImageLoader,
		SofaOtpInput,
		SofaBadge,
		SofaPhoneInput,
	},
	props: {
		name: {
			type: String,
		},
		customClass: {
			type: String,
		},
		isProfileEducation: {
			type: Boolean,
			default: false,
		},
		isProfilePhone: {
			type: Boolean,
			default: false,
		},
	},
	name: 'AccountSetup',
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
				await Promise.all([typeFactory.isOrganization ? updateType(true) : true, updateProfile(true), updateLocation(true)]).then(
					(res) => {
						if (res.every(Boolean)) tab.value = typeFactory.isOrganization ? 'phone' : 'type'
					},
				)
			else if (tab.value === 'type')
				await updateType(true).then((res) => {
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
