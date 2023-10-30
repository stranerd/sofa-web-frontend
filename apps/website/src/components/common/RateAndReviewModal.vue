<template>
  <!-- create item action -->
  <sofa-modal :close="() => {
    close ? close() : null
  }
    " :can-close="canClose">
    <div class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
        <div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
          <sofa-header-text :customClass="'text-xl'">
            {{ title }}
          </sofa-header-text>
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            {{ title }}
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-col gap-4 px-4 py-4 items-center justify-center">
          <template v-if="tutor">
            <div class="w-full flex flex-row justify-center items-center gap-2">
              <sofa-avatar :bgColor="'!bg-[#78828C]'" :photoUrl="tutor.photo || ''" :size="'27'">
                <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
              </sofa-avatar>
              <div class="flex flex-row items-center gap-
                <SofaNormalText :custom-class="'!font-bold'">
                      {{ tutor.name }}
                    </SofaNormalText>
                    <SofaIcon
                      :name="'tutor-bagde'"
                      :custom-class="'h-[20px]'"
                    ></SofaIcon>
                  </div>
                </div>
              </template>

              <div
                :class="`flex flex-col pb-3 ${tutor ? 'pt-2' : ''} `" v-if="hasRatings">
                <sofa-ratings :count="formData.ratings" v-model="formData.ratings" :custom-class="'cursor-pointer'"
                  :readonly="false" :size="'h-[23px]'" />
              </div>

              <div class="flex flex-col w-full">
                <sofa-textarea :padding="'px-3 py-4'" :custom-class="'bg-backgroundGray custom-border'"
                  :placeholder="'Write a short message'" v-model="formData.review" :rich-editor="false"
                  :text-area-style="'!bg-backgroundGray custom-border'">
                </sofa-textarea>
              </div>

              <div class="w-full flex flex-row items-center justify-center">
                <div class="w-full md:w-auto flex flex-col">
                  <sofa-button @click="submitReview()" :padding="'px-5 md:py-2 py-3'"
                    :customClass="'!w-full'">Submit</sofa-button>
                </div>
              </div>
            </div>
        </div>
      </div>
  </sofa-modal>
</template>
<script lang="ts">
import { showAddItem } from "@/composables"
import {
  SofaAvatar,
  SofaButton,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaRatings,
  SofaTextarea,
} from "sofa-ui-components"
import { defineComponent, reactive } from "vue"

export default defineComponent({
  components: {
    SofaModal,
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaAvatar,
    SofaRatings,
    SofaTextarea,
    SofaButton,
  },
  props: {
    close: {
      type: Function,
    },
    title: {
      type: String,
      default: "",
    },
    tutor: {
      type: Object as () => {
        name: string
        photo: string
      },
    },
    canClose: {
      type: Boolean,
      default: false,
    },
    hasRatings: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["OnReviewSubmitted"],
  setup (props, context) {
    const formData = reactive({
      ratings: 1,
      review: "",
    })

    const submitReview = () => {
      context.emit("OnReviewSubmitted", formData)
      props.close()
    }

    return {
      showAddItem,
      formData,
      submitReview,
    }
  },
})
</script>
