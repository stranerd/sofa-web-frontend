<template>
  <div class="w-full flex flex-col space-y-4">
    <div class="w-full flex flex-col space-y-4" v-if="!isExplanation">
      <div
        class="bg-primaryPurple custom-border px-4 py-4 flex flex-col space-y-2"
      >
        <div
          class="flex flex-row items-center justify-start space-x-2"
          v-for="(item, index) in allSteps"
          :key="index"
        >
          <span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
          <sofa-normal-text
            :color="'text-white'"
            :isHtml="true"
            :content="item"
          >
          </sofa-normal-text>
        </div>
      </div>

      <div class="w-full flex flex-row space-x-2 items-center justify-center">
        <sofa-checkbox :customClass="'!w-auto'" v-model="dontShowAgain"
          ><sofa-normal-text :color="'text-grayColor'"
            >Don’t show again</sofa-normal-text
          ></sofa-checkbox
        >
      </div>
    </div>

    <div class="w-full flex flex-col" v-else>
      <sofa-normal-text :customClass="'text-left'" :content="explanation" />
    </div>
    <div
      class="w-full flex mdlg:!flex-row flex-col items-center justify-between mdlg:!relative sticky bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0"
    >
      <sofa-button
        :padding="'px-5 py-2'"
        :bgColor="'bg-white'"
        :textColor="'text-grayColor'"
        :customClass="'border-[1px] border-gray-100 hidden mdlg:!inline-block'"
        @click.prevent="close ? close() : null"
      >
        Exit
      </sofa-button>

      <div class="mdlg:!w-auto w-full flex flex-col">
        <sofa-button
          :padding="'px-5 mdlg:!py-2 py-3'"
          :customClass="'mdlg:!w-auto w-full'"
          @click.prevent="handleNextButton()"
        >
          {{ isExplanation ? "Continue" : "Start" }}
        </sofa-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { SofaNormalText, SofaButton, SofaCheckbox } from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { FormValidations } from "@/composables";

export default defineComponent({
  components: {
    SofaCheckbox,
    SofaNormalText,
    SofaButton,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "flashcards",
    },
    close: {
      type: Function,
    },
    isExplanation: {
      type: Boolean,
      default: false,
    },
    explanation: {
      type: String,
      default: "",
    },
    continueAction: {
      type: Function,
    },
  },
  setup(props) {
    const showAddVideo = ref(false);

    const allSteps = reactive<string[]>([]);

    const dontShowAgain = ref(false);

    const setContent = () => {
      if (props.mode == "flashcard") {
        allSteps.push(
          `<span class="text-white">Click on the card to flip it</span>`,
          `<span class="text-white"><b class="font-semibold">Mastered</b> makes card not reappear</span>`,
          `<span class="text-white"><b class="font-semibold">Show later</b> sends card to end of deck</span>`,
          `<span class="text-white">Both buttons take you to next card</span>`
        );
      } else if (props.mode == "test") {
        allSteps.push(
          `<span class="text-white">Submit before time runs out</span>`,
          `<span class="text-white">Get your result after submitting</span>`,
          `<span class="text-white">See correction for wrong answers</span>`
        );
      }
    };

    watch(dontShowAgain, () => {
      if (dontShowAgain.value) {
        localStorage.setItem(`${props.mode}-info`, "true");
      } else {
        localStorage.removeItem(`${props.mode}-info`);
      }
    });

    onMounted(() => {
      setContent();
    });

    const handleNextButton = () => {
      props.close();
      if (props.isExplanation) {
        props.continueAction();
      } else {
        //
      }
    };

    return {
      Logic,
      FormValidations,
      showAddVideo,
      allSteps,
      dontShowAgain,
      handleNextButton,
    };
  },
});
</script>
