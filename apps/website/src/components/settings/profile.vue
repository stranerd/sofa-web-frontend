<template>
  <div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
    <div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Personal info
      </sofa-header-text>
      <div class="w-full flex flex-row items-center justify-start py-2 gap-4">
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

        <sofa-button :padding="'px-5 py-2'" @click="Logic.Common.GoToRoute('/profile')">View profile</sofa-button>
      </div>

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'First name'" ref="name.first" :placeholder="'First Name'"
        :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.first"
        :defaultValue="UserProfile.bio.name.first" :borderColor="'border-transparent'" />

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'Last name'" ref="name.last" :placeholder="'Last Name'" :rules="[FormValidations.RequiredRule]"
        v-model="updateProfileForm.name.last" :defaultValue="UserProfile.bio.name.last"
        :borderColor="'border-transparent'" />

      <sofa-textarea :hasTitle="false"
        :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
        :placeholder="'Bio'" v-model="updateProfileForm.description" />
    </div>

    <div id="contact" class="w-full flex flex-col bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left mb-4'">
        Contact info
      </sofa-header-text>

      <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'Email'" ref="name.first" :placeholder="'Email'" v-model="AuthUser.email"
        :rules="[FormValidations.RequiredRule]" :disabled="true" :borderColor="'border-transparent'" />

      <account-setup :isProfilePhone="true" />
    </div>

    <div id="type" v-if="UserProfile.type.type !== 'organization'"
      class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        {{ UserProfile.type.type === 'teacher' ? 'Experience' : 'Education' }}
      </sofa-header-text>

      <account-setup :isProfileEducation="true" />
    </div>

    <div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Social links
      </sofa-header-text>

      <social-media-update />
    </div>

    <div class="h-[40px]"></div>
  </div>
</template>
<script lang="ts">
import SocialMediaUpdate from "@/components/onboarding/SocialMediaUpdate.vue"
import { FormValidations } from "@/composables"
import {
  UpdateProfile,
  educationOptions,
  setDepartmentsOptions,
  setFacultiesOptions,
  setSchoolsOption,
  updatePhoneForm,
  updateProfileForm,
  updateUserEducationForm,
  updateVerificationForm,
  userSocials,
} from "@/composables/profile"
import { Logic } from "sofa-logic"
import {
  SofaButton,
  SofaFileAttachment,
  SofaHeaderText,
  SofaIcon,
  SofaImageLoader,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref, watch } from "vue"
import AccountSetup from "../onboarding/AccountSetup.vue"

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaTextField,
    SofaTextarea,
    SofaIcon,
    SofaFileAttachment,
    SofaImageLoader,
    SofaButton,
    SocialMediaUpdate,
    AccountSetup,
  },
  setup () {
    const profileImageUrl = ref("")

    const AuthUser = Logic.Auth.AuthUser
    const UserProfile = ref(Logic.Users.UserProfile)

    const userPhoneNumber = ref(
      AuthUser.phone ? AuthUser.phone?.code + "" + AuthUser.phone?.number : ""
    )

    const preventUpdate = ref(true)

    const UserVerification = ref(Logic.Users.Verifications?.results[0])

    const setDefaultValues = () => {
      updateProfileForm.description = UserProfile.value.bio.description
      updateProfileForm.name.first = UserProfile.value.bio.name.first
      updateProfileForm.name.last = UserProfile.value.bio.name.last
      profileImageUrl.value = UserProfile.value.bio.photo?.link

      updatePhoneForm.phone.code = AuthUser?.phone?.code
      updatePhoneForm.phone.number = AuthUser?.phone?.number

      if (UserProfile.value.type?.type) {
        updateUserEducationForm.type = UserProfile.value.type?.type

        if (UserProfile.value.type?.type == "student") {
          updateUserEducationForm.level = UserProfile.value.type.school.type
          if (UserProfile.value.type.school.type === 'college') {
            updateUserEducationForm.institution = UserProfile.value.type.school.institutionId
            updateUserEducationForm.department = UserProfile.value.type.school.departmentId
            updateUserEducationForm.faculty = UserProfile.value.type.school.facultyId
          } else if (UserProfile.value.type.school.type === 'aspirant') {
            updateUserEducationForm.exams = UserProfile.value.type.school.exams
          }
        } else if (UserProfile.value.type?.type === 'teacher') {
          updateUserEducationForm.tutorSchool = UserProfile.value.type.school.toString()
        }
      }

      if (UserVerification.value) {
        updateVerificationForm.socials = UserVerification.value.socials
      }
    }

    const handleSchoolSelection = (option: any) => {
      updateUserEducationForm.institution = option.extraId
      setFacultiesOptions()
    }

    onMounted(() => {
      Logic.Users.watchProperty("UserProfile", UserProfile)
      setDefaultValues()
      setSchoolsOption()
      setTimeout(() => {
        preventUpdate.value = false
      }, 3000)
    })

    watch(updateProfileForm, () => {
      if (!preventUpdate.value) {
        Logic.Common.debounce(() => {
          UpdateProfile(undefined, false)
        }, 1000)
      }
    })

    watch(userSocials, () => {
      Logic.Common.debounce(() => {
        Logic.Users.UpdateUserSocialForm = {
          socials: userSocials.socials.filter((item) => item.link),
        }
        Logic.Users.UpdateUserSocial()
      }, 1000)
    })

    return {
      profileImageUrl,
      FormValidations,
      updateProfileForm,
      AuthUser,
      userPhoneNumber,
      updateUserEducationForm,
      educationOptions,
      updateVerificationForm,
      UserVerification,
      UserProfile,
      Logic,
      userSocials,
      setSchoolsOption,
      handleSchoolSelection,
      setDepartmentsOptions,
    }
  },
})
</script>
