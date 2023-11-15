<template>
  <div class="w-full flex flex-col gap-1 relative overflow-y-auto h-full flex-grow">
    <div class="w-full flex flex-row items-center justify-between sticky top-0 left-0 bg-white py-3 z-10">
      <sofa-header-text :customClass="'!font-bold !text-base'">
        Notifications
      </sofa-header-text>
      <sofa-icon :customClass="'h-[19px] cursor-pointer'" :name="'circle-close'" @click="close ? close() : null" />
    </div>
    <div class="w-full flex flex-col gap-3" v-if="AllNotifications.results.length">
      <div :class="`w-full flex flex-row items-start justify-between ${item.seen ? 'opacity-80' : ''
        }`" v-for="(item, index) in AllNotifications.results" :key="index">
        <div class="flex flex-col gap-1">
          <sofa-normal-text :custom-class="'text-left'">
            {{ item.body }}
          </sofa-normal-text>
          <sofa-normal-text :color="'text-[#78828C]'" :customClass="'!text-left'">
            {{ Logic.Common.timeFromNow(item.createdAt) }}
          </sofa-normal-text>
        </div>
        <div class="flex flex-col" v-if="!item.seen">
          <span class="h-[8px] w-[8px] rounded-full bg-primaryBlue"> </span>
        </div>
      </div>
    </div>
    <div v-else class="w-full flex flex-col gap-2 flex-grow items-center justify-center h-full">
      <sofa-icon :name="'empty-notification'" :customClass="'h-[48px]'" />
      <sofa-normal-text :color="'text-[#78828C]'" :customClass="'!text-center'">
        You have no notifications
      </sofa-normal-text>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { Logic, Paginated, Notification } from "sofa-logic"
import SofaIcon from "../SofaIcon"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
  },
  props: {
    close: {
      type: Function,
    },
  },
  setup () {
    const AllNotifications = ref<Paginated<Notification>>(
      Logic.Notifications.AllNotifications
    )

    onMounted(() => {
      // mark all notifications as seen
      Logic.Notifications.ToggleAllNotifications(true)
    })

    return {
      AllNotifications,
      Logic,
    }
  },
})
</script>
