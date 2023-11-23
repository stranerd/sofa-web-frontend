<template>
  <div class="w-full h-[80%] flex flex-col items-center gap-2 justify-center">
    <template v-if="state == 'question'">
      <div
        class="group h-full lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full [perspective:1000px] cursor-pointer md:!px-0 px-4">
        <div class="flip-card rounded-xl" @click="showAnswer = !showAnswer" @swiped="handleSwiperAction($event)"
          style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)">
          <div class="flip-card-inner rounded-xl" :style="`${showAnswer ? 'transform: rotateY(180deg);' : ''}`">
            <div class="flip-card-front rounded-xl">
              <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
                <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'" :content="questionRef.question" />
              </div>
            </div>
            <div class="flip-card-back rounded-xl flex flex-col items-center justify-center px-12 text-center">
              <sofa-header-text :customClass="'!font-semibold md:!text-xl text-base w-full'"
                :content="questionRef.answer.replace('----------', ' ')" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="state == 'completed'">
      <sofa-header-text :customClass="'!font-bold md:!text-2xl text-lg'" content="Congratulations!" />
      <sofa-normal-text :color="'text-grayColor'" content="Your have mastered all flashcards" />
    </template>
  </div>
</template>
<script lang="ts">
import { QuizQuestion } from "sofa-logic"
import { SofaHeaderText, SofaNormalText } from "sofa-ui-components"
import { defineComponent, reactive, ref, toRef } from "vue"

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
  setup (props) {
    const questionRef = toRef(props, "questionData")

    const showAnswer = ref(false)

    const question = reactive<QuizQuestion>(
      JSON.parse(JSON.stringify(questionRef.value))
    )

    const handleSwiperAction = (event: any) => {
      if (event.detail.dir == "left") {
        showAnswer.value = false
      }

      if (event.detail.dir == "right") {
        showAnswer.value = true
      }
    }

    return {
      question,
      showAnswer,
      questionRef,
      handleSwiperAction,
    }
  },
})
</script>
<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: white;
}

/* Style the back side */
.flip-card-back {
  background-color: white;
  transform: rotateY(180deg);
}
</style>
