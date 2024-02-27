<template>
	<div class="w-[90%] mdlg:w-[80%] mx-auto border-[6px] border-black rounded-[30px] p-4 md:p-8 my-20 relative">
		<h4 class="text-purple font-bold text-[20px] md:text-[36px] md:leading-[54px] text-center">Frequently Asked Questions</h4>
		<div class="mt-6 overflow-hidden">
			<div class="flex items-center gap-4 overflow-x-auto styled-scrollbar pb-6">
				<button
					v-for="(question, index) in questions"
					:key="index"
					class="border border-[#E6E6E6] font-medium text-[14px] md:text-[24px] leading-[36px] whitespace-nowrap py-2 px-4 rounded-lg"
					:class="activeQuestion === question ? 'bg-purple text-white' : ''"
					@click="activeQuestion = question">
					{{ question.question }}
				</button>
			</div>
			<div class="bg-[#FCA311] rounded-[15px] p-4 md:p-10 mt-8">
				<p class="text-white text-[14px] md:text-[24px] leading-[18px] md:leading-[36px]">{{ activeQuestion.answer }}</p>
			</div>
		</div>
		<div class="absolute left-0 right-0 -bottom-24 md:-bottom-[220px] flex items-center justify-center">
			<img class="w-[96px] h-[116px] md:w-[209px] md:h-[253px]" src="/images/stranerd-rob.png" />
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
const questions = ref([
	{
		question: 'Who is Dr. Stranerd?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'How do i know if a creator is verified?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'Are there costs associated??',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'Who is Dr. Stranerd?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
])

const activeQuestion = ref(questions.value[0])
</script>

<style scoped>
/* Works on Firefox */
.styled-scrollbar {
	scrollbar-width: 64px !important;
	scrollbar-color: #ffffff #e6e6e6 !important;
}

/* Works on Chrome, Edge, and Safari */
.styled-scrollbar::-webkit-scrollbar {
	width: 24px !important;
}

.styled-scrollbar::-webkit-scrollbar-track {
	background: #e6e6e6 !important;
}

.styled-scrollbar::-webkit-scrollbar-thumb {
	background-color: #ffffff !important;
	border-radius: 24px !important;
	border: 3px solid #ffffff !important;
}
</style>
