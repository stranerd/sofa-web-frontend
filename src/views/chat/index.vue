<template>
  <dashboard-layout>
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col"
      >
        <div
          class="w-full flex flex-row items-center justify-start space-x-3 py-3 px-3 cursor-pointer"
          @click="addNewChat()"
        >
          <sofa-icon :name="'box-add-pink'" :custom-class="'h-[17px]'" />
          <sofa-normal-text :color="'text-primaryPink'">
            New chat
          </sofa-normal-text>
        </div>

        <div
          :class="`w-full flex flex-row items-center justify-start space-x-3 px-3 py-3 rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${
            chat.selected ? 'bg-[#E5F2FD]' : ''
          }`"
          v-for="(chat, index) in chatList"
          :key="index"
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
    </template>

    <template v-slot:middle-session>
      <div
        class="w-full mdlg:!shadow-custom relative mdlg:!bg-white bg-transparent mdlg:!rounded-[16px] justify-between mdlg:flex-grow mdlg:h-full flex flex-col space-y-4 mdlg:!space-y-0"
      >
        <div
          class="w-full mdlg:!flex hidden flex-row px-4 py-4 bg-white rounded-t-[16px] sticky top-0 space-x-3 items-center justify-start border-b-[1px] border-[#E1E6EB]"
        >
          <sofa-icon :name="'conversation'" :customClass="'h-[35px]'" />
          <div class="flex flex-col">
            <sofa-custom-input
              :updateValue="
                SingleConversation ? SingleConversation.title : 'New Chat'
              "
              :customClass="'!font-bold w-full flex flex-row justify-start !px-0 !py-0'"
            ></sofa-custom-input>
            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!text-[12px]'"
            >
              You, Dr. Sofa
            </sofa-normal-text>
          </div>
        </div>

        <!-- Small screen new chat -->

        <div class="w-full flex flex-col mdlg:!hidden px-4">
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
        >
          <div class="w-full flex flex-row space-x-2 items-center mdlg:!hidden">
            <sofa-normal-text :customClass="'!font-bold'">
              Recent chats
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide mdlg:scrollbar-default h-auto mdlg:!pb-4 scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin"
            id="MessagesScrollContainerLg"
          >
            <div
              v-if="!hasMessage"
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
              <conversation-messages :Messages="Messages" />
            </div>
          </div>
        </div>

        <!-- Small screen chat list -->

        <div class="w-full flex flex-col mdlg:!hidden px-4 space-y-3 pt-1">
          <div class="w-full flex flex-row space-x-2 items-center mdlg:hidden">
            <sofa-normal-text :customClass="'!font-bold'">
              All chats
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col space-y-3">
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in chatList"
              :key="index"
              :custom-class="'!w-full'"
              @click="Logic.Common.GoToRoute('/chat/' + item.id)"
            >
              <template v-slot:title>
                <div class="w-full flex flex-row items-center space-x-2">
                  <sofa-normal-text
                    :customClass="'!line-clamp-1 font-bold text-left'"
                  >
                    {{ item.title }}
                  </sofa-normal-text>
                </div>
              </template>
            </sofa-icon-card>
          </div>
        </div>

        <div
          class="w-full py-4 border-t-[1px] mdlg:!flex hidden border-[#E1E6EB] sticky bottom-0 px-4 bg-white"
        >
          <div
            class="w-full flex flex-row space-x-2 items-center bg-fadedPurple rounded-[8px] px-1"
          >
            <span
              :contenteditable="true"
              role="textbox"
              :class="`w-full textarea resize-none !min-h-[48px]  focus:outline-none !max-h-[80px] overflow-x-hidden bg-transparent rounded-[8px] py-3 px-3 items-start text-left overflow-y-hidden`"
              placeholder="Enter message"
              id="messageContainer"
              @input="onInput"
            >
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
    </template>

    <template v-slot:right-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-row items-center space-x-3">
          <div
            :style="`background-image: url('/images/icons/robot.svg')`"
            class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"
          ></div>

          <div class="flex flex-col space-y-1">
            <sofa-header-text :customClass="'!text-base !font-bold'"
              >Dr. Sofa</sofa-header-text
            >
            <sofa-normal-text>AI assistant</sofa-normal-text>
          </div>
        </div>
        <div
          class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple"
        >
          <sofa-normal-text :customClass="'text-left'" :color="'text-deepGray'">
            Hello! I am here to respond to your messages in every chat 24/7.
            <br /><br />
            Let us work towards your highest ever academic achievements.
          </sofa-normal-text>
        </div>
      </div>

      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-row items-center justify-start space-x-2">
          <sofa-icon :customClass="'h-[16px]'" :name="'tutor-green'" />
          <sofa-normal-text :color="'text-primaryGreen'">
            Add a tutor
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row items-center justify-start space-x-2">
          <sofa-icon :customClass="'h-[16px]'" :name="'star-outline'" />
          <sofa-normal-text> Starred messages </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row items-center justify-start space-x-2">
          <sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
          <sofa-normal-text :color="'text-primaryRed'">
            Delete chat
          </sofa-normal-text>
        </div>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToBottom, scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaIconCard,
  SofaCustomInput,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import {
  createCoversation,
  onInput,
  sendNewMessage,
} from "@/composables/conversation";
import ConversationMessages from "@/components/conversation/Messages.vue";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaIconCard,
    ConversationMessages,
    SofaCustomInput,
  },
  middlewares: {
    fetchRules: [
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
    ],
  },
  name: "ChatIndexPage",
  setup() {
    useMeta({
      title: "Chat",
    });

    onMounted(() => {
      scrollToTop();
    });

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

    const chatList = reactive<
      {
        title: string;
        selected: boolean;
        subTitle: string;
        icon: string;
        iconSize: string;
        id: string;
      }[]
    >([]);

    const AllConversations = ref(Logic.Conversations.AllConversations);
    const SingleConversation = ref(Logic.Conversations.SingleConversation);
    const Messages = ref(Logic.Conversations.Messages);

    const hasMessage = ref(false);

    const addNewChat = () => {
      createCoversation("Hello I need your help with a question.").then(
        (data) => {
          if (data) {
            if (
              Logic.Common.mediaQuery() != "sm" &&
              Logic.Common.mediaQuery() != "md"
            ) {
              selectConversation(data.id);
            } else {
              Logic.Common.GoToRoute("/chat/" + data.id);
            }
            Logic.Conversations.GetConversations({
              where: [
                {
                  field: "user.id",
                  value: Logic.Auth.AuthUser.id,
                  condition: Conditions.eq,
                },
              ],
            });
          }
        }
      );
    };

    const setConversations = (goToIndex = -1) => {
      chatList.length = 0;
      AllConversations.value.results.forEach((convo, index) => {
        chatList.push({
          icon: "conversation",
          iconSize: "h-[35px]",
          selected: index == goToIndex,
          subTitle: convo.last.body,
          title: convo.title,
          id: convo.id,
        });
      });
    };

    const selectConversation = (convoId: string) => {
      Logic.Common.showLoader({
        loading: true,
        show: true,
        useModal: true,
      });
      Logic.Conversations.GetConversation(convoId).then((response: any) => {
        if (response) {
          Logic.Conversations.GetMessages(convoId).then((responseData: any) => {
            if (responseData) {
              Logic.Common.setupWebsocket();

              setTimeout(() => {
                Logic.Common.listenOnSocket(
                  `conversations/${SingleConversation.value.id}/messages`,
                  (data) => {
                    console.log(data);
                  },
                  (data) => {
                    console.log(data);
                  }
                );
              }, 100);

              if (Messages.value) {
                hasMessage.value = true;
              }

              // scroll to bottom
              setTimeout(() => {
                scrollToBottom("MessagesScrollContainerLg");
              }, 1000);

              Logic.Common.hideLoader();

              chatList.forEach((item) => {
                if (item.id == SingleConversation.value.id) {
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              });
            }
          });
        }
      });
    };

    onMounted(() => {
      if (
        document.getElementById("body") &&
        Logic.Common.mediaQuery() != "sm" &&
        Logic.Common.mediaQuery() != "md"
      ) {
        document.getElementById("body").style["overflowY"] = "hidden";
      }

      Logic.Conversations.watchProperty("AllConversations", AllConversations);
      Logic.Conversations.watchProperty(
        "SingleConversation",
        SingleConversation
      );
      Logic.Conversations.watchProperty("Messages", Messages);

      setConversations();
    });

    watch(Messages, () => {
      if (Messages.value.results.length > 0) {
        hasMessage.value = true;
      }
      setTimeout(() => {
        scrollToBottom("MessagesScrollContainerLg");
      }, 1000);
    });

    watch(AllConversations, () => {
      setConversations();
    });

    watch(SingleConversation, () => {
      //
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
