<template>
  <router-link :to="chat.route"
    :class="`w-full flex items-center justify-between relative gap-3 p-3 custom-border hover:bg-[#E5F2FD] ${customClass}`"
    exact-active-class="bg-[#E5F2FD]">
    <div class="flex gap-2 w-full">
      <div class="!w-[40px] mdlg:!w-[44px]">
        <sofa-avatar :photoUrl="chat.photoUrl ?? ''"
          :custom-class="'!h-[40px] !w-[40px] mdlg:!h-[44px] mdlg:!w-[44px] !bg-grayColor'">
          <sofa-icon :customClass="'h-[23px]'" :name="'user'" v-if="!chat.photoUrl" />
        </sofa-avatar>
      </div>
      <div class="flex flex-col">
        <sofa-normal-text :customClass="'!font-semibold text-left !line-clamp-1'">
          {{ chat.title }}
        </sofa-normal-text>
        <sofa-normal-text :customClass="'text-left !line-clamp-1'" :color="'text-[#78828C]'">
          {{ chat.lastMessage }}
        </sofa-normal-text>
      </div>
    </div>

    <div class="flex flex-col justify-between items-end">
      <sofa-normal-text :customClass="'text-right !text-[11px] whitespace-nowrap'" :color="'text-[#78828C]'">
        {{ chat.lastMessageTime }}
      </sofa-normal-text>
    </div>
  </router-link>
</template>

<script lang="ts">
import { SofaAvatar, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineComponent } from "vue"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaAvatar,
    SofaIcon,
  },
  props: {
    chat: {
      type: Object as () => {
        route: string,
        title: string,
        lastMessage: string,
        lastMessageTime: string
        photoUrl: string | null
      },
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  setup () {
    return {}
  },
})
</script>
