<template>
  <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
    <div class="w-full flex gap-3" v-if="!isProfileEducation && !isProfilePhone">
      <a v-for="option in accountSetupOptions.filter((o) => !o.hide)" :key="option.id"
        class="p-3 custom-border flex items-center gap-2 justify-center w-full"
        :class="tab === option.id ? 'bg-primaryPurple' : option.done ? 'bg-primaryGreen' : 'bg-lightGrayVaraint'"
        @click="tab = option.id">
        <sofa-normal-text :color="option.done || tab === option.id ? 'text-white' : 'text-grayColor'">
          {{ option.name }}
        </sofa-normal-text>
        <sofa-icon v-if="option.done" :customClass="'h-[14px]'" :name="'done'" />
      </a>
    </div>

    <template v-if="tab === 'profile'">
      <div class="w-full flex flex-col gap-4 py-3">
        <div class="w-full flex flex-col items-center justify-center pt-3">
          <sofa-image-loader
            :customClass="`w-[90px] h-[90px] flex items-center justify-center relative bg-grayColor border-[1px] border-grayColor rounded-full`"
            :photoUrl="profileImageUrl ?? ''">
            <sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!profileImageUrl" />
            <sofa-file-attachment :isWrapper="true"
              :customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
              :accept="'image/png, image/gif, image/jpeg'" v-model="updateProfileForm.photo"
              v-model:localFileUrl="profileImageUrl">
              <template v-slot:content>
                <sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
              </template>
            </sofa-file-attachment>
          </sofa-image-loader>
        </div>

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" type="text" :name="'First name'" ref="name.first" :placeholder="'First Name'"
          :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.first"
          :borderColor="'border-transparent'" v-if="currentAccountType != 'organization'" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" type="text" :name="'Last name'" ref="name.last" :placeholder="'Last Name'"
          :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.last"
          :borderColor="'border-transparent'" v-if="currentAccountType != 'organization'" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" type="text" :name="'organization name'" ref="organization_name"
          :placeholder="'Organization name'" :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.organization_name" :borderColor="'border-transparent'"
          :default-value="updateProfileForm.organization_name" v-if="currentAccountType == 'organization'" />

        <sofa-textarea :hasTitle="false"
          :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:p-4 p-3 resize-none'"
          :placeholder="currentAccountType != 'organization' ? 'Bio' : 'About the organization'"
          v-model="updateProfileForm.description" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" type="text" :name="'organization Code'" ref="organization_code"
          :placeholder="'Set organization code'" :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.organization_code" :borderColor="'border-transparent'"
          :default-value="updateProfileForm.organization_code" v-if="currentAccountType == 'organization'" />

        <div class="w-full grid grid-cols-2 gap-4">
          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor col-span-1'"
            :padding="'p-3'" :name="'Country'" ref="country" :placeholder="'Country'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :auto-complete="true"
            @on-option-selected="countryIsSelected" v-model="updateProfileForm.country" :options="allCountries" />
          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor col-span-1'"
            :padding="'p-3'" :name="'State'" ref="state" :placeholder="'State'" :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'" :auto-complete="true" v-model="updateProfileForm.state"
            :options="allStates" />
        </div>
      </div>
    </template>

    <template v-if="tab === 'type'">
      <div class="w-full flex flex-col gap-4 py-3">
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" :name="'School'" ref="school" :placeholder="'Where do you teach at the moment?'"
          :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :options="educationOptions.schools"
          v-if="updateUserEducationForm.type == 'teacher'" v-model="updateUserEducationForm.tutorSchool" />

        <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" :name="'Level'" ref="level" :placeholder="'Select education level'"
          v-if="updateUserEducationForm.type == 'student'" :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'" :options="educationOptions.levels" v-model="updateUserEducationForm.level"
          @OnOptionSelected="setSchoolsOption" />

        <template v-if="updateUserEducationForm.type === 'student' && updateUserEducationForm.level === 'college'">
          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:p-4 p-3'" :name="'School'" ref="school" :placeholder="'School'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            :options="educationOptions.schools" v-model="updateUserEducationForm.school"
            :update-value="updateUserEducationForm.institution" @OnOptionSelected="handleSchoolSelection" />

          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:p-4 p-3'" :name="'Faculty'" ref="faculty" :placeholder="'Faculty'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            :options="educationOptions.faculties" v-model="updateUserEducationForm.faculty"
            @OnOptionSelected="setDepartmentsOptions" />

          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:p-4 p-3'" :name="'Department'" ref="department" :placeholder="'Department'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            :options="educationOptions.departments" v-model="updateUserEducationForm.department" />
        </template>
        <template v-if="updateUserEducationForm.type === 'student' && updateUserEducationForm.level === 'aspirant'">
          <div class="w-full flex flex-col gap-4">
            <sofa-normal-text :custom-class="'!font-semibold !text-left'">
              Your exams
            </sofa-normal-text>

            <div class="w-full flex flex-row gap-2 items-center">
              <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
                :padding="'md:p-4 p-3'" :name="'Exams'" ref="exams" :placeholder="'Select exam'"
                :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
                :options="educationOptions.schools" v-model="updateUserEducationForm.school"
                :update-value="updateUserEducationForm.school" />
              <sofa-button :padding="'py-3 px-4'" @click.prevent="addExam()">Add</sofa-button>
            </div>

            <div class="w-full flex flex-row flex-wrap gap-3">
              <sofa-badge v-for="(item, index) in updateUserEducationForm.exams" :key="index"
                :color="updateUserEducationForm.selectedExamId === item.institutionId ? 'purple' : 'gray'"
                :customClass="'!flex !flex-row items-center gap-2 cursor-pointer'" @click.prevent="
                  updateUserEducationForm.selectedExamId = item.institutionId
                setExamCourses();
                ">
                {{ educationOptions.schools.find((i) => i.key == item.institutionId)?.value }}
                <span class="pl-2">
                  <sofa-icon
                    :name="updateUserEducationForm.selectedExamId == item.institutionId ? 'circle-close-white' : 'circle-close'"
                    :customClass="'h-[17px]'" />
                </span>
              </sofa-badge>
            </div>

            <template v-if="updateUserEducationForm.selectedExamId">
              <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor'"
                :padding="'md:p-4 p-3'" :name="'Courses'" ref="courses" :placeholder="'Select exam subjects'"
                :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :is-multiple="true"
                v-if="!updateUserEducationForm.fetchingCourse" :options="educationOptions.examCourses"
                v-model="updateUserEducationForm.exams.filter((i) => i.institutionId === updateUserEducationForm.selectedExamId)[0].courseIds" />
            </template>
          </div>
        </template>
      </div>
    </template>

    <template v-if="tab === 'phone'">
      <div class="w-full flex flex-col py-5">
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:p-4 p-3'" type="tel" :name="'Phone'" ref="phone" :placeholder="'Enter phone number'"
          :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
          v-model="updatePhoneForm.phone.number">
          <template v-slot:inner-prefix>
            <sofa-select v-model="updatePhoneForm.phone.code" :options="phoneCodes"
              :customClass="'!border-none bg-transparent !w-[70px]'" :paddings="'!py-0'" :withKey="true"
              :autoComplete="true" :placeholder="'Search country'" />
          </template>
        </sofa-text-field>
      </div>
    </template>

    <template v-if="tab === 'phone-verify'">
      <div class="w-full flex flex-col items-center justify-center gap-4 py-5">
        <sofa-normal-text :color="'text-grayColor'" :customClass="'pb-3'">
          Enter the 6-digit code sent to {{ updatePhoneForm.phone.code + "" + updatePhoneForm.phone.number }}
        </sofa-normal-text>
        <div class="w-full md:!w-[60%] flex flex-col gap-4">
          <sofa-otp-input :numberOfInput="6" :type="'tel'" :onChangeOTP="() => { }" v-model="updatePhoneForm.otp" />
        </div>

        <div class="w-full flex items-center justify-center gap-1 pt-3">
          <sofa-normal-text :color="'text-grayColor'">Didn’t receive code?</sofa-normal-text>
          <sofa-normal-text :color="'text-primaryBlue'" :customClass="'cursor-pointer'" @click="UpdatePhone">Resend code</sofa-normal-text>
        </div>

        <div class="w-full flex items-center justify-center gap-2">
          <sofa-normal-text :color="'text-primaryBlue'" :customClass="'cursor-pointer'" @click="tab = 'phone'">Change number</sofa-normal-text>
        </div>
      </div>
    </template>

    <div class="w-full flex flex-col items-center md:py-0 px-0 py-4">
      <div v-if="isProfileEducation || isProfilePhone" class="w-full flex justify-end">
        <sofa-button :customClass="'!w-full'" :padding="'px-4 py-3'" @click.prevent="handleAccountSetup">
          {{ isProfilePhone && tab === 'phone' ? 'Send OTP': 'Save changes'  }}
        </sofa-button>
      </div>
      <div v-else class="flex flex-col w-full">
        <sofa-button :customClass="'!w-full'" :padding="'md:py-4 py-3'" @click.prevent="handleAccountSetup">
          Continue
        </sofa-button>
      </div>
    </div>
  </sofa-form-wrapper>
</template>
<script lang="ts">
import { FormValidations } from "@/composables"
import {
  Countries,
  UpdatePhone,
  UpdateProfile,
  UpdateUserEducation,
  VerifyPhone,
  allCountries,
  allStates,
  countryIsSelected,
  educationOptions,
  setCountry,
  setDepartmentsOptions,
  setExamCourses,
  setFacultiesOptions,
  setSchoolsOption,
  updatePhoneForm,
  updateProfileForm,
  updateUserEducationForm,
  updateUserLocation,
} from "@/composables/profile"
import { Logic } from "sofa-logic"
import {
  SofaBadge,
  SofaButton,
  SofaFileAttachment,
  SofaFormWrapper,
  SofaIcon,
  SofaImageLoader,
  SofaNormalText,
  SofaOtpInput,
  SofaSelect,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import phoneCodes from "../../assets/country-phone.json"

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
    SofaFormWrapper,
    SofaOtpInput,
    SofaBadge,
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
  name: "AccountSetup",
  setup (props) {
    const profileImageUrl = ref("")

    const formComp = ref<any>()
    const tab = ref(props.isProfileEducation ? 'type' : props.isProfilePhone ? 'phone' : 'profile')
    const currentAccountType = computed(() => UserProfile.value?.type?.type ?? Logic.Common.route?.query?.type?.toString() ?? "student")
    const AuthUser = ref(Logic.Auth.AuthUser)
    const UserProfile = ref(Logic.Users.UserProfile)

    const accountSetupOptions = computed(() => [
      {
        name: 'Profile',
        id: 'profile',
        hide: false,
        done: !!UserProfile.value?.bio.description && !!UserProfile.value?.location && (currentAccountType.value === 'organization' ? UserProfile.value?.type?.type === 'organization' : true),
      },
      {
        name: currentAccountType.value === 'teacher' ? 'Experience' : 'Education',
        id: 'type',
        hide: currentAccountType.value === 'organization',
        done: !!UserProfile.value?.type
      },
      {
        name: 'Phone',
        id: 'phone',
        hide: false,
        done: !!AuthUser.value?.phone
      },
    ])

    const handleAccountSetup = async () => {
      try {
        if (tab.value === 'profile') {
          if (updateUserEducationForm.type === 'organization') {
            Logic.Users.UpdateUserForm = {
              data: {
                type: 'organization',
                name: updateProfileForm.organization_name,
                code: updateProfileForm.organization_code,
              },
            }
            await Logic.Users.UpdateUser(true, false)
            const fullNameArray = updateProfileForm.organization_name.split(' ')
            updateProfileForm.name.first = fullNameArray[0]
            updateProfileForm.name.last = fullNameArray[1] ?? ''
          }
          await UpdateProfile(formComp.value)
          await updateUserLocation()
          tab.value = updateUserEducationForm.type === 'organization' ? 'phone' : 'type'
        } else if (tab.value === 'type') {
          await UpdateUserEducation(true)
          if (!props.isProfileEducation) tab.value = 'phone'
        }
        else if (tab.value === 'phone') {
          await UpdatePhone()
          tab.value = 'phone-verify'
        }
        else if (tab.value === 'phone-verify') {
          await VerifyPhone()
          if (props.isProfilePhone) tab.value = 'phone'
          else await Logic.Common.GoToRoute((await Logic.Auth.getRedirectToRoute()) ?? '/')
        }
      } catch (e) {
        Logic.Common.showValidationError(e, formComp.value)
      }
    }

    const handleSchoolSelection = (option: any) => {
      updateUserEducationForm.institution = option.extraId

      if (updateUserEducationForm.level == "aspirant") {
        //
      } else {
        setFacultiesOptions()
      }
    }

    const addExam = () => {
      if (updateUserEducationForm.school) {
        if (
          updateUserEducationForm.exams.filter(
            (item) => item.institutionId == updateUserEducationForm.school
          ).length == 0
        ) {
          updateUserEducationForm.institution = updateUserEducationForm.school
          updateUserEducationForm.exams.push({
            institutionId: updateUserEducationForm.institution,
            courseIds: [],
            startDate: new Date().getTime(),
            endDate: new Date().getTime(),
          })
          setExamCourses()
          updateUserEducationForm.selectedExamId =
            updateUserEducationForm.institution
        }
        updateUserEducationForm.school = ""
      }
    }

    const setDefaultVerificationData = () => {
      profileImageUrl.value = UserProfile.value?.bio.photo?.link ?? ''
      updateProfileForm.name.first = UserProfile.value?.bio.name.first
      updateProfileForm.name.last = UserProfile.value?.bio.name.last
      updateProfileForm.description = UserProfile.value?.bio.description
      updateProfileForm.country = UserProfile.value?.location?.country
      updateProfileForm.state = UserProfile.value?.location?.state
      updatePhoneForm.phone.code = AuthUser.value?.phone?.code
      updatePhoneForm.phone.number = AuthUser.value?.phone?.number
      if (currentAccountType.value == "teacher") {
        updateUserEducationForm.type = "teacher"
        updateUserEducationForm.tutorSchool = UserProfile.value?.type?.school.toString()
      } else if (currentAccountType.value == "organization") {
        updateUserEducationForm.type = "organization"
        updateProfileForm.organization_name = UserProfile.value?.type?.name ?? UserProfile.value?.bio.name.full ?? ""
      } else {
        updateUserEducationForm.type = "student"
        updateUserEducationForm.level = UserProfile.value?.type?.school?.type

        if (UserProfile.value?.type?.school?.type == "college") {
          updateUserEducationForm.institution = UserProfile.value.type.school.institutionId
          updateUserEducationForm.faculty = UserProfile.value.type.school.facultyId
          updateUserEducationForm.department = UserProfile.value.type.school.departmentId

          handleSchoolSelection({ extraId: updateUserEducationForm.institution })
        }

        if (UserProfile.value?.type?.school?.type == "aspirant") {
          updateUserEducationForm.exams = UserProfile.value.type.school.exams as any
        }
      }
    }

    watch(Countries, () => {
      setCountry()
    })

    onMounted(() => {
      Logic.Auth.watchProperty("AuthUser", AuthUser)
      Logic.Users.watchProperty("UserProfile", UserProfile)
      Logic.Users.watchProperty("Countries", Countries)
      setDefaultVerificationData()
      if (!Countries.value) Logic.Users.GetCountries().then(setCountry)
      setSchoolsOption()
    })

    return {
      tab,
      accountSetupOptions,
      FormValidations,
      updatePhoneForm,
      phoneCodes,
      profileImageUrl,
      formComp,
      updateProfileForm,
      currentAccountType,
      educationOptions,
      updateUserEducationForm,
      allCountries,
      allStates,
      Logic,
      setSchoolsOption,
      setFacultiesOptions,
      setDepartmentsOptions,
      handleSchoolSelection,
      handleAccountSetup,
      countryIsSelected,
      addExam,
      setExamCourses,
      UpdatePhone,
    }
  },
  data () {
    return {
      parentRefs: null,
    }
  },
  mounted () {
    const parentRefs: any = this.$refs
    this.parentRefs = parentRefs
  },
})
</script>
