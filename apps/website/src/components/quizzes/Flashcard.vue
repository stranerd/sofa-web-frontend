<template>
  <div
    class="w-full h-[80%] flex flex-col items-center space-y-2 justify-center"
  >
    <template v-if="state == 'question'">
      <div
        class="group h-full lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full [perspective:1000px] cursor-pointer md:!px-0 px-4"
      >
        <div
          @click="showAnswer ? (showAnswer = false) : (showAnswer = true)"
          :class="`relative h-full w-full rounded-xl transition-all duration-500 bg-white [transform-style:preserve-3d]   ${
            showAnswer ? '[transform:rotateY(180deg)]' : ''
          } `"
          style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)"
        >
          <div
            class="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <sofa-header-text
              :customClass="'!font-bold md:!text-2xl text-lg'"
              >{{ question.question }}</sofa-header-text
            >
          </div>
          <div
            class="absolute inset-0 h-full w-full rounded-xl bg-white 0 flex flex-col items-center justify-center px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]"
          >
            <sofa-header-text
              :customClass="'!font-semibold md:!text-xl text-base'"
              >{{ question.answer }}</sofa-header-text
            >
          </div>
        </div>
      </div>
    </template>
    <template v-if="state == 'completed'">
      <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'"
        >Congratulations!</sofa-header-text
      >
      <sofa-normal-text :color="'text-grayColor'"
        >Your have mastered all flashcards</sofa-normal-text
      >
    </template>
  </div>
</template>
<script lang="ts">
import { QuizQuestion } from "sofa-logic/src/logic/types/domains/study";
import { defineComponent, onMounted, reactive, ref, toRef } from "vue";
import { SofaHeaderText, SofaNormalText } from "sofa-ui-components";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaNormalText,
  },
  props: {
    questionData: {
      type: Object as () => QuizQuestion,
    },
    state: {
      type: String,
      default: "preview",
    },
    mode: {
      type: String,
      default: "preview",
    },
  },
  setup(props) {
    const questionRef = toRef(props, "questionData");

    const showAnswer = ref(false);

    const question = reactive<QuizQuestion>(
      JSON.parse(JSON.stringify(questionRef.value))
    );

    const setAnswer = () => {
      //   console.log(question);
    };

    onMounted(() => {
      setAnswer();
    });

    return {
      question,
      showAnswer,
    };
  },
});
</script>
