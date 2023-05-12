import { Logic } from 'sofa-logic'
import { Conditions } from 'sofa-logic/src/logic/types/common'
import { UpdateUserProfileInput } from 'sofa-logic/src/logic/types/forms/auth'
import { reactive, ref } from 'vue'

const currentSetupOption = ref<'profile' | 'education' | 'phone'>('profile')
const phoneVerificationState = ref('start')
const showAccountSetup = ref(false)

const updateProfileForm = reactive<UpdateUserProfileInput>({
  description: '',
  name: {
    first: '',
    last: '',
  },
  photo: undefined,
})

const updatePhoneForm = reactive({
  phone: {
    code: '+234',
    number: '',
  },
  otp: '',
})

const updateUserEducationForm = reactive({
  level: '',
  school: '',
  institution: '',
  faculty: '',
  department: '',
})

const accountSetupOptions = reactive([
  {
    name: 'Profile',
    status: 'active',
    id: 'profile',
  },
  {
    name: 'Education',
    status: 'inactive',
    id: 'education',
  },
  {
    name: 'Phone',
    status: 'inactive',
    id: 'phone',
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
})

const setSchoolsOption = () => {
  Logic.Schools.GetInstitutions({}).then(() => {
    educationOptions.schools.length = 0
    Logic.Schools.AllInstitutions.results.forEach((institution) => {
      educationOptions.schools.push({
        key: institution.title,
        value: institution.title,
        extraId: institution.id,
      })
    })
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

const UpdateProfile = (formComp: any) => {
  Logic.Auth.UpdateUserProfileForm = {
    name: {
      first: updateProfileForm.name.first,
      last: updateProfileForm.name.last,
    },
    description: updateProfileForm.description,
    photo: updateProfileForm.photo,
  }

  const formState: boolean = formComp.validate()

  Logic.Auth.UpdateUserProfile(formState, (progress: any) => {
    console.log(progress)
  })
    .then(() => {
      currentSetupOption.value = 'education'
      accountSetupOptions[0].status = 'done'
      accountSetupOptions[1].status = 'active'
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const UpdateUserEducation = () => {
  Logic.Users.UpdateUserForm = {
    data: {
      type: 'student',
      school: {
        departmentId: updateUserEducationForm.department,
        type: updateUserEducationForm.level,
      },
    },
  }

  Logic.Users.UpdateUser(true).then(() => {
    currentSetupOption.value = 'phone'
    phoneVerificationState.value = 'start'
    accountSetupOptions[1].status = 'done'
    accountSetupOptions[2].status = 'active'
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

export {
  updateProfileForm,
  updateUserEducationForm,
  educationOptions,
  accountSetupOptions,
  currentSetupOption,
  updatePhoneForm,
  phoneVerificationState,
  showAccountSetup,
  UpdateProfile,
  setSchoolsOption,
  setFacultiesOptions,
  setDepartmentsOptions,
  UpdateUserEducation,
  UpdatePhone,
  VerifyPhone,
}
