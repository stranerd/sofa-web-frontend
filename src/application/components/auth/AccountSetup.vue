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
					<SofaText
						:content="option.name"
						:class="[
							'hidden mdlg:block',
							{
								'text-primaryGreen': option.done,
								'text-primaryPurple': tab === option.id && !option.done,
								'text-grayColor': !option.done && tab !== option.id,
							},
						]" />
					<div
						v-if="index < accountSetupOptions.length - 1 && !accountSetupOptions[index + 1].hide"
						class="w-8 mdlg:w-12 h-0.5 bg-grayColor mx-1 mdlg:mx-2"></div>
				</a>
			</div>
		</div>

		<div
			:class="{
				'flex flex-col mdlg:flex-row items-center min-w-full':
					tab === 'profile' || (tab === 'type' && (typeFactory.isStudent || typeFactory.isTeacher || typeFactory.isOrganization)),
			}">
			<div
				v-if="
					tab === 'profile' || (tab === 'type' && (typeFactory.isStudent || typeFactory.isTeacher || typeFactory.isOrganization))
				"
				class="w-full flex flex-col mdlg:flex-row gap-4 py-3">
				<div class="flex flex-col items-center justify-center pt-3">
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
				<!-- Organization -->
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.orgLength"
					placeholder="How long has your organization been operating?"
					:error="typeFactory.errors.orgLength"
					:options="[]"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.orgTeachersLength"
					placeholder="How many teachers do you have?"
					:error="typeFactory.errors.orgTeachersLength"
					:options="[]"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.orgStudentsLength"
					placeholder="How many students do you have?"
					:error="typeFactory.errors.orgStudentsLength"
					:options="[]"
					class="text-grayColor" />
				<!-- Organization & Teachers -->
				<SofaSelect
					v-if="typeFactory.isTeacher || typeFactory.isOrganization"
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
							'flex items-center justify-between whitespace-nowrap gap-2 px-2 py-3 border-2 rounded-lg cursor-pointer',
							typeFactory.schoolType === studentType.value ? 'border-primaryPurple bg-lightPurple' : 'border-lightGray',
						]">
						<SofaText :content="studentType.value" class="capitalize" />
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
			<template v-if="(typeFactory.isStudent && typeFactory.isAspirantType) || typeFactory.isTeacher || typeFactory.isOrganization">
				<div class="w-full flex flex-col gap-4 justify-center items-center">
					<SofaHeading v-if="typeFactory.isStudent" content="Choose exams your studying for" />
					<SofaHeading v-if="typeFactory.isTeacher" content="What exams do you teach for?" />
					<SofaHeading v-if="typeFactory.isOrganization" content="What exams does your organization cover?" />

					<div class="w-full flex justify-center items-center flex-wrap gap-3">
						<SofaBadge class="flex items-center gap-2" color="gray">Enter exam</SofaBadge>
						<SofaBadge
							v-for="exam in gatewayExams.map((s) => ({ key: s.id, value: s.title }))"
							:key="exam.key"
							:color="typeFactory.institutions.includes(exam.key) ? 'purple' : 'gray'"
							class="flex items-center gap-2"
							as="a"
							@click.prevent="toggleInstitution(exam.key)">
							{{ exam.value }}
							<SofaIcon
								:name="typeFactory.institutions.includes(exam.key) ? 'done' : 'circle-close'"
								:class="typeFactory.institutions.includes(exam.key) ? 'fill-white' : 'fill-deepGray'"
								class="h-[17px]" />
						</SofaBadge>
					</div>
				</div>
			</template>
		</div>

		<div v-if="tab === 'subjects'" class="w-full flex flex-col py-5 justify-center items-center">
			<template v-if="typeFactory.isStudent || typeFactory.isTeacher || typeFactory.isOrganization">
				<SofaHeading v-if="typeFactory.isStudent" content="Choose subjects you are studying for" />
				<SofaHeading v-if="typeFactory.isTeacher" content="What subjects do you teach?" />
				<SofaHeading v-if="typeFactory.isOrganization" content="What subjects does your organization cover?" />
				<div class="w-full flex justify-center items-center flex-wrap gap-3 py-2">
					<SofaBadge class="flex items-center gap-2" color="gray">Enter exam</SofaBadge>
					<SofaBadge
						v-for="course in courses
							.filter((c) => c.institutionId === typeFactory.activeInst)
							.map((s) => ({ key: s.id, value: s.title }))"
						:key="course.key"
						:color="typeFactory.getInstitution(typeFactory.activeInst).courseIds.includes(course.key) ? 'purple' : 'gray'"
						class="flex items-center gap-2"
						as="a"
						@click="toggleCourse(course.key)">
						{{ course.value }}
					</SofaBadge>
				</div>
			</template>
		</div>

		<div v-if="tab === 'phone'" class="w-full flex flex-col py-5">
			<SofaPhoneInput v-model="phoneFactory.phone" class="rounded-custom bg-lightGray py-2" />
		</div>

		<div v-if="tab === 'phone-verify'" class="w-full flex flex-col items-center justify-center gap-4 py-5">
			<SofaText class="pb-3">Enter the 6-digit code sent to {{ phoneFactory.phoneStr }}</SofaText>
			<div class="w-full md:!w-[60%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" />
			</div>

			<div class="w-full flex items-center justify-center gap-1 pt-3">
				<SofaText content="Didn't receive code?" />
				<SofaText class="text-primaryBlue" as="a" content="Resend code" @click="sendVerificationText" />
			</div>

			<SofaText class="text-primaryBlue mx-auto" as="a" content="Change number" @click="tab = 'phone'" />
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

const router = useRouter()
const { auth, user } = useAuth()
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
	else if (tab.value === 'type') return !typeFactory.isValidExcept('exams')
	else if (tab.value === 'exams') return !typeFactory.isValidExcept('exams')
	else if (tab.value === 'subjects') return !typeFactory.valid
	return false
})

const accountSetupOptions = computed<{ name: string; id: Tab; hide: boolean; done: boolean }[]>(() => [
	{
		name: 'Profile',
		id: 'profile',
		hide: false,
		done: !!auth.value?.description && !!user.value?.location,
	},
	/* {
		name: 'Phone',
		id: 'phone',
		hide: false,
		done: !!auth.value?.phone,
	}, */
	{
		name: typeFactory.isStudent ? 'Education' : 'Experience',
		id: 'type',
		hide: false,
		done: !!user.value?.type || typeFactory.isValidExcept('exams'),
	},
	{
		name: 'Exams',
		id: 'exams',
		hide: !typeFactory.canSetSchool || !typeFactory.isAspirantType,
		done: !!user.value?.type || typeFactory.isValidExcept('exams'),
	},
	{
		name: 'Subjects',
		id: 'subjects',
		hide: !typeFactory.canSetSchool || !typeFactory.isAspirantType,
		done: !!user.value?.type || typeFactory.isValidExcept('exams'),
	},
])

const handleAccountSetup = async () => {
	if (isDisabled.value) return
	if (tab.value === 'profile') {
		const res = await Promise.all([updateProfile(), updateLocation()])
		if (res.every(Boolean)) tab.value = 'type' // 'phone'
	} else if (tab.value === 'phone') {
		const res = await sendVerificationText()
		if (res) tab.value = 'phone-verify'
	} else if (tab.value === 'phone-verify') {
		const res = await completeVerification()
		if (res) tab.value = props.isProfilePhone ? 'phone' : 'type'
	} else if (tab.value === 'type') {
		if (typeFactory.canSetSchool && typeFactory.isAspirantType) {
			tab.value = 'exams'
		} else {
			const res = await updateType()
			if (res && !props.isProfileEducation) complete()
		}
	} else if (tab.value === 'exams') {
		tab.value = 'subjects'
	} else if (tab.value === 'subjects') {
		const res = await updateType()
		if (res) props.isProfileEducation ? (tab.value = 'type') : complete()
	}
}

const complete = async () => {
	await router.push(await $utils.getRedirectToRoute())
}

const toggleCourse = (key: string) => {
	const activeInst = typeFactory.activeInst
	if (!activeInst) return
	const institution = typeFactory.getInstitution(activeInst)
	const index = institution.courseIds.indexOf(key)
	index === -1 ? institution.courseIds.push(key) : institution.courseIds.splice(index, 1)
}

const toggleInstitution = (key: string) => {
	if (typeFactory.institutions.includes(key)) {
		typeFactory.institutions = []
		typeFactory.activeInst = null
	} else {
		typeFactory.institutions = [key]
		typeFactory.activeInst = key
	}
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
