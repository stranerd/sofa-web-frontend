<template>
  <expanded-layout layoutStyle="!w-full">
    <div
      class="w-full flex flex-col space-y-5 py-8 pb-14 bg-primaryPurple justify-center items-center"
    >
      <sofa-header-text
        color="!text-white"
        size="xl"
        :customClass="'!font-extrabold'"
        >All contents made by verified creators</sofa-header-text
      >

      <div class="w-[48%] flex flex-row items-center justify-center">
        <sofa-normal-text
          color="!text-white"
          :customClass="'w-full text-center flex items-center justify-center'"
          >Everything here is carefully reviewed to ensure the highest quality
          and accuracy. By purchasing from our marketplace, you can have
          confidence in the credibility of the creators and the value of the
          materials.</sofa-normal-text
        >
      </div>

      <div class="w-[40%] flex flex-col pt-4">
        <div
          class="w-full shadow-custom px-4 py-1 bg-white custom-border flex flex-row space-x-3 items-center justify-between"
        >
          <div class="flex flex-row space-x-2 items-center flex-grow">
            <sofa-icon :name="'filter'" :customClass="'h-[15px]'" />
            <sofa-normal-text
              :customClass="'pr-2 border-r-[1px] border-[#E1E6EB]'"
              >Filter</sofa-normal-text
            >
            <sofa-text-field
              :customClass="'!border-none w-full'"
              :placeholder="'Search for anything'"
            >
            </sofa-text-field>
          </div>

          <div class="w-[20px]">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
        </div>
      </div>
    </div>

    <div class="mdlg:!w-[85%] lg:!w-[75%] w-full flex flex-col space-y-2">
      <sofa-normal-text :customClass="'!font-bold'"> Topics </sofa-normal-text>

      <div class="w-full grid grid-cols-6 gap-4">
        <div
          :class="`col-span-1 flex flex-row items-center justify-center h-[50px] custom-border ${topic.color}`"
          v-for="(topic, index) in popularTopics"
          :key="index"
        >
          <sofa-normal-text
            :color="'text-white'"
            :customClass="'!font-semibold'"
            >{{ topic.name }}</sofa-normal-text
          >
        </div>
      </div>
    </div>

    <div class="mdlg:!w-[85%] lg:!w-[75%] w-full flex flex-col space-y-2">
      <div class="w-full flex flex-row items-center justify-between">
        <sofa-normal-text :customClass="'!font-bold'">
          Courses
        </sofa-normal-text>

        <sofa-normal-text
          :color="'text-primaryBlue'"
          :custom-class="'cursor-pointer'"
          @click="Logic.Common.GoToRoute('/explore/search')"
        >
          See all
        </sofa-normal-text>
      </div>

      <div class="w-full grid grid-cols-5 gap-4">
        <sofa-item-card
          :content="content"
          custom-class="!col-span-1 !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
          @click="Logic.Common.GoToRoute('/marketplace/id')"
          v-for="(content, index) in resourceContents"
          :key="index"
        ></sofa-item-card>
      </div>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaItemCard,
  SofaTextField,
  SofaHeaderText,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaItemCard,
    SofaTextField,
    SofaHeaderText,
  },
  middlewares: {},
  name: "MarketPlaceIndexPage",
  setup() {
    useMeta({
      title: "Marketplace",
    });

    onMounted(() => {
      scrollToTop();
    });

    const popularTopics = [
      {
        name: "Physics",
        color: "bg-[#32007D]",
      },
      {
        name: "Mathematics",
        color: "bg-[#AF19C8]",
      },
      {
        name: "Chemistry",
        color: "bg-[#FA9632]",
      },
      {
        name: "Economics",
        color: "bg-[#197DFA]",
      },
      {
        name: "History",
        color: "bg-[#FF4BC8]",
      },
      {
        name: "Geography",
        color: "bg-[#6419C8]",
      },
    ];

    const resourceContents: {
      id: string;
      subject?: string;
      title?: string;
      image?: string;
      labels?: {
        main: string;
        sub: string;
        color: string;
      };
      username?: string;
      price?: number;
    }[] = [
      {
        id: "1",
        subject: "Science",
        title: "Our Solar System",
        image: "/images/default.png",
        labels: {
          main: "Quiz",
          sub: "20 questions",
          color: "pink",
        },
        username: "Buzz Lightyear",
        price: 4000,
      },
      {
        id: "2",
        subject: "Computer",
        title: "Big Data: What it is and why it matters",
        image: "/images/default.png",
        labels: {
          main: "Course",
          sub: "17 materials",
          color: "orange",
        },
        username: "Claudius Freeman",
        price: 1200,
      },
      {
        id: "3",
        subject: "Art",
        title: "History of art",
        image: "/images/default.png",
        labels: {
          main: "Quiz",
          sub: "25 questions",
          color: "pink",
        },
        username: "Van Gogh",
        price: 3400,
      },
      {
        id: "4",
        subject: "Physics",
        title: "Astrophysics - Dark matter",
        image: "/images/default.png",
        labels: {
          main: "Course",
          sub: "16 materials",
          color: "orange",
        },
        username: "Ben Kastro",
        price: 5000,
      },
      {
        id: "5",
        subject: "Biology",
        title: "Photosynthesis",
        image: "/images/default.png",
        labels: {
          main: "Quiz",
          sub: "25 questions",
          color: "pink",
        },
        username: "Van Gogh",
        price: 1040,
      },
    ];

    return {
      moment,
      popularTopics,
      resourceContents,
      Logic,
    };
  },
});
</script>
