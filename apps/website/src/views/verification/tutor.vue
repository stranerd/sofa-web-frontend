<template>
  <expanded-layout
    :hasBottomBar="false"
    layoutStyle="mdlg:!w-[60%] lg:!w-[45%] w-full pt-0  mdlg:!pt-0 lg:!pt-0 "
  >
    <div
      class="w-full flex mdlg:!hidden flex-row items-center space-x-3 z-50 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
    >
      <sofa-icon
        :customClass="'h-[15px]'"
        :name="'back-arrow'"
        @click="Logic.Common.goBack()"
      />
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        Become a tutor</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <div class="w-full flex flex-col space-y-5 mdlg:px-0 px-4">
      <!-- Top bar for larger screens -->
      <div
        class="w-full hidden flex-row items-center justify-between mdlg:!flex"
      >
        <sofa-header-text :customClass="'!text-2xl !font-bold'">
          Become a tutor
        </sofa-header-text>
        <div class="flex flex-row items-center space-x-2">
          <sofa-button :padding="'px-5 py-2'"> Next </sofa-button>
          <sofa-button
            :padding="'px-5 py-2'"
            :bgColor="'bg-primaryGreen'"
            :customClass="'opacity-50'"
            :disabled="true"
          >
            Submit
          </sofa-button>
        </div>
      </div>

      <div class="w-full grid grid-cols-2 gap-2">
        <div class="col-span-1 h-[8px] rounded-[99px] bg-[#141618]"></div>
        <div class="col-span-1 h-[8px] rounded-[99px] bg-[#E1E6EB]"></div>
      </div>

      <!-- Profile -->
      <template v-if="currentStep == 'profile'">
        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <sofa-header-text :size="'xl'" :customClass="'text-left'">
            Profile
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

        <!-- Qualifications -->

        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <sofa-header-text :size="'xl'" :customClass="'text-left'">
            Qualification
          </sofa-header-text>

          <sofa-file-attachment
            :isWrapper="true"
            :customClass="'custom-border border-[2px] border-dashed border-primaryPurple bg-[#F1F6FA] py-4 px-4 items-center jusify-center flex !flex-row space-x-2'"
            v-model="tutorRequestForm.qualification"
            accept="application/pdf, image/*"
            :is-multiple="true"
          >
            <template v-slot:content>
              <div
                class="w-full flex mdlg:flex-row mdlg:space-x-3 flex-col space-y-1 mdlg:space-y-0 items-center justify-center"
              >
                <sofa-icon :name="'upload-purple'" :customClass="'h-[16px]'" />

                <sofa-normal-text
                  :color="'text-primaryPurple'"
                  :customClass="'text-center'"
                >
                  {{
                    tutorRequestForm.qualification.length
                      ? `${tutorRequestForm.qualification
                          .map((item) => item.name)
                          .join(", ")}`
                      : " Upload PDFs or images of your degree, results, transcripts, e.t.c."
                  }}
                </sofa-normal-text>
              </div>
            </template>
          </sofa-file-attachment>
        </div>

        <!-- Verification -->
        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <sofa-header-text :size="'xl'" :customClass="'text-left'">
            Verification
          </sofa-header-text>

          <sofa-file-attachment
            :isWrapper="true"
            :customClass="'custom-border border-[2px] border-dashed border-primaryPurple  bg-[#F1F6FA] py-4 px-4 items-center jusify-center flex !flex-row space-x-2'"
            v-model="tutorRequestForm.verification"
            accept="image/*"
          >
            <template v-slot:content>
              <div
                class="w-full flex mdlg:flex-row mdlg:space-x-3 flex-col space-y-1 mdlg:space-y-0 items-center justify-center"
              >
                <sofa-icon :name="'upload-purple'" :customClass="'h-[16px]'" />
                <sofa-normal-text :color="'text-primaryPurple'">
                  {{
                    tutorRequestForm.verification
                      ? `${tutorRequestForm.verification.name}`
                      : "Upload a valid ID"
                  }}
                </sofa-normal-text>
              </div>
            </template>
          </sofa-file-attachment>
        </div>

        <!-- Location -->
        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <sofa-header-text :size="'xl'" :customClass="'text-left'">
            Location
          </sofa-header-text>

          <sofa-select
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'  px-3 py-3'"
            :name="'Country'"
            ref="country"
            :placeholder="'Country'"
            :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'"
            :auto-complete="true"
            @on-option-selected="countryIsSelected"
            v-model="updateProfileForm.country"
            :options="allCountries"
          />

          <sofa-select
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'px-3 py-3'"
            :name="'State'"
            ref="state"
            :placeholder="'State'"
            :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'"
            :auto-complete="true"
            v-model="updateProfileForm.state"
            :options="allStates"
          />
        </div>
      </template>

      <!-- Test -->

      <template v-if="currentStep == 'test'">
        <!-- Select subject -->
        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <div class="w-full flex flex-col space-y-1">
            <sofa-header-text :size="'xl'" :customClass="'text-left'">
              Subject
            </sofa-header-text>
            <sofa-normal-text>
              Choose the subject you want to teach
            </sofa-normal-text>
          </div>

          <sofa-select
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'  px-3 py-3'"
            :name="'Subject'"
            ref="Subject"
            :placeholder="'Select subject'"
            :rules="[FormValidations.RequiredRule]"
            :borderColor="'border-transparent'"
            :auto-complete="true"
            :options="allTopics"
            v-model="tutorRequestForm.topicId"
          />
        </div>

        <!-- Subject test -->
        <div
          class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
        >
          <div class="w-full flex flex-col space-y-1">
            <sofa-header-text :size="'xl'" :customClass="'text-left'">
              Test
            </sofa-header-text>
            <sofa-normal-text>
              Pass a test on the subject you selected
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col" v-if="SingleTutorRequest">
            <sofa-normal-text
              :color="'text-grayColor'"
              v-if="!tutorRequestForm.topicId"
            >
              You have not selected any subject
            </sofa-normal-text>
            <template v-else>
              <div
                :class="`flex flex-row ${
                  SingleTutorRequest.testFinished ? 'opacity-50' : ''
                } `"
                v-if="!SingleTutorRequest.testFinished"
              >
                <sofa-button
                  @click="
                    SingleTutorRequest.testFinished
                      ? null
                      : Logic.Common.GoToRoute(
                          `/quiz/empty?mode=tutor_test&testId=${SingleTutorRequest.topicId}`
                        )
                  "
                >
                  Take test
                </sofa-button>
              </div>

              <template v-if="SingleTutorRequest.testFinished">
                <sofa-normal-text :color="'text-grayColor'"
                  >Waiting for approval...</sofa-normal-text
                >
              </template>
            </template>
          </div>
          <div v-else class="w-full flex flex-col">
            <sofa-activity-card v-if="TestQuiz" :activity="TestQuiz">
            </sofa-activity-card>
          </div>
        </div>
      </template>

      <div class="h-[100px]"></div>
    </div>
    <!-- Button for smaller screens -->
    <div
      class="w-full flex flex-col fixed bottom-0 left-0 bg-white px-4 py-4 mdlg:hidden"
    >
      <sofa-button
        :padding="'py-3'"
        :customClass="'!w-full'"
        @click="handleNextAction()"
      >
        Next
      </sofa-button>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import {
  SofaNormalText,
  SofaHeaderText,
  SofaButton,
  SofaIcon,
  SofaTextField,
  SofaTextarea,
  SofaFileAttachment,
  SofaImageLoader,
  SofaSelect,
  SofaActivityCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import {
  allCountries,
  allStates,
  Countries,
  countryIsSelected,
  createTutorRequest,
  setCountry,
  tutorRequestForm,
  UpdateProfile,
  updateProfileForm,
  updateUserLocation,
} from "@/composables/profile";
import { FormValidations } from "@/composables";
import { allTopics, getTopics } from "@/composables/course";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaHeaderText,
    SofaIcon,
    SofaButton,
    SofaTextField,
    SofaTextarea,
    SofaFileAttachment,
    SofaImageLoader,
    SofaSelect,
    SofaActivityCard,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Users",
        property: "AllTutorRequests",
        method: "GetTutorRequests",
        params: [
          {
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          },
          true,
        ],
        requireAuth: true,
      },
    ],
  },
  name: "BecomeATutorPage",
  setup() {
    useMeta({
      title: "Become a tutor",
    });

    const currentStep = ref("profile");

    const profileImageUrl = ref("");
    const UserProfile = ref(Logic.Users.UserProfile);
    const SingleTutorRequest = ref(Logic.Users.SingleTutorRequest);
    const SingleQuiz = ref(Logic.Study.SingleQuiz);
    const TestQuiz = ref();

    const selectedTopic = ref("");

    const setDefault = () => {
      profileImageUrl.value = UserProfile.value.bio.photo?.link || null;
      updateProfileForm.description = UserProfile.value.bio.description;
      updateProfileForm.name = UserProfile.value.bio.name;
      if (UserProfile.value.location) {
        updateProfileForm.state = UserProfile.value.location.state
        updateProfileForm.country = UserProfile.value.location.country
      }

      if (SingleTutorRequest.value) {
        currentStep.value = "test";
        tutorRequestForm.topicId = SingleTutorRequest.value.topicId;
      }
    };

    watch(updateProfileForm, () => {
      UpdateProfile(undefined, false);
    });

    onMounted(() => {
      Logic.Users.watchProperty("UserProfile", UserProfile);
      Logic.Users.watchProperty("Countries", Countries);
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz);
      if (!Countries.value) {
        Logic.Users.GetCountries().then(() => {
          setCountry();
        });
      }
      if (UserProfile.value) {
        setDefault();
      }
      getTopics();
    });

    watch(Countries, () => {
      setCountry();
    });

    const handleNextAction = () => {
      if (currentStep.value == "profile") {
        if (
          tutorRequestForm.qualification.length &&
          tutorRequestForm.verification
        ) {
          updateUserLocation()?.then(() => {
            currentStep.value = "test";
          });
        } else {
          Logic.Common.showLoader({
            show: true,
            message: "Please upload the required documents",
            type: "warning",
          });
        }
      }

      if (currentStep.value == "test") {
        if (tutorRequestForm.topicId) {
          createTutorRequest();
        }
      }
    };

    return {
      UserProfile,
      Logic,
      profileImageUrl,
      updateProfileForm,
      FormValidations,
      currentStep,
      selectedTopic,
      allTopics,
      allCountries,
      allStates,
      tutorRequestForm,
      SingleTutorRequest,
      SingleQuiz,
      TestQuiz,
      countryIsSelected,
      handleNextAction,
    };
  },
});
</script>
