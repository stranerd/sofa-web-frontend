<template>
  <div v-if="auth" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
    <div id="profile" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Personal info
      </sofa-header-text>
      <div class="w-full flex flex-row items-center justify-start py-2 gap-4">
        <sofa-image-loader
          :customClass="`w-[90px] h-[90px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
          :photoUrl="profileImageUrl">
          <sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!profileImageUrl" />
          <sofa-file-attachment :isWrapper="true"
            :customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
            accept="image/*" v-model="factory.photo" v-model:localFileUrl="profileImageUrl">
            <template v-slot:content>
              <sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
            </template>
          </sofa-file-attachment>
        </sofa-image-loader>

        <sofa-button :padding="'px-5 py-2'" @click="Logic.Common.GoToRoute('/profile')">View profile</sofa-button>
      </div>

      <sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'First name'" :placeholder="'First Name'" :error="factory.errors.first" v-model="factory.first"
        :borderColor="'border-transparent'" />

      <sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'Last name'" :placeholder="'Last Name'" :error="factory.errors.last" v-model="factory.last"
        :borderColor="'border-transparent'" />

      <sofa-textarea :hasTitle="false" :error="factory.errors.description"
        :textAreaStyle="'h-[90px] rounded-custom !bg-lightGray !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
        :placeholder="'Bio'" v-model="factory.description" />
    </div>

    <div id="contact" class="w-full flex flex-col bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left mb-4'">
        Contact info
      </sofa-header-text>

      <sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor '" :padding="'p-3'"
        type="text" :name="'Email'" ref="name.first" :placeholder="'Email'" v-model="auth.email" :disabled="true"
        :borderColor="'border-transparent'" />

      <account-setup :isProfilePhone="true" />
    </div>

    <div id="type" v-if="!userType.isOrg"
      class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        {{ userType.isTeacher ? 'Experience' : 'Education' }}
      </sofa-header-text>

      <account-setup :isProfileEducation="true" />
    </div>

    <div id="socials" class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Social links
      </sofa-header-text>

      <social-media-update />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SocialMediaUpdate from "@/components/onboarding/SocialMediaUpdate.vue"
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
import { ref, watch } from "vue"
import AccountSetup from "../onboarding/AccountSetup.vue"
import { useProfileUpdate } from '@/composables/auth/profile'
import { useAuth } from '@/composables/auth/auth'

const { auth, userType } = useAuth()
const profileImageUrl = ref(auth.value?.photo?.link ?? '')
const { factory, updateProfile } = useProfileUpdate()

watch(factory.values, () => {
  Logic.Common.debounce(() => {
    updateProfile(true)
  }, 1000)
})
</script>
