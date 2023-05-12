<template>
  <expanded-layout>
    <div class="flex flex-row justify-between items-center w-full">
      <sofa-normal-text
        :color="'text-grayColor w-full flex flex-row justify-start'"
      >
        Marketplace / Physics
      </sofa-normal-text>
    </div>
    <div
      class="w-full px-4 py-4 bg-white rounded-[16px] h-auto max-h-full flex flex-col space-y-3 items-center justify-start"
    >
      <div class="w-full flex flex-row items-start justify-between">
        <div class="w-full flex flex-row items-start space-x-3">
          <sofa-image-loader
            :photo-url="'/images/chemistry.png'"
            :customClass="'w-[30%] h-[175px] rounded-[8px]'"
          />

          <div class="h-full flex flex-col space-y-2 justify-between">
            <div class="flex flex-col space-y-2">
              <sofa-normal-text :color="'text-grayColor'">
                Chemistry
              </sofa-normal-text>
              <sofa-normal-text :custom-class="'!font-bold'">
                Introduction to Organic Chemistry
              </sofa-normal-text>
              <div class="flex flex-row space-x-2 items-center">
                <sofa-badge :color="'pink'"> Course </sofa-badge>
                <sofa-badge :color="'pink'" :isInverted="true">
                  12 materials
                </sofa-badge>
              </div>

              <sofa-normal-text
                :customClass="'w-full flex flex-row justify-start text-start'"
                >This course is the well explained and simplified to ease
                students into learning organic chemistry in a way that gives
                them a strong foundation to go further into the world of organic
                chemistry.</sofa-normal-text
              >
            </div>

            <div class="flex flex-row pt-2 items-center space-x-2 flex-grow">
              <div
                class="w-[24px] h-[24px] flex flex-row items-center justify-center bg-grayColor border-[1px] border-grayColor rounded-full"
              >
                <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
              </div>
              <sofa-normal-text> Sukky Samwise </sofa-normal-text>
              <span class="h-[5px] w-[5px] rounded-full bg-[#78828c]"> </span>
              <sofa-normal-text :color="'text-grayColor'">
                Last updated 28/01/2023
              </sofa-normal-text>
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-4 justify-end items-center">
          <div class="flex flex-row space-x-4 items-center w-[45px]">
            <sofa-icon :customClass="'h-[16px]'" :name="'upload'" />
            <sofa-icon :customClass="'h-[16px]'" :name="'bookmark'" />
          </div>
          <sofa-button
            :custom-class="'!whitespace-nowrap !font-semibold'"
            padding="py-1 px-3"
            >Buy
            {{ Logic.Common.convertToMoney(1200, false, "ngn") }}</sofa-button
          >
        </div>
      </div>

      <div
        class="w-full flex flex-row space-x-3 justify-between items-center pt-3"
      >
        <div class="flex flex-row items-center justify-start space-x-3">
          <sofa-normal-text :customClass="'!font-bold '">
            Content
          </sofa-normal-text>
          <span class="h-[4px] w-[4px] rounded-full bg-[#78828c]"> </span>
          <sofa-normal-text :customClass="'!font-bold '">
            3 sections
          </sofa-normal-text>
          <span class="h-[4px] w-[4px] rounded-full bg-[#78828c]"> </span>
          <sofa-normal-text :customClass="'!font-bold '">
            12 materials
          </sofa-normal-text>
        </div>

        <sofa-normal-text :color="'text-primaryPink'">
          Expand all sections
        </sofa-normal-text>
      </div>

      <div class="w-full flex flex-col space-y-4 pt-2 pb-2">
        <div
          v-for="(item, index) in contentList"
          :key="index"
          class="w-full px-4 py-4 bg-ligthGray flex flex-row items-center justify-between space-x-3 rounded-[8px]"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            {{ item.title }}
          </sofa-normal-text>
          <div class="flex flex-row space-x-4 items-center">
            <sofa-normal-text>
              {{ item.content }}
            </sofa-normal-text>
            <sofa-icon :name="'chevron-up'" :customClass="'h-[7px]'" />
          </div>
        </div>
      </div>

      <div
        class="w-full flex flex-col space-y-3 justify-center items-center py-9 px-6 rounded-[8px] bg-primaryPurple"
      >
        <sofa-icon :customClass="'h-[24px]'" :name="'lock-white'" />
        <div
          class="w-full flex flex-col space-y-2 justify-center items-center py-2"
        >
          <sofa-normal-text :color="'text-white'" :custom-class="'!font-bold'"
            >You have no access</sofa-normal-text
          >
          <sofa-normal-text
            :color="'text-white'"
            :custom-class="'w-full flex flex-row items-center justify-center !font-semibold'"
            >Purchase this quiz to use it’s content in different learning
            modes</sofa-normal-text
          >
        </div>
        <sofa-button
          :custom-class="'!whitespace-nowrap'"
          :bgColor="'bg-white'"
          padding="py-1 px-3"
          :textColor="'text-#141618[]'"
          >Buy
          {{ Logic.Common.convertToMoney(1200, false, "ngn") }}</sofa-button
        >
      </div>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaImageLoader,
  SofaBadge,
  SofaButton,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaImageLoader,
    SofaBadge,
    SofaButton,
  },
  middlewares: {},
  name: "MarketplaceInfoPage",
  setup() {
    useMeta({
      title: "Course Info",
    });

    const selectedTab = ref("start");

    const tabItems = [
      {
        id: "start",
        name: "Start",
      },
      {
        id: "questions",
        name: "Questions",
      },
      {
        id: "results",
        name: "Results",
      },
    ];

    onMounted(() => {
      scrollToTop();
    });

    const contentList = [
      {
        title: "Alkanes",
        content: "4 materials",
      },
    ];

    return {
      moment,
      tabItems,
      Logic,
      selectedTab,
      contentList,
    };
  },
});
</script>
