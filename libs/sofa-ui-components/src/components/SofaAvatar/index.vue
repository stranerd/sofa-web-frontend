<template>
  <sofa-image-loader
    :photo-url="photoUrl"
    :custom-class="`rounded-full flex text-xs uppercase font-semibold bg-opacity-10 cursor-pointer  ${bgColor} flex-row items-center justify-center ${customClass} `"
    :custom-style="`width: ${size}px; height: ${size}px;`"
    @click.stop="userId ? Logic.Common.GoToRoute(`/profile/${userId}`) : null"
  >
    <template v-if="photoUrl == ''">
      <slot />
    </template>
  </sofa-image-loader>
</template>
<script lang="ts">
import { Logic } from "sofa-logic"
import { defineComponent } from "vue";
import SofaImageLoader from "../SofaImageLoader/index.vue";

export default defineComponent({
  components: {
    SofaImageLoader,
  },
  props: {
    size: {
      type: String,
      default: "50",
    },
    photoUrl: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
  },
  name: "SofaAvatar",
  setup() {
    const randomIndex = Math.floor(Math.random() * 5);

    return {
      randomIndex,
      Logic,
    };
  },
});
</script>
