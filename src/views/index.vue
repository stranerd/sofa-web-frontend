<template>
  <dashboard-layout>
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-row items-center space-x-3">
          <div
            class="w-[84px] h-[84px] flex flex-row items-center justify-center bg-grayColor border-[1px] border-grayColor rounded-full"
          >
            <sofa-icon :customClass="'h-[45px]'" :name="'user'" />
          </div>

          <div class="flex flex-col space-y-1">
            <sofa-header-text :customClass="'!text-base !font-bold'"
              >Sukky Samwise</sofa-header-text
            >
            <sofa-normal-text>Student</sofa-normal-text>
            <sofa-normal-text :color="'text-primaryPink'"
              >Add your school</sofa-normal-text
            >
          </div>
        </div>

        <div class="w-full grid grid-cols-2 gap-3">
          <div
            class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row space-x-3 justify-start items-center"
          >
            <sofa-icon :customClass="'h-[40px]'" :name="'xp-points'" />
            <div class="flex flex-col items-start justify-center">
              <sofa-normal-text :customClass="'font-bold'"
                >1 xp</sofa-normal-text
              >
              <sofa-normal-text :color="'text-bodyBlack'"
                >Point</sofa-normal-text
              >
            </div>
          </div>
          <div
            class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row space-x-3 justify-start items-center"
          >
            <sofa-icon :customClass="'h-[40px]'" :name="'streak-new'" />
            <div class="flex flex-col items-start justify-center">
              <sofa-normal-text :customClass="'font-bold'"
                >0 days</sofa-normal-text
              >
              <sofa-normal-text :color="'text-bodyBlack'"
                >Streak</sofa-normal-text
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-3"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Get verified
          </sofa-normal-text>
          <sofa-icon :name="'verify'" :custom-class="'h-[16px]'" />
        </div>
        <sofa-normal-text>
          Join the elite that create the highest quality study materials, reach
          more audience, and sell on marketplace.
        </sofa-normal-text>
        <sofa-button
          :has-double-layer="false"
          padding="py-2 px-6"
          @click="Logic.Common.GoToRoute('/verification')"
        >
          Apply here
        </sofa-button>
      </div>

      <div
        v-if="false"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-3"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Latest analytics
          </sofa-normal-text>
        </div>
        <div class="flex flex-col space-y-4 w-full">
          <div
            class="w-full px-3 py-3 bg-ligthGray flex flex-row items-center space-x-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px]"
            v-for="(item, index) in latestAnalytics"
            :key="index"
          >
            <div>
              <sofa-icon :custom-class="'h-[48px]'" :name="item.icon" />
            </div>
            <div class="w-full flex flex-col">
              <sofa-normal-text :customClass="'!line-clamp-1'">
                {{ item.title }}
              </sofa-normal-text>
              <sofa-normal-text :color="item.subTextColor">
                {{ item.subText }}
              </sofa-normal-text>
            </div>
          </div>
        </div>

        <div class="w-full">
          <sofa-normal-text :color="'text-primaryPink'"
            >See all</sofa-normal-text
          >
        </div>
      </div>
    </template>

    <template v-slot:middle-session>
      <div class="w-full flex flex-col mdlg:pl-0 pl-4">
        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-3 mdlg:!gap-5 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:pr-0 pr-4 mdlg:pt-0 pt-2"
          >
            <div
              class="mdlg:!col-span-1 w-[280px] mdlg:!w-auto rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] flex flex-row space-x-6 items-center justify-between lg:py-5 lg:px-5 px-3 py-3 bg-primaryPurple"
            >
              <sofa-header-text
                :color="'text-white '"
                :custom-class="'text-left '"
              >
                Engineering Notes
              </sofa-header-text>
              <sofa-icon
                :name="'notes-white'"
                :custom-class="'lg:h-[37px] h-[30px]'"
              />
            </div>

            <div
              class="mdlg:!col-span-1 w-[280px] mdlg:!w-auto rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] flex flex-row space-x-6 items-center justify-between lg:py-5 lg:px-5 px-3 py-3 bg-primaryGreen"
            >
              <sofa-header-text
                :color="'text-white '"
                :custom-class="'text-left '"
              >
                Engineering Past questions
              </sofa-header-text>
              <sofa-icon
                :name="'questions-white'"
                :custom-class="'lg:h-[37px] h-[30px]'"
              />
            </div>

            <div
              class="mdlg:!col-span-1 w-[280px] mdlg:!w-auto lg:mr-0 mr-4 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] flex flex-row space-x-6 items-center justify-between lg:py-5 lg:px-5 px-3 py-3 bg-primaryPurplePink"
            >
              <sofa-header-text
                :color="'text-white '"
                :custom-class="'text-left '"
              >
                Engineering Textbook solutions
              </sofa-header-text>
              <sofa-icon
                :name="'books-white'"
                :custom-class="'lg:h-[37px] h-[30px]'"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 mdlg:!pt-4 pt-3 mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Complete your account setup
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in profileSteps"
              :key="index"
            >
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Create study materials
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in studyMaterialsSteps"
              :key="index"
            >
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Take on some tasks
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in takeOnTasks"
              :key="index"
            >
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] mdlg:!hidden flex flex-col mdlg:!space-y-4 space-y-1"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Recent chats
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in recentChats"
              :key="index"
            >
              <template v-slot:title>
                <div class="w-full flex flex-row items-center space-x-2">
                  <sofa-normal-text :customClass="'!line-clamp-1 font-bold'">
                    {{ item.title }}
                  </sofa-normal-text>
                  <span class="h-[5px] w-[5px] rounded-full bg-[#78828c]">
                  </span>
                  <sofa-normal-text>{{ item.date }}</sofa-normal-text>
                </div>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col space-y-4"
      >
        <div
          class="w-full flex flex-row space-x-2 items-center justify-between"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Suggested for you
          </sofa-normal-text>

          <div class="mdlg:!hidden pr-4">
            <sofa-normal-text :color="'text-primaryPink'"
              >See all</sofa-normal-text
            >
          </div>
        </div>

        <div
          class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-activity-card
              v-for="(activity, index) in activities"
              :key="index"
              :activity="activity"
            />
          </div>
        </div>

        <!-- <div class="w-full">
          <sofa-normal-text :color="'text-primaryBlue'"
            >See all</sofa-normal-text
          >
        </div> -->

        <div
          class="w-full mdlg:!flex hidden flex-col space-y-3 justify-center items-center py-9 px-6 rounded-[8px] bg-primaryPurple"
        >
          <sofa-icon :customClass="'h-[28px]'" :name="'white-search'" />
          <div
            class="w-full flex flex-col space-y-2 justify-center items-center py-2"
          >
            <sofa-normal-text :color="'text-white'" :custom-class="'!font-bold'"
              >Discover more</sofa-normal-text
            >
            <sofa-normal-text
              :color="'text-white'"
              :custom-class="'w-full flex flex-row items-center justify-center !font-semibold'"
              >There are lots of quizzes and courses that you can learn from, so
              start searching!</sofa-normal-text
            >
          </div>
          <sofa-button
            :custom-class="'!whitespace-nowrap'"
            :bgColor="'bg-white'"
            padding="py-1 px-3"
            :textColor="'text-[#141618]'"
            >Explore more
          </sofa-button>
        </div>
      </div>

      <!-- Content details modal -->
      <sofa-modal
        v-if="showAccountSetup"
        :close="
          () => {
            showAccountSetup = false;
          }
        "
        :customClass="'hidden md:!flex'"
      >
        <div
          class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] flex flex-col items-center relative"
          @click.stop="
            () => {
              //
            }
          "
        >
          <div
            class="bg-white w-full flex flex-col lg:!px-6 space-y-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center"
          >
            <sofa-header-text :customClass="'text-xl'"
              >Set up your account</sofa-header-text
            >

            <account-setup />
          </div>
        </div>
      </sofa-modal>
    </template>

    <template v-slot:right-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-row items-center space-x-3">
          <div
            :style="`background-image: url('/images/icons/robot.svg')`"
            class="w-[84px] h-[84px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"
          ></div>

          <div class="flex flex-col space-y-1">
            <sofa-header-text :customClass="'!text-base !font-bold'"
              >Dr. Sofa</sofa-header-text
            >
            <sofa-normal-text>AI Assistant</sofa-normal-text>
            <sofa-normal-text :color="'text-primaryPink'"
              >Customise</sofa-normal-text
            >
          </div>
        </div>

        <sofa-text-field
          placeholder="What can I do for you?"
          :padding="'px-3 py-3'"
        >
          <template v-slot:inner-suffix>
            <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
          </template>
        </sofa-text-field>

        <div class="w-full flex flex-row items-center space-x-2">
          <sofa-badge
            :color="'gray'"
            :isInverted="true"
            :customClass="'py-2 px-4 cursor-pointer'"
            @click="Logic.Common.GoToRoute('/quiz/create')"
            >Create a quiz</sofa-badge
          >
          <sofa-badge
            :color="'gray'"
            :isInverted="true"
            :customClass="'py-2 px-4'"
            >Create a course</sofa-badge
          >
        </div>
      </div>

      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-row space-x-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Recent chats
          </sofa-normal-text>
        </div>

        <div
          class="w-full px-3 py-3 bg-ligthGray flex flex-row items-center space-x-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px]"
          v-for="(item, index) in recentChats"
          :key="index"
        >
          <div>
            <sofa-icon :custom-class="'h-[40px]'" :name="'conversation'" />
          </div>
          <div class="w-full flex flex-col">
            <div class="w-full flex flex-row items-center space-x-2">
              <sofa-normal-text :customClass="'!line-clamp-1 font-bold'">
                {{ item.title }}
              </sofa-normal-text>
              <span class="h-[5px] w-[5px] rounded-full bg-[#78828c]"> </span>
              <sofa-normal-text>{{ item.date }}</sofa-normal-text>
            </div>
            <sofa-normal-text
              :customClass="'!line-clamp-1'"
              :color="'text-grayColor'"
            >
              {{ item.content }}
            </sofa-normal-text>
          </div>
        </div>
        <div class="w-full">
          <sofa-normal-text :color="'text-primaryPink'"
            >See all</sofa-normal-text
          >
        </div>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaButton,
  SofaBadge,
  SofaTextField,
  SofaActivityCard,
  SofaIconCard,
  SofaModal,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import AccountSetup from "@/components/onboarding/AccountSetup.vue";
import { showAccountSetup } from "@/composables/profile";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaButton,
    SofaBadge,
    SofaTextField,
    SofaActivityCard,
    SofaIconCard,
    SofaModal,
    AccountSetup,
  },
  middlewares: {},
  name: "IndexPage",
  setup() {
    useMeta({
      title: "Home",
    });

    onMounted(() => {
      scrollToTop();
    });

    const latestAnalytics = [
      {
        icon: "orange-list",
        title: "Big Data: What it is and why is this working",
        subText: "40% done",
        subTextColor: "text-primaryOrange",
      },
      {
        icon: "pink-question",
        title: "Our Solar System",
        subText: "Multiplayer - 1st",
        subTextColor: "text-primaryGreen",
      },
      {
        icon: "pink-question",
        title: "Physics: All terms and definitions",
        subText: "Learn - 75% done",
        subTextColor: "text-primaryOrange",
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
        progress: 40,
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
    ];

    const recentChats = [
      {
        title: "Calculus",
        date: "Today",
        content: "That is the derivative of the function",
        subTitle: "The idiom is correct",
        icon: "conversation",
        iconSize: "h-[40px]",
      },
      {
        title: "Idioms",
        date: "Yesterday",
        content: "The idiom is correct",
        subTitle: "The idiom is correct",
        icon: "conversation",
        iconSize: "h-[40px]",
      },
      {
        title: "Scheduling",
        date: "Yesterday",
        content: "A very good start",
        subTitle: "The idiom is correct",
        icon: "conversation",
        iconSize: "h-[40px]",
      },
    ];

    const profileSteps = [
      {
        title: "Add profile",
        subTitle: "Picture, name and bio",
        icon: "add-profile",
        iconSize: "h-[46px]",
      },
      {
        title: "Add education",
        subTitle: "Level and school or exams",
        icon: "add-education",
        iconSize: "h-[46px]",
      },
      {
        title: "Add phone",
        subTitle: "Enter your phone numbero",
        icon: "add-phone",
        iconSize: "h-[46px]",
      },
    ];

    const studyMaterialsSteps = [
      {
        title: "Create a quiz",
        subTitle:
          "Build a customized quiz with different question types and study modes",
        icon: "pink-question",
        iconSize: "h-[46px]",
      },
      {
        title: "Create a course",
        subTitle:
          "Develop and publish a series of educational material on a particular subject",
        icon: "orange-list",
        iconSize: "h-[46px]",
      },
    ];

    const takeOnTasks = [
      {
        title: "Learn a quiz",
        subTitle: "Practice alone with a quiz",
        icon: "learn-quiz",
        iconSize: "h-[46px]",
      },
      {
        title: "Study flashcards",
        subTitle: "Learn flashcards on a quiz",
        icon: "study-flashcard",
        iconSize: "h-[46px]",
      },
      {
        title: "Play a quiz game ",
        subTitle: "Challenge your friends",
        icon: "play-quiz",
        iconSize: "h-[46px]",
      },
    ];

    return {
      moment,
      latestAnalytics,
      activities,
      recentChats,
      Logic,
      profileSteps,
      studyMaterialsSteps,
      takeOnTasks,
      showAccountSetup,
    };
  },
});
</script>
