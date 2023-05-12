<template>
  <div class="w-full flex flex-col space-y-5">
    <template v-for="(message, index) in allMessages" :key="index">
      <template v-if="message.type == 'message'">
        <div
          class="w-auto min-w-[80px] flex max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%] flex-row space-x-2 items-end justify-start"
          v-if="message.user.type == 'robot'"
        >
          <div class="w-[30px]">
            <sofa-avatar
              :bgColor="'!bg-[#78828C]'"
              :photoUrl="'/images/icons/robot.svg'"
              :size="'27'"
            >
              <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
            </sofa-avatar>
          </div>
          <div
            class="px-3 py-3 custom-border text-left bg-[#E2F3FD] flex flex-col space-y-1 justify-start"
          >
            <sofa-normal-text
              :customClass="'!font-semibold'"
              :color="'text-[#3296C8]'"
            >
              {{ message.user.name }}
            </sofa-normal-text>
            <sofa-normal-text
              :customClass="'text-left'"
              :isHtml="true"
              :content="message.content"
            ></sofa-normal-text>
          </div>
        </div>

        <div
          class="w-auto min-w-[80px] max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%] flex flex-row space-x-2 items-end justify-start"
          v-if="message.user.type == 'tutor'"
        >
          <div class="w-[30px]">
            <sofa-avatar :bgColor="'!bg-[#78828C]'" :photoUrl="''" :size="'27'">
              <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
            </sofa-avatar>
          </div>
          <div
            class="px-3 py-3 custom-border text-left bg-[#E1F5EB] flex flex-col space-y-1 justify-start"
          >
            <sofa-normal-text
              :customClass="'!font-semibold'"
              :color="'text-[#4BAF7D]'"
            >
              {{ message.user.name }}
            </sofa-normal-text>
            <sofa-normal-text
              :customClass="'text-left'"
              :isHtml="true"
              :content="message.content"
            >
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="min-w-[80px] w-full flex flex-row space-x-2 items-end justify-end py-4"
          v-if="message.user.type == 'user'"
        >
          <div
            class="flex flex-row items-end space-x-2 max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%]"
          >
            <div class="px-3 py-3 custom-border text-left bg-[#E1E6EB]">
              <sofa-normal-text
                :customClass="'text-left'"
                :isHtml="true"
                :content="message.content"
              >
              </sofa-normal-text>
            </div>
            <div class="w-[30px]">
              <sofa-avatar
                :bgColor="'!bg-[#78828C]'"
                :photoUrl="''"
                :size="'27'"
              >
                <sofa-icon :customClass="'h-[16px]'" :name="'user'" />
              </sofa-avatar>
            </div>
          </div>
        </div>
      </template>

      <template v-if="message.type == 'badge'">
        <div class="w-full flex flex-row items-center justify-center">
          <div class="px-4 py-2 custom-border bg-[#F1F6FA] text-center">
            <sofa-normal-text :color="'text-grayColor'">{{
              message.content
            }}</sofa-normal-text>
          </div>
        </div>
      </template>
    </template>
    <div class="h-[30px] mdlg:flex hidden"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import { SofaIcon, SofaAvatar, SofaNormalText } from "sofa-ui-components";

import { Message } from "sofa-logic/src/logic/types/domains/conversations";
import { Paginated } from "sofa-ui-components/src/types/domains/common";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaAvatar,
    SofaNormalText,
  },
  props: {
    Messages: {
      type: Object as () => Paginated<Message>,
    },
  },
  name: "ConversationMessages",
  setup(props) {
    const MessagesRef = toRef(props, "Messages");

    const allMessages = ref<
      {
        type: string;
        user?: {
          name: string;
          photo: string;
          type: string;
        };
        content: string;
        id: string;
      }[]
    >([]);

    const setMessage = () => {
      allMessages.value.length = 0;

      MessagesRef.value.results.forEach((message) => {
        let userType = "";
        let userName = "";
        let photoUrl = "";

        if (message.userId == Logic.Auth.AuthUser.id) {
          userType = "user";
          userName = "User";
          photoUrl = Logic.Auth.AuthUser.photo.link || "";
        } else if (message.userId == "ai-bot") {
          userType = "robot";
          userName = "Dr. Sofa";
          photoUrl = "/images/icons/robot.svg";
        } else {
          userType = "tutor";
          userName = "Tutor";
          photoUrl = "";
        }
        allMessages.value.push({
          content: message.body,
          id: message.id,
          type: "message",
          user: {
            name: userName,
            photo: photoUrl,
            type: userType,
          },
        });
      });

      if (allMessages.value.length == 0) {
        allMessages.value.push({
          content: "Send a message to get started",
          id: "",
          type: "badge",
        });
      }
    };

    watch(MessagesRef, () => {
      setMessage();
    });

    onMounted(() => {
      setMessage();
    });
    return {
      allMessages,
    };
  },
});
</script>
