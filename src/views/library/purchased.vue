<template>
  <expanded-layout>
    <div class="flex flex-row justify-between items-center w-full">
      <sofa-normal-text
        :color="'text-grayColor w-full flex flex-row justify-start'"
      >
        Library > Purchased
      </sofa-normal-text>
    </div>
    <div
      class="w-full px-4 py-4 bg-white rounded-[16px] h-auto max-h-full flex flex-col space-y-3 items-center justify-start"
    >
      <div class="w-full flex flex-row items-start justify-between">
        <div class="w-full flex flex-row items-start space-x-3">
          <sofa-image-loader
            :photo-url="'/images/pendulum.png'"
            :customClass="'w-[26%] h-[170px] rounded-[8px]'"
          />

          <div class="h-full flex flex-col space-y-2 justify-between">
            <div class="flex flex-col space-y-2">
              <sofa-normal-text :color="'text-grayColor'">
                Science
              </sofa-normal-text>
              <sofa-normal-text :custom-class="'!font-bold'">
                Physics terms and definitions
              </sofa-normal-text>
              <div class="flex flex-row space-x-2 items-center">
                <sofa-badge :color="'pink'"> Quiz </sofa-badge>
                <sofa-badge :color="'pink'" :isInverted="true">
                  50 questions
                </sofa-badge>
              </div>

              <sofa-normal-text
                :customClass="'w-full flex flex-row justify-start text-start'"
                >This quiz help you learn the definitions of many important
                terms in Physics.</sofa-normal-text
              >
            </div>

            <div class="flex flex-row pt-3 items-center space-x-2 flex-grow">
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
          <sofa-icon :customClass="'h-[16px]'" :name="'upload'" />
          <sofa-icon :customClass="'h-[16px]'" :name="'more-options'" />
        </div>
      </div>

      <div
        class="w-full border-b-[2px] border-[#EFF2F5] flex flex-row space-x-4"
      >
        <sofa-normal-text
          v-for="(item, index) in tabItems"
          :key="index"
          :customClass="` !font-bold cursor-pointer  ${
            item.id == selectedTab ? '  border-b-[3px] border-deepGray' : ''
          } py-3 pb-2  `"
          :color="
            item.id == selectedTab ? '!text-bodyBlack' : '!text-grayColor'
          "
          @click="selectedTab = item.id"
        >
          {{ item.name }}
        </sofa-normal-text>
      </div>

      <div
        class="w-full flex flex-col space-y-4 pt-2"
        v-if="selectedTab == 'start'"
      >
        <div
          v-for="(item, index) in startItems"
          :key="index"
          class="w-full px-4 py-4 bg-ligthGray flex flex-row items-center space-x-3 rounded-[8px]"
        >
          <div>
            <img :src="item.icon" :class="'h-[40px]'" />
          </div>
          <div class="w-full flex flex-col">
            <sofa-normal-text :customClass="'!font-bold'">
              {{ item.name }}
            </sofa-normal-text>
            <sofa-normal-text>
              {{ item.body }}
            </sofa-normal-text>
          </div>
        </div>
      </div>

      <div
        class="w-full flex flex-col space-y-4 pt-2"
        v-if="selectedTab == 'questions'"
      >
        <div
          v-for="(item, index) in questions"
          :key="index"
          class="w-full px-4 py-4 bg-ligthGray flex flex-col items-center space-y-2 rounded-[8px]"
        >
          <sofa-normal-text
            :customClass="'!font-bold w-full flex flex-row justify-start'"
          >
            {{ item.title }}
          </sofa-normal-text>
          <div class="w-full flex flex-row items-center space-x-2">
            <sofa-icon :name="'box-exclamation'" :custom-class="'h-[16px]'" />
            <sofa-normal-text :color="'!text-grayColor'">
              {{ item.type }}
            </sofa-normal-text>
            <span class="h-[4px] w-[4px] rounded-full bg-[#78828c]"> </span>
            <sofa-normal-text :color="'!text-grayColor'">
              {{ item.duration }}
            </sofa-normal-text>
          </div>
        </div>
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
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaImageLoader,
    SofaBadge,
  },
  middlewares: {},
  name: "LibraryPurchasedPage",
  setup() {
    useMeta({
      title: "Purchased",
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

    const startItems = [
      {
        name: "Learn",
        body: "Take this quiz alone without a time limit until you master all questions",
        icon: "/images/learn.svg",
      },
      {
        name: "Flashcard",
        body: "Digital cards to help you master all questions and answers in this quiz",
        icon: "/images/flashcard.svg",
      },
      {
        name: "Multiplayer",
        body: "Play this quiz like a game with your friends, battle for the highest score ",
        icon: "/images/multiplayer.svg",
      },
      {
        name: "Host",
        body: "Use this quiz as a live competition for your friends or students",
        icon: "/images/host.svg",
      },
      {
        name: "Assignment",
        body: "Share this quiz to your friends or students as an assignment",
        icon: "/images/assignment.svg",
      },
    ];

    const questions = [
      {
        title: "1. What is acceleration?",
        type: "Multiple choice",
        duration: "20s",
      },
      {
        title:
          "2. Angular Momentum is measure of the momentum of a body in rotational motion about its centre of mass",
        type: "True/False",
        duration: "20s",
      },
      {
        title: "3. What is the mixture of metals with other metals?",
        type: "Multiple choice",
        duration: "20s",
      },
      {
        title: "4. Ammeter is used to measure current",
        type: "True/False",
        duration: "20s",
      },
    ];

    onMounted(() => {
      scrollToTop();
    });

    return {
      moment,
      tabItems,
      Logic,
      selectedTab,
      startItems,
      questions,
    };
  },
});
</script>
