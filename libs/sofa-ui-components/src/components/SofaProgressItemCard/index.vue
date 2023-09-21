<template>
  <div
    :class="`col-span-1 flex mdlg:!flex-row flex-col mdlg:!space-x-3 px-3 py-3 custom-border bg-white ${customClass}`"
  >
    <div class="w-[110px] mdlg:!flex flex-col hidden">
      <sofa-image-loader
        custom-class="w-[110px] h-[78px] custom-border relative"
        :photo-url="content.image"
      >
      </sofa-image-loader>
    </div>
    <div class="flex flex-col w-full space-y-2">
      <div class="w-full flex flex-row items-center justify-between">
        <sofa-normal-text :customClass="'!font-bold !line-clamp-1'">
          {{ content.title }}
        </sofa-normal-text>
        <sofa-icon
          :customClass="'!h-[5px]'"
          :name="'more-options-horizontal'"
        />
      </div>
      <div class="w-full flex flex-row items-center space-x-3">
        <sofa-normal-text :color="'text-grayColor'">
          {{ content.type }}
        </sofa-normal-text>
        <span :class="`h-[5px] w-[5px] rounded-full bg-grayColor`"> </span>
        <sofa-normal-text :color="'text-grayColor'">
          {{ content.label }}
        </sofa-normal-text>
      </div>

      <div class="w-full pt-2">
        <div
          class="w-full flex flex-col h-[7px] relative bg-[#E1E6EB] rounded-[8px]"
        >
          <div
            class="absolute left-0 top-0 rounded-[8px] h-full bg-[#FFAF4B]"
            :style="`width: ${content.progress}%;`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SofaIcon from "../SofaIcon";
import SofaImageLoader from "../SofaImageLoader";
import { SofaNormalText } from "../SofaTypography";
import SofaBadge from "../SofaBadge";
import SofaButton from "../SofaButton";
import { Logic } from "../../composable";

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
  setup() {
    return {
      Logic,
    };
  },
});
</script>
