<template>
	<form class="w-full flex flex-col gap-4" @submit.prevent="handleAccountSetup">
		<div v-if="!isProfileEducation && !isProfilePhone" class="w-full flex gap-3">
			<div class="flex items-center">
				<a
					v-for="(option, index) in accountSetupOptions.filter((o) => !o.hide)"
					:key="option.id"
					class="flex items-center gap-2 w-full"
					@click="tab = option.id">
					<div
						:class="[
							'w-8 h-8 rounded-full flex items-center justify-center text-white',
							{
								'bg-primaryGreen': option.done,
								'bg-primaryPurple': tab === option.id && !option.done,
								'bg-grayColor': !option.done && tab !== option.id,
							},
						]">
						<SofaIcon v-if="option.done" class="h-[14px]" name="done" />
						<span v-else>{{ index + 1 }}</span>
					</div>
					<SofaNormalText
						:class="[
							'hidden mdlg:block',
							{
								'text-primaryGreen': option.done,
								'text-primaryPurple': tab === option.id && !option.done,
								'text-grayColor': !option.done && tab !== option.id,
							},
						]">
						{{ option.name }}
					</SofaNormalText>
					<div
						v-if="index < accountSetupOptions.length - 1 && !accountSetupOptions[index + 1].hide"
						class="w-8 mdlg:w-12 h-0.5 bg-grayColor mx-1 mdlg:mx-2"></div>
				</a>
			</div>
		</div>

		<div
			:class="{
				'flex flex-col mdlg:flex-row items-center justify-around':
					tab === 'profile' || (tab === 'type' && (typeFactory.isStudent || typeFactory.isTeacher)),
			}">
			<div
				v-if="
					tab === 'profile' || (tab === 'type' && (typeFactory.isStudent || typeFactory.isTeacher || typeFactory.isOrganization))
				"
				class="w-full flex flex-col mdlg:flex-row gap-4 py-3">
				<div class="mdlg:w-2/5 flex flex-col items-center justify-center pt-3">
					<SofaImageLoader class="size-[90px] mdlg:size-[200px] bg-grayColor rounded-full" :photoUrl="profileFactory.photo?.link">
						<SofaIcon v-if="!profileFactory.photo" class="h-[50px] mdlg:h-[150px]" name="user" />
						<SofaFileInput
							v-if="tab === 'profile'"
							v-model="profileFactory.photo"
							class="absolute bottom-[-5%] right-[-5%] mdlg:bottom-[5%] mdlg:right-[5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center"
							accept="image/*">
							<SofaIcon class="h-[18px] fill-white" name="camera" />
						</SofaFileInput>
					</SofaImageLoader>
				</div>

				<div v-if="tab === 'profile'" class="mdlg:w-3/5 grid gap-4">
					<div class="grid mdlg:grid-cols-2 gap-4">
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
					</div>

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
							class="col-span-1"
							placeholder="Country"
							:error="locationFactory.errors.country"
							:options="countries.map((c) => ({ key: c, value: c }))" />

						<SofaSelect
							v-model="locationFactory.state"
							class="col-span-1"
							placeholder="State"
							:error="locationFactory.errors.state"
							:options="states.map((s) => ({ key: s, value: s }))" />
					</div>
				</div>
			</div>

			<div v-if="tab === 'type'" class="w-full flex flex-col gap-4 py-3">
				<SofaTextField
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.degree"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					:error="typeFactory.errors.degree"
					placeholder="What acdemy degree(s) do you have?"
					borderColor="border-transparent" />

				<SofaTextField
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.school"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Where do you teach now?"
					:error="typeFactory.errors.school"
					borderColor="border-transparent" />

				<SofaSelect
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.teachingYears"
					placeholder="How long have you been teaching?"
					:options="[]"
					:error="typeFactory.errors.teachingYears"
					class="text-grayColor" />

				<SofaSelect
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.sellMaterials"
					placeholder="Do you sell study materials?"
					:options="[]"
					:error="typeFactory.errors.sellMaterials"
					class="text-grayColor" />

				<div
					v-if="typeFactory.isStudent"
					:class="[
						'flex gap-2',
						typeFactory.schoolType.length > 0 && typeFactory.isCollegeType ? 'flex-row items-center' : 'flex-col',
					]">
					<label
						v-for="studentType in Object.values(UserSchoolType).map((s) => ({ key: s, value: s }))"
						:key="studentType.key"
						:for="studentType.value"
						:class="[
							'flex items-center justify-between gap-2 px-2 py-3 border-2 rounded-lg min-w-fit',
							typeFactory.schoolType === studentType.value ? 'border-primaryPurple bg-lightPurple' : 'border-lightGray',
						]">
						<SofaNormalText :content="studentType.value" class="capitalize text-grayColor" />
						<SofaRadio
							:id="studentType.value"
							v-model="typeFactory.schoolType"
							name="studentType"
							:value="studentType.value"
							:error="typeFactory.errors.schoolType"
							color="text-primaryPurple ring-primaryPurple" />
					</label>
				</div>

				<template v-if="typeFactory.isStudent && typeFactory.isCollegeType">
					<SofaSelect
						v-model="typeFactory.institutionId"
						placeholder="School"
						class="text-grayColor capitalize"
						:error="typeFactory.errors.institutionId"
						:options="schools.map((s) => ({ key: s.id, value: s.title }))" />

					<SofaSelect
						v-model="typeFactory.facultyId"
						placeholder="Faculty"
						class="text-grayColor capitalize"
						:error="typeFactory.errors.facultyId"
						:options="filteredFaculties.map((s) => ({ key: s.id, value: s.title }))" />

					<SofaSelect
						v-model="typeFactory.departmentId"
						placeholder="Department"
						class="text-grayColor capitalize"
						:error="typeFactory.errors.departmentId"
						:options="filteredDepartments.map((s) => ({ key: s.id, value: s.title }))" />
				</template>
			</div>
		</div>

		<div v-if="tab === 'exams'" class="w-full flex flex-col py-5">
			<template v-if="typeFactory.isStudent && typeFactory.isAspirantType">
				<div class="w-full flex flex-col gap-4 justify-center items-center">
					<SofaNormalText class="!font-semibold" content="Choose exams your studying for" />

					<SofaSelect
						v-model="typeFactory.institutions"
						placeholder="Exams"
						multiple
						:options="gatewayExams.map((s) => ({ key: s.id, value: s.title }))" />
					<!-- To convert set of datas into badges here is the code snippet -->

					<!-- <div class="w-full flex justify-center items-center flex-wrap gap-3">
						<SofaBadge customClass="flex items-center gap-2" color="gray">Enter exam</SofaBadge>
						<SofaBadge
							v-for="exam in gatewayExams"
							:key="exam.id"
							:color="typeFactory.activeInst === exam.id ? 'purple' : 'gray'"
							customClass="flex items-center gap-2"
							as="a"
							@click.prevent="typeFactory.activeInst = exam.id">
							{{ exam.title }}
							<SofaIcon
								:name="typeFactory.activeInst === exam.id ? 'done' : 'circle-close'"
								:class="typeFactory.activeInst === exam.id ? 'fill-white' : 'fill-deepGray'"
								class="h-[17px]" />
						</SofaBadge>
					</div> -->
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
								:name="typeFactory.activeInst === institution.id ? 'done' : 'circle-close'"
								:class="typeFactory.activeInst === institution.id ? 'fill-white' : 'fill-deepGray'"
								class="h-[17px]" />
						</SofaBadge>
					</div>
				</div>
			</template>
		</div>

		<div v-if="tab === 'subjects'" class="w-full flex flex-col py-5 justify-center items-center">
			<SofaNormalText class="!font-semibold" content="Choose subjects you are studying for" />
			<div class="w-full flex justify-center items-center flex-wrap gap-3">
				<SofaBadge customClass="flex items-center gap-2" color="gray">Enter exam</SofaBadge>
				<!-- To convert items in the select to now be badges -->
				<SofaSelect
					v-if="typeFactory.activeInst"
					v-model="typeFactory.getInstitution(typeFactory.activeInst).courseIds"
					placeholder="Subjects"
					multiple
					:options="
						courses.filter((c) => c.institutionId === typeFactory.activeInst).map((s) => ({ key: s.id, value: s.title }))
					" />
			</div>
		</div>

		<div v-if="tab === 'phone'" class="w-full flex flex-col py-5">
			<SofaPhoneInput v-model="phoneFactory.phone" class="rounded-custom bg-lightGray py-2" />
		</div>

		<div v-if="tab === 'phone-verify'" class="w-full flex flex-col items-center justify-center gap-4 py-5">
			<SofaNormalText color="text-grayColor" class="pb-3">
				Enter the 6-digit code sent to {{ phoneFactory.phoneStr }}
			</SofaNormalText>
			<div class="w-full md:!w-[60%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" />
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
			<div v-else class="flex items-center justify-between w-full">
				<SofaButton :disabled="isDisabled" padding="px-4 py-2" bgColor="bg-grayColor"> Skip </SofaButton>
				<SofaButton :disabled="isDisabled" padding="px-4 py-2" type="submit"> Next </SofaButton>
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

type Tab = 'type' | 'phone' | 'profile' | 'phone-verify' | 'exams' | 'subjects'

const tab = ref<Tab>(props.isProfileEducation ? 'type' : props.isProfilePhone ? 'phone' : 'profile')
const isDisabled = computed(() => {
	if (tab.value === 'profile') return !profileFactory.valid || !locationFactory.valid
	else if (tab.value === 'phone') return !phoneFactory.valid
	else if (tab.value === 'phone-verify') return !token.value
	else if (tab.value === 'type') return !typeFactory.isValidExceptExams
	else if (tab.value === 'exams') return !typeFactory.isValidExceptExams
	else if (tab.value === 'subjects') return !typeFactory.valid
	return false
})

const accountSetupOptions = computed<{ name: string; id: Tab; hide: boolean; done: boolean }[]>(() => [
	{
		name: 'Profile',
		id: 'profile',
		hide: false,
		done: !!auth.value?.description && !!user.value?.location && (typeFactory.isOrganization ? user.value?.userType.isOrg : true),
	},
	{
		name: typeFactory.isStudent ? 'Education' : 'Experience',
		id: 'type',
		hide: false,
		done: !!user.value?.type || typeFactory.isValidExceptExams,
	},
	{
		name: 'Exams',
		id: 'exams',
		hide: typeFactory.isStudent && (typeFactory.isCollegeType || typeFactory.isUniversityType),
		done: !!user.value?.type || typeFactory.isValidExceptExams,
	},
	{
		name: 'Subjects',
		id: 'subjects',
		hide: typeFactory.isStudent && (typeFactory.isCollegeType || typeFactory.isUniversityType),
		done: !!user.value?.type || typeFactory.isValidExceptExams,
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
		await Promise.all([updateProfile(), updateLocation()]).then((res) => {
			// if (res.every(Boolean)) tab.value = 'phone'
			if (res.every(Boolean)) tab.value = 'type'
		})
	else if (tab.value === 'phone')
		await sendVerificationText().then((res) => {
			if (res) tab.value = 'phone-verify'
		})
	else if (tab.value === 'phone-verify')
		await completeVerification().then((res) => {
			if (!res) return
			if (props.isProfilePhone) tab.value = 'phone'
			else tab.value = 'type'
		})
	else if (tab.value === 'type') {
		if (typeFactory.isStudent && (typeFactory.isUniversityType || typeFactory.isCollegeType)) {
			await updateType().then((res) => {
				if (res && !props.isProfileEducation) complete()
			})
		}
		if ((typeFactory.isStudent && typeFactory.isAspirantType) || typeFactory.isTeacher || typeFactory.isOrganization) {
			tab.value = 'exams'
		}
	} else if (tab.value === 'exams') {
		tab.value = 'subjects'
	} else if (tab.value === 'subjects') {
		await updateType().then((res) => {
			if (res && !props.isProfileEducation) complete()
		})
	}
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
