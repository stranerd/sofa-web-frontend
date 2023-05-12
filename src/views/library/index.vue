<template>
  <dashboard-layout
    :middleSessionWidth="'lg:w-[78%] mdlg:w-[75%]'"
    :topbarOptions="{
      title: 'Library',
    }"
  >
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 space-y-2"
      >
        <div
          :class="`w-full flex flex-row items-center justify-start space-x-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${
            selectedFilter == index ? 'bg-[#E5F2FD]' : ''
          }`"
          v-for="(item, index) in libraryTypeList"
          :key="index"
          @click="selectedFilter = index"
        >
          <sofa-icon :name="item.icon" :custom-class="'h-[16px]'" />
          <sofa-normal-text
            :custom-class="` ${selectedFilter == index ? '!font-bold' : ''}`"
          >
            {{ item.title }}
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2"
        >
          <sofa-normal-text :customClass="'!font-bold'"
            >Folders</sofa-normal-text
          >

          <sofa-normal-text :color="'text-primaryPink'">Add</sofa-normal-text>
        </div>

        <div
          :class="`w-full flex flex-row items-center justify-start space-x-3 px-3 py-3 rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${
            item.selected ? 'bg-[#E5F2FD]' : ''
          }`"
          v-for="(item, index) in folders"
          :key="index"
        >
          <sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
          <sofa-normal-text
            :custom-class="` ${item.selected ? '!font-bold' : ''}`"
          >
            {{ item.name }}
          </sofa-normal-text>
        </div>
      </div>
    </template>

    <template v-slot:middle-session>
      <div class="w-full flex flex-col space-y-5 mdlg:!pl-3 mdlg:!pr-7">
        <div
          class="w-full mdlg:!flex hidden flex-row space-x-2 justify-between items-center"
        >
          <div class="w-full flex flex-row space-x-3 items-center">
            <span
              @mouseenter="item.active = true"
              @mouseleave="item.active = false"
              :class="`px-6 py-2  ${
                item.active ? 'bg-primaryPurple' : 'bg-white'
              } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer `"
              v-for="(item, index) in libraryTypeList[selectedFilter].options"
              :key="index"
            >
              <sofa-normal-text
                :color="`${item.active ? 'text-white' : 'text-deepGray'} `"
                :custom-class="'!font-semibold'"
                >{{ item.name }}</sofa-normal-text
              >
            </span>
          </div>

          <!-- <div>
            <sofa-button :customClass="'whitespace-nowrap'">
              Create a quiz
            </sofa-button>
          </div> -->
        </div>

        <div
          class="w-full mdlg:!flex hidden flex-col space-y-4"
          v-if="selectedFilter != 0"
        >
          <sofa-activity-card
            v-for="(activity, index) in activities"
            :key="index"
            :activity="activity"
            :custom-class="'!bg-white shadow-custom '"
          />
        </div>

        <div class="w-full grid-cols-2 gap-4 mdlg:!grid hidden" v-else>
          <sofa-progress-item-card
            v-for="(content, index) in inProgressItems"
            :key="index"
            :content="content"
            :custom-class="'!bg-white shadow-custom '"
          />
        </div>

        <!-- Content for mobile screens -->
        <div class="w-full flex flex-col space-y-4 px-4 mdlg:!hidden">
          <div
            class="w-full bg-white flex flex-col shadow-custom custom-border px-3"
          >
            <div
              :class="`w-full flex flex-row items-center justify-start space-x-3 px-3 py-4  border-b-[1px] border-[#F1F6FA]`"
              v-for="(item, index) in libraryTypeList"
              :key="index"
              @click="Logic.Common.GoToRoute('/library/type')"
            >
              <sofa-icon :name="item.icon" :custom-class="'h-[16px]'" />
              <sofa-normal-text>
                {{ item.title }}
              </sofa-normal-text>
            </div>
          </div>

          <div class="w-full flex flex-col space-y-2">
            <div
              class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2"
            >
              <sofa-normal-text :customClass="'!font-bold'"
                >Folders</sofa-normal-text
              >

              <sofa-normal-text :color="'text-primaryPink'"
                >Add</sofa-normal-text
              >
            </div>

            <div
              :class="`w-full flex flex-row items-center justify-start space-x-3 px-4 py-4 custom-border bg-white shadow-custom`"
              v-for="(item, index) in folders"
              :key="index"
            >
              <sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
              <sofa-normal-text
                :custom-class="` ${item.selected ? '!font-bold' : ''}`"
              >
                {{ item.name }}
              </sofa-normal-text>
            </div>
          </div>
        </div>

        <div class="w-full h-[130px]"></div>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  // SofaButton,
  SofaActivityCard,
  SofaProgressItemCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    // SofaButton,
    SofaActivityCard,
    SofaProgressItemCard,
  },
  middlewares: {},
  name: "LibraryIndexPage",
  setup() {
    useMeta({
      title: "Library",
    });

    onMounted(() => {
      scrollToTop();
    });

    const selectedFilter = ref(0);

    const libraryTypeList = reactive([
      {
        title: "In progress",
        selected: true,
        icon: "in-progress",
        routePath: "#",
        options: [
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
        ],
      },
      {
        title: "Quizzes",
        selected: false,
        icon: "quiz",
        routePath: "#",
        options: [
          {
            name: "Recent",
            active: true,
          },
          {
            name: "Draft",
            active: false,
          },
          {
            name: "Saved",
            active: false,
          },
          {
            name: "Created",
            active: false,
          },
          {
            name: "Completed",
            active: false,
          },
          {
            name: "Uncompleted",
            active: false,
          },
        ],
      },
      {
        title: "Courses",
        selected: false,
        icon: "course-list",
        routePath: "#",
        options: [
          {
            name: "Recent",
            active: true,
          },
          {
            name: "Draft",
            active: false,
          },
          {
            name: "Saved",
            active: false,
          },
          {
            name: "Created",
            active: false,
          },
          {
            name: "Completed",
            active: false,
          },
          {
            name: "Uncompleted",
            active: false,
          },
        ],
      },
      {
        title: "Purchased",
        selected: false,
        icon: "purchased",
        routePath: "/library/purchased",
        options: [
          {
            name: "Recent",
            active: true,
          },
          {
            name: "Draft",
            active: false,
          },
          {
            name: "Saved",
            active: false,
          },
          {
            name: "Created",
            active: false,
          },
          {
            name: "Completed",
            active: false,
          },
          {
            name: "Uncompleted",
            active: false,
          },
        ],
      },
    ]);

    const folders = [
      {
        name: "400L Exam",
        selected: false,
      },
    ];

    const activities = [
      {
        title: "Big Data: What it is and why it matters",
        image: "/images/big-data.png",
        username: "Claudius Freeman",
        subject: "Computer",
        labels: {
          main: "Course",
          sub: "17 topics",
          color: "orange",
        },
        progress: 60,
      },
      {
        title: "Introduction to Organic Chemistry",
        image: "/images/chemistry.png",
        username: "Sukky Samwise",
        subject: "Chemistry",
        labels: {
          main: "Quiz - Multiplayer",
          sub: "20 questions",
          color: "pink",
        },
        progress: 100,
      },
      {
        title: "Physics: All terms and definitions",
        image: "/images/physics.png",
        username: "Dorcas Ayo",
        subject: "Computer",
        labels: {
          main: "Quiz - Learn",
          sub: "20 questions",
          color: "pink",
        },
        progress: 60,
      },
      {
        title: "Physics: All terms and definitions",
        image: "/images/physics.png",
        username: "Dorcas Ayo",
        subject: "Computer",
        labels: {
          main: "Quiz - Learn",
          sub: "20 questions",
          color: "pink",
        },
        progress: 0,
      },
      {
        title: "Physics: All terms and definitions",
        image: "/images/physics.png",
        username: "Dorcas Ayo",
        subject: "Computer",
        labels: {
          main: "Quiz - Learn",
          sub: "20 questions",
          color: "pink",
        },
        progress: 60,
      },
      {
        title: "Big Data: What it is and why it matters",
        image: "/images/big-data.png",
        username: "Claudius Freeman",
        subject: "Computer",
        labels: {
          main: "Course",
          sub: "17 topics",
          color: "orange",
        },
        progress: 0,
      },
    ];

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
      moment,
      libraryTypeList,
      folders,
      activities,
      Logic,
      selectedFilter,
      inProgressItems,
    };
  },
});
</script>
<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Enter message";
  color: #78828c;
}
</style>
