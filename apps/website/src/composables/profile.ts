import {
	Conditions, CreateTutorRequestForm,
	Logic, SelectOption
} from 'sofa-logic'
import { reactive, ref } from 'vue'

const currentSetupOption = ref<'profile' | 'education' | 'phone'>('profile')
const phoneVerificationState = ref('start')
const showAccountSetup = ref(false)
const showCustomizeAI = ref(false)
const allStudents = ref([])
const allRequests = ref([])
const showRemoveMember = ref(false)
const selectedMember = ref('')
const allCountries = reactive<SelectOption[]>([])
const allStates = reactive<SelectOption[]>([])
const Countries = ref(Logic.Users.Countries)

const updateProfileForm = reactive({
	description: '',
	name: {
		first: '',
		last: '',
	},
	organization_name: '',
	organization_code: '',
	photo: undefined,
	country: '',
	state: '',
})

const userSocials = reactive({
	socials: [
		{
			ref: 'website',
			link: '',
		},
		{
			ref: 'tiktok',
			link: '',
		},
		{
			ref: 'youtube',
			link: '',
		},
		{
			ref: 'instagram',
			link: '',
		},
		{
			ref: 'twitter',
			link: '',
		},
		{
			ref: 'facebook',
			link: '',
		},
	],
})

const tutorRequestForm = reactive<CreateTutorRequestForm>({
	qualification: [],
	topicId: '',
	verification: undefined,
})

const setCountry = () => {
	if (Countries.value) {
		allCountries.length = 0

		Countries.value?.forEach((country) => {
			allCountries.push({
				key: country.name,
				value: country.name,
				extras: JSON.stringify(country.states),
			})
		})
	}
}

const countryIsSelected = (data: any) => {
	updateProfileForm.state = ''
	allStates.length = 0
	const AllStateData: any = JSON.parse(data.extras)
	AllStateData.forEach((states: { name: string; state_code: string }) => {
		allStates.push({
			key: states.name,
			value: states.name,
		})
	})
}

const updateVerificationForm = reactive({
	content: {
		quizzes: [],
		courses: [],
	},
	socials: {
		facebook: '',
		instagram: '',
		linkedIn: '',
		tiktok: '',
		twitter: '',
		website: '',
		youtube: '',
	},
})

const updatePhoneForm = reactive({
	phone: {
		code: '+234',
		number: '',
	},
	otp: '',
})

const updateUserEducationForm = reactive<{
  level: string
  school: string
  institution: string
  faculty: string
  department: string
  type: string
  name: string
  selectedExamId: string
  fetchingCourse: boolean
  exams: {
    institutionId: string
    startDate: number
    endDate: number
    courseIds: string[]
  }[]
  tutorSchool: string
}>({
	level: '',
	school: '',
	institution: '',
	faculty: '',
	department: '',
	type: '',
	name: '',
	fetchingCourse: false,
	selectedExamId: '',
	exams: [],
	tutorSchool: '',
})

const accountSetupOptions = reactive([
	{
		name: 'Profile',
		status: 'active',
		id: 'profile',
		show: true,
	},
	{
		name: 'Education',
		status: 'inactive',
		id: 'education',
		show: true,
	},
	{
		name: 'Phone',
		status: 'inactive',
		id: 'phone',
		show: true,
	},
])

const educationOptions = reactive({
	levels: [
		{
			key: 'college',
			value: 'University undergraduate',
		},
		{
			key: 'aspirant',
			value: 'University aspirant',
		},
	],
	schools: [],
	faculties: [],
	departments: [],
	examCourses: [],
})

const profileLinks = reactive([
	{
		icon: 'website',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'website',
		show: false,
	},
	{
		icon: 'youtube',
		link: '',
		iconSize: 'h-[19px]',
		ref: 'youtube',
		show: false,
	},
	{
		icon: 'instagram-social',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'instagram',
		show: false,
	},
	{
		icon: 'tiktok-social',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'tiktok',
		show: false,
	},
	{
		icon: 'facebook-social',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'facebook',
		show: false,
	},
	{
		icon: 'twitter-social',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'twitter',
		show: false,
	},
])

export const socials = profileLinks.reduce((acc, cur) => {
	return { ...acc, [cur.ref]: cur.icon }
}, {} as Record<string, string>)

const allLinks = reactive([
	{
		icon: 'website',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'website',
		show: false,
	},
	{
		icon: 'tiktok-social',
		link: '',
		iconSize: 'h-[20px]',
		ref: 'tiktok',
		show: false,
	},
])

const setSchoolsOption = () => {
	Logic.Schools.GetInstitutions({}).then(() => {
		educationOptions.schools.length = 0
		Logic.Schools.AllInstitutions.results.forEach((institution) => {
			if (institution.title) {
				if (updateUserEducationForm.level == 'college') {
					if (institution.isGateway == false) {
						educationOptions.schools.push({
							key: institution.title,
							value: institution.title,
							extraId: institution.id,
						})
					}
				}

				if (updateUserEducationForm.level == 'aspirant') {
					if (institution.isGateway == true) {
						educationOptions.schools.push({
							key: institution.id,
							value: institution.title,
							extraId: institution.id,
						})
					}
				}
			}
		})

		if (Logic.Users.UserProfile?.type?.type == 'student') {
			updateUserEducationForm.institution = educationOptions.schools.find(
				(item) =>
					item.extraId == Logic.Users.UserProfile.type.school.institutionId,
			)?.value
		}
	})
}

const setExamCourses = () => {
	updateUserEducationForm.fetchingCourse = true
	Logic.Schools.GetDepartmentCourses({
		where: [
			{
				field: 'institutionId',
				value: updateUserEducationForm.selectedExamId,
				condition: Conditions.eq,
			},
		],
	}).then(() => {
		educationOptions.examCourses.length = 0
		Logic.Schools.AllDepartmentCourses.results.forEach((courses) => {
			educationOptions.examCourses.push({
				key: courses.id,
				value: courses.title,
			})
		})
		updateUserEducationForm.fetchingCourse = false
	})
}

const setFacultiesOptions = () => {
	Logic.Schools.GetFaculties({
		where: [
			{
				field: 'institutionId',
				value: updateUserEducationForm.institution,
				condition: Conditions.eq,
			},
		],
	}).then(() => {
		educationOptions.faculties.length = 0
		Logic.Schools.AllFaculties.results.forEach((faculty) => {
			educationOptions.faculties.push({
				key: faculty.id,
				value: faculty.title,
			})
		})
	})
}

const setDepartmentsOptions = () => {
	Logic.Schools.GetDepartments({
		where: [
			{
				field: 'facultyId',
				value: updateUserEducationForm.faculty,
				condition: Conditions.eq,
			},
		],
	}).then(() => {
		educationOptions.departments.length = 0
		Logic.Schools.AllDepartments.results.forEach((department) => {
			educationOptions.departments.push({
				key: department.id,
				value: department.title,
			})
		})
	})
}

const UpdateProfile = async (formComp: any, showLoader = true) => {
	Logic.Auth.UpdateUserProfileForm = {
		name: {
			first: updateProfileForm.name.first,
			last: updateProfileForm.name.last,
		},
		description: updateProfileForm.description,
		photo: updateProfileForm.photo,
		socials: [],
	}

	await Logic.Auth.UpdateUserProfile(
		formComp?.validate() ?? true,
		() => {
			//
		},
		showLoader,
	)
}

const UpdateUserEducation = async (useLoader = true) => {
	if (updateUserEducationForm.type === 'student') {
		if (updateUserEducationForm.level === 'aspirant') {
			Logic.Users.UpdateUserForm = {
				data: {
					type: 'student',
					school: {
						type: 'aspirant',
						exams: updateUserEducationForm.exams as any,
					},
				},
			}
		} else {
			Logic.Users.UpdateUserForm = {
				data: {
					type: 'student',
					school: {
						departmentId: updateUserEducationForm.department,
						type: updateUserEducationForm.level,
					},
				},
			}
		}
	} else if (updateUserEducationForm.type == 'teacher') {
		Logic.Users.UpdateUserForm = {
			data: {
				type: 'teacher',
				school: updateUserEducationForm.tutorSchool,
			},
		}
	}

	return await Logic.Users.UpdateUser(true, useLoader)
}

const UpdatePhone = async () => {
	Logic.Auth.SendPhoneVerificationForm = {
		phone: {
			code: updatePhoneForm.phone.code,
			// TODO: substring is used to remove 0 if no starts with zero, might only work for 9ja numbers, so needs a more robust solution
			number: updatePhoneForm.phone.number?.substring(updatePhoneForm.phone.number?.charAt(0) == '0' ? 1 : 0)
		},
	}

	return await Logic.Auth.SendPhoneVerification(true)
}

const VerifyPhone = () => {
	if (updatePhoneForm.otp) {
		Logic.Auth.VerifyPhone(updatePhoneForm.otp).then(() => {
			showAccountSetup.value = false
			Logic.Common.GoToRoute('/')
		})
	}
}

const submitVerification = async (useLoader = true) => {
	Logic.Users.CreateVerificationForm = {
		content: updateVerificationForm.content,
	}

	await Logic.Users.CreateVerification(true, useLoader)
	Logic.Common.showAlert({
		message: 'Verification submitted. You will get an email after your account has been reviewed',
		type: 'success'
	})
	await Logic.Common.GoToRoute('/')
}

const autoCreateVerification = () => {
	if (Logic.Users.Verifications.results.length == 0) {
		Logic.Users.CreateVerificationForm = {
			content: {
				quizzes: [],
				courses: [],
			},
		}

		Logic.Users.CreateVerification(true)
	}
}

const updateUserLocation = () => {
	if (updateProfileForm.country && updateProfileForm.state) {
		Logic.Users.UpdateUserLocationForm = {
			location: {
				country: updateProfileForm.country,
				state: updateProfileForm.state,
			},
		}

		return Logic.Users.UpdateUserLocation()
	}
}

const createTutorRequest = () => {
	if (
		tutorRequestForm.qualification.length &&
    tutorRequestForm.topicId &&
    tutorRequestForm.verification
	) {
		Logic.Users.CreateTutorRequestForm = {
			qualification: tutorRequestForm.qualification,
			topicId: tutorRequestForm.topicId,
			verification: tutorRequestForm.verification,
		}
		Logic.Users.CreateTutorRequest()
			.then((res) => {
				Logic.Common.GoToRoute(`/tests/${res.testId}`)
			})
			.catch((e) => {
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: e?.response?.data?.at(0)?.message ?? e.message,
					type: 'error',
				})
			})
	}
}

const addNewLink = (ref: string) => {
	const currentLink = profileLinks.filter((item) => item.ref == ref)

	if (currentLink.length) {
		allLinks.push(currentLink[0])
	}
}

export {
	Countries, UpdatePhone, UpdateProfile, UpdateUserEducation, VerifyPhone, accountSetupOptions, addNewLink, allCountries, allLinks, allRequests, allStates, allStudents, autoCreateVerification, countryIsSelected, createTutorRequest, currentSetupOption, educationOptions, phoneVerificationState, profileLinks, selectedMember, setCountry, setDepartmentsOptions, setExamCourses, setFacultiesOptions, setSchoolsOption, showAccountSetup, showCustomizeAI, showRemoveMember, submitVerification, tutorRequestForm, updatePhoneForm, updateProfileForm,
	updateUserEducationForm, updateUserLocation, updateVerificationForm, userSocials
}
