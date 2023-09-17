<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center space-x-3 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
      >
        <sofa-icon
          :customClass="'h-[15px]'"
          :name="'back-arrow'"
          @click="Logic.Common.goBack()"
        />
        <sofa-normal-text :customClass="'!font-bold !text-base'">
          In progress</sofa-normal-text
        >
        <div></div>
      </div>
      <div
        class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide pl-4 py-2"
      >
        <div
          class="w-full flex flex-row space-x-3 items-center pr-4 mdlg:!pr-0"
        >
          <span
            @mouseenter="item.active = true"
            @mouseleave="item.active = false"
            :class="`px-6 py-2  ${
              item.active ? 'bg-primaryPurple' : 'bg-white'
            } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer`"
            v-for="(item, index) in mainFilters"
            :key="index"
          >
            <sofa-normal-text
              :color="`${item.active ? 'text-white' : 'text-deepGray'} `"
              :custom-class="'!font-semibold'"
              >{{ item.name }}</sofa-normal-text
            >
          </span>
        </div>
      </div>

      <div class="w-full grid grid-cols-1 gap-4 px-4 pt-3">
        <sofa-progress-item-card
          v-for="(content, index) in inProgressItems"
          :key="index"
          :content="content"
          :custom-class="'!bg-white shadow-custom '"
        />
      </div>

      <div class="w-full flex flex-row"></div>
    </div>
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useMeta } from "vue-meta";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaProgressItemCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaProgressItemCard,
  },
  middlewares: {},
  name: "LibraryContentPage",
  setup() {
    useMeta({
      title: "Library Content",
    });

    onMounted(() => {
      scrollToTop();
    });

    const mainFilters = reactive([
      {
        name: "All",
        active: true,
      },
      {
        name: "Quizzes",
        active: false,
      },
      {
        name: "Courses",
        active: false,
      },
    ]);

    const inProgressItems = [
      {
        image: "/images/astrophysics.png",
        title: "Universe - Space and Solar Systems",
        type: "Course",
        label: "1/11 materials studied",
        progress: 10,
      },
      {
        image: "/images/astrophysics.png",
        title: "Universe - Space and Solar Systems",
        type: "Assignment",
        label: "2/10 questions answered",
        progress: 20,
      },
      {
        image: "/images/astrophysics.png",
        title: "Universe - Space and Solar Systems",
        type: "Flashcards",
        label: "7/20 cards mastered",
        progress: 40,
      },
      {
        image: "/images/astrophysics.png",
        title: "Universe - Space and Solar Systems",
        type: "Test",
        label: "4/10 questions answered",
        progress: 40,
      },
      {
        image: "/images/astrophysics.png",
        title: "Universe - Space and Solar Systems",
        type: "Practice",
        label: "5/10 questions answered",
        progress: 50,
      },
    ];

    return {
      Logic,
      mainFilters,
      inProgressItems,
    };
  },
});
</script>
