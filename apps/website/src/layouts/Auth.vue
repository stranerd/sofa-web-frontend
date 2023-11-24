<template>
  <div class="w-full h-full flex fixed top-0 left-0 bg-white items-center justify-center">
    <div class="bg-white w-full lg:w-[45%] mdlg:w-[50%] h-full flex flex-col items-center justify-center md:pt-9 pt-0">
      <div class="w-full h-full flex-grow flex flex-col justify-start relative md:px-9 md:py-5 p-4">
        <div class="w-full flex gap-4 items-center">
          <a @click="Logic.Common.goBack()">
            <sofa-icon :customClass="'md:h-[26px] h-[20px] cursor-pointer'" :name="'auth-goback'" />
          </a>

          <div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
            <sofa-header-text :customClass="'md:!text-2xl text-lg'" :content="title" />
            <sofa-normal-text v-if="subTitle" :color="'text-grayColor'" :customClass="'!font-normal'" :content="subTitle" />
          </div>
        </div>

        <div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10 px-0">
          <slot />
        </div>
      </div>
    </div>

    <sofa-image-loader :photoUrl="'/images/auth-bg.png'"
      :customClass="`bg-primaryPurple hidden mdlg:flex flex-col relative lg:w-[55%] mdlg:w-[50%] h-full items-center justify-center pt-9`">
      <div class="w-full h-full bg-[#141618] bg-opacity-75 top-0 left-0 absolute flex flex-col gap-5 px-[14%] py-6 justify-center">
        <div class="w-full bg-white custom-border px-5 py-3">
          <sofa-normal-text :customClass="'!font-bold !text-base gap-2 flex'">
            <span> Did you know? </span>
            <sofa-icon :name="'idea'" :customClass="'h-[20px]'" />
          </sofa-normal-text>
        </div>
        <sofa-normal-text :color="'text-white'" :customClass="'text-left !text-2xl'">
          The human brain can store about 2.5 petabytes of information? That's
          roughly equivalent to three million hours of TV shows.
        </sofa-normal-text>
      </div>
    </sofa-image-loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { SofaHeaderText, SofaImageLoader, SofaNormalText, SofaIcon } from "sofa-ui-components"
import { Logic } from "sofa-logic"

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
  },
  components: {
    SofaHeaderText,
    SofaImageLoader,
    SofaNormalText,
    SofaIcon,
  },
  name: "AuthLayout",
  setup () {
    return { Logic }
  },
})
</script>
