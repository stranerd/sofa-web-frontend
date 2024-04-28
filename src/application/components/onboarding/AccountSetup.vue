<template>
	<form class="w-full flex flex-col gap-4" @submit.prevent="handleAccountSetup">
		<div v-if="!isProfileEducation && !isProfilePhone" class="w-full flex gap-3">
			<a
				v-for="option in accountSetupOptions.filter((o) => !o.hide)"
				:key="option.id"
				class="p-3 rounded-custom flex items-center gap-2 justify-center w-full"
				:class="tab === option.id ? 'bg-primaryPurple' : option.done ? 'bg-primaryGreen' : 'bg-lightGray'"
				@click="tab = option.id">
				<SofaNormalText :color="option.done || tab === option.id ? 'text-white' : 'text-grayColor'">
					{{ option.name }}
				</SofaNormalText>
				<SofaIcon v-if="option.done" class="h-[14px]" name="done" />
			</a>
		</div>

		<div v-if="tab === 'profile'" class="w-full flex flex-col gap-4 py-3">
			<div class="w-full flex flex-col items-center justify-center pt-3">
				<SofaImageLoader class="size-[90px] bg-grayColor rounded-full" :photoUrl="profileFactory.photo?.link">
					<SofaIcon v-if="!profileFactory.photo" class="h-[50px]" name="user" />
					<SofaFileInput
						v-model="profileFactory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px] fill-white" name="camera" />
					</SofaFileInput>
				</SofaImageLoader>
			</div>

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

			<SofaTextField
				v-if="typeFactory.isOrganization"
				v-model="typeFactory.name"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Organization name"
				:error="typeFactory.errors.name"
				borderColor="border-transparent" />

			<SofaTextarea
				v-model="profileFactory.description"
				class="h-[90px] resize-none"
				:error="profileFactory.errors.description"
				:placeholder="typeFactory.isOrganization ? 'About the organization' : 'Bio'" />

			<SofaTextField
				v-if="typeFactory.isOrganization"
				v-model="typeFactory.code"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Set organization code"
				:error="typeFactory.errors.code"
				borderColor="border-transparent" />

			<div class="w-full grid grid-cols-2 gap-4">
				<SofaSelect
					v-model="locationFactory.country"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Country"
					:error="locationFactory.errors.country"
					borderColor="border-transparent"
					:options="countries.map((c) => ({ key: c, value: c }))" />

				<SofaSelect
					v-model="locationFactory.state"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="State"
					:error="locationFactory.errors.state"
					borderColor="border-transparent"
					:options="states.map((s) => ({ key: s, value: s }))" />
			</div>
		</div>

		<div v-if="tab === 'type'" class="w-full flex flex-col gap-4 py-3">
			<SofaTextField
				v-if="typeFactory.isTeacher"
				v-model="typeFactory.school"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Where do you teach at the moment?"
				:error="typeFactory.errors.school"
				borderColor="border-transparent" />

			<SofaSelect
				v-if="typeFactory.isStudent"
				v-model="typeFactory.schoolType"
				customClass="rounded-custom !bg-lightGray"
				placeholder="Select education level"
				:error="typeFactory.errors.schoolType"
				borderColor="border-transparent"
				:options="[UserSchoolType.university].map((s) => ({ key: s, value: s }))" />

			<template v-if="typeFactory.isStudent && typeFactory.isCollegeType">
				<SofaSelect
					v-model="typeFactory.institutionId"
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select school"
					:error="typeFactory.errors.institutionId"
					borderColor="border-transparent"
					:options="schools.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					v-model="typeFactory.facultyId"
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select faculty"
					:error="typeFactory.errors.facultyId"
					borderColor="border-transparent"
					:options="filteredFaculties.map((s) => ({ key: s.id, value: s.title }))" />

				<SofaSelect
					v-model="typeFactory.departmentId"
					customClass="rounded-custom !bg-lightGray"
					placeholder="Select department"
					:error="typeFactory.errors.departmentId"
					borderColor="border-transparent"
					:options="filteredDepartments.map((s) => ({ key: s.id, value: s.title }))" />
			</template>
			<template v-if="typeFactory.isStudent && typeFactory.isAspirantType">
				<div class="w-full flex flex-col gap-4">
					<SofaNormalText class="!font-semibold" content="Your exams" />

					<SofaSelect
						v-model="typeFactory.institutions"
						customClass="rounded-custom !bg-lightGray"
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
								name="circle-close"
								:class="typeFactory.activeInst === institution.id ? 'fill-white' : 'fill-deepGray'"
								class="h-[17px]" />
						</SofaBadge>
					</div>

					<SofaSelect
						v-if="typeFactory.activeInst"
						v-model="typeFactory.getInstitution(typeFactory.activeInst).courseIds"
						customClass="rounded-custom !bg-lightGray"
						placeholder="Select exam subjects"
						borderColor="border-transparent"
						:isMultiple="true"
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
				Enter the 6-digit code sent to {{ phoneFactory.phoneStr }}
			</SofaNormalText>
			<div class="w-full md:!w-[60%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" :numberOfInput="6" />
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

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { usePhoneUpdate, useProfileUpdate } from '@app/composables/auth/profile'
import { useChooseSchool } from '@app/composables/school'
import { useCourseList } from '@app/composables/school/courses'
import { useUserLocationUpdate, useUserTypeUpdate } from '@app/composables/users/profile'
import { UserSchoolType } from '@modules/users'

const props = defineProps<{
	isProfileEducation?: boolean
	isProfilePhone?: boolean
}>()

const { auth, user } = useAuth()
const router = useRouter()
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
		done: !!auth.value?.description && !!user.value?.location && (typeFactory.isOrganization ? user.value?.userType.isOrg : true),
	},
	{
		name: typeFactory.isTeacher ? 'Experience' : 'Education',
		id: 'type',
		hide: typeFactory.isOrganization,
		done: !!user.value?.type,
	},
	/* {
		name: 'Phone',
		id: 'phone',
		hide: false,
		done: !!auth.value?.phone,
	}, */
])

const handleAccountSetup = async () => {
	if (isDisabled.value) return
	if (tab.value === 'profile')
		await Promise.all([typeFactory.isOrganization ? updateType() : true, updateProfile(), updateLocation()]).then((res) => {
			// if (res.every(Boolean)) tab.value = typeFactory.isOrganization ? 'phone' : 'type'
			if (res.every(Boolean)) typeFactory.isOrganization ? complete() : (tab.value = 'type')
		})
	else if (tab.value === 'type')
		await updateType().then((res) => {
			// if (res && !props.isProfileEducation) tab.value = 'phone'
			if (res && !props.isProfileEducation) complete()
		})
	else if (tab.value === 'phone')
		await sendVerificationText().then((res) => {
			if (res) tab.value = 'phone-verify'
		})
	else if (tab.value === 'phone-verify')
		await completeVerification().then((res) => {
			if (!res) return
			if (props.isProfilePhone) tab.value = 'phone'
			else complete()
		})
}

const complete = async () => {
	await router.push(await $utils.getRedirectToRoute())
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
</script>
