<template>
  <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Personal info
      </sofa-header-text>
      <div
        class="w-full flex flex-row items-center justify-start py-2 space-x-4"
      >
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

        <sofa-button
          :padding="'px-5 py-2'"
          @click="Logic.Common.GoToRoute('/profile/' + Logic.Auth.AuthUser.id)"
          >View profile</sofa-button
        >
      </div>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-3 md:!px-3 px-3 py-3'"
        type="text"
        :name="'First name'"
        ref="name.first"
        :placeholder="'First Name'"
        :rules="[FormValidations.RequiredRule]"
        v-model="updateProfileForm.name.first"
        :defaultValue="UserProfile.bio.name.first"
        :borderColor="'border-transparent'"
      />

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-3 md:!px-3 px-3 py-3'"
        type="text"
        :name="'Last name'"
        ref="name.last"
        :placeholder="'Last Name'"
        :rules="[FormValidations.RequiredRule]"
        v-model="updateProfileForm.name.last"
        :defaultValue="UserProfile.bio.name.last"
        :borderColor="'border-transparent'"
      />

      <sofa-textarea
        :hasTitle="false"
        :textAreaStyle="'h-[90px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
        :placeholder="'Bio'"
        :richEditor="false"
        v-model="updateProfileForm.description"
        :updateValue="UserProfile.bio.description"
      />
    </div>

    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Contact info
      </sofa-header-text>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-3 md:!px-3 px-3 py-3'"
        type="text"
        :name="'Email'"
        ref="name.first"
        :placeholder="'Email'"
        v-model="AuthUser.email"
        :rules="[FormValidations.RequiredRule]"
        :disabled="true"
        :borderColor="'border-transparent'"
      />

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-3 md:!px-3 px-3 py-3'"
        type="tel"
        :name="'Phone number'"
        ref="phone.code"
        :disabled="true"
        v-model="userPhoneNumber"
        :placeholder="'Phone number'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
      />
    </div>

    <div
      v-if="UserProfile.type.type != 'organization'"
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Education
      </sofa-header-text>

      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        :name="'AccountType'"
        ref="account_type"
        :placeholder="'Account type'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
        :options="accountTypeOption"
        v-model="updateUserEducationForm.type"
        :updateValue="updateUserEducationForm.type"
      />

      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        :name="'Level'"
        ref="level"
        :placeholder="'Select education level'"
        v-if="updateUserEducationForm.type == 'student'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
        :options="educationOptions.levels"
        v-model="updateUserEducationForm.level"
        @OnOptionSelected="setSchoolsOption"
        :updateValue="updateUserEducationForm.level"
      />

      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        :name="'School'"
        v-if="educationOptions.schools.length"
        ref="school"
        :placeholder="'School'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
        :options="educationOptions.schools"
        v-model="updateUserEducationForm.institution"
        @OnOptionSelected="handleSchoolSelection"
        :updateValue="updateUserEducationForm.institution"
      />

      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="' px-3 py-3'"
        :name="'Faculty'"
        ref="faculty"
        :placeholder="'Faculty'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
        :options="educationOptions.faculties"
        v-if="updateUserEducationForm.type == 'student'"
        v-model="updateUserEducationForm.faculty"
        @OnOptionSelected="setDepartmentsOptions"
        :updateValue="updateUserEducationForm.faculty"
      />

      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        :name="'Department'"
        ref="department"
        :placeholder="'Department'"
        :rules="[FormValidations.RequiredRule]"
        :borderColor="'border-transparent'"
        v-if="updateUserEducationForm.type == 'student'"
        :options="educationOptions.departments"
        v-model="updateUserEducationForm.department"
        :updateValue="updateUserEducationForm.department"
      />
    </div>

    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Social links
      </sofa-header-text>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'Website'"
        ref="website"
        :placeholder="'Website'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[0].link"
        :defaultValue="userSocials.socials[0].link"
      >
      </sofa-text-field>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'TikTok'"
        ref="tiktok"
        :placeholder="'TikTok'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[1].link"
        :defaultValue="userSocials.socials[1].link"
      >
      </sofa-text-field>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'YouTube'"
        ref="youtube"
        :placeholder="'YouTube'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[2].link"
        :defaultValue="userSocials.socials[2].link"
      >
      </sofa-text-field>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'Instagram'"
        ref="instagram"
        :placeholder="'Instagram'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[3].link"
        :defaultValue="userSocials.socials[3].link"
      >
      </sofa-text-field>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'Twitter'"
        ref="twitter"
        :placeholder="'Twitter'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[4].link"
        :defaultValue="userSocials.socials[4].link"
      >
      </sofa-text-field>

      <sofa-text-field
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'  px-3 py-3'"
        type="text"
        :name="'Facebook'"
        ref="facebook"
        :placeholder="'Facebook'"
        :rules="[FormValidations.RequiredRule, FormValidations.UrlRule]"
        :borderColor="'border-transparent'"
        v-model="userSocials.socials[5].link"
        :defaultValue="userSocials.socials[5].link"
      >
      </sofa-text-field>
    </div>

    <div class="h-[40px]"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  SofaHeaderText,
  SofaTextField,
  SofaTextarea,
  SofaIcon,
  SofaFileAttachment,
  SofaImageLoader,
  SofaSelect,
  SofaButton,
} from "sofa-ui-components";
import { FormValidations } from "@/composables";
import {
  accountTypeOption,
  educationOptions,
  setDepartmentsOptions,
  setFacultiesOptions,
  setSchoolsOption,
  submitVerification,
  UpdateProfile,
  updateProfileForm,
  UpdateUserEducation,
  updateUserEducationForm,
  updateVerificationForm,
  userSocials,
} from "@/composables/profile";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaTextField,
    SofaTextarea,
    SofaIcon,
    SofaFileAttachment,
    SofaImageLoader,
    SofaSelect,
    SofaButton,
  },
  setup() {
    const profileImageUrl = ref("");

    const AuthUser = Logic.Auth.AuthUser;
    const UserProfile = ref(Logic.Users.UserProfile);

    const userPhoneNumber = ref(
      AuthUser.phone?.code + "" + AuthUser.phone?.number
    );

    const preventUpdate = ref(true);

    const UserVerification = ref(Logic.Users.Verifications?.results[0]);

    const setDefaultValues = () => {
      updateProfileForm.description = UserProfile.value.bio.description;
      updateProfileForm.name.first = UserProfile.value.bio.name.first;
      updateProfileForm.name.last = UserProfile.value.bio.name.last;
      profileImageUrl.value = UserProfile.value.bio.photo?.link;

      if (UserProfile.value.type?.type) {
        updateUserEducationForm.type = UserProfile.value.type?.type;

        if (UserProfile.value.type?.type == "student") {
          updateUserEducationForm.department =
            UserProfile.value.type.school.departmentId;
          updateUserEducationForm.faculty =
            UserProfile.value.type.school.facultyId;

          updateUserEducationForm.level = "college";
        }
      }

      if (UserVerification.value) {
        updateVerificationForm.socials = UserVerification.value.socials;
      }
    };

    const handleSchoolSelection = (option: any) => {
      updateUserEducationForm.institution = option.extraId;
      setFacultiesOptions();
    };

    onMounted(() => {
      Logic.Users.watchProperty("UserProfile", UserProfile);
      setDefaultValues();
      setSchoolsOption();
      setTimeout(() => {
        preventUpdate.value = false;
      }, 3000);

      // get user verification
      Logic.Users.GetVerifications({
        where: [
          {
            field: "userId",
            condition: Conditions.eq,
            value: Logic.Auth.AuthUser?.id,
          },
        ],
      }).then(() => {
        if (UserVerification.value) {
          updateVerificationForm.socials = UserVerification.value.socials;
        }
      });
    });

    watch(updateProfileForm, () => {
      if (!preventUpdate.value) {
        Logic.Common.debounce(() => {
          UpdateProfile(undefined, false);
        }, 1000);
      }
    });

    watch(updateUserEducationForm, () => {
      if (!preventUpdate.value) {
        Logic.Common.debounce(() => {
          UpdateUserEducation(false);
        }, 500);
      }
    });

    watch(updateVerificationForm, () => {
      if (!preventUpdate.value) {
        updateVerificationForm.content = {
          courses: UserVerification.value.content.courses,
          quizzes: UserVerification.value.content.quizzes,
        };
        Logic.Common.debounce(() => {
          submitVerification(false);
        }, 500);
      }
    });

    watch(userSocials, () => {
      Logic.Common.debounce(() => {
        Logic.Users.UpdateUserSocialForm = {
          socials: userSocials.socials.filter((item) => item.link),
        };
        Logic.Users.UpdateUserSocial();
      }, 500);
    });

    return {
      profileImageUrl,
      FormValidations,
      updateProfileForm,
      AuthUser,
      userPhoneNumber,
      updateUserEducationForm,
      educationOptions,
      accountTypeOption,
      updateVerificationForm,
      UserVerification,
      UserProfile,
      Logic,
      userSocials,
      setSchoolsOption,
      handleSchoolSelection,
      setDepartmentsOptions,
    };
  },
});
</script>
