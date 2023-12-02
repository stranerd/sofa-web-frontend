<template>
  <div :class="`col-span-1 flex gap-3 p-3 rounded-custom bg-white ${customClass}`">
    <div class="w-[110px] flex flex-col">
      <sofa-image-loader custom-class="w-[110px] h-[78px] mdlg:h-[80px] rounded-custom relative"
        :photo-url="content.image">
      </sofa-image-loader>
    </div>
    <div class="flex flex-col w-full gap-2">
      <div class="w-full flex items-center justify-between">
        <sofa-normal-text :customClass="'!font-bold !line-clamp-1'">
          {{ content.title }}
        </sofa-normal-text>
      </div>
      <div class="w-full flex flex-row items-center gap-3">
        <sofa-normal-text :color="'text-grayColor'" custom-class="capitalize">
          {{ content.type }}
        </sofa-normal-text>
      </div>

      <div class="w-full flex items-center justify-between">
        <sofa-normal-text :color="content.label_color" :customClass="'font-semibold'">
          {{ content.label }}
        </sofa-normal-text>
        <div class="flex flex-row items-center gap-2" v-if="content.type == 'game'">
          <sofa-normal-text :color="'text-grayColor'">
            {{ content.participants }}
          </sofa-normal-text>
          <sofa-icon :name="'participant'" :customClass="'h-[15px]'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Logic } from "sofa-logic"
import { defineComponent } from "vue"
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
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    content: {
      type: Object as () => any,
    },
  },
  name: "SofaProgressItemCard",
  setup () {
    return {
      Logic,
    }
  },
})
</script>
