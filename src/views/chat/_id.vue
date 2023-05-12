<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-between absolute">
      <div
        class="w-full flex flex-row space-x-2 items-center justify-between px-4 py-4 sticky top-0"
      >
        <div class="flex flex-row space-x-3 items-center">
          <div class="w-[28px]">
            <sofa-icon
              :customClass="'h-[15px]'"
              :name="'back-arrow'"
              @click="Logic.Common.goBack()"
            />
          </div>
          <div class="flex flex-col">
            <sofa-normal-text
              :customClass="'!font-bold w-full flex flex-row justify-start !text-sm text-left !line-clamp-1'"
              >{{ SingleConversation.title }}</sofa-normal-text
            >
            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!text-[12px]'"
            >
              You, Dr. Sofa
            </sofa-normal-text>
          </div>
        </div>

        <div class="space-x-3 flex flex-row items-center">
          <sofa-icon :customClass="'h-[19px] '" :name="'tutor-black'" />
          <sofa-icon :customClass="'h-[23px]'" :name="'menu'" />
        </div>
      </div>

      <div
        class="w-full h-full flex flex-grow bg-white flex-col space-y-5 overflow-y-auto px-4 py-6"
        id="MessagesScrollContainer"
      >
        <conversation-messages :Messages="Messages" />
      </div>

      <div class="w-full py-4 mdlg:!flex sticky bottom-0 px-4 bg-white">
        <div
          class="w-full flex flex-row space-x-2 items-center bg-fadedPurple rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] px-1"
        >
          <span
            :contenteditable="true"
            role="textbox"
            :class="`w-full textarea resize-none !min-h-[48px] whitespace-pre-wrap focus:outline-none !max-h-[80px] overflow-x-hidden bg-transparent rounded-[8px] py-3 px-3 items-start text-left overflow-y-auto`"
            placeholder="Enter message"
            id="messageContainer"
            @input="onInput"
          >
          </span>
          <span class="min-w-[45px]">
            <span
              class="h-[40px] w-[40px] flex items-center justify-center"
              @click="sendNewMessage()"
            >
              <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
            </span>
          </span>
        </div>
      </div>
    </div>
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import { scrollToBottom, scrollToTop } from "@/composables";
import { SofaIcon, SofaNormalText } from "sofa-ui-components";
import { Logic } from "sofa-logic";
import ConversationMessages from "@/components/conversation/Messages.vue";
import {
  messageContent,
  onInput,
  sendNewMessage,
} from "@/composables/conversation";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    ConversationMessages,
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
    ],
  },
  name: "ChatArenaPage",
  setup() {
    useMeta({
      title: "Chat",
    });

    const SingleConversation = ref(Logic.Conversations.SingleConversation);
    const Messages = ref(Logic.Conversations.Messages);

    onMounted(() => {
      scrollToTop();
      Logic.Common.setupWebsocket();

      setTimeout(() => {
        Logic.Common.listenOnSocket(
          `conversations/${Logic.Conversations.SingleConversation.id}/messages`,
          (data) => {
            console.log(data);
          },
          (data) => {
            console.log(data);
          }
        );
      }, 100);

      Logic.Conversations.watchProperty("Messages", Messages);
      setTimeout(() => {
        scrollToBottom("MessagesScrollContainer");
      }, 1000);
    });

    watch(Messages, () => {
      //

      setTimeout(() => {
        scrollToBottom("MessagesScrollContainer");
      }, 1000);
    });

    return {
      Logic,
      SingleConversation,
      Messages,
      onInput,
      messageContent,
      sendNewMessage,
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
