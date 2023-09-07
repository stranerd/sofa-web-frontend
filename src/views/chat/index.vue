<template>
  <component :is="currentComponent">
    <!-- For pending tutor verification -->
    <div
      class="w-full flex flex-row items-center space-x-3 z-50 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0 mdlg:hidden"
    >
      <div class="invisible">Hello</div>
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        Chat</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <div class="w-full flex flex-col h-[50px] items-center justify-center px-4">
      <div class="lg:w-[60%] mdlg:w-[60%] w-full h-full flex flex-col">
        <template v-if="SingleTutorRequest">
          <sofa-empty-state
            :title="'Tutor application in review'"
            :subTitle="'You will get a notification via email when your application has been accepted or rejected'"
            :actionLabel="'Tutor guide'"
            :action="
              () => {
                null;
              }
            "
            :icon="{
              name: 'tutor-review',
              size: 'h-[34px]',
            }"
            :titleStyle="'mdlg:!text-xl '"
          />
        </template>
        <template v-else>
          <sofa-empty-state
            :title="'Complete your tutor verification'"
            :subTitle="'Apply to become a tutor on SOFA'"
            :actionLabel="'Become a tutor'"
            :action="
              () => {
                Logic.Common.GoToRoute('/verification/tutor');
              }
            "
            :icon="{
              name: 'tutor-review',
              size: 'h-[34px]',
            }"
            :titleStyle="'mdlg:!text-xl '"
          />
        </template>
      </div>
    </div>

    <template v-slot:left-session>
      <div
        class="w-full shadow-custom px-4 pb-4 bg-white relative rounded-[16px] space-y-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin flex flex-col"
      >
        <div
          class="w-full flex flex-row items-center justify-start pt-7 top-0 left-0 sticky bg-white z-30 space-x-3 py-3 px-3 cursor-pointer"
          @click="newChat()"
          v-if="Logic.Users.getUserType() == 'student'"
        >
          <sofa-icon :name="'box-add-pink'" :custom-class="'h-[17px]'" />
          <sofa-normal-text :color="'text-primaryPink'">
            New chat
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row justify-start pt-4 pb-2"
          v-if="chatList.length && Logic.Users.getUserType() == 'teacher'"
        >
          <sofa-header-text :customClass="'text-left mdlg:!text-base text-sm'">
            All Chats
          </sofa-header-text>
        </div>

        <!-- Chat list -->
        <chat-list-component />

        <!-- Empty state -->
        <template
          v-if="Logic.Users.getUserType() == 'teacher' && !chatList.length"
        >
          <div class="pt-4">
            <sofa-empty-state
              :title="'No chat'"
              :subTitle="'Your active chats will show up here'"
              :actionLabel="''"
            />
          </div>
        </template>
      </div>

      <sofa-delete-prompt
        v-if="showDeleteConvo"
        :title="'Are you sure?'"
        :subTitle="`This action is permanent. All messages in this conversation would be lost`"
        :close="
          () => {
            showDeleteConvo = false;
          }
        "
        :buttons="[
          {
            label: 'No',
            isClose: true,
            action: () => {
              showDeleteConvo = false;
            },
          },
          {
            label: 'Yes, delete',
            isClose: false,
            action: () => {
              deleteConvo(selectedConvoId);
            },
          },
        ]"
      />

      <!-- End session modal -->
      <sofa-delete-prompt
        v-if="showEndSession"
        :title="'End session with tutor?'"
        :subTitle="`Are you sure you want to end this session? The tutor will be removed from this chat`"
        :close="
          () => {
            showEndSession = false;
          }
        "
        :buttons="[
          {
            label: 'No',
            isClose: true,
            action: () => {
              showEndSession = false;
            },
          },
          {
            label: 'End session',
            isClose: false,
            action: () => {
              showEndSession = false;
              showRateAndReviewTutor = true;
            },
          },
        ]"
      />
    </template>

    <template v-slot:middle-session>
      <div
        class="w-full mdlg:!shadow-custom relative mdlg:!bg-white bg-transparent mdlg:!rounded-[16px] justify-between mdlg:flex-grow mdlg:h-full flex flex-col space-y-4 mdlg:!space-y-0"
      >
        <div
          class="w-full mdlg:!flex hidden flex-row px-4 py-4 bg-white rounded-t-[16px] sticky top-0 space-x-3 items-start justify-between border-b-[1px] border-[#E1E6EB]"
        >
          <div class="flex flex-row items-center space-x-3">
            <sofa-avatar
              :photoUrl="selectedChatData.photoUrl"
              :size="'40'"
              :bgColor="'bg-grayColor'"
            >
              <sofa-icon
                :customClass="'h-[23px]'"
                :name="'user'"
                v-if="!selectedChatData.photoUrl"
              />
            </sofa-avatar>
            <div class="flex flex-col">
              <sofa-custom-input
                :updateValue="conversationTitle"
                :customClass="'!font-bold w-full flex flex-row justify-start !px-0 !py-0'"
                @onContentChange="contentTitleChanged"
                @onBlur="editTitle = false"
                :autoFocus="true"
                v-if="editTitle"
              ></sofa-custom-input>
              <sofa-normal-text
                :customClass="'!font-bold w-full flex flex-row justify-start !px-0 !py-0'"
                v-else
              >
                {{ selectedChatData.title }}
              </sofa-normal-text>
              <sofa-normal-text
                v-if="Logic.Users.getUserType() == 'student'"
                :color="'text-grayColor'"
                :customClass="'!text-[12px]'"
              >
                You, {{ UserProfile.ai.name || "Dr. Sofa" }}
              </sofa-normal-text>
              <sofa-normal-text
                v-if="Logic.Users.getUserType() == 'teacher'"
                :color="'text-grayColor'"
                :customClass="'!text-[12px]'"
              >
                You
              </sofa-normal-text>
            </div>
          </div>
          <div
            class="flex flex-row"
            v-if="!editTitle && conversationTitle != 'New Chat'"
            @click="editTitle = true"
          >
            <sofa-icon
              :name="'edit-gray'"
              :custom-class="'h-[15px] cursor-pointer'"
            />
          </div>
        </div>

        <!-- Small screen new chat -->

        <div
          class="w-full flex flex-col mdlg:!hidden px-4"
          v-if="Logic.Users.getUserType() == 'student'"
        >
          <div
            @click="addNewChat()"
            class="w-full rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] flex flex-row space-x-3 items-center justify-start px-4 py-4 bg-primaryPurple"
          >
            <sofa-icon :name="'box-add-white'" :custom-class="'h-[25px]'" />
            <sofa-normal-text
              :color="'text-white '"
              :custom-class="'text-left !text-sm'"
            >
              New chat
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="w-full mdlg:!flex-grow flex flex-col items-start justify-start space-y-2 mdlg:!pl-0 pl-4 mdlg:!pt-0 pt-3 mdlg:!h-[50px] !overflow-y-auto"
          v-if="
            Logic.Common.mediaQuery() != 'sm' ||
            (Logic.Common.mediaQuery() == 'sm' &&
              chatList.length == 0 &&
              tutorRequestList.length == 0)
          "
        >
          <div class="w-full flex flex-row space-x-2 items-center mdlg:!hidden">
            <sofa-normal-text :customClass="'!font-bold'">
              Recent chats
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide mdlg:scrollbar-default h-auto mdlg:!pb-4 scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin"
            id="MessagesScrollContainerLg"
            v-if="!itIsTutorRequest"
          >
            <div
              v-if="!hasMessage && !itIsNewMessage && !itIsTutorRequest"
              class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-3 mdlg:!gap-4 mdlg:!px-4 flex flex-row space-x-3 mdlg:!space-x-0 py-2 mdlg:!py-0 mdlg:!pt-3 mdlg:!pr-4 pr-4"
            >
              <div
                class="mdlg:!col-span-1 w-[280px] shadow-custom mdlg:!shadow-none mdlg:!w-auto flex flex-col space-y-2 mdlg:!justify-center mdlg:!items-center items-start px-5 py-5 rounded-[16px] mdlg:!bg-fadedPurple bg-white"
                v-for="(content, index) in contentList"
                :key="index"
              >
                <sofa-icon :name="content.icon" :customClass="'h-[39px]'" />
                <sofa-normal-text
                  :customClass="'!font-bold w-full flex flex-row mdlg:!justify-center justify-start'"
                  >{{ content.title }}</sofa-normal-text
                >
                <sofa-normal-text :customClass="'mdlg:!text-center text-left'">
                  {{ content.body }}
                </sofa-normal-text>
              </div>
            </div>

            <div
              class="hidden mdlg:!flex flex-col space-y-6 px-5 py-5 w-full"
              v-else
            >
              <conversation-messages
                :Messages="Messages"
                :ShowLoader="showLoader"
                :itIsNewMessage="itIsNewMessage"
              />
            </div>
          </div>
        </div>

        <!-- Small screen chat list -->

        <div
          class="w-full flex flex-col mdlg:!hidden px-4 space-y-3 pt-1"
          v-if="chatList.length || tutorRequestList.length"
        >
          <div
            class="w-full flex flex-row space-x-2 items-center mdlg:hidden"
            v-if="Logic.Users.getUserType() == 'student'"
          >
            <sofa-normal-text :customClass="'!font-bold'">
              All chats
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col space-y-3">
            <chat-list-component :customClass="'!bg-white shadow-custom'" />
          </div>
        </div>

        <!-- Tutor request message -->
        <div
          class="w-full flex flex-row items-start justify-start px-4 py-4"
          v-if="itIsTutorRequest"
        >
          <div
            class="mdlg:w-[65%] lg:w-[55%] custom-border bg-[#E2F3FD] px-3 py-3 flex flex-row items-start justify-start"
          >
            <sofa-normal-text :customClass="'text-left'">
              {{ selectedChatData.lastMessage }}
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="w-full py-4 border-t-[1px] mdlg:!flex hidden border-[#E1E6EB] sticky bottom-0 px-4 bg-white"
        >
          <template v-if="itIsTutorRequest">
            <div class="w-full grid grid-cols-2 gap-4">
              <div class="col-span-1 flex flex-col">
                <sofa-button
                  :bgColor="'bg-primaryRed'"
                  :textColor="'text-white'"
                  :customClass="'w-full custom-border'"
                  :padding="'py-3'"
                  :has-double-layer="false"
                  @click="acceptOrRejectTutorRequest(false)"
                >
                  Decline
                </sofa-button>
              </div>

              <div class="col-span-1 flex flex-col">
                <sofa-button
                  :bgColor="'bg-primaryGreen'"
                  :textColor="'text-white'"
                  :customClass="'w-full custom-border'"
                  :padding="'py-3'"
                  :has-double-layer="false"
                  @click="acceptOrRejectTutorRequest(true)"
                >
                  Accept
                </sofa-button>
              </div>
            </div>
          </template>
          <div
            class="w-full flex flex-row space-x-2 items-center bg-fadedPurple rounded-[8px] px-1"
            v-else
          >
            <span
              :contenteditable="true"
              role="textbox"
              :class="`w-full textarea resize-none !min-h-[48px] text-bodyBlack focus:outline-none !max-h-[80px] overflow-x-hidden bg-transparent rounded-[8px] py-3 px-3 items-start text-left overflow-y-hidden`"
              placeholder="Enter message"
              id="messageContainer"
              @input="onInput"
              @keypress="handleKeyEvent"
            >
              {{ messageContent }}
            </span>
            <span class="min-w-[45px]">
              <span
                class="h-[40px] w-[40px] flex items-center justify-center cursor-pointer"
                @click="sendNewMessage(selectConversation)"
              >
                <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <add-tutor
        v-if="showAddTutor"
        :close="
          () => {
            showAddTutor = false;
          }
        "
        @on-request-sent="handleRequestSent"
      />

      <!-- Success prompt for tutor request -->
      <sofa-success-prompt
        v-if="showTutorRequestSubmited"
        :title="'Tutor request sent'"
        :subTitle="`You will get notified when the tutor responds`"
        :close="
          () => {
            showTutorRequestSubmited = false;
          }
        "
        :button="{
          label: 'Done',
          action: () => {
            showTutorRequestSubmited = false;
          },
        }"
      />

      <!-- Rate and review modal -->
      <rate-and-review-modal
        v-if="showRateAndReviewTutor"
        :close="
          () => {
            showRateAndReviewTutor = false;
          }
        "
        :title="'Session ended, rate tutor'"
        :tutor="{
          name: SingleConversation.tutor.bio.name.full,
          photo: SingleConversation.tutor?.bio?.photo?.link || '',
        }"
        @on-review-submitted="
          (data) => {
            endChatSession(data);
          }
        "
      />
    </template>

    <template v-slot:right-session>
      <!-- Student POV -->
      <template v-if="Logic.Users.getUserType() == 'student' && UserProfile">
        <div
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
          v-if="!selectedTutorRequestData || !SingleConversation.tutor"
        >
          <div class="w-full flex flex-row items-center space-x-3">
            <div
              :style="`background-image: url('${
                UserProfile.ai.photo
                  ? UserProfile.ai.photo.link
                  : '/images/icons/robot.svg'
              }')`"
              class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"
            ></div>

            <div class="flex flex-col space-y-1">
              <sofa-header-text :customClass="'!text-base !font-bold'">{{
                UserProfile.ai.name || "Dr. Sofa"
              }}</sofa-header-text>
              <sofa-normal-text>AI assistant</sofa-normal-text>
            </div>
          </div>
          <div
            class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple"
          >
            <sofa-normal-text
              :customClass="'text-left'"
              :color="'text-deepGray'"
            >
              Hello! I am here to respond to your messages in every chat 24/7.
              <br /><br />
              Let us work towards your highest ever academic achievements.
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
          v-if="SingleConversation && !itIsNewMessage"
        >
          <div
            class="w-full flex flex-row items-center justify-start space-x-2 cursor-pointer"
            v-if="selectedTutorRequestData && SingleConversation.tutor"
            @click.stop="
              showEndSession = true;
              selectedConvoId = SingleConversation.id;
            "
          >
            <sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
            <sofa-normal-text :color="'text-primaryRed'">
              End tutor session</sofa-normal-text
            >
          </div>
          <div
            class="w-full flex flex-row items-center justify-start space-x-2 cursor-pointer"
          >
            <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
            <sofa-normal-text
              :color="'text-primaryRed'"
              @click.stop="
                showDeleteConvo = true;
                selectedConvoId = SingleConversation.id;
              "
            >
              Delete chat</sofa-normal-text
            >
          </div>
        </div>

        <div
          class="w-full shadow-custom px-4 py-4 bg-primaryPurple rounded-[16px] flex flex-col space-y-3"
          v-if="
            (SingleConversation &&
              hasMessage &&
              !itIsNewMessage &&
              !selectedTutorRequestData) ||
            !SingleConversation?.tutor
          "
        >
          <div
            class="w-full flex flex-row space-x-2 items-center justify-start"
          >
            <sofa-icon :customClass="'h-[24px]'" :name="'add-tutor-white'" />
            <sofa-normal-text
              :color="'text-white'"
              :customClass="'!text-base !font-bold'"
            >
              Tutor help
            </sofa-normal-text>
          </div>
          <div class="w-full flex flex-col">
            <sofa-normal-text
              :customClass="'text-left'"
              :color="'text-[#E1E6EB]'"
            >
              Need extra help with your work?
            </sofa-normal-text>
          </div>
          <div class="flex flex-row">
            <sofa-button
              :bg-color="'bg-white'"
              :text-color="'!text-primaryPurple'"
              :padding="'px-5 py-1'"
              @click="showAddTutor = true"
            >
              Add a tutor
            </sofa-button>
          </div>
        </div>
      </template>

      <!-- Teacher POV -->
      <template v-if="Logic.Users.getUserType() == 'teacher'">
        <div
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4 justify-center items-center"
        >
          <div
            class="w-full flex flex-col items-center justify-center space-y-3"
          >
            <sofa-avatar
              :size="'180'"
              :bgColor="'bg-grayColor'"
              :photoUrl="
                UserProfile?.bio?.photo ? UserProfile?.bio?.photo.link : ''
              "
              :customClass="'!cursor-pointer'"
              @click="Logic.Common.GoToRoute('/settings')"
            >
              <sofa-icon :customClass="'h-[23px]'" :name="'user'" />
            </sofa-avatar>
          </div>

          <sofa-header-text :size="'xl'">
            {{ UserProfile?.bio.name.full }}
          </sofa-header-text>

          <sofa-normal-text
            :customClass="'text-center'"
            :color="'text-[#78828C]'"
          >
            {{ UserProfile?.bio.description }}
          </sofa-normal-text>
        </div>
      </template>
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToBottom, scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaIconCard,
  SofaCustomInput,
  SofaDeletePrompt,
  SofaEmptyState,
  SofaAvatar,
  SofaButton,
  SofaSuccessPrompt,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import {
  acceptOrRejectTutorRequest,
  addNewChat,
  AllConversations,
  AllTutorRequests,
  chatList,
  ChatMembers,
  contentTitleChanged,
  conversationTitle,
  deleteConvo,
  endChatSession,
  handleKeyEvent,
  hasMessage,
  itIsNewMessage,
  itIsTutorRequest,
  messageContent,
  Messages,
  onInput,
  selectConversation,
  selectedChatData,
  selectedConvoId,
  selectedTutorRequestData,
  sendNewMessage,
  setConversations,
  setConvoFromRoute,
  showAddTutor,
  showDeleteConvo,
  showEndSession,
  showLoader,
  showRateAndReviewTutor,
  SingleConversation,
  tutorRequestList,
} from "@/composables/conversation";
import ConversationMessages from "@/components/conversation/Messages.vue";
import AddTutor from "@/components/conversation/AddTutor.vue";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import ChatListComponent from "@/components/conversation/ChatList.vue";
import RateAndReviewModal from "@/components/common/RateAndReviewModal.vue";

const fetchRules = [
  {
    domain: "Users",
    property: "UserProfile",
    method: "GetUserProfile",
    params: [],
    requireAuth: true,
    ignoreProperty: false,
  },
];

if (Logic.Users.getUserType() == "teacher") {
  fetchRules.push(
    {
      domain: "Users",
      property: "AllTutorRequests",
      method: "GetTutorRequests",
      params: [
        {
          where: [
            {
              field: "userId",
              condition: Conditions.eq,
              value: Logic.Auth.AuthUser?.id,
            },
          ],
        },
        true,
      ],
      requireAuth: true,
      ignoreProperty: true,
    },
    {
      domain: "Conversations",
      property: "AllTutorRequests",
      method: "GetTutorRequests",
      params: [
        {
          where: [
            {
              field: "tutor.id",
              condition: Conditions.eq,
              value: Logic.Auth.AuthUser?.id,
            },
          ],
        },
        true,
      ],
      requireAuth: true,
      ignoreProperty: true,
    }
  );
} else {
  fetchRules.push({
    domain: "Conversations",
    property: "AllConversations",
    method: "GetConversations",
    params: [],
    requireAuth: true,
    ignoreProperty: true,
  });
}

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaIconCard,
    ConversationMessages,
    SofaCustomInput,
    SofaDeletePrompt,
    AddTutor,
    SofaEmptyState,
    SofaAvatar,
    SofaButton,
    SofaSuccessPrompt,
    ChatListComponent,
    RateAndReviewModal,
  },
  middlewares: {
    fetchRules,
  },
  name: "ChatIndexPage",
  setup() {
    useMeta({
      title: "Chat",
    });

    const UserProfile = ref(Logic.Users.UserProfile);
    const SingleTutorRequest = ref(Logic.Users.SingleTutorRequest);
    const currentComponent = ref("dashboard-layout");

    const editTitle = ref(false);
    const showTutorRequestSubmited = ref(false);

    const contentList = [
      {
        icon: "master-subject",
        title: "Master your subjects",
        body: "Ask for answers, explanations, feedback on work, and anything else to help you learn better",
      },
      {
        icon: "study-skill",
        title: "Hone great study skills",
        body: "Get better at time management, planning, scheduling, and many other skills with Dr. Sofa",
      },
      {
        icon: "chat-category",
        title: "Chat categorization",
        body: "Have separate chats for each topic you want to learn under courses, subjects, or study skills",
      },
      {
        icon: "study-material",
        title: "Creating study materials",
        body: "Dr. Sofa can take information you give it to create quizzes or courses for you to study with",
      },
      {
        icon: "personal-learning",
        title: "Personalized learning",
        body: "The more you interact with, and give information to Dr. Sofa, the better it gets at helping you",
      },
      {
        icon: "extra-hand",
        title: "An extra hand",
        body: "Add a tutor to a chat for a while to better help you learn beyond the limits of Dr. Sofa",
      },
    ];

    onMounted(() => {
      if (
        document.getElementById("body") &&
        Logic.Common.mediaQuery() != "sm" &&
        Logic.Common.mediaQuery() != "md"
      ) {
        document.getElementById("body").style["overflowY"] = "hidden";
      }
      Logic.Conversations.watchProperty("AllConversations", AllConversations);
      Logic.Conversations.watchProperty("AllTutorRequests", AllTutorRequests);
      Logic.Conversations.watchProperty(
        "SingleConversation",
        SingleConversation
      );
      Logic.Conversations.watchProperty("Messages", Messages);
      Logic.Users.watchProperty("UserProfile", UserProfile);
      Logic.Conversations.watchProperty("ChatMembers", ChatMembers);

      setConversations();
      setConvoFromRoute();
      scrollToTop();

      if (
        Logic.Users.getUserType() == "teacher" &&
        SingleTutorRequest.value.accepted == false
      ) {
        currentComponent.value = "expanded-layout";
      }
    });

    const newChat = () => {
      if (Messages.value) {
        Messages.value = undefined;
      }

      itIsNewMessage.value = true;
    };

    const handleRequestSent = () => {
      showAddTutor.value = false;
      showTutorRequestSubmited.value = true;
    };

    watch(Messages, () => {
      if (Messages.value?.results.length > 0) {
        hasMessage.value = true;
        setTimeout(() => {
          scrollToBottom("MessagesScrollContainerLg");
        }, 1000);
      } else {
        hasMessage.value = false;
      }
    });

    watch(AllConversations, () => {
      setConversations();

      showDeleteConvo.value = false;
      if (SingleConversation.value?.id == selectedConvoId.value) {
        hasMessage.value = false;
        // set tutor request if it exists
        selectedTutorRequestData.value = undefined;
        tutorRequestList.forEach((item) => {
          if (item.convoId == selectedConvoId.value) {
            selectedTutorRequestData.value = item;
          }
        });
      }
    });

    watch(SingleConversation, () => {
      if (editTitle.value == false) {
        if (SingleConversation.value) {
          conversationTitle.value = SingleConversation.value.title;
        } else {
          conversationTitle.value = "New Chat";
        }
        editTitle.value = false;
      }
    });

    watch(itIsNewMessage, () => {
      if (itIsNewMessage.value) {
        const messageContainer = document.getElementById("messageContainer");
        if (messageContainer) {
          messageContainer.focus();
        }
      }
    });

    onUnmounted(() => {
      if (
        document.getElementById("body") &&
        Logic.Common.mediaQuery() != "sm" &&
        Logic.Common.mediaQuery() != "md"
      ) {
        document.getElementById("body").style["overflowY"] = "auto";
      }
    });

    return {
      moment,
      contentList,
      chatList,
      Logic,
      addNewChat,
      hasMessage,
      SingleConversation,
      Messages,
      AllConversations,
      selectConversation,
      sendNewMessage,
      onInput,
      showLoader,
      showDeleteConvo,
      deleteConvo,
      selectedConvoId,
      showAddTutor,
      handleKeyEvent,
      UserProfile,
      conversationTitle,
      contentTitleChanged,
      itIsNewMessage,
      editTitle,
      SingleTutorRequest,
      currentComponent,
      newChat,
      messageContent,
      showTutorRequestSubmited,
      handleRequestSent,
      selectedChatData,
      itIsTutorRequest,
      tutorRequestList,
      acceptOrRejectTutorRequest,
      selectedTutorRequestData,
      showEndSession,
      showRateAndReviewTutor,
      endChatSession,
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
