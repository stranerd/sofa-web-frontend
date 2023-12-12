<template>
  <SofaImageLoader :photo-url="photoUrl"
    :custom-class="`rounded-full flex text-xs uppercase font-semibold bg-opacity-10 cursor-pointer ${bgColor} items-center justify-center ${customClass}`"
    :custom-style="`width: ${size}px; height: ${size}px;`"
    @click.stop.prevent="userId ? Logic.Common.GoToRoute(`/profile/${userId}`) : null">
    <template v-if="!photoUrl">
      <slot>
        <SofaIcon class="w-1/2 h-1/2" name="user" />
      </slot>
    </template>
    <span v-if="showOnline" class="h-[5px] w-[5px] absolute bottom-0 right-0 rounded-full"
      :class="online ? 'bg-primaryGreen' : 'bg-grayColor'" />
  </SofaImageLoader>
</template>

<script lang="ts">
import { Logic } from "sofa-logic"
import { defineComponent } from "vue"
import SofaImageLoader from "../SofaImageLoader/index.vue"
import SofaIcon from '../SofaIcon'

export default defineComponent({
  components: {
    SofaImageLoader,
    SofaIcon,
  },
  props: {
    size: {
      type: String,
      default: "50",
    },
    photoUrl: {
      type: String,
      required: false,
      default: '',
    },
    customClass: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "bg-grayColor",
    },
    userId: {
      type: String,
      default: "",
    },
    showOnline: {
      type: Boolean,
      default: false,
      required: false
    },
    online: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  name: "SofaAvatar",
  setup () {
    const randomIndex = Math.floor(Math.random() * 5)

    return {
      randomIndex,
      Logic,
    }
  },
})
</script>
