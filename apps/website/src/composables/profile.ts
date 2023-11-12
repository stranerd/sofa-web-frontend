import { Logic } from 'sofa-logic'
import { Conditions, SelectOption } from 'sofa-logic/src/logic/types/common'
import { SingleUser } from 'sofa-logic/src/logic/types/domains/users'
import {
  CreateTutorRequestForm,
  CustomizeAIInput,
} from 'sofa-logic/src/logic/types/forms/users'
import { reactive, ref } from 'vue'

const currentSetupOption = ref<'profile' | 'education' | 'phone'>('profile')
const phoneVerificationState = ref('start')
const showAccountSetup = ref(false)
const showCustomizeAI = ref(false)
const allStudents = ref([])
const allRequests = ref([])
const allOrganizationMembers = ref(Logic.Users.AllorganizationMembers)
const showRemoveMember = ref(false)
const selectedMember = ref('')
const allCountries = reactive<SelectOption[]>([])
const allStates = reactive<SelectOption[]>([])
const allOrganizations = reactive<
  {
    id: string
    name: string
    profile_url: string
    subscribed: boolean
  }[]
>([])
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

const customizeAIForm = reactive<CustomizeAIInput>({
  name: '',
  tagline: '',
  photo: undefined,
})

const tutorRequestForm = reactive<CreateTutorRequestForm>({
  qualification: [],
  topicId: '',
  verification: undefined,
})

const setCountry = () => {
  if (Countries.value) {
    allCountries.length = 0

    Countries.value.forEach((country) => {
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

const accountTypeOption = reactive<SelectOption[]>([
  {
    key: 'student',
    value: 'Student',
  },
  {
    key: 'teacher',
    value: 'Tutor',
  },
  {
    key: 'organization',
    value: 'organization',
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
      updateUserEducationForm.institution = educationOptions.schools.filter(
        (item) =>
          item.extraId == Logic.Users.UserProfile.type.school.institutionId,
      )[0]?.value
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

const UpdateProfile = (formComp: any, showLoader = true) => {
  if (updateUserEducationForm.type == 'organization') {
    if (updateProfileForm.organization_name) {
      Logic.Users.UpdateUserForm = {
        data: {
          type: 'organization',
          name: updateProfileForm.organization_name,
          code: updateProfileForm.organization_code,
        },
      }
      Logic.Users.UpdateUser(true, false)
      const fullNameArray = updateProfileForm.organization_name.split(' ')
      updateProfileForm.name.first = fullNameArray[0]
      updateProfileForm.name.last = fullNameArray[1] ?? ''
    }
  }

  Logic.Auth.UpdateUserProfileForm = {
    name: {
      first: updateProfileForm.name.first,
      last: updateProfileForm.name.last,
    },
    description: updateProfileForm.description,
    photo: updateProfileForm.photo,
    socials: [],
  }

  let formState = false

  if (formComp) {
    formState = formComp.validate()
  } else {
    formState = true
  }

  Logic.Auth.UpdateUserProfile(
    formState,
    () => {
      // console.log(progress)
    },
    showLoader,
  )
    .then(() => {
      if (formComp) {
        if (updateUserEducationForm.type == 'organization') {
          updateUserLocation()
            .then(() => {
              Logic.Common.GoToRoute('/')
            })
            .catch(() => {
              Logic.Common.showLoader({
                show: true,
                message: 'Unable to complete account setup. Please try again',
                type: 'warning',
              })
            })
        } else {
          currentSetupOption.value = 'education'
          accountSetupOptions[0].status = 'done'
          accountSetupOptions[1].status = 'active'
        }
      }
    })
    .catch((error) => {
      if (formComp) {
        Logic.Common.showValidationError(error, formComp)
      } else {
        Logic.Common.hideLoader()
      }
    })
}

const CustomizeAI = (formComp: any) => {
  Logic.Users.CustomizeAIForm = {
    name: customizeAIForm.name,
    tagline: customizeAIForm.tagline,
    photo: customizeAIForm.photo,
  }

  let formState = false

  if (formComp) {
    formState = formComp.validate()
  } else {
    formState = true
  }

  Logic.Users.CustomizeAI(formState)
    .then(() => {
      showCustomizeAI.value = false
      Logic.Users.GetUserProfile()
    })
    .catch((error) => {
      if (formComp) {
        Logic.Common.showValidationError(error, formComp)
      } else {
        Logic.Common.hideLoader()
      }
    })
}

const UpdateUserEducation = (useLoader = true, fromProfile = false) => {
  if (updateUserEducationForm.type == 'student') {
    if (updateUserEducationForm.level == 'aspirant') {
      const exams: any = updateUserEducationForm.exams
      Logic.Users.UpdateUserForm = {
        data: {
          type: 'student',
          school: {
            type: 'aspirant',
            exams: exams,
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
  } else if (updateUserEducationForm.type == 'tutor') {
    Logic.Users.UpdateUserForm = {
      data: {
        type: 'teacher',
        school: updateUserEducationForm.tutorSchool,
      },
    }
  }

  Logic.Users.UpdateUser(true, useLoader).then(() => {
    if (useLoader) {
      if (!fromProfile) {
        Logic.Common.GoToRoute('/')
      } else {
        Logic.Common.showLoader({
          show: true,
          message: 'Your changes has been saved',
          type: 'success',
        })
      }
    }
  })
}

const UpdatePhone = () => {
  Logic.Auth.SendPhoneVerificationForm = {
    phone: {
      code: updatePhoneForm.phone.code,
      number:
        updatePhoneForm.phone.number.charAt(0) == '0'
          ? updatePhoneForm.phone.number.substring(1)
          : updatePhoneForm.phone.number,
    },
  }

  Logic.Auth.SendPhoneVerification(true).then(() => {
    phoneVerificationState.value = 'verify'
  })
}

const VerifyPhone = () => {
  if (updatePhoneForm.otp) {
    Logic.Auth.VerifyPhone(updatePhoneForm.otp).then(() => {
      showAccountSetup.value = false
      Logic.Common.GoToRoute('/')
    })
  }
}

const submitVerification = (useLoader = true) => {
  Logic.Users.CreateVerificationForm = {
    content: updateVerificationForm.content,
  }

  Logic.Users.CreateVerification(true, useLoader)
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

const setOrganizationMembers = () => {
  const allMembersEmail = [] ?? allOrganizationMembers.value?.results.map((data) => {
    return data.email.toLocaleLowerCase()
  })

  // get user details if it exist
  Logic.Users.GetUsers({
    where: [
      {
        field: 'bio.email',
        value: allMembersEmail,
        condition: Conditions.in,
      },
    ],
  }).then((response) => {
    const allUsers: SingleUser[] = response
    allRequests.value.length = 0
    allStudents.value.length = 0
    allOrganizationMembers.value?.results.forEach((member) => {
      const user = allUsers.find((item) => item.bio.email?.toLocaleLowerCase() == member.email?.toLocaleLowerCase())

      const memberData = {
        name: user?.bio.name.full ?? member.email,
        email: member.email?.toLocaleLowerCase(),
        profile_url: user?.bio.photo?.link ?? '',
        userId: user?.id ?? '',
        emailId: member.email,
      }
      if (member.pending == true) {
        allRequests.value.push(memberData)
      } else {
        allStudents.value.push(memberData)
      }
    })

    allRequests.value = Logic.Common.removeDuplicatesFromArray(
      allRequests.value,
      ['email'],
    )
    allStudents.value = Logic.Common.removeDuplicatesFromArray(
      allStudents.value,
      ['email'],
    )
  })
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
        Logic.Common.GoToRoute(`/quiz/empty?mode=tutor_test&testId=${res.testId}`)
      })
      .catch((e) => {
        Logic.Common.hideLoader()
        Logic.Common.showLoader({
          show: true,
          message: e?.response?.data?.at(0)?.message ?? e.message,
          type: 'error',
        })
      })
  }
}

const setOrganizations = () => {
  return new Promise((resolve) => {
    Logic.Users.GetUsers({
      where: [
        {
          field: 'id',
          value: Logic.Users.UserProfile.account.organizationsIn,
          condition: Conditions.in,
        },
      ],
    }).then((data) => {
      const allUser: SingleUser[] = data
      allOrganizations.length = 0
      if (data) {
        allUser.forEach((item) => {
          allOrganizations.push({
            id: item.id,
            name: item.bio.name.full,
            profile_url: item.bio.photo?.link,
            subscribed: item.roles.isSubscribed,
          })
        })
      }
      resolve('')
    })
  })
}

const addNewLink = (ref: string) => {
  const currentLink = profileLinks.filter((item) => item.ref == ref)

  if (currentLink.length) {
    allLinks.push(currentLink[0])
  }
}

export {
  Countries, CustomizeAI, UpdatePhone, UpdateProfile, UpdateUserEducation, VerifyPhone, accountSetupOptions, accountTypeOption, addNewLink, allCountries, allLinks, allOrganizationMembers, allOrganizations, allRequests, allStates, allStudents, autoCreateVerification, countryIsSelected, createTutorRequest, currentSetupOption, customizeAIForm, educationOptions, phoneVerificationState, profileLinks, selectedMember, setCountry, setDepartmentsOptions, setExamCourses, setFacultiesOptions, setOrganizationMembers, setOrganizations, setSchoolsOption, showAccountSetup, showCustomizeAI, showRemoveMember, submitVerification, tutorRequestForm, updatePhoneForm, updateProfileForm,
  updateUserEducationForm, updateUserLocation, updateVerificationForm, userSocials
}
