<template>
  <div
    :class="`w-full flex flex-row items-center justify-between relative space-x-3 px-3 py-3  custom-border hover:bg-[#E5F2FD] cursor-pointer ${
      chat.selected ? 'bg-[#E5F2FD]' : ''
    }  ${customClass}`"
  >
    <div class="flex flex-row space-x-2 w-full">
      <div class="!w-[40px] mdlg:!w-[44px]">
        <sofa-avatar
          :photoUrl="chat.photoUrl"
          :custom-class="'!h-[40px] !w-[40px] mdlg:!h-[44px] mdlg:!w-[44px] !bg-grayColor'"
        >
          <sofa-icon
            :customClass="'h-[23px]'"
            :name="'user'"
            v-if="!chat.photoUrl"
          />
        </sofa-avatar>
      </div>
      <div class="flex flex-col">
        <sofa-normal-text
          :customClass="'!font-semibold text-left !line-clamp-1'"
        >
          {{ chat.title }}
        </sofa-normal-text>
        <sofa-normal-text
          :customClass="'text-left !line-clamp-1'"
          :color="'text-[#78828C]'"
        >
          {{ chat.lastMessage }}
        </sofa-normal-text>
      </div>
    </div>

    <div class="flex flex-col justify-between items-end">
      <sofa-normal-text
        :customClass="'text-right !text-[11px]'"
        :color="'text-[#78828C]'"
      >
        {{ chat.lastMessageTime }}
      </sofa-normal-text>
      <div class="invisible">Hello</div>
    </div>

    <!-- <sofa-normal-text
      :custom-class="` !line-clamp-1 text-left ${
        chat.selected ? '!font-bold' : ''
      }`"
    >
      {{ chat.title.substring(0, 36) }}
    </sofa-normal-text>
    <div
      v-if="chat.hover"
      class="right-0 top-0 absolute h-full bg-[#E5F2FD] rounded-r-[8px] px-4 flex flex-row items-center space-x-2"
    >
      <sofa-icon
        :customClass="'h-[15px] cursor-pointer'"
        :name="'trash-gray'"
        @click.stop="
          showDeleteConvo = true;
          selectedConvoId = chat.id;
        "
      />
    </div> -->
  </div>
</template>
<script lang="ts">
import { ChatListData } from "@/composables/conversation";
import { defineComponent } from "vue";
import { SofaNormalText, SofaAvatar } from "sofa-ui-components";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaAvatar,
  },
  props: {
    chat: {
      type: Object as () => ChatListData,
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>
