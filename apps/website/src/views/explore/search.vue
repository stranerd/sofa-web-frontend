<template>
  <global-layout>
    <dashboard-layout
      :middleSessionWidth="'lg:w-[78%] mdlg:w-[78%]'"
      :hideSmNavigator="{
        bottom: true,
        top: true,
      }"
    >
      <template v-slot:left-session>
        <div
          class="w-full shadow-custom pb-6 bg-white custom-border relative flex flex-col h-full space-y-6 overflow-y-auto"
        >
          <div
            class="w-full flex flex-row items-center px-4 pt-4 bg-white sticky top-0 left-0 space-x-2 pb-3 border-b-[1px] border-[#F1F6FA]"
          >
            <sofa-icon :customClass="'h-[14px]'" :name="'filter'" />
            <sofa-normal-text :customClass="'!font-bold'"
              >Filter</sofa-normal-text
            >
          </div>

          <div class="w-full flex flex-col space-y-3 px-4">
            <div
              class="w-full flex flex-row items-center space-x-2 justify-between"
            >
              <sofa-normal-text :customClass="'!font-bold'"
                >Applied filters</sofa-normal-text
              >

              <sofa-normal-text :color="'text-primaryPink'"
                >Clear all</sofa-normal-text
              >
            </div>

            <div class="flex flex-row">
              <span
                class="px-4 py-2 bg-primaryPurple custom-border flex flex-row items-center justify-center space-x-1"
              >
                <sofa-normal-text :color="'text-white'"
                  >Biology</sofa-normal-text
                >
                <sofa-icon :customClass="'h-[18px]'" :name="'close-white'" />
              </span>
            </div>
          </div>

          <div
            class="w-full flex flex-col space-y-3 px-4"
            v-for="(option, index) in searchOptions"
            :key="index"
          >
            <div
              class="w-full flex flex-row items-center justify-between cursor-pointer"
              @click="
                option.opened ? (option.opened = false) : (option.opened = true)
              "
            >
              <div class="flex flex-row items-center space-x-2">
                <sofa-icon :customClass="'h-[16px]'" :name="option.icon" />

                <sofa-normal-text :customClass="'!font-bold'">{{
                  option.name
                }}</sofa-normal-text>
              </div>
              <sofa-icon
                :customClass="'h-[7px]'"
                :name="option.opened ? 'chevron-up' : 'chevron-down'"
              />
            </div>

            <div
              class="w-full flex flex-row flex-wrap gap-3"
              v-if="option.opened"
            >
              <span
                @mouseenter="item.active = true"
                @mouseleave="item.active = false"
                :class="`px-4 py-2  ${
                  item.active ? 'bg-primaryPurple' : 'bg-[#EFF2F5]'
                } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer`"
                v-for="(item, index) in option.options"
                :key="index"
              >
                <sofa-normal-text
                  :color="`${item.active ? 'text-white' : 'text-deepGray'} `"
                  >{{ item.name }}</sofa-normal-text
                >
              </span>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:middle-session>
        <div
          class="w-full flex flex-col mdlg:!space-y-5 space-y-1 pl-3 mdlg:!pr-7 relative"
        >
          <div
            class="w-full mdlg:!shadow-custom mdlg:!px-4 sticky mdlg:!relative top-0 left-0 mdlg:!top-auto mdlg:!left-auto z-30 mdlg:!py-1 pr-4 py-4 mdlg:!bg-white bg-backgroundGray mdlgcustom-border flex flex-row space-x-3 items-center mdlg:!justify-between justify-start"
          >
            <sofa-icon
              :customClass="'h-[15px] mdlg:!hidden pl-2'"
              :name="'back-arrow'"
              @click="Logic.Common.goBack()"
            />
            <div
              class="flex flex-row items-center flex-grow custom-border w-full px-3 mdlg:!px-0 mdlg:!bg-transparent bg-white"
            >
              <div class="w-[20px] mdlg:!hidden">
                <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
              </div>
              <sofa-text-field
                :customClass="'!border-none w-full'"
                :placeholder="'Search for anything'"
                :padding="'px-3 mdlg:!pl-0 py-3'"
              >
              </sofa-text-field>
            </div>

            <div class="w-[20px] hidden mdlg:!inline-block">
              <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
            </div>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
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

          <div class="w-full flex flex-col space-y-3 mdlg:!pt-0 pt-4">
            <div
              class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
            >
              <sofa-normal-text :customClass="'!font-bold'">
                Quizzes
              </sofa-normal-text>

              <sofa-normal-text
                :color="'text-primaryPink'"
                :custom-class="'cursor-pointer'"
              >
                See all
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
            >
              <div
                class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
              >
                <sofa-item-card
                  :content="content"
                  custom-class="!col-span-1 !border-none  mdlg:!w-auto w-[220px] !shadow-itemBox bg-white rounded-[16px]"
                  v-for="(content, index) in quizContents"
                  :key="index"
                ></sofa-item-card>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col space-y-3 mdlg:!pt-2 pt-4">
            <div
              class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
            >
              <sofa-normal-text :customClass="'!font-bold'">
                Courses
              </sofa-normal-text>

              <sofa-normal-text
                :color="'text-primaryPink'"
                :custom-class="'cursor-pointer'"
              >
                See all
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
            >
              <div
                class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
              >
                <sofa-item-card
                  :content="content"
                  custom-class="!col-span-1 !border-none  mdlg:!w-auto w-[220px] !shadow-itemBox bg-white rounded-[16px]"
                  v-for="(content, index) in courseContents"
                  :key="index"
                ></sofa-item-card>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col space-y-4 mdlg:!pt-2 pt-4">
            <div
              class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
            >
              <sofa-normal-text :customClass="'!font-bold'">
                Tutors
              </sofa-normal-text>

              <sofa-normal-text
                :color="'text-primaryPink'"
                :custom-class="'cursor-pointer'"
                @click="Logic.Common.GoToRoute('/explore/search')"
              >
                View all
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
            >
              <div
                class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-4 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
              >
                <sofa-user-card
                  :user="user"
                  v-for="(user, index) in topTutors"
                  :key="index"
                  :custom-class="'w-[280px] mdlg:!w-auto'"
                ></sofa-user-card>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col space-y-4 mdlg:!pt-2 pt-4">
            <div
              class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
            >
              <sofa-normal-text :customClass="'!font-bold'">
                Top creators
              </sofa-normal-text>

              <sofa-normal-text
                :color="'text-primaryPink'"
                :custom-class="'cursor-pointer'"
                @click="Logic.Common.GoToRoute('/explore/search')"
              >
                View all
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
            >
              <div
                class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
              >
                <sofa-user-card
                  :user="user"
                  v-for="(user, index) in topCreators"
                  :key="index"
                  :custom-class="'w-[280px] mdlg:!w-auto'"
                ></sofa-user-card>
              </div>
            </div>
          </div>

          <div class="w-full h-[130px]"></div>
        </div>
        <!-- Bottom filter for sm screens -->
        <div
          class="fixed bg-backgroundGray mdlg:!hidden bottom-0 left-0 px-4 py-4 flex flex-col w-full"
        >
          <div
            class="bg-primaryPurple custom-border py-3 flex flex-row items-center justify-center space-x-2"
          >
            <sofa-icon :customClass="'h-[14px]'" :name="'filter-white'" />
            <sofa-normal-text
              :customClass="'!font-semibold !text-sm'"
              :color="'text-white'"
              >Filter</sofa-normal-text
            >
            <span
              class="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center"
            >
              <sofa-normal-text :color="'text-primaryPurple'"
                >3</sofa-normal-text
              >
            </span>
          </div>
        </div>
      </template>
    </dashboard-layout>
  </global-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaTextField,
  SofaItemCard,
  SofaUserCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { onIonViewWillEnter } from "@ionic/vue";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaTextField,
    SofaItemCard,
    SofaUserCard,
  },
  middlewares: {},
  name: "SearchAndExplorePage",
  setup() {
    useMeta({
      title: "Search",
    });

    onMounted(() => {
      scrollToTop();
    });

    onIonViewWillEnter(() => {
      scrollToTop()
    })

    const searchOptions = reactive([
      {
        name: "Price",
        options: [
          {
            name: "Free",
            active: false,
          },
          {
            name: "Paid",
            active: false,
          },
        ],
        opened: true,
        icon: "price-filter",
      },
      {
        name: "Subject",
        options: [
          {
            name: "Art",
            active: false,
          },
          {
            name: "Physics",
            active: false,
          },
          {
            name: "Mathematics",
            active: false,
          },
          {
            name: "Chemistry",
            active: false,
          },
          {
            name: "Biology",
            active: true,
          },
          {
            name: "Economics",
            active: false,
          },
          {
            name: "History",
            active: false,
          },
          {
            name: "Geography",
            active: false,
          },
        ],
        opened: true,
        icon: "subject-filter",
      },
      {
        name: "Popular tags",
        options: [
          {
            name: "Past questions",
            active: false,
          },
          {
            name: "Textbook solutions",
            active: false,
          },
          {
            name: "Notes",
            active: false,
          },
          {
            name: "Year 1",
            active: false,
          },
          {
            name: "Year 3",
            active: false,
          },
          {
            name: "Year 5",
            active: false,
          },
        ],
        opened: false,
        icon: "tag-filter",
      },
      {
        name: "Rating",
        options: [
          {
            name: "4 stars and higher ",
            active: false,
          },
          {
            name: "3 stars and higher",
            active: false,
          },
          {
            name: "2 stars and higher",
            active: false,
          },
          {
            name: "1 star and higher ",
            active: false,
          },
        ],
        opened: false,
        icon: "rating-filter",
      },
      {
        name: "Author",
        options: [
          {
            name: "Student",
            active: false,
          },
          {
            name: "Teacher",
            active: false,
          },
        ],
        opened: false,
        icon: "author-filter",
      },
    ]);

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
      {
        name: "Tutors",
        active: false,
      },
      {
        name: "Creators",
        active: false,
      },
    ]);

    const quizContents: {
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
        price: 0,
      },
      {
        id: "2",
        subject: "Computer",
        title: "Big Data: What it is and why it matters",
        image: "/images/default.png",
        labels: {
          main: "Quiz",
          sub: "20 questions",
          color: "pink",
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
        price: 0,
      },
      {
        id: "4",
        subject: "Physics",
        title: "Astrophysics - Dark matter",
        image: "/images/default.png",
        labels: {
          main: "Quiz",
          sub: "20 questions",
          color: "pink",
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
        price: 0,
      },
    ];

    const courseContents: {
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
          main: "Course",
          sub: "16 materials",
          color: "orange",
        },
        username: "Buzz Lightyear",
        price: 0,
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
          main: "Course",
          sub: "16 materials",
          color: "orange",
        },
        username: "Van Gogh",
        price: 0,
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
          main: "Course",
          sub: "16 materials",
          color: "orange",
        },
        username: "Van Gogh",
        price: 0,
      },
    ];

    const topTutors = [
      {
        profile_image: "/images/einstein.png",
        name: "Einstein Heesef",
        icons: ["tutor-bagde"],
        subTitle: "Mathematics, Physics, Chemistry",
        ratings: {
          total: "4.0",
          label: "(24 ratings)",
        },
        status: "online",
      },
      {
        profile_image: "/images/jerry.png",
        name: "Jerry Godwin",
        icons: ["tutor-bagde"],
        subTitle: "Computer Science",
        ratings: {
          total: "4.0",
          label: "(24 ratings)",
        },
        status: "offline",
      },
      {
        profile_image: "/images/dorcas.png",
        name: "Dorcas Taiwo",
        icons: ["tutor-bagde"],
        subTitle: "English, Literature",
        ratings: {
          total: "4.0",
          label: "(24 ratings)",
        },
        status: "online",
      },
      {
        profile_image: "/images/sam.png",
        name: "Sam Sukks ",
        icons: ["tutor-bagde", "verify"],
        subTitle: "English, Literature",
        ratings: {
          total: "4.0",
          label: "(24 ratings)",
        },
        status: "offline",
      },
    ];

    const topCreators = [
      {
        profile_image: "/images/isaac.png",
        name: "Isaac Newton",
        icons: ["verify"],
        subTitle: "Teacher",
        ratings: undefined,
        status: "",
      },
      {
        profile_image: "/images/robert.png",
        name: "Robert Green",
        icons: ["verify"],
        subTitle: "Student",
        ratings: undefined,
        status: "",
      },
      {
        profile_image: "/images/desdemona.png",
        name: "Desdemona",
        icons: ["verify"],
        subTitle: "Teacher",
        ratings: undefined,
        status: "",
      },
      {
        profile_image: "/images/freeman.png",
        name: "Freeman Ayo",
        icons: ["verify"],
        subTitle: "Student",
        ratings: undefined,
        status: "",
      },
      {
        profile_image: "/images/istar.png",
        name: "Istar Nefari",
        icons: ["verify"],
        subTitle: "Student",
        ratings: undefined,
        status: "",
      },
    ];

    return {
      moment,
      searchOptions,
      mainFilters,
      quizContents,
      courseContents,
      Logic,
      topTutors,
      topCreators,
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
