<template>
	<form class="w-full flex flex-col gap-4" @submit.prevent="handleAccountSetup">
		<div v-if="!isProfileEducation && !isProfilePhone" class="flex items-center gap-2 justify-center w-full">
			<template v-for="(option, index) in accountSetupOptions.filter((o) => !o.hide)" :key="option.id">
				<a
					:class="[
						'flex items-center gap-2',
						{
							'text-primaryGreen': option.done,
							'text-primaryPurple': tab === option.id && !option.done,
							'text-grayColor': !option.done && tab !== option.id,
						},
					]">
					<span class="size-8 rounded-full flex items-center justify-center bg-current">
						<SofaIcon v-if="option.done" class="h-[14px] fill-white" name="done" />
						<span v-else class="text-white">{{ index + 1 }}</span>
					</span>
					<SofaText :content="option.name" class="hidden mdlg:block whitespace-nowrap'" />
				</a>
				<span
					v-if="index < accountSetupOptions.length - 1 && !accountSetupOptions[index + 1].hide"
					class="w-8 mdlg:w-12 h-0.5 bg-grayColor" />
			</template>
		</div>

		<div class="flex flex-col mdlg:flex-row gap-4 items-center w-full py-5">
			<SofaImageLoader
				v-if="tab === 'profile' || tab === 'type'"
				class="size-[90px] mdlg:size-[200px] bg-grayColor rounded-full"
				:photoUrl="profileFactory.photo?.link">
				<SofaIcon v-if="!profileFactory.photo" class="h-[50px] mdlg:h-[150px]" name="user" />
				<SofaFileInput
					v-if="tab === 'profile'"
					v-model="profileFactory.photo"
					class="absolute bottom-[5%] right-[5%] bg-black/50 rounded-full size-[28px] mdlg:size-[40px] flex items-center justify-center"
					accept="image/*">
					<SofaIcon class="h-[18px] fill-white" name="camera" />
				</SofaFileInput>
			</SofaImageLoader>

			<div v-if="tab === 'profile'" class="w-full flex flex-col gap-4">
				<div class="grid mdlg:grid-cols-2 gap-4">
					<SofaInput v-model="profileFactory.first" placeholder="First Name" :error="profileFactory.errors.first" />

					<SofaInput v-model="profileFactory.last" placeholder="Last Name" :error="profileFactory.errors.last" />
				</div>

				<SofaInput
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.name"
					placeholder="Organization name"
					:error="typeFactory.errors.name" />

				<SofaTextarea
					v-model="profileFactory.description"
					class="h-[90px] resize-none"
					:error="profileFactory.errors.description"
					:placeholder="typeFactory.isOrganization ? 'About the organization' : 'Bio'" />

				<SofaInput
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.code"
					placeholder="Set organization code"
					:error="typeFactory.errors.code" />

				<div class="w-full grid grid-cols-2 gap-4">
					<SofaSelect
						v-model="locationFactory.country"
						class="col-span-1 capitalize"
						placeholder="Country"
						:error="locationFactory.errors.country"
						:options="countries.map((c) => ({ key: c, value: c }))" />

					<SofaSelect
						v-model="locationFactory.state"
						class="col-span-1 capitalize"
						placeholder="State"
						:error="locationFactory.errors.state"
						:options="states.map((s) => ({ key: s, value: s }))" />
				</div>
			</div>

			<div v-if="tab === 'type'" class="w-full flex flex-col gap-6">
				<SofaInput
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.degree"
					:error="typeFactory.errors.degree"
					placeholder="What academy degree(s) do you have?" />
				<SofaInput
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.workplace"
					placeholder="Where do you teach now?"
					:error="typeFactory.errors.workplace" />
				<SofaSelect
					v-if="typeFactory.isTeacher"
					v-model="typeFactory.opLength"
					placeholder="How long have you been teaching?"
					:error="typeFactory.errors.opLength"
					:options="opLengths.map((s) => ({ key: s, value: s }))"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.opLength"
					placeholder="How long has your organization been operating?"
					:error="typeFactory.errors.opLength"
					:options="opLengths.map((s) => ({ key: s, value: s }))"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.teachersSize"
					placeholder="How many teachers do you have?"
					:error="typeFactory.errors.teachersSize"
					:options="teachersSize.map((s) => ({ key: s, value: s }))"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isOrganization"
					v-model="typeFactory.studentsSize"
					placeholder="How many students do you have?"
					:error="typeFactory.errors.studentsSize"
					:options="studentsSize.map((s) => ({ key: s, value: s }))"
					class="text-grayColor" />
				<SofaSelect
					v-if="typeFactory.isTeacher || typeFactory.isOrganization"
					v-model="typeFactory.sellsMaterials"
					placeholder="Do you sell study materials?"
					:options="[
						{ key: true, value: 'Yes' },
						{ key: false, value: 'No' },
					]"
					:error="typeFactory.errors.sellsMaterials"
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
							class="text-primaryPurple ring-primaryPurple" />
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

			<div v-if="tab === 'exams'" class="w-full flex flex-col">
				<template
					v-if="(typeFactory.isStudent && typeFactory.isAspirantType) || typeFactory.isTeacher || typeFactory.isOrganization">
					<div class="w-full flex flex-col gap-4 justify-center items-center">
						<SofaHeading v-if="typeFactory.isStudent" content="Choose exams your studying for" />
						<SofaHeading v-if="typeFactory.isTeacher" content="What exams do you teach for?" />
						<SofaHeading v-if="typeFactory.isOrganization" content="What exams does your organization cover?" />

						<div class="w-full flex justify-center items-center flex-wrap gap-3">
							<SofaBadge class="flex items-center gap-2" color="gray">Enter exam</SofaBadge>
							<SofaBadge
								v-for="exam in gatewayExams"
								:key="exam.id"
								:color="typeFactory.hasInstitution(exam.id) ? 'purple' : 'gray'"
								class="flex items-center gap-2"
								as="a"
								@click.prevent="typeFactory.toggleInstitution(exam.id)">
								{{ exam.title }}
								<SofaIcon
									:name="typeFactory.hasInstitution(exam.id) ? 'done' : 'circle-close'"
									:class="typeFactory.hasInstitution(exam.id) ? 'fill-white' : 'fill-deepGray'"
									class="h-[17px]" />
							</SofaBadge>
						</div>
					</div>
				</template>
			</div>

			<div v-if="tab === 'subjects'" class="w-full flex flex-col justify-center items-center gap-4">
				<template v-if="typeFactory.isStudent || typeFactory.isTeacher || typeFactory.isOrganization">
					<SofaHeading v-if="typeFactory.isStudent" content="Choose subjects you are studying for" />
					<SofaHeading v-if="typeFactory.isTeacher" content="What subjects do you teach?" />
					<SofaHeading v-if="typeFactory.isOrganization" content="What subjects does your organization cover?" />
					<div
						v-for="exam in typeFactory.institutions"
						:key="exam.institutionId"
						class="w-full flex justify-start items-center flex-wrap gap-3 py-2">
						<SofaBadge class="flex items-center gap-2" color="gray">
							Enter exams for {{ gatewayExams.find((e) => e.id === exam.institutionId)?.title ?? '' }}
						</SofaBadge>
						<SofaBadge
							v-for="course in courses.filter((c) => c.institutionId === exam.institutionId)"
							:key="course.id"
							:color="exam.courseIds.includes(course.id) ? 'purple' : 'gray'"
							class="flex items-center gap-2"
							as="a"
							@click="exam.toggleCourse(course.id)">
							{{ course.title }}
						</SofaBadge>
					</div>
				</template>
			</div>

			<div v-if="tab === 'phone'" class="w-full flex flex-col">
				<SofaPhoneInput v-model="phoneFactory.phone" class="rounded-custom bg-lightGray py-2" />
			</div>

			<div v-if="tab === 'phone-verify'" class="w-full flex flex-col items-center justify-center gap-6">
				<SofaText>Enter the 6-digit code sent to {{ phoneFactory.phoneStr }}</SofaText>
				<SofaOtpInput v-model="token" class="w-full md:w-[60%]" />

				<div class="w-full flex items-center justify-center gap-1">
					<SofaText content="Didn't receive code?" />
					<SofaText class="text-primaryBlue" as="a" content="Resend code" @click="sendVerificationText" />
				</div>

				<SofaText class="text-primaryBlue" as="a" content="Change number" @click="tab = 'phone'" />
			</div>
		</div>

		<div class="w-full flex items-center justify-end">
			<template v-if="isProfileEducation || isProfilePhone">
				<SofaButton :disabled="isDisabled" padding="px-4 py-2" type="submit">
					{{ isProfilePhone && tab === 'phone' ? 'Send OTP' : 'Save changes' }}
				</SofaButton>
			</template>
			<template v-else>
				<SofaButton v-if="canBack" padding="px-4 py-2" bgColor="bg-grayColor" class="mr-auto" @click="goBack">
					{{ tab === 'profile' ? 'Skip' : 'Back' }}
				</SofaButton>
				<SofaButton :disabled="isDisabled" padding="px-4 py-2" type="submit"> Next </SofaButton>
			</template>
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
	if (tab.value === 'profile')
		return !profileFactory.valid || !locationFactory.valid || !(typeFactory.isOrganization && typeFactory.isValid('name', 'code'))
	else if (tab.value === 'phone') return !phoneFactory.valid
	else if (tab.value === 'phone-verify') return !token.value
	else if (tab.value === 'type') return !typeFactory.isValidExcept('exams')
	else if (tab.value === 'exams') return !typeFactory.isValidExcept('exams')
	else if (tab.value === 'subjects') return !typeFactory.valid
	return false
})
const canBack = computed(() => !props.isProfileEducation && !props.isProfilePhone)

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
		done: !!user.value?.type || typeFactory.valid,
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
			if (res && !props.isProfileEducation) await complete()
		}
	} else if (tab.value === 'exams') {
		tab.value = 'subjects'
	} else if (tab.value === 'subjects') {
		const res = await updateType()
		if (res) props.isProfileEducation ? (tab.value = 'type') : await complete()
	}
}

const goBack = async () => {
	if (!canBack.value) return
	if (tab.value === 'profile') await complete()
	else if (tab.value === 'phone') tab.value = 'profile'
	else if (tab.value === 'phone-verify') tab.value = 'phone'
	else if (tab.value === 'type')
		tab.value = 'profile' // 'phone'
	else if (tab.value === 'exams') tab.value = 'type'
	else if (tab.value === 'subjects') tab.value = 'exams'
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

const opLengths = ['1 - 2 years', '3 - 5 years', '6 - 10 years', '11 - 50 years', '> 50 years']
const teachersSize = ['1 - 10', '11 - 50', '51 - 100', '101 - 1000', '> 1000']
const studentsSize = ['1 - 10', '11 - 50', '51 - 100', '101 - 1000', '1001 - 10000', '> 10000']
</script>
