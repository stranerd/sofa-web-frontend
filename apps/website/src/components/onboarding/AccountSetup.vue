<template>
  <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
    <div class="w-full grid grid-cols-6 gap-3" v-if="accountSetupOptions.filter((item) => item.show).length > 1">
      <template v-for="(option, index) in accountSetupOptions" :key="index">
        <div :class="`${accountSetupOptions.filter((item) => item.show).length == 2
          ? 'col-span-3'
          : 'col-span-2'
          } py-3 px-3 custom-border flex flex-row items-center gap-2 cursor-pointer justify-center ${option.status == 'active' ? 'bg-primaryPurple' : ''
          }
                                                ${option.status == 'inactive' ? 'bg-lightGrayVaraint' : ''} ${option.status == 'done' ? 'bg-primaryGreen' : ''
          }`" v-if="option.show" @click="selectStage(option)">
          <sofa-normal-text :color="` ${option.status == 'active' ? 'text-white' : ''}
                                                            ${option.status == 'inactive' ? 'text-grayColor' : ''} ${option.status == 'done' ? 'text-white' : ''
            }`">
            {{ option.name }}
          </sofa-normal-text>
          <sofa-icon v-if="option.status == 'done'" :customClass="'h-[14px]'" :name="'done'" />
        </div>
      </template>
    </div>

    <template v-if="currentSetupOption == 'profile' && accountSetupOptions[0].show">
      <div class="w-full flex flex-col gap-4 py-3">
        <div class="w-full flex flex-col items-center justify-center pt-3">
          <sofa-image-loader
            :customClass="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border-[1px] border-grayColor rounded-full`"
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
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'First name'" ref="name.first"
          :placeholder="'First Name'" :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.first"
          :borderColor="'border-transparent'" v-if="currentAccountType != 'organization'" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'Last name'" ref="name.last"
          :placeholder="'Last Name'" :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.last"
          :borderColor="'border-transparent'" v-if="currentAccountType != 'organization'" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'organization name'" ref="organization_name"
          :placeholder="'organization name'" :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.organization_name" :borderColor="'border-transparent'"
          :default-value="updateProfileForm.organization_name" v-if="currentAccountType == 'organization'" />

        <sofa-textarea :hasTitle="false"
          :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="currentAccountType != 'organization'
            ? 'Bio'
            : 'About the organization'
            " :richEditor="false" v-model="updateProfileForm.description" />

        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'organization Code'" ref="organization_code"
          :placeholder="'Set organization Code'" :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.organization_code" :borderColor="'border-transparent'"
          :default-value="updateProfileForm.organization_code" v-if="currentAccountType == 'organization'" />

        <div class="w-full grid grid-cols-2 gap-4" v-if="currentAccountType == 'organization'">
          <div class="col-span-1 flex flex-col">
            <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor !w-full'"
              :padding="'  px-3 py-3'" :name="'Country'" ref="country" :placeholder="'Country'"
              :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :auto-complete="true"
              @on-option-selected="countryIsSelected" v-model="updateProfileForm.country" :options="allCountries" />
          </div>
          <div class="col-span-1 flex flex-col">
            <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'px-3 py-3'" :name="'State'" ref="state" :placeholder="'State'"
              :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :auto-complete="true"
              v-model="updateProfileForm.state" :options="allStates" />
          </div>
        </div>
      </div>
    </template>

    <template v-if="currentSetupOption == 'education' && accountSetupOptions[1].show">
      <div class="w-full flex flex-col gap-4 py-3">
        <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'School'" ref="school" :placeholder="'School'"
          :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'" :options="educationOptions.schools"
          v-if="updateUserEducationForm.type == 'tutor'" v-model="updateUserEducationForm.tutorSchool" />

        <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Level'" ref="level" :placeholder="'Select education level'"
          v-if="updateUserEducationForm.type == 'student'" :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'" :options="educationOptions.levels" v-model="updateUserEducationForm.level"
          @OnOptionSelected="setSchoolsOption" />

        <template v-if="updateUserEducationForm.level != 'aspirant'">
          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'School'" ref="school" :placeholder="'School'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            :options="educationOptions.schools" v-if="updateUserEducationForm.type == 'student'"
            v-model="updateUserEducationForm.school" :update-value="updateUserEducationForm.institution"
            @OnOptionSelected="handleSchoolSelection" />

          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Faculty'" ref="faculty" :placeholder="'Faculty'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            :options="educationOptions.faculties" v-if="updateUserEducationForm.type == 'student'"
            v-model="updateUserEducationForm.faculty" @OnOptionSelected="setDepartmentsOptions" />

          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Department'" ref="department" :placeholder="'Department'"
            :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
            v-if="updateUserEducationForm.type == 'student'" :options="educationOptions.departments"
            v-model="updateUserEducationForm.department" />
        </template>
        <template v-else>
          <div class="w-full flex flex-col gap-4">
            <sofa-normal-text :custom-class="'!font-semibold !text-left'">
              Your exams
            </sofa-normal-text>

            <div class="w-full flex flex-row gap-2 items-center">
              <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
                :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Exams'" ref="exams" :placeholder="'Select exam'"
                :rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
                :options="educationOptions.schools" v-if="updateUserEducationForm.type == 'student'"
                v-model="updateUserEducationForm.school" :update-value="updateUserEducationForm.school" />
              <sofa-button :padding="'py-3 px-4'" @click.prevent="addExam()">Add</sofa-button>
            </div>

            <div class="w-full flex flex-row flex-wrap gap-3">
              <sofa-badge v-for="(item, index) in updateUserEducationForm.exams" :key="index" :color="updateUserEducationForm.selectedExamId == item.institutionId
                ? 'purple'
                : 'gray'
                " :customClass="'!flex !flex-row items-center gap-2 cursor-pointer'" @click.prevent="
    updateUserEducationForm.selectedExamId = item.institutionId
  setExamCourses();
  ">{{
  educationOptions.schools.filter(
    (eachitem) => eachitem.key == item.institutionId
  )[0]?.value
}}
                <span class="pl-2">
                  <sofa-icon :name="updateUserEducationForm.selectedExamId ==
                        item.institutionId
                        ? 'circle-close-white'
                        : 'circle-close'
                      " :customClass="'h-[17px]'"></sofa-icon>
                </span>
              </sofa-badge>
            </div>

            <template v-if="updateUserEducationForm.selectedExamId">
              <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
                :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Courses'" ref="courses"
                :placeholder="'Select exam subjects'" :rules="[FormValidations.RequiredRule]"
                :borderColor="'border-transparent'" :is-multiple="true" v-if="updateUserEducationForm.type == 'student' &&
                  !updateUserEducationForm.fetchingCourse
                  " :options="educationOptions.examCourses" v-model="updateUserEducationForm.exams.filter(
    (item) =>
      item.institutionId ==
      updateUserEducationForm.selectedExamId
  )[0].courseIds
    " />
            </template>
          </div>
        </template>
      </div>
    </template>

    <template v-if="currentSetupOption == 'phone' && accountSetupOptions[2].show">
      <div class="w-full flex flex-col py-5">
        <template v-if="phoneVerificationState == 'start'">
          <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="tel" :name="'Phone'" ref="phone"
            :placeholder="'Enter phone number'" :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'" v-model="updatePhoneForm.phone.number">
            <template v-slot:inner-prefix>
              <sofa-select v-model="updatePhoneForm.phone.code" :options="phoneCodes"
                :customClass="'!border-none bg-transparent !w-[50px]'" :paddings="'!py-0'" :withKey="true"
                :autoComplete="true" :placeholder="'Search country'" />
            </template>
          </sofa-text-field>
        </template>
        <template v-else>
          <div class="w-full flex flex-col items-center justify-center gap-4">
            <sofa-normal-text :color="'text-grayColor'" :customClass="'pb-3'">Enter the 6-digit code sent to
              {{
                updatePhoneForm.phone.code + "" + updatePhoneForm.phone.number
              }}</sofa-normal-text>
            <div class="w-full md:!w-[60%] flex flex-col gap-4">
              <sofa-otp-input :numberOfInput="6" :type="'tel'" :onChangeOTP="onChangeOTP" v-model="updatePhoneForm.otp" />
            </div>

            <div class="w-full flex flex-row items-center justify-center gap-1 pt-3">
              <sofa-normal-text :color="'text-grayColor'">Didn’t receive code?
              </sofa-normal-text>
              <sofa-normal-text :color="'text-primaryBlue'" :customClass="'cursor-pointer'">Resend code</sofa-normal-text>
            </div>

            <div class="w-full flex flex-row items-center justify-center gap-2">
              <sofa-normal-text :color="'text-primaryBlue'" :customClass="'cursor-pointer'"
                @click="phoneVerificationState = 'start'">Change number</sofa-normal-text>
            </div>
          </div>
        </template>
      </div>
    </template>

    <div class="w-full flex flex-col items-center relative md:!py-0 px-0 py-4">
      <template v-if="!fromProfile">
        <div class="flex flex-col w-full" v-if="isNotModal">
          <sofa-button :customClass="'!w-full'" :padding="'md:!py-4 py-3'"
            @click.prevent="handleAccountSetup(currentSetupOption)">
            Next
          </sofa-button>
        </div>
        <div class="flex flex-row items-start justify-between w-full" v-else>
          <sofa-button :customClass="'!border-[1px] '" :bg-color="'bg-white'" :text-color="'text-grayColor'"
            :padding="'md:!py-2 py-3 px-5'" @click.prevent="showAccountSetup = false"
            v-if="Logic.Common.mediaQuery() != 'sm'">
            Close
          </sofa-button>

          <sofa-button :customClass="''" :padding="'md:!py-2 py-3 px-5'"
            @click.prevent="handleAccountSetup(currentSetupOption)">
            Next
          </sofa-button>
        </div>
      </template>
      <template v-else>
        <div class="w-full flex flex-row justify-end">
          <sofa-button :customClass="'!w-full'" :padding="'px-4 py-3'"
            @click.prevent="handleAccountSetup(currentSetupOption)">
            Save changes
          </sofa-button>
        </div>
      </template>
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
  accountSetupOptions,
  accountTypeOption,
  allCountries,
  allStates,
  countryIsSelected,
  currentSetupOption,
  educationOptions,
  phoneVerificationState,
  setCountry,
  setDepartmentsOptions,
  setExamCourses,
  setFacultiesOptions,
  setSchoolsOption,
  showAccountSetup,
  updatePhoneForm,
  updateProfileForm,
  updateUserEducationForm,
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
import { defineComponent, onMounted, ref, watch } from "vue"
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
    fromProfile: {
      type: Boolean,
      default: false,
    },
  },
  name: "AccountSetup",
  setup (props) {
    const profileImageUrl = ref("")

    const formComp = ref<any>()

    const UserProfile = ref(Logic.Users.UserProfile)

    const currentAccountType = ref("student")

    const isNotModal = ref(Logic.Common.route.query?.type ? true : false)

    const handleAccountSetup = (type: "profile" | "education" | "phone") => {
      if (type == "profile") {
        UpdateProfile(formComp.value)
      } else if (type == "education") {
        UpdateUserEducation(true, props.fromProfile)
      } else {
        if (phoneVerificationState.value == "start") {
          UpdatePhone()
        } else {
          VerifyPhone()
        }
      }
    }

    const detectVerificationStage = () => {
      if (props.fromProfile) {
        isNotModal.value = true
        accountSetupOptions[0].show = false
        accountSetupOptions[1].show = true
        accountSetupOptions[2].show = false
        currentSetupOption.value = "education"
        setTimeout(() => {
          setDefaultVerificationData()
        }, 300)

        return
      }

      updateUserEducationForm.type =
        Logic.Common.route.query?.type?.toString() || "student"

      if (isNotModal.value) {
        accountSetupOptions[2].show = false
        if (updateUserEducationForm.type == "organization") {
          accountSetupOptions[0].show = true
          accountSetupOptions[1].show = false
          updateUserEducationForm.type = "organization"
          currentSetupOption.value = "profile"
          updateProfileForm.organization_name = `${UserProfile.value?.bio.name?.full || ""
            }`
          updateProfileForm.description = UserProfile.value?.bio.description
        } else {
          accountSetupOptions[1].show = true
        }
        accountSetupOptions.forEach((item) => {
          if (item.id == "profile") {
            if (currentAccountType.value == "organization") {
              if (UserProfile.value?.type?.name) {
                item.status = "done"
                currentSetupOption.value = "phone"
              }
            } else {
              if (
                UserProfile.value?.bio.name?.first &&
                UserProfile.value?.bio.name?.first != "New"
              ) {
                item.status = "done"
                currentSetupOption.value = "education"
                accountSetupOptions[1].status = "active"
              }
            }
          }

          if (
            item.id == "education" &&
            currentAccountType.value != "organization"
          ) {
            if (UserProfile.value?.type) {
              item.status = "done"
              currentSetupOption.value = "profile"
            }
          }

          if (item.id == "phone") {
            if (UserProfile.value?.bio.phone) {
              item.status = "done"
            }
          }
        })
      } else {
        accountSetupOptions[0].show = false
        accountSetupOptions[1].show = false
        currentSetupOption.value = "phone"
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

    const selectStage = (stage: {
      name: string
      status: string
      id: string
      show: boolean
    }) => {
      accountSetupOptions.forEach((item: any) => {
        if (item.id == stage.id) {
          if (item.status != "done") {
            item.status = "active"
          }
          currentSetupOption.value = item.id
        } else {
          if (item.status != "done") {
            item.status = "inactive"
          }
        }
      })
    }

    const onChangeOTP = () => {
      //
    }

    const setDefaultVerificationData = () => {
      if (UserProfile.value.type?.type) {
        if (UserProfile.value.type?.type == "teacher") {
          updateUserEducationForm.type = "tutor"
          updateUserEducationForm.tutorSchool =
            UserProfile.value.type?.school.toString()
        } else if (UserProfile.value.type?.type == "organization") {
          updateUserEducationForm.type = "organization"
          updateProfileForm.organization_name = UserProfile.value.type?.name
        } else {
          updateUserEducationForm.type = UserProfile.value.type?.type

          updateUserEducationForm.level = UserProfile.value.type?.school.type

          if (UserProfile.value.type?.school.type == "college") {
            updateUserEducationForm.school =
              UserProfile.value.type?.school.institutionId
            updateUserEducationForm.institution =
              UserProfile.value.type?.school.institutionId
            updateUserEducationForm.faculty =
              UserProfile.value.type?.school.facultyId
            updateUserEducationForm.department =
              UserProfile.value.type?.school.departmentId

            handleSchoolSelection({
              extraId: UserProfile.value.type?.school.institutionId,
            })
          }

          if (UserProfile.value.type?.school.type == "aspirant") {
            const allExams: any = UserProfile.value.type?.school.exams
            updateUserEducationForm.exams = allExams
          }
        }
      }
    }

    watch(Countries, () => {
      setCountry()
    })

    onMounted(() => {
      currentAccountType.value =
        Logic.Common.route?.query?.type?.toString() || "student"
      detectVerificationStage()

      Logic.Users.watchProperty("UserProfile", UserProfile)
      if (currentAccountType.value == "organization") {
        Logic.Users.watchProperty("Countries", Countries)
        if (!Countries.value) {
          Logic.Users.GetCountries().then(() => {
            setCountry()
          })
        }
      } else {
        setSchoolsOption()
      }
    })

    return {
      accountSetupOptions,
      currentSetupOption,
      phoneVerificationState,
      FormValidations,
      updatePhoneForm,
      phoneCodes,
      profileImageUrl,
      formComp,
      updateProfileForm,
      currentAccountType,
      educationOptions,
      updateUserEducationForm,
      accountTypeOption,
      allCountries,
      allStates,
      isNotModal,
      showAccountSetup,
      Logic,
      setSchoolsOption,
      setFacultiesOptions,
      setDepartmentsOptions,
      handleSchoolSelection,
      onChangeOTP,
      handleAccountSetup,
      countryIsSelected,
      selectStage,
      addExam,
      setExamCourses,
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
