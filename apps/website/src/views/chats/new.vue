<template>
  <ChatLayout title="Chat">
    <ChatContent class="h-full">
      <div class="grid w-full gap-4 py-2 mdlg:!grid-cols-3"
        style="grid-template-columns: repeat(auto-fit, minmax(150px,  1fr))">
        <div class="col-span-1 flex flex-col gap-2 items-center p-3 mdlg:p-5 rounded-2xl bg-fadedPurple"
          v-for="(content, index) in contentList" :key="index">
          <sofa-icon :name="content.icon" :customClass="'h-[39px]'" />
          <sofa-normal-text :customClass="'!font-bold'">{{ content.title }}</sofa-normal-text>
          <sofa-normal-text>{{ content.body }}</sofa-normal-text>
        </div>
      </div>
      <template v-slot:bottom>
        <form @submit.prevent="createConversation"
          class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1">
          <textarea v-model=factory.title
            :class="`w-full resize-none !min-h-[48px] text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto`"
            placeholder="Enter message" />
          <a class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
            <sofa-icon :name="'send'" :customClass="'h-[19px]'" />
          </a>
        </form>
      </template>
    </ChatContent>
  </ChatLayout>
</template>

<script lang="ts">
import ChatContent from "@/components/conversation/ChatContent.vue"
import ChatLayout from "@/components/conversation/ChatLayout.vue"
import { useCreateConversation } from '@/composables/conversations/conversations'
import { SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export const contentList = [
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
]

export default defineComponent({
  components: { ChatLayout, ChatContent, SofaIcon, SofaNormalText },
  middlewares: {
    goBackRoute: "/",
  },
  name: "ChatsNewPage",
  setup () {
    useMeta({
      title: "New Chat",
    })

    const { factory, createConversation } = useCreateConversation()

    return {
      factory,
      createConversation,
      contentList,
    }
  },
})
</script>
