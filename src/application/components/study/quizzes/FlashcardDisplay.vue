<template>
	<div class="w-full h-[90%] my-auto flex flex-col items-center gap-2 justify-center [perspective:1000px] md:px-0 px-4">
		<a class="flip-card scrollbar-hide rounded-xl shadow-custom" @click="showAnswer = !showAnswer">
			<div class="flip-card-inner scrollbar-hide rounded-xl" :style="showAnswer ? 'transform: rotateY(180deg);' : ''">
				<div class="flip-card-front">
					<SofaText size="mid" :content="question.content" class="m-auto" />
				</div>
				<div class="flip-card-back">
					<SofaText size="mid" :content="question.answer" class="m-auto" />
				</div>
			</div>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { QuestionEntity } from '@modules/study'

defineProps<{
	question: QuestionEntity
	isDark: boolean
}>()

const showAnswer = ref(false)
</script>

<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
	width: 100%;
	height: 100%;
	perspective: 1000px;
	overflow: hidden;
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
	background-color: white;
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 1.5rem;
	overflow: auto;
	-webkit-backface-visibility: hidden;
	/* Safari */
	backface-visibility: hidden;
}

/* Style the back side */
.flip-card-back {
	transform: rotateY(180deg);
}
</style>
