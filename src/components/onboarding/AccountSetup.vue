<template>
  <sofa-form-wrapper
    :parentRefs="parentRefs"
    ref="formComp"
    class="w-full flex flex-col space-y-4"
  >
    <div class="w-full grid grid-cols-3 gap-3">
      <div
        :class="`col-span-1 py-3 px-3 custom-border flex flex-row items-center space-x-2 justify-center ${
          option.status == 'active' ? 'bg-primaryPurple' : ''
        } 
        ${option.status == 'inactive' ? 'bg-lightGrayVaraint' : ''} ${
          option.status == 'done' ? 'bg-primaryGreen' : ''
        }`"
        v-for="(option, index) in accountSetupOptions"
        :key="index"
      >
        <sofa-normal-text
          :color="` ${option.status == 'active' ? 'text-white' : ''} 
          ${option.status == 'inactive' ? 'text-grayColor' : ''} ${
            option.status == 'done' ? 'text-white' : ''
          }`"
        >
          {{ option.name }}
        </sofa-normal-text>
        <sofa-icon
          v-if="option.status == 'done'"
          :customClass="'h-[14px]'"
          :name="'done'"
        />
      </div>
    </div>

    <template v-if="currentSetupOption == 'profile'">
      <div class="w-full flex flex-col space-y-4 py-3">
        <div class="w-full flex flex-col items-center justify-center pt-3">
          <sofa-image-loader
            :customClass="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border-[1px] border-grayColor rounded-full`"
            :photoUrl="profileImageUrl"
          >
            <sofa-icon
              :customClass="'h-[50px]'"
              :name="'user'"
              v-if="!profileImageUrl"
            />
            <sofa-file-attachment
              :isWrapper="true"
              :customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
              :accept="'image/png, image/gif, image/jpeg'"
              v-model="updateProfileForm.photo"
              v-model:localFileUrl="profileImageUrl"
            >
              <template v-slot:content>
                <sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
              </template>
            </sofa-file-attachment>
          </sofa-image-loader>
        </div>

        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          type="text"
          :name="'First name'"
          ref="name.first"
          :placeholder="'First Name'"
          :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.name.first"
          :borderColor="'border-transparent'"
        />

        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          type="text"
          :name="'Last name'"
          ref="name.last"
          :placeholder="'Last Name'"
          :rules="[FormValidations.RequiredRule]"
          v-model="updateProfileForm.name.last"
          :borderColor="'border-transparent'"
        />

        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="'Bio'"
          :richEditor="false"
          v-model="updateProfileForm.description"
        />
      </div>
    </template>

    <template v-if="currentSetupOption == 'education'">
      <div class="w-full flex flex-col space-y-4 py-3">
        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'Level'"
          ref="level"
          :placeholder="'Select education level'"
          :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'"
          :options="educationOptions.levels"
          v-model="updateUserEducationForm.level"
          @OnOptionSelected="setSchoolsOption"
        />

        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'School'"
          ref="school"
          :placeholder="'School'"
          :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'"
          :options="educationOptions.schools"
          v-model="updateUserEducationForm.school"
          @OnOptionSelected="handleSchoolSelection"
        />

        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'Faculty'"
          ref="faculty"
          :placeholder="'Faculty'"
          :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'"
          :options="educationOptions.faculties"
          v-model="updateUserEducationForm.faculty"
          @OnOptionSelected="setDepartmentsOptions"
        />

        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'Department'"
          ref="department"
          :placeholder="'Department'"
          :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'"
          :options="educationOptions.departments"
          v-model="updateUserEducationForm.department"
        />
      </div>
    </template>

    <template v-if="currentSetupOption == 'phone'">
      <div class="w-full flex flex-col py-5">
        <template v-if="phoneVerificationState == 'start'">
          <sofa-text-field
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'"
            type="tel"
            :name="'Phone'"
            ref="phone"
            :placeholder="'Enter phone number'"
            :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'"
            v-model="updatePhoneForm.phone.number"
          >
            <template v-slot:inner-prefix>
              <sofa-select
                v-model="updatePhoneForm.phone.code"
                :options="phoneCodes"
                :customClass="'!border-none bg-transparent !w-[50px]'"
                :paddings="'!py-0'"
                :withKey="true"
                :autoComplete="true"
                :placeholder="'Search country'"
              />
            </template>
          </sofa-text-field>
        </template>
        <template v-else>
          <div
            class="w-full flex flex-col items-center justify-center space-y-4"
          >
            <sofa-normal-text :color="'text-grayColor'" :customClass="'pb-3'"
              >Enter the 6-digit code sent to
              {{
                updatePhoneForm.phone.code + "" + updatePhoneForm.phone.number
              }}</sofa-normal-text
            >
            <div class="w-full md:!w-[60%] flex flex-col space-y-4">
              <sofa-otp-input
                :numberOfInput="6"
                :type="'tel'"
                :onChangeOTP="onChangeOTP"
                v-model="updatePhoneForm.otp"
              />
            </div>

            <div
              class="w-full flex flex-row items-center justify-center space-x-1 pt-3"
            >
              <sofa-normal-text :color="'text-grayColor'"
                >Didn’t receive code?
              </sofa-normal-text>
              <sofa-normal-text
                :color="'text-primaryBlue'"
                :customClass="'cursor-pointer'"
                >Resend code</sofa-normal-text
              >
            </div>

            <div
              class="w-full flex flex-row items-center justify-center space-x-2"
            >
              <sofa-normal-text
                :color="'text-primaryBlue'"
                :customClass="'cursor-pointer'"
                @click="phoneVerificationState = 'start'"
                >Change number</sofa-normal-text
              >
            </div>
          </div>
        </template>
      </div>
    </template>

    <div
      class="w-full flex flex-row items-center justify-between md:!relative fixed bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0 py-4 px-4"
    >
      <sofa-button
        :padding="'px-5 py-2'"
        :bgColor="'bg-white'"
        :textColor="'text-grayColor'"
        :customClass="'border-[1px] border-gray-100'"
      >
        Exit
      </sofa-button>

      <sofa-button
        :padding="'px-5 py-2'"
        @click.prevent="handleAccountSetup(currentSetupOption)"
      >
        Next
      </sofa-button>
    </div>
  </sofa-form-wrapper>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import {
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
} from "sofa-ui-components";
import { FormValidations } from "@/composables";
import phoneCodes from "../../assets/country-phone.json";
import {
  accountSetupOptions,
  currentSetupOption,
  educationOptions,
  phoneVerificationState,
  setDepartmentsOptions,
  setFacultiesOptions,
  setSchoolsOption,
  UpdatePhone,
  updatePhoneForm,
  UpdateProfile,
  updateProfileForm,
  UpdateUserEducation,
  updateUserEducationForm,
  VerifyPhone,
} from "@/composables/profile";

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
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      required: true,
    },
  },
  name: "AccountSetup",
  setup() {
    const profileImageUrl = ref("");

    const formComp = ref<any>();

    const handleAccountSetup = (type: "profile" | "education" | "phone") => {
      if (type == "profile") {
        UpdateProfile(formComp.value);
      } else if (type == "education") {
        UpdateUserEducation();
      } else {
        if (phoneVerificationState.value == "start") {
          UpdatePhone();
        } else {
          VerifyPhone();
        }
      }
    };

    const handleSchoolSelection = (option: any) => {
      updateUserEducationForm.institution = option.extraId;
      setFacultiesOptions();
    };

    const onChangeOTP = () => {
      //
    };

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
      handleAccountSetup,
      educationOptions,
      updateUserEducationForm,
      setSchoolsOption,
      setFacultiesOptions,
      setDepartmentsOptions,
      handleSchoolSelection,
      onChangeOTP,
    };
  },
  data() {
    return {
      parentRefs: null,
    };
  },
  mounted() {
    const parentRefs: any = this.$refs;
    this.parentRefs = parentRefs;
  },
});
</script>
