<template>
	<div class="w-full mx-auto p-4 md:p-8 my-20 relative max-w-[1800px] bg-blue-100">
		<h4 class="text-purple font-bold text-[25px] md:text-[36px] md:leading-[54px] text-center">Frequently Asked Questions</h4>
		<p class="text-center text-grayColor mt-4">
			To assist you, we have compiled a list of frequently asked questions (FAQs) below. If you cannot find the information you’re
			looking for or have additional questions, please don’t hesitate to contact our customer support team. We’re here to help!
		</p>
		<div class="mt-4">
			<div class="flex items-start gap-4 flex-col w-full p-6">
				<div
					v-for="(question, index) in questions"
					:key="question.question"
					class="bg-white w-full p-4 rounded-lg flex flex-col cursor-pointer">
					<div
						class="flex items-center justify-between font-medium text-[15px] md:text-[20px]"
						@click="activeQuestion = activeQuestion === index ? null : index">
						{{ question.question }}
						<SofaIcon name="arrow-down-2" />
					</div>
					<div v-if="activeQuestion === index" class="mt-2 max-w-full h-fit text-grayColor text-base">
						{{ question.answer }}
					</div>
				</div>
			</div>
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
		question: 'Are there costs associated?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'How can I register with  Stranerd?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'Stranerd ambassadors',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
	{
		question: 'What is stranerd?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis similique molestias ex quae corrupti rem, ducimus cum necessitatibus minus laborum sint numquam praesentium, accusantium fugit, ratione eaque quam explicabo at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut minima ducimus, aliquid a neque autem enim architecto doloremque voluptatem facere. Repellat doloremque cum fuga eaque quia reiciendis iure officiis iusto.',
	},
])

const activeQuestion = ref(questions.value[0])
</script>

<style scoped></style>
