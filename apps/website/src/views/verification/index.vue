<template>
  <dashboard-layout :topbarOptions="{
    type: 'subpage',
    title: 'Account verification',
    actions: [
      {
        IsOutlined: true,
        name: 'Exit',
        handler: cancle,
      },
      {
        IsOutlined: false,
        name: 'Submit',
        handler: submitVerification,
      },
    ],
  }" :wrapLayout="true" :hideSmNavigator="{
  top: false,
  bottom: true,
}">
    <template v-slot:left-session>
      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-col">
          <sofa-header-text :customClass="'!font-bold'">
            Personal information
          </sofa-header-text>
          <sofa-normal-text> Edit your profile </sofa-normal-text>
        </div>

        <div class="w-full flex flex-col items-center justify-center pt-3">
          <sofa-image-loader
            :customClass="`w-[96px] h-[96px] flex flex-row items-center justify-center relative bg-grayColor border-[1px] border-grayColor rounded-full`"
            :photoUrl="profileImageUrl">
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

        <sofa-text-field :placeholder="'Enter name'" :hasTitle="true" :name="'First name'" ref="name.first"
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.first"
          :defaultValue="UserProfile.bio.name.first">
          <template v-slot:title> First Name </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Enter name'" :hasTitle="true" :name="'Last name'" ref="name.last"
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :rules="[FormValidations.RequiredRule]" v-model="updateProfileForm.name.last"
          :defaultValue="UserProfile.bio.name.last">
          <template v-slot:title> Last Name </template>
        </sofa-text-field>

        <sofa-textarea :placeholder="'Description of yourself'" :hasTitle="true" :name="'Bio'"
          ref="description"
          :text-area-style="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor resize-none'"
          :rules="[FormValidations.RequiredRule]" v-if="UserProfile" v-model="updateProfileForm.description">
          <template v-slot:title> Bio </template>
        </sofa-textarea>
      </div>
    </template>

    <template v-slot:middle-session>
      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-col justify-start">
          <sofa-header-text :customClass="'!font-bold flex flex-row justify-start'">
            Page content
          </sofa-header-text>
          <sofa-normal-text>Add 3 study materials you’ve created
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-col gap-2">
          <div class="w-full flex flex-col gap-4 md:!gap-4">
            <template v-for="(content, index) in selectedMaterialList" :key="index">
              <template v-if="!Logic.Common.isOnlyMobile">
                <sofa-activity-card v-if="content.subject" :activity="content"
                  :customClass="'!bg-backgroundGray !w-full cursor-pointer'" @click="
                    Logic.Common.GoToRoute('/course/create?id=' + content.id)
                    "></sofa-activity-card>
              </template>
              <template v-else>
                <sofa-activity-card :activity="content" :customClass="'!bg-backgroundGray'" :is-wrapped="true" @click="
                  Logic.Common.GoToRoute('/course/create?id=' + content.id)
                  ">
                </sofa-activity-card>
              </template>
            </template>

            <div class="w-full flex flex-col">
              <div @click="showAddMaterialHandler()"
                class="w-full flex cursor-pointer flex-row gap-3 md:!min-h-[140px] min-h-[50px] justify-center items-center px-4 py-4 border-[2px] rounded-[16px] border-[#E1E6EB]">
                <sofa-icon :name="'box-add-pink'" :customClass="'h-[18px]'"></sofa-icon>
                <sofa-normal-text :color="'text-primaryPink '">
                  Add content
                </sofa-normal-text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-[80px] hidden mdlg:!flex"></div>

      <!-- Smaller screen CTA -->
      <div
        class="w-full flex flex-col md:!hidden bg-backgroundGray px-4 py-4 fixed bottom-0 left-0 items-center z-50 justify-center">
        <div class="w-full flex flex-col">
          <sofa-button :padding="'py-3'" :customClass="'w-full'" @click="submitVerification()">Submit</sofa-button>
        </div>
      </div>

      <!-- Add material modal -->
      <sofa-modal v-if="showAddMaterial" :close="() => {
        showAddMaterial = false
      }
        " :canClose="false">
        <div
          class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative"
          @click.stop="() => {
            //
          }
            ">
          <div
            class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
            <div class="w-full text-center hidden md:!inline-block">
              <sofa-header-text :customClass="'!text-xl !font-bold '">Add a Material</sofa-header-text>
            </div>

            <div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
              <sofa-normal-text :customClass="'!font-bold !text-base'">
                Add a Material
              </sofa-normal-text>
              <sofa-icon :customClass="'h-[16px]'" :name="'circle-close'" @click="showAddMaterial = false" />
            </div>

            <div class="w-full flex flex-col gap-4">
              <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
                :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="capitalize(addMaterialType)" :ref="addMaterialType"
                :placeholder="'Select material'" :rules="[FormValidations.RequiredRule]" :autoComplete="false"
                :borderColor="'border-transparent'" :options="allMaterials" :hasTitle="true" v-model="selectedMaterial">
                <template v-slot:title> Choose a material </template>
              </sofa-select>

              <div class="w-full flex flex-row items-center justify-between z-[50] bg-white">
                <sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
                  :customClass="'border-[1px] border-gray-100 hidden mdlg:!inline-block'"
                  @click.prevent="showAddMaterial = false">
                  Exit
                </sofa-button>

                <div class="mdlg:!w-auto w-full">
                  <sofa-button :padding="'px-5 py-2'" :customClass="'mdlg:!w-auto w-full'" @click="addMaterial()">
                    Add
                  </sofa-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </sofa-modal>
    </template>

    <template v-slot:right-session>
      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-col justify-start">
          <sofa-header-text :customClass="'!font-bold flex flex-row justify-start'">
            Add links (optional)
          </sofa-header-text>
          <sofa-normal-text>Your educational website and socials</sofa-normal-text>
        </div>

        <social-media-update />
      </div>
      <div class="h-[80px] mdlg:!hidden flex"></div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, capitalize, watch } from "vue"
import { useMeta } from "vue-meta"
import { FormValidations, scrollToTop } from "@/composables"
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaTextField,
  SofaTextarea,
  SofaImageLoader,
  SofaFileAttachment,
  SofaModal,
  SofaButton,
  SofaSelect,
  SofaActivityCard,
} from "sofa-ui-components"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic"
import {
  UpdateProfile,
  submitVerification,
  updateProfileForm,
  updateVerificationForm,
  userSocials,
} from "@/composables/profile"
import { SelectOption } from "sofa-logic"
import { ContentDetails } from "@/composables/marketplace"
import SocialMediaUpdate from "@/components/onboarding/SocialMediaUpdate.vue"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaTextarea,
    SofaImageLoader,
    SofaFileAttachment,
    SofaModal,
    SofaButton,
    SofaSelect,
    SofaActivityCard,
    SocialMediaUpdate,
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
        property: "Verifications",
        method: "GetVerifications",
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
        ],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "AllQuzzies",
        method: "GetQuizzes",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "AllCourses",
        method: "GetCourses",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [
          {
            where: [
              {
                field: "type",
                value: "topics",
                condition: "eq",
              },
            ],
          },
        ],
        requireAuth: true,
      },
    ],
  },
  name: "VerificationIndexPage",
  setup () {
    useMeta({
      title: "Verification application",
    })

    const UserProfile = ref(Logic.Users.UserProfile)
    const AllQuzzies = ref(Logic.Study.AllQuzzies)
    const AllCourses = ref(Logic.Study.AllCourses)

    const showAddNewItems = ref(false)

    const selectedMaterialList = ref<ContentDetails[]>([])

    const allMaterialsContents = ref<ContentDetails[]>([])

    const showAddMaterial = ref(false)
    const addMaterialType = ref("course")
    const allMaterials = ref<SelectOption[]>([])
    const selectedMaterial = ref("")

    const UserVerification = ref(Logic.Users.Verifications.results[0])

    const profileImageUrl = ref("")

    const setDefaultValues = () => {
      updateProfileForm.description = UserProfile.value.bio.description
      updateProfileForm.name.first = UserProfile.value.bio.name.first
      updateProfileForm.name.last = UserProfile.value.bio.name.last
      profileImageUrl.value = UserProfile.value.bio.photo?.link

      if (UserVerification.value) {
        UserVerification.value.content.courses.forEach((courseId) => {
          selectedMaterial.value = courseId
          addMaterial()
        })

        UserVerification.value.content.quizzes.forEach((quizId) => {
          selectedMaterial.value = quizId
          addMaterial()
        })

        updateVerificationForm.socials = UserVerification.value.socials
      }
    }

    const cancle = () => {
      Logic.Common.goBack()
    }

    const setMaterialsOptions = () => {
      allMaterials.value.length = 0

      AllCourses.value.results.forEach((course) => {
        allMaterials.value.push({
          key: course.id,
          value: course.title,
        })
      })

      AllQuzzies.value.results.forEach((quiz) => {
        allMaterials.value.push({
          key: quiz.id,
          value: quiz.title,
        })
      })
    }
    const quizContents = ref<ContentDetails[]>([])

    const courseContents = ref<ContentDetails[]>([])

    const setMaterials = () => {
      allMaterialsContents.value.length = 0

      AllQuzzies.value.results.forEach((quiz) => {
        allMaterialsContents.value.push({
          id: quiz.id,
          subject: Logic.Study.GetTagName(quiz.topicId),
          title: quiz.title,
          image: quiz.photo ? quiz.photo.link : "/images/default.png",
          labels: {
            main: "Quiz",
            sub: `${quiz.questions.length} questions`,
            color: "pink",
          },
          price: 0,
          type: "quiz",
          ratings: quiz.ratings,
          user: quiz.user as any,
          authUserId: Logic.Users.UserProfile?.id
        })
      })

      AllCourses.value.results.forEach((course) => {
        allMaterialsContents.value.push({
          id: course.id,
          subject: Logic.Study.GetTagName(course.topicId),
          title: course.title,
          image: course.photo ? course.photo.link : "/images/default.png",
          labels: {
            main: "Course",
            sub: `${course.sections.length} materials`,
            color: "orange",
          },
          price: course.price.amount,
          type: "course",
          ratings: course.ratings,
          user: course.user as any,
          authUserId: Logic.Users.UserProfile?.id
        })
      })
    }

    const showAddMaterialHandler = () => {
      setMaterialsOptions()
      selectedMaterial.value
      showAddMaterial.value = true
    }

    const addMaterial = () => {
      if (selectedMaterial.value) {
        const currentMaterial = allMaterialsContents.value.filter(
          (item) => item.id == selectedMaterial.value
        )

        if (
          selectedMaterialList.value.filter(
            (item) => item.id == selectedMaterial.value
          ).length == 0
        ) {
          selectedMaterialList.value.push(currentMaterial[0])

          if (currentMaterial[0].type == "quiz") {
            updateVerificationForm.content.quizzes.push(currentMaterial[0].id)
          }
          if (currentMaterial[0].type == "course") {
            updateVerificationForm.content.courses.push(currentMaterial[0].id)
          }
        }
      }
      showAddMaterial.value = false
    }

    onMounted(() => {
      scrollToTop()
      // Logic.Users.watchProperty("UserProfile", UserProfile);
      setMaterials()
      setMaterialsOptions()
      setDefaultValues()
    })

    watch(UserProfile, () => {
      setDefaultValues()
    })

    watch(updateProfileForm, () => {
      Logic.Common.debounce(() => {
        UpdateProfile(undefined, false)
      }, 500)
    })

    return {
      quizContents,
      courseContents,
      updateProfileForm,
      FormValidations,
      UserProfile,
      profileImageUrl,
      updateVerificationForm,
      selectedMaterialList,
      showAddMaterial,
      addMaterialType,
      Logic,
      allMaterials,
      selectedMaterial,
      userSocials,
      showAddNewItems,
      addMaterial,
      showAddMaterialHandler,
      submitVerification,
      capitalize,
      cancle,
    }
  },
})
</script>
