<template>
  <div :class="`w-full col-span-full ${customClass} `">
    <swiper
      :slides-per-view="slidePerView"
      :space-between="spaceBetween"
      @swiper="onSwiper"
      :freeMode="freeMode"
      :modules="modules"
      @slideChange="onSlideChange"
      :class="swiperClass"
      :direction="direction"
      :enabled="enabled"
      :initial-slide="currentSlidePosition"
    >
      <slot />
    </swiper>
    <div
      v-if="showPagination"
      class="w-full pt-3 flex flex-row items-center space-x-1 justify-center"
    >
      <span
        :class="`rounded w-[25px] h-[3px] ${
          activeSlide == index
            ? 'bg-primaryPurple'
            : 'bg-[#B8B8B]  bg-opacity-60'
        }`"
        v-for="(slide, index) in slideCount"
        :key="index"
      >
      </span>
    </div>
  </div>
</template>
<script lang="ts">
// Import Swiper Vue.js components
import { Swiper } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode } from "swiper";
import { ref, toRef, watch } from "vue";

export default {
  components: {
    Swiper,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    slideCount: {
      type: Number,
      default: 3,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    slidePerView: {
      type: String as () => any,
      default: "auto",
    },
    spaceBetween: {
      type: Number,
      default: 15,
    },
    freeMode: {
      type: Boolean,
      default: true,
    },
    swiperClass: {
      type: String,
      default: "pr-6",
    },
    currentSlidePosition: {
      type: Number,
      default: 0,
    },
    direction: {
      type: String as () => "vertical" | "horizontal",
      default: "horizontal",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    baseData: {
      type: Array as () => any[],
      default: [],
    },
  },
  name: "SofaSwiper",
  emits: ["update:modelValue"],
  setup(props: any, context: any) {
    const activeSlide = ref(0);
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    const baseDataRef = toRef(props, "baseData");

    const swiperInstance = ref<any>();
    const onSwiper = (swiper: any) => {
      swiperInstance.value = swiper;
    };
    const onSlideChange = (swiper: any) => {
      activeSlide.value = swiper.activeIndex;

      context.emit("update:modelValue", activeSlide.value);
    };

    const currentSlidePositionRef = toRef(props, "currentSlidePosition");

    watch(currentSlidePositionRef, () => {
      swiperInstance.value.slideTo(currentSlidePositionRef.value);
      swiperInstance.value.update();
    });

    watch(baseDataRef, () => {
      console.log("youi ");
    });

    return {
      onSwiper,
      onSlideChange,
      modules: [FreeMode],
      activeSlide,
      swiperInstance,
    };
  },
};
</script>
