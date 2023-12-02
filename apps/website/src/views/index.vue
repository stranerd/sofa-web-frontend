<template>
  <dashboard-layout>
    <template v-slot:left-session>
      <div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-row items-center gap-3">
          <sofa-avatar :size="'84'" :bgColor="'bg-grayColor'" :photoUrl="UserProfile.bio?.photo?.link ?? ''">
            <sofa-icon :customClass="'h-[45px]'" :name="'user'" />
          </sofa-avatar>

          <div class="flex flex-col gap-1">
            <sofa-header-text :customClass="'!text-base !font-bold'">{{ UserProfile.bio.name?.full }}</sofa-header-text>
            <sofa-normal-text :customClass="'capitalize'">{{ Logic.Users.getUserType() }}</sofa-normal-text>

            <sofa-normal-text :color="'text-primaryPink'" :customClass="'cursor-pointer'"
              @click="Logic.Common.GoToRoute('/profile/')">
              View profile
            </sofa-normal-text>
          </div>
        </div>

        <div class="w-full grid grid-cols-2 gap-3" v-if="Logic.Users.getUserType() == 'student'">
          <div
            class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row gap-3 justify-start items-center">
            <sofa-icon :customClass="'h-[40px]'" :name="'xp-points'" />
            <div class="flex flex-col items-start justify-center">
              <sofa-normal-text :customClass="'font-bold'">{{
                Logic.Common.convertToMoney(
                  UserProfile.account.rankings.overall.value,
                  false,
                  ""
                )
              }}
                xp</sofa-normal-text>
              <sofa-normal-text :color="'text-bodyBlack'">Point</sofa-normal-text>
            </div>
          </div>
          <div
            class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row gap-3 justify-start items-center">
            <sofa-icon :customClass="'h-[40px]'" :name="'streak-new'" />
            <div class="flex flex-col items-start justify-center">
              <sofa-normal-text :customClass="'font-bold'">{{ UserProfile.account.streak.count }} days</sofa-normal-text>
              <sofa-normal-text :color="'text-bodyBlack'">Streak</sofa-normal-text>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!Logic.Users.UserProfile.roles.isVerified"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-3">
        <div class="w-full flex flex-row gap-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            {{ "Get verified" }}
          </sofa-normal-text>
          <sofa-icon :name="'verify'" :custom-class="'h-[16px]'" />
        </div>
        <sofa-normal-text>
          Join the elite that create the highest quality study materials, reach
          more audience, and sell on marketplace.
        </sofa-normal-text>

        <sofa-button :has-double-layer="false" padding="py-2 px-6" @click="Logic.Common.GoToRoute('/verification')">
          Apply here
        </sofa-button>
      </div>

      <div v-if="Logic.Users.UserProfile.type?.type === 'teacher' && Logic.Users.UserProfile.tutor.topics.length === 0"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-3">
        <div class="w-full flex flex-row gap-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Apply to teach subjects
          </sofa-normal-text>
          <sofa-icon :name="'tutor-bagde'" :custom-class="'h-[16px]'" />
        </div>
        <sofa-normal-text>
          As a teacher, you need to pass a test on a subject before you can be recommended to teach the subject to others.
          Complete your test after this application and we will reach out to you with your result.
        </sofa-normal-text>

        <sofa-button :has-double-layer="false" padding="py-2 px-6" @click="Logic.Common.GoToRoute('/verification/tutor')">
          Apply here
        </sofa-button>
      </div>

    </template>

    <template v-slot:middle-session>
      <div v-if="profileSteps.find((s) => !s.isDone) && Logic.Users.getUserType() != 'organization'"
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 mdlg:!pt-4 pt-3 mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!gap-4 gap-1">
        <div class="w-full flex flex-row gap-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Complete your account setup
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-icon-card :data="item" v-for="(item, index) in profileSteps" :key="index"
              @click="item.action ? item.action() : null">
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div v-if="studyMaterialsSteps.find((s) => !s.isDone)"
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!gap-4 gap-1">
        <div class="w-full flex flex-row gap-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Create study materials
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-icon-card :data="item" v-for="(item, index) in studyMaterialsSteps" :key="index"
              @click="item.action ? item.action() : null">
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>
          </div>
        </div>
      </div>

      <div v-if="takeOnTasks.find((s) => !s.isDone) && Logic.Users.getUserType() == 'student'"
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!gap-4 gap-1">
        <div class="w-full flex flex-row gap-2 items-center">
          <sofa-normal-text :customClass="'!font-bold'">
            Take on some tasks
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-icon-card :data="item" v-for="(item, index) in takeOnTasks" :key="index"
              @click="item.action ? item.action() : null">
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
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-row gap-2 items-center justify-between">
          <sofa-normal-text :customClass="'!font-bold'">
            Suggested for you
          </sofa-normal-text>

          <div class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>

        <div
          class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div v-if="homeContents.suggested.length"
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-activity-card v-for="(activity, index) in homeContents.suggested" :key="index" :activity="activity"
              :custom-class="'cursor-pointer'" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  activity.id +
                  `?type=${activity.labels.main.toLowerCase()}`
                )
                " :has-bookmark="true" :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = activity
  }
    " />
          </div>
          <template v-else>
            <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
              <sofa-empty-state :title="'No suggested materials'" :subTitle="'We could not find any suggested materials'"
                :custom-class="'!h-[230px]'" />
            </div>
          </template>
        </div>

        <div class="w-full" v-if="homeContents.suggested.length">
          <div class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-row gap-2 items-center justify-between">
          <sofa-normal-text :customClass="'!font-bold'">
            Recent study materials
          </sofa-normal-text>

          <div class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>

        <div
          class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div v-if="homeContents.recent.length"
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-activity-card v-for="(activity, index) in homeContents.recent" :key="index" :activity="activity"
              :custom-class="'cursor-pointer'" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  activity.id +
                  `?type=${activity.labels.main.toLowerCase()}`
                )
                " :has-bookmark="true" :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = activity
  }
    " />
          </div>
          <template v-else>
            <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
              <sofa-empty-state :title="'No recent materials'" :subTitle="'We could not find any recent materials'"
                :custom-class="'!h-[230px]'" />
            </div>
          </template>
        </div>

        <div class="w-full" v-if="homeContents.recent.length">
          <div class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>
      </div>

      <div v-if="homeContents.my_org.length"
        class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col gap-4">
        <div class="w-full flex flex-row gap-2 items-center justify-between">
          <sofa-normal-text :customClass="'!font-bold'">
            From your organizations
          </sofa-normal-text>

          <div class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>

        <div
          class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div v-if="homeContents.my_org.length"
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-activity-card v-for="(activity, index) in homeContents.my_org" :key="index"
              :custom-class="'cursor-pointer'" :activity="activity" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  activity.id +
                  `?type=${activity.labels.main.toLowerCase()}`
                )
                " :has-bookmark="true" :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = activity
  }
    " />
          </div>
          <template v-else>
            <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
              <sofa-empty-state :title="'No result found'"
                :subTitle="'We could not find any material from your organizations'" :custom-class="'!h-[350px]'" />
            </div>
          </template>
        </div>

        <div class="w-full" v-if="homeContents.my_org.length">
          <div class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block" @click="Logic.Common.GoToRoute(`/marketplace`)">
            <sofa-normal-text :color="'text-primaryPink'">View all</sofa-normal-text>
          </div>
        </div>
      </div>

      <div
        class="w-full mdlg:shadow-custom px-4 mdlg:!py-4 mdlg:!bg-white bg-transparent rounded-2xl flex flex-col gap-4">
        <div class="w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-[8px] bg-primaryPurple">
          <sofa-icon :customClass="'h-[28px]'" :name="'white-search'" />
          <div class="w-full flex flex-col gap-2 justify-center items-center py-2">
            <sofa-normal-text :color="'text-white'" :custom-class="'!font-bold'">Discover more</sofa-normal-text>
            <sofa-normal-text :color="'text-white'"
              :custom-class="'w-full flex flex-row items-center justify-center !font-semibold'">There are lots of quizzes
              and courses that you can learn from, so
              start searching!</sofa-normal-text>
          </div>
          <sofa-button :custom-class="'!whitespace-nowrap'" :bgColor="'bg-white'" padding="py-1 px-3"
            :textColor="'text-[#141618]'" @click="Logic.Common.GoToRoute('/marketplace')">Explore more
          </sofa-button>
        </div>
      </div>

      <div class="fixed bottom-[80px] z-[100] w-full flex items-center justify-end pr-2 mdlg:hidden">
        <router-link class="px-3 py-2 bg-primaryPurple text-white flex items-center rounded-custom gap-2"
          style="box-shadow: 0px 4px 8px rgba(120, 130, 140, 0.05)" to="/chats/new">
          <SofaNormalText color="text-inherit" content="Ask me anything" />
          <SofaIcon name="robot" class="w-[24px] h-[24px]" />
        </router-link>
      </div>

      <!-- Customize AI -->
      <customize-bot :close="() => showCustomizeAI = false" v-if="showCustomizeAI" />
    </template>

    <template v-slot:right-session>
      <div v-if="!Logic.Users.isTeacher"
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
        <template v-if="Logic.Users.isStudent">
          <div class="w-full flex flex-row items-center gap-3">
            <div :style="`background-image: url('${UserProfile.ai.photo
              ? UserProfile.ai.photo.link
              : '/images/icons/robot.svg'
              }')`"
              class="w-[84px] h-[84px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"></div>

            <div class="flex flex-col gap-1">
              <sofa-header-text :customClass="'!text-base !font-bold'" :content="UserProfile.ai.name" />
              <sofa-normal-text :content="UserProfile.ai.tagline" />
              <sofa-normal-text :color="'text-primaryPink'" :customClass="'cursor-pointer'"
                @click="showCustomizeAI = true">Customise</sofa-normal-text>
            </div>
          </div>

          <sofa-text-field placeholder="What can I do for you?" :padding="'p-3'" :custom-class="'border'"
            v-model="factory.title">
            <template v-slot:inner-suffix>
              <sofa-icon :name="'send'" :customClass="'h-[19px] cursor-pointer'" @click="createConversation" />
            </template>
          </sofa-text-field>

          <div class="w-full flex flex-row items-center gap-2">
            <sofa-badge :color="'gray'" :isInverted="true" :customClass="'py-2 px-4 cursor-pointer'"
              @click="Logic.Common.GoToRoute('/quiz/create')">Create a quiz</sofa-badge>
            <sofa-badge :color="'gray'" :isInverted="true" :customClass="'py-2 px-4 cursor-pointer'"
              @click="Logic.Common.GoToRoute('/course/create')">Create a course</sofa-badge>
          </div>
        </template>
        <template v-if="Logic.Users.getUserType() == 'organization'">
          <div class="w-full flex flex-row items-center justify-between">
            <sofa-normal-text :custom-class="'!font-bold'">
              Your students
            </sofa-normal-text>
            <div class="flex flex-row gap-2 items-center cursor-pointer"
              @click="Logic.Common.GoToRoute('/settings/students')">
              <sofa-normal-text :custom-class="'!text-grayColor'">
                Add
              </sofa-normal-text>
              <sofa-icon :name="'add-gray'" :custom-class="'h-[20px]'" />
            </div>
          </div>

          <template v-if="allStudents.length">
            <div class="w-full flex flex-col gap-4">
              <div class="w-full flex flex-row items-center justify-between" v-for="(item, index) in allStudents"
                :key="index">
                <div class="flex flex-row items-center gap-2">
                  <sofa-avatar :photoUrl="item.profile_url || ''" :size="'26'" :bgColor="'bg-grayColor'">
                    <sofa-icon :name="'user'" :customClass="'h-[15px]'" />
                  </sofa-avatar>

                  <sofa-normal-text :customClass="'text-left'">
                    {{ item.name }}
                  </sofa-normal-text>
                </div>
              </div>

              <div class="w-full flex flex-row items-center justify-start">
                <sofa-normal-text :color="'text-primaryPink'" :custom-class="'cursor-pointer'"
                  @click="Logic.Common.GoToRoute('/settings/students')">
                  View all
                </sofa-normal-text>
              </div>
            </div>
          </template>
          <sofa-empty-state v-else :title="'No students'"
            :subTitle="'Your students have free access all contents you create'" :actionLabel="'Add students'" :action="() => {
              Logic.Common.GoToRoute('/settings/students')
            }
              " />
        </template>
      </div>

      <div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4"
        v-if="(conversations.length && Logic.Users.isStudent) || Logic.Users.isTeacher">
        <sofa-normal-text :customClass="'!font-bold'">
          Recent chats
        </sofa-normal-text>

        <template v-if="conversations.length">
          <ChatList :limit="3" />

          <router-link to="/chats">
            <sofa-normal-text :color="'text-primaryPink'">See all</sofa-normal-text>
          </router-link>
        </template>
        <template v-else>
          <sofa-empty-state :title="'No chat'" :subTitle="'Your active chats will show up here'" :actionLabel="''" />
        </template>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import ChatList from "@/components/conversations/ChatList.vue"
import CustomizeBot from "@/components/onboarding/CustomizeBot.vue"
import { scrollToTop } from "@/composables"
import { useConversationsList, useCreateConversation } from '@/composables/conversations/conversations'
import {
  selectedFolderMaterailToAdd,
  showSaveToFolder,
} from "@/composables/library"
import {
  HomeMaterials,
  homeContents,
  sectionTags,
  setHomeMaterials,
} from "@/composables/marketplace"
import {
  allOrganizationMembers,
  allStudents,
  selectedMember,
  setOrganizationMembers,
  showCustomizeAI,
  showRemoveMember,
} from "@/composables/profile"
import { Logic } from "sofa-logic"
import {
  SofaActivityCard,
  SofaAvatar,
  SofaBadge,
  SofaButton,
  SofaEmptyState,
  SofaHeaderText,
  SofaIcon,
  SofaIconCard,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import { useMeta } from "vue-meta"

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
    SofaAvatar,
    CustomizeBot,
    SofaEmptyState,
    ChatList,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Schools",
        property: "AllInstitutions",
        method: "GetInstitutions",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "HomeMaterials",
        method: "GetHomeMaterials",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
        silentUpdate: true,
      },
      {
        domain: "Study",
        property: "AllTopics",
        method: "GetTopics",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "AllOtherTags",
        method: "GetOtherTags",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Users",
        property: "AllorganizationMembers",
        method: "GetOrganizationMembers",
        params: [
          Logic.Auth.AuthUser?.id,
          {
            limit: 10,
          },
        ],
        requireAuth: true,
        silentUpdate: false,
      },
      {
        domain: "Users",
        property: "AllorganizationMembers",
        method: "GetOrganizationMembers",
        params: [
          Logic.Auth.AuthUser?.id,
          {
            limit: 10,
          },
        ],
        shouldSkip: () => Logic.Users.getUserType() !== "organization",
        requireAuth: true,
        silentUpdate: false,
      }
    ]
  },
  name: "IndexPage",
  setup () {
    useMeta({
      title: "Home",
    })

    const { conversations } = useConversationsList()
    const { factory, createConversation } = useCreateConversation()

    const UserProfile = ref(Logic.Users.UserProfile)

    const profileSteps = computed(() => UserProfile.value ? [
      {
        title: "Add profile",
        subTitle: "Picture, name and bio",
        icon: "add-profile",
        iconSize: "h-[46px]",
        isDone: Logic.Users.CheckUserTaskState("profile_setup"),
        action: () => Logic.Common.GoToRoute('/settings/profile#profile')
      },
      {
        title: UserProfile.value.type?.type === 'teacher' ? 'Add experience' : "Add education",
        subTitle: "Current place you teach at",
        icon: "add-education",
        iconSize: "h-[46px]",
        isDone: Logic.Users.CheckUserTaskState("education_setup"),
        action: () => Logic.Common.GoToRoute('/settings/profile#type')
      },
      {
        title: "Add phone",
        subTitle: "Enter your phone number",
        icon: "add-phone",
        iconSize: "h-[46px]",
        isDone: Logic.Users.CheckUserTaskState("phone_setup"),
        action: () => Logic.Common.GoToRoute('/settings/profile#contact')
      }
    ] : [])

    const studyMaterialsSteps = computed(() => UserProfile.value ? [
      {
        title: "Create a quiz",
        subTitle:
          "Build a customized quiz with different question types and study modes",
        icon: "pink-question",
        iconSize: "h-[46px]",
        isDone: Logic.Users.CheckUserTaskState("create_quiz"),
        action: () => Logic.Common.GoToRoute("/quiz/create")
      },
      {
        title: "Create a course",
        subTitle: "Develop and publish a series of educational material on a particular subject",
        icon: "orange-list",
        iconSize: "h-[46px]",
        isDone: Logic.Users.CheckUserTaskState("create_course"),
        action: () => Logic.Common.GoToRoute("/course/create")
      }
    ] : [])

    const takeOnTasks = computed(() => UserProfile.value ? [
      {
        title: "Learn a quiz",
        subTitle: "Practice alone with a quiz",
        icon: "learn-quiz",
        isDone: Logic.Users.CheckUserTaskState("learn_quiz"),
        iconSize: "h-[46px]",
        action: () => Logic.Common.GoToRoute("/marketplace")
      },
      {
        title: "Study flashcards",
        subTitle: "Learn flashcards on a quiz",
        icon: "study-flashcard",
        isDone: Logic.Users.CheckUserTaskState("quiz_flashcard"),
        iconSize: "h-[46px]",
        action: () => Logic.Common.GoToRoute("/marketplace")
      },
      {
        title: "Play a quiz game ",
        subTitle: "Challenge your friends",
        icon: "play-quiz",
        isDone: Logic.Users.CheckUserTaskState("quiz_game"),
        iconSize: "h-[46px]",
        action: () => Logic.Common.GoToRoute("/marketplace")
      }
    ] : [])

    onMounted(() => {
      scrollToTop()
      setHomeMaterials(4)
      Logic.Users.watchProperty("UserProfile", UserProfile)
      Logic.Study.watchProperty("HomeMaterials", HomeMaterials)
      // set organization students

      if (Logic.Users.getUserType() == "organization") {
        setOrganizationMembers()
        Logic.Users.watchProperty(
          "AllorganizationMembers",
          allOrganizationMembers
        )
      }
    })

    watch(allOrganizationMembers, () => {
      setOrganizationMembers()
    })

    watch(HomeMaterials, () => {
      setHomeMaterials(4)
    })

    return {
      factory,
      createConversation,
      Logic,
      profileSteps,
      studyMaterialsSteps,
      conversations,
      takeOnTasks,
      UserProfile,
      homeContents,
      sectionTags,
      showCustomizeAI,
      allStudents,
      selectedMember,
      showRemoveMember,
      showSaveToFolder,
      selectedFolderMaterailToAdd,
    }
  },
})
</script>
