<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-between absolute">
      <div
        class="w-full flex flex-row space-x-2 items-center justify-between px-4 py-4 sticky top-0 z-[899989879878]"
      >
        <div class="flex flex-row space-x-3 items-center">
          <div class="w-[28px]">
            <sofa-icon
              :customClass="'h-[15px]'"
              :name="'back-arrow'"
              @click="
                hasMessage = false;
                Logic.Common.goBack();
              "
            />
          </div>
          <div class="flex flex-col">
            <sofa-custom-input
              :updateValue="conversationTitle"
              :customClass="'!font-bold w-full flex flex-row justify-start !text-sm text-left !px-0 !py-0'"
              @onContentChange="contentTitleChanged"
              @onBlur="editTitle = false"
              :autoFocus="true"
              v-if="editTitle"
            ></sofa-custom-input>
            <sofa-normal-text
              v-else
              :customClass="'!font-bold w-full flex flex-row justify-start !text-sm text-left !line-clamp-1'"
              @click="editTitle = true"
              >{{ SingleConversation.title }}</sofa-normal-text
            >
            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!text-[12px]'"
            >
              You, {{ UserProfile.ai.name || "Dr. Sofa" }}
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="space-x-3 flex flex-row items-center min-w-[60px] justify-end"
        >
          <sofa-icon
            :customClass="'h-[17px] '"
            :name="'tutor-black'"
            @click="showAddTutor = true"
          />
          <sofa-icon
            :customClass="'h-[23px]'"
            :name="'menu'"
            @click="showMoreOptions = true"
          />
        </div>
      </div>

      <div
        class="w-full h-full flex flex-grow bg-white flex-col space-y-5 overflow-y-auto px-4 py-6"
        id="MessagesScrollContainer"
      >
        <conversation-messages :Messages="Messages" :ShowLoader="showLoader" />
      </div>

      <div class="w-full py-4 mdlg:!flex fixed left-0 bottom-0 px-4 bg-white">
        <div
          class="w-full flex flex-row space-x-2 items-center bg-fadedPurple rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] px-1"
        >
          <span
            :contenteditable="true"
            role="textbox"
            :class="`w-full textarea resize-none !min-h-[48px] text-bodyBlack whitespace-pre-wrap focus:outline-none !max-h-[80px] overflow-x-hidden bg-transparent rounded-[8px] py-3 px-3 items-start text-left overflow-y-auto`"
            placeholder="Enter message"
            id="messageContainer"
            @input="onInput"
          >
          </span>
          <span class="min-w-[45px]">
            <span
              class="h-[40px] w-[40px] flex items-center justify-center"
              @click="sendNewMessage(undefined)"
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
    />

    <!-- More options for smaller screens -->
    <sofa-modal
      :close="
        () => {
          showMoreOptions = false;
        }
      "
      v-if="showMoreOptions"
      :customClass="`mdlg:!hidden `"
    >
      <div
        :class="` w-full top-0 px-0 pt-0 h-full flex flex-col  `"
        @click.stop="
          () => {
            showMoreOptions = false;
          }
        "
      >
        <div
          @click.stop="
            () => {
              //
            }
          "
          class="w-[80%] md:!w-[60%] flex flex-col bg-white left-[20%] md:!left-[40%] space-y-4 py-3 relative overflow-y-auto h-full"
        >
          <div
            class="w-full flex flex-row items-center justify-start top-0 left-0 sticky bg-white z-30 space-x-3 py-3 px-4 cursor-pointer"
            @click="addNewChat()"
          >
            <sofa-icon :name="'box-add-pink'" :custom-class="'h-[17px]'" />
            <sofa-normal-text :color="'text-primaryPink'">
              New chat
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col space-y-2">
            <div
              :class="`w-full flex flex-row items-center justify-start relative space-x-3 px-4 py-3  hover:bg-[#E5F2FD] cursor-pointer ${
                chat.selected ? 'bg-[#E5F2FD]' : ''
              }`"
              v-for="(chat, index) in chatList"
              :key="index"
              @mouseenter="chat.hover = true"
              @mouseleave="chat.hover = false"
              @click="selectConversation(chat.id)"
            >
              <span>
                <sofa-icon :name="'conversation'" :custom-class="'h-[20px]'"
              /></span>

              <sofa-normal-text
                :custom-class="` !line-clamp-1 text-left ${
                  chat.selected ? '!font-bold' : ''
                }`"
              >
                {{ chat.title.substring(0, 36) }}
              </sofa-normal-text>
            </div>
          </div>

          <div
            class="absolute w-full bottom-0 left-0 bg-white z-50 px-4 py-4 b border-t-[1px] border-[#F1F6FA] flex flex-col space-y-4"
          >
            <div
              class="w-full flex flex-row items-center justify-start space-x-2 cursor-pointer"
              @click="
                showMoreOptions = false;
                showAddTutor = true;
              "
            >
              <sofa-icon :customClass="'h-[16px]'" :name="'tutor-green'" />
              <sofa-normal-text :color="'text-primaryGreen'">
                Add a tutor
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row items-center justify-start space-x-2 cursor-pointer"
            >
              <sofa-icon :customClass="'h-[16px]'" :name="'star-outline'" />
              <sofa-normal-text> Starred messages </sofa-normal-text>
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
        </div>
      </div>
    </sofa-modal>
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import { scrollToBottom, scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaModal,
  SofaCustomInput,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import ConversationMessages from "@/components/conversation/Messages.vue";
import {
  addNewChat,
  AllConversations,
  chatList,
  contentTitleChanged,
  conversationTitle,
  handleIncomingMessage,
  handleKeyEvent,
  hasMessage,
  messageContent,
  onInput,
  selectConversation,
  selectedConvoId,
  sendNewMessage,
  setConversations,
  showAddTutor,
  showDeleteConvo,
  showLoader,
  showMoreOptions,
} from "@/composables/conversation";
import AddTutor from "@/components/conversation/AddTutor.vue";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    ConversationMessages,
    AddTutor,
    SofaModal,
    SofaCustomInput,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Conversations",
        property: "SingleConversation",
        method: "GetConversation",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
        requireAuth: true,
      },
      {
        domain: "Conversations",
        property: "Messages",
        method: "GetMessages",
        params: [],
        useRouteId: true,
        requireAuth: true,
        ignoreProperty: true,
      },
      {
        domain: "Conversations",
        property: "AllConversations",
        method: "GetConversations",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
      },
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
        requireAuth: true,
      },
    ],
    goBackRoute: "/chat",
  },
  name: "ChatArenaPage",
  setup() {
    useMeta({
      title: "Chat",
    });

    const editTitle = ref(false);

    const SingleConversation = ref(Logic.Conversations.SingleConversation);
    const Messages = ref(Logic.Conversations.Messages);

    const UserProfile = ref(Logic.Users.UserProfile);

    const connectWebsocket = () => {
      Logic.Common.setupWebsocket();

      Logic.Common.listenOnSocket(
        `conversations/${Logic.Conversations.SingleConversation.id}/messages`,
        (data) => {
          handleIncomingMessage(data);
        },
        (data) => {
          console.log(data);
        }
      );

      setTimeout(() => {
        scrollToBottom("MessagesScrollContainer");
      }, 500);
    };

    onMounted(() => {
      scrollToTop();
      connectWebsocket();
      Logic.Conversations.watchProperty("AllConversations", AllConversations);
      Logic.Conversations.watchProperty(
        "SingleConversation",
        SingleConversation
      );
      Logic.Users.watchProperty("UserProfile", UserProfile);
      Logic.Conversations.watchProperty("Messages", Messages);

      conversationTitle.value = SingleConversation.value.title;

      setConversations();

      chatList.forEach((chat) => {
        if (chat.id == SingleConversation.value.id) {
          chat.selected = true;
        }
      });
    });

    watch(Messages, () => {
      //
      setTimeout(() => {
        scrollToBottom("MessagesScrollContainer");
      }, 500);
    });

    watch(SingleConversation, () => {
      chatList.forEach((chat) => {
        if (chat.id == SingleConversation.value.id) {
          chat.selected = true;
        } else {
          chat.selected = false;
        }
      });
      connectWebsocket();

      if (editTitle.value == false) {
        if (SingleConversation.value) {
          conversationTitle.value = SingleConversation.value.title;
        } else {
          conversationTitle.value = "New Chat";
        }
        editTitle.value = false;
      }
    });

    return {
      Logic,
      SingleConversation,
      Messages,
      onInput,
      messageContent,
      sendNewMessage,
      showLoader,
      showAddTutor,
      showMoreOptions,
      chatList,
      showDeleteConvo,
      selectConversation,
      selectedConvoId,
      addNewChat,
      hasMessage,
      handleKeyEvent,
      UserProfile,
      conversationTitle,
      contentTitleChanged,
      editTitle,
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
