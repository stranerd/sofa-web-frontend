<template>
  <expanded-layout layoutStyle="!w-full">
    <div
      class="w-full mdlg:!flex hidden flex-col space-y-2 py-10 pb-14 bg-primaryPurple justify-center items-center"
    >
      <sofa-header-text
        color="!text-white"
        :customClass="'!font-extrabold !text-xl'"
        >Everything you need to study, in one place</sofa-header-text
      >

      <div class="w-[48%] flex flex-row items-center justify-center">
        <sofa-normal-text
          color="!text-white"
          :customClass="'w-full text-center flex items-center justify-center'"
          >Discover materials, creators, and tutors you can rely on for a
          quality learning experience</sofa-normal-text
        >
      </div>

      <div class="w-[40%] flex flex-col pt-4">
        <div
          class="w-full shadow-custom px-4 py-1 bg-white custom-border flex flex-row space-x-1 items-center justify-start"
        >
          <div class="flex flex-row space-x-2 items-center flex-grow">
            <sofa-icon :name="'filter'" :customClass="'h-[15px]'" />
            <sofa-normal-text
              :customClass="'pr-2 border-r-[1px] border-[#E1E6EB]'"
              >Filter</sofa-normal-text
            >
          </div>
          <div class="w-full flex flex-row items-center space-x-1">
            <div class="pl-2">
              <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
            </div>
            <sofa-text-field
              :customClass="'!border-none w-full flex-grow'"
              :placeholder="'Search for anything'"
            >
            </sofa-text-field>
          </div>
        </div>
      </div>
    </div>

    <!-- Small screen search -->
    <div
      class="w-full px-4 flex mdlg:!hidden flex-col sticky top-0 left-0 py-4 bg-backgroundGray z-[9999999999]"
    >
      <div
        class="w-full shadow-custom px-4 py-1 bg-white custom-border flex flex-row space-x-1 items-center justify-start"
      >
        <div class="flex flex-row space-x-2 items-center flex-grow">
          <sofa-icon :name="'filter'" :customClass="'h-[15px]'" />
        </div>
        <div class="w-full flex flex-row items-center space-x-1">
          <div class="pl-2">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
          <sofa-text-field
            :customClass="'!border-none w-full flex-grow'"
            :placeholder="'Search'"
          >
          </sofa-text-field>
        </div>
      </div>
    </div>

    <div
      class="mdlg:!w-[85%] lg:!w-[75%] w-full flex flex-col mdlg:!space-y-10 space-y-6 mdlg:!pt-8 pl-4 mdlg:!pl-0"
    >
      <div
        class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
      >
        <div
          class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-3 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
        >
          <sofa-image-loader
            :photoUrl="item.image"
            custom-class="col-span-1 mdlg:!w-auto w-[290px] relative custom-border mdlg:!h-[230px] h-[190px]"
            v-for="(item, index) in mainCards"
            :key="index"
          >
            <div
              class="w-full h-full absolute top-0 custom-border left-0 bg-black bg-opacity-40 z-10"
            ></div>
            <div
              class="absolute left-0 bottom-0 flex flex-row items-center z-40 justify-between w-full py-3 px-4 bg-black bg-opacity-50 rounded-br-[16px] rounded-bl-[8px]"
            >
              <sofa-normal-text :color="'text-white !font-bold'">
                {{ item.text }}
              </sofa-normal-text>
              <sofa-icon
                :customClass="'h-[14px]'"
                :name="'arrow-right-white'"
              />
            </div>
          </sofa-image-loader>
        </div>
      </div>

      <div class="w-full flex flex-col mdlg:!space-y-4 space-y-3">
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Purchase verified materials
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
            <sofa-item-card
              :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in resourceContents"
              :key="index"
              @click="showContentDetails = true"
            ></sofa-item-card>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col space-y-4">
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Subjects and courses
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
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-6 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <div
              :class="`col-span-1 flex flex-row items-center justify-center mdlg:!h-[50px] h-[43px] mdlg:!w-auto w-[160px] custom-border ${topic.color}`"
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
      </div>

      <div class="w-full flex flex-col space-y-4">
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Popular exams
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
            <sofa-item-card
              :content="content"
              custom-class="!col-span-1 !border-none mdlg:!w-auto w-[220px] !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in popularContents"
              :key="index"
              @click="showContentDetails = true"
            ></sofa-item-card>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col space-y-4">
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Top tutors
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

      <div class="w-full flex flex-col space-y-4">
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

      <div class="h-[120px] hidden mdlg:!inline-block"></div>
    </div>

    <!-- Content details modal -->
    <sofa-modal
      v-if="showContentDetails"
      :close="
        () => {
          showContentDetails = false;
        }
      "
    >
      <div
        class="mdlg:!w-[70%] lg:!w-[60%] mdlg:!h-full h-[95%] w-full flex flex-col items-center justify-center relative"
        @click.stop="
          () => {
            //
          }
        "
      >
        <sofa-content-details
          :close="
            () => {
              showContentDetails = false;
            }
          "
          :content="contentDetails"
        />

        <!--  Smaller screen options -->
        <span
          class="w-[47px] h-[40px] flex items-center mdlg:!hidden justify-center rounded-tr-[16px] rounded-bl-[16px] bg-white bg-opacity-50 top-0 right-0 absolute"
          @click.stop="showContentDetails = false"
        >
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" />
        </span>

        <span
          class="w-[47px] h-[40px] flex items-center mdlg:!hidden justify-center rounded-tl-[16px] rounded-br-[16px] bg-white bg-opacity-50 top-0 left-0 absolute"
        >
          <sofa-icon
            :customClass="'h-[5px]'"
            :name="'more-options-horizontal'"
          />
        </span>
      </div>
    </sofa-modal>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaImageLoader,
  SofaItemCard,
  SofaTextField,
  SofaHeaderText,
  SofaUserCard,
  SofaModal,
  SofaContentDetails,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaImageLoader,
    SofaItemCard,
    SofaTextField,
    SofaHeaderText,
    SofaUserCard,
    SofaModal,
    SofaContentDetails,
  },
  middlewares: {},
  name: "ExploreIndexPage",
  setup() {
    useMeta({
      title: "Explore",
    });

    onMounted(() => {
      scrollToTop();
    });

    const showContentDetails = ref(false);

    const contentDetails = reactive({
      type: "course",
      price: 1000,
      title: "Introduction to Organic Chemistry",
      info: "A well explained and simplified course that helps students learning organic chemistry in a way that gives them a strong foundation to succeed and go further in the field of study.",
      labels: {
        color: "pink",
        main: "Course",
        sub: "16 materials",
      },
      ratings: {
        total: 4,
        label: "24 ratings",
        totalCount: 24,
        stats: {
          "5": 3,
          "4": 21,
          "3": 0,
          "2": 0,
          "1": 0,
        },
        reviews: [
          {
            user: {
              name: "Blessing J.",
              photoUrl: "/images/desdemona.png",
            },
            rating: 4,
            review:
              "This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing",
          },
          {
            user: {
              name: "Blessing J.",
              photoUrl: "/images/desdemona.png",
            },
            rating: 4,
            review:
              "This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing",
          },
        ],
      },
      user: {
        name: "Nikola Tesla",
        photoUrl: "/images/sam.png",
        role: "Teacher",
        stats: {
          quizzes: 34,
          courses: 18,
          followers: "1.1k",
        },
      },
      lastUpdated: "Last updated 28/01/2023",
      tags: ["Notes", "Year 3", "Alkanes", "Alkenes", "Alkynes", "Ochem"],
      content: {
        materialsCount: 11,
        sections: [
          {
            title: "Alkanes",
            data: [
              {
                title: "Summary notes on alkanes",
                sub: "4 pages",
                type: "Document",
                isLocked: true,
              },
              {
                title: "Rules for naming alkanes",
                sub: "4m 44s",
                type: "Video",
                isLocked: true,
              },
              {
                title: "Everything you should know about alkanes",
                sub: "10 questions",
                type: "Quiz",
                isLocked: true,
              },
            ],
            opened: true,
          },
          {
            title: "Alkynes",
            data: [
              {
                title: "Summary notes on alkanes",
                sub: "4 pages",
                type: "Document",
                isLocked: true,
              },
              {
                title: "Rules for naming alkanes",
                sub: "4m 44s",
                type: "Video",
                isLocked: true,
              },
              {
                title: "Everything you should know about alkanes",
                sub: "10 questions",
                type: "Quiz",
                isLocked: true,
              },
            ],
            opened: true,
          },
          {
            title: "Alkenes",
            data: [
              {
                title: "Summary notes on alkanes",
                sub: "4 pages",
                type: "Document",
                isLocked: true,
              },
              {
                title: "Rules for naming alkanes",
                sub: "4m 44s",
                type: "Video",
                isLocked: true,
              },
              {
                title: "Everything you should know about alkanes",
                sub: "10 questions",
                type: "Quiz",
                isLocked: true,
              },
            ],
            opened: false,
          },
        ],
      },
    });

    const mainCards = [
      {
        image: "/images/note-explore.png",
        text: "Notes",
      },
      {
        image: "/images/past-question-explore.png",
        text: "Past questions",
      },
      {
        image: "/images/textbook-explore.png",
        text: "Textbook solutions",
      },
    ];

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
        image: "/images/solar-system.png",
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
        image: "/images/computer.png",
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
        image: "/images/art.png",
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
        image: "/images/astrophysics.png",
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
        image: "/images/biology.png",
        labels: {
          main: "Quiz",
          sub: "25 questions",
          color: "pink",
        },
        username: "Van Gogh",
        price: 0,
      },
    ];

    const popularContents: {
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
        title: "WAEC Mathematics 2020",
        image: "/images/waec-exam.png",
        labels: {
          main: "Quiz",
          sub: "40 questions",
          color: "pink",
        },
        username: "Sofa",
        price: 0,
      },
      {
        id: "2",
        title: "JAMB English 2020",
        image: "/images/jamb-exam.png",
        labels: {
          main: "Quiz",
          sub: "60 questions",
          color: "pink",
        },
        username: "Sofa",
        price: 0,
      },
      {
        id: "2",
        title: "JAMB Biology 2020",
        image: "/images/jamb-exam.png",
        labels: {
          main: "Quiz",
          sub: "40 questions",
          color: "pink",
        },
        username: "Sofa",
        price: 0,
      },
      {
        id: "2",
        title: "WAEC Physics 2020",
        image: "/images/waec-exam.png",
        labels: {
          main: "Quiz",
          sub: "40 questions",
          color: "pink",
        },
        username: "Sofa",
        price: 0,
      },
      {
        id: "2",
        title: "WAEC Physics 2020",
        image: "/images/waec-exam.png",
        labels: {
          main: "Quiz",
          sub: "40 questions",
          color: "pink",
        },
        username: "Sofa",
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
      mainCards,
      popularTopics,
      resourceContents,
      Logic,
      popularContents,
      topTutors,
      topCreators,
      showContentDetails,
      contentDetails,
    };
  },
});
</script>
