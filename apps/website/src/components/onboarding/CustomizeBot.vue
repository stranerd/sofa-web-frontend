<template>
  <!-- create item action -->
  <sofa-modal :close="() => {
    close ? close() : null
  }
    " :can-close="false">
    <div
      class="mdlg:!w-[60%] lg:!w-[50%] w-full mdlg:!h-[100%] md:!h-full !overflow-y-hidden md:w-[70%] h-auto flex flex-col mdlg:!justify-start items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col mdlg:!h-auto h-full overflow-y-hidden lg:!px-6 md:!gap-4 relative gap-3 lg:!py-0 mdlg:!px-6 mdlg:!py-0 md:!py-0 py-0 md:!px-4 md:!rounded-[16px] rounded-t-[16px]">
        <div
          class="w-full hidden flex-col gap-2 justify-center items-center md:flex sticky top-0 left-0 pt-4 bg-white z-50"
          v-if="!Logic.Common.isOnlyMobile">
          <sofa-header-text :customClass="'!text-xl'" content="Customize AI" />
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 bg-white z-50 md:!hidden py-3 border-[#F1F6FA] border-b-[1px] px-4">
          <sofa-normal-text :customClass="'!font-bold'">
            Customize AI
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" />
        </div>

        <sofa-form-wrapper :parentRefs="parentRefs" ref="formComp"
          class="w-full flex flex-col mdlg:!gap-4 gap-2 mdlg:!px-0 px-4">
          <div class="w-full flex flex-col gap-4 py-3">
            <div class="w-full flex flex-col items-center justify-center pt-3">
              <sofa-image-loader
                :customClass="`w-[93px] h-[93px] flex flex-row items-center justify-center relative bg-grayColor border-[1px] border-grayColor rounded-full`"
                :photoUrl="profileImageUrl">
                <sofa-icon :customClass="'h-[50px]'" :name="'user'" v-if="!profileImageUrl" />
                <sofa-file-attachment :isWrapper="true"
                  :customClass="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full !h-[40px] !w-[40px] flex items-center justify-center`"
                  :accept="'image/png, image/gif, image/jpeg'" v-model="customizeAIForm.photo"
                  v-model:localFileUrl="profileImageUrl">
                  <template v-slot:content>
                    <sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
                  </template>
                </sofa-file-attachment>
              </sofa-image-loader>
            </div>

            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'Name'" ref="name" :placeholder="'Name'"
              :rules="[FormValidations.RequiredRule]" v-model="customizeAIForm.name" :defaultValue="customizeAIForm.name"
              :borderColor="'border-transparent'" />

            <sofa-text-field :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'md:!py-4 md:!px-4 px-3 py-3'" type="text" :name="'Tagline'" ref="tagline"
              :placeholder="'Tagline'" :rules="[FormValidations.RequiredRule]" v-model="customizeAIForm.tagline"
              :defaultValue="customizeAIForm.tagline" :borderColor="'border-transparent'" />
          </div>

          <div
            class="w-full flex flex-row items-center justify-between md:!relative sticky bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0 py-4">
            <sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
              :customClass="'border-[1px] border-gray-100'" @click.prevent="close ? close() : null">
              Exit
            </sofa-button>

            <sofa-button :padding="'px-5 py-2'" @click.prevent="handleCustomizeBot()">
              Save
            </sofa-button>
          </div>

          <div class="mdlg:!h-[20px]"></div>
        </sofa-form-wrapper>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import {
  SofaIcon,
  SofaTextField,
  SofaButton,
  SofaFileAttachment,
  SofaImageLoader,
  SofaFormWrapper,
  SofaModal,
  SofaNormalText,
  SofaHeaderText,
} from "sofa-ui-components"
import { FormValidations } from "@/composables"

import { Logic } from "sofa-logic"
import { CustomizeAI, customizeAIForm } from "@/composables/profile"

export default defineComponent({
  components: {
    SofaIcon,
    SofaTextField,
    SofaButton,
    SofaFileAttachment,
    SofaImageLoader,
    SofaFormWrapper,
    SofaModal,
    SofaNormalText,
    SofaHeaderText,
  },
  props: {
    customClass: {
      type: String,
    },
    close: {
      type: Function,
    },
  },
  name: "CustomizeBot",
  setup () {
    const profileImageUrl = ref("")

    const formComp = ref<any>()

    const UserProfile = ref(Logic.Users.UserProfile)

    const handleCustomizeBot = () => {
      CustomizeAI(formComp.value)
    }

    onMounted(() => {
      customizeAIForm.name = UserProfile.value.ai.name
      customizeAIForm.tagline = UserProfile.value.ai.tagline

      if (UserProfile.value.ai?.photo) {
        profileImageUrl.value = UserProfile.value.ai.photo.link
      } else {
        profileImageUrl.value = "/images/icons/robot.svg"
      }

      Logic.Users.watchProperty("UserProfile", UserProfile)
    })

    return {
      handleCustomizeBot,
      profileImageUrl,
      formComp,
      FormValidations,
      customizeAIForm,
      Logic,
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
