<template>
  <div
    :class="`col-span-1  flex flex-row items-center shadow-custom gap-3 px-3 py-3 custom-border bg-white ${customClass}`">
    <div class="w-[65px]">
      <sofa-avatar :photoUrl="user.profile_image" :size="'65'" :customClass="'relative'">
        <span v-if="user.status" :class="`w-[12px] h-[12px] border-[2px] border-white absolute bottom-0 right-0 rounded-full ${user.status == 'online' ? 'bg-primaryGreen' : 'bg-grayColor'
          }`">
        </span>
      </sofa-avatar>
    </div>
    <div class="w-full flex flex-col gap-1">
      <div class="w-full flex flex-row gap-2 items-center flex-nowrap">
        <sofa-normal-text :customClass="'!font-bold'">
          {{ user.name }}
        </sofa-normal-text>
        <span class="flex flex-row items-center gap-1" v-if="user.icons">
          <sofa-icon v-for="(icon, index) in user.icons" :key="index"
            :customClass="icon == 'verify' ? 'h-[16px]' : 'h-[18px]'" :name="icon" />
        </span>
      </div>
      <sofa-normal-text :customClass="'w-full flex flex-row text-left !line-clamp-1'"
        :color="user.ratings ? 'text-bodyBlack' : 'text-grayColor'">
        {{ user.subTitle }}
      </sofa-normal-text>
      <div class="w-full flex flex-row gap-2 items-center" v-if="user.ratings">
        <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

        <div class="flex flex-row gap-1 items-center">
          <sofa-normal-text> {{ user.ratings.total }} </sofa-normal-text>
          <sofa-normal-text :color="'text-grayColor'">
            {{ user.ratings.label }}
          </sofa-normal-text>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { Logic } from "../../composable"
import SofaAvatar from "../SofaAvatar"
import SofaBadge from "../SofaBadge"
import SofaButton from "../SofaButton"
import SofaIcon from "../SofaIcon"
import SofaImageLoader from "../SofaImageLoader"
import { SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaImageLoader,
    SofaNormalText,
    SofaBadge,
    SofaButton,
    SofaAvatar,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    user: {
      type: Object as () => any,
    },
  },
  name: "SofaUserCard",
  setup () {
    return {
      Logic,
    }
  },
})
</script>
