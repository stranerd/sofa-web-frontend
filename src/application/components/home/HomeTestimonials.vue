<template>
	<div class="w-[90%] max-w-[1800px] md:w-[80%] flex flex-col gap-4 mdlg:gap-16 mx-auto mt-[100px]">
		<h4 class="text-purple font-bold text-[20px] md:text-[36px] md:leading-[54px] text-center capitalize">
			Don’t just take our word for it
		</h4>
		<div class="w-full flex items-center overflow-x-auto gap-8 p-2 md:p-8">
			<div
				v-for="(testimonial, index) in paginatedTestimonials"
				:key="index"
				class="bg-white flex flex-col gap-4 p-8 min-w-[400px] rounded-[20px]"
				style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)">
				<div class="flex items-center gap-2">
					<SofaAvatar :photoUrl="testimonial.image" />
					<div class="flex flex-col gap-1">
						<p class="font-semibold text-[14px]">{{ testimonial.name }}</p>
						<p class="text-[13px]">{{ testimonial.role }}</p>
					</div>
				</div>
				<p class="text-[16px]">{{ testimonial.testimonial }}</p>
				<div class="flex items-center gap-1">
					<SofaIcon v-for="i in testimonial.ratings" :key="i" name="star" class="h-[10px] fill-primaryYellow" />
					<SofaIcon v-for="i in 5 - testimonial.ratings" :key="i" name="star" class="h-[10px] fill-grayColor" />
				</div>
			</div>
		</div>
		<div class="flex justify-center gap-4">
			<button
				v-for="page in pages"
				:key="page"
				:class="{ 'bg-orange-200 p-3 rounded-full w-10 h-10 flex justify-center items-center': currentPage === page }"
				@click="goToPage(page)">
				{{ page + 1 }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
const testimonials = [
	{
		name: 'Joshua Opalele',
		image: '/images/robert.png',
		role: 'Tutor',
		testimonial:
			"I've tried numerous online learning platforms, but none compare to the quality and variety offered here. From interactive quizzes to in-depth courses, I've found everything I need to excel in my studies.",
		ratings: 3,
	},
	{
		name: 'Joshua Opalele',
		image: '/images/robert.png',
		role: 'Tutor',
		testimonial:
			"I've tried numerous online learning platforms, but none compare to the quality and variety offered here. From interactive quizzes to in-depth courses, I've found everything I need to excel in my studies.",
		ratings: 4,
	},
	{
		name: 'Joshua Opalele',
		image: '/images/robert.png',
		role: 'Tutor',
		testimonial:
			"I've tried numerous online learning platforms, but none compare to the quality and variety offered here. From interactive quizzes to in-depth courses, I've found everything I need to excel in my studies.",
		ratings: 5,
	},
	{
		name: 'Joshua Opalele',
		image: '/images/robert.png',
		role: 'Tutor',
		testimonial:
			"I've tried numerous online learning platforms, but none compare to the quality and variety offered here. From interactive quizzes to in-depth courses, I've found everything I need to excel in my studies.",
		ratings: 4,
	},
	{
		name: 'Joshua Opalele',
		image: '/images/robert.png',
		role: 'Tutor',
		testimonial:
			"I've tried numerous online learning platforms, but none compare to the quality and variety offered here. From interactive quizzes to in-depth courses, I've found everything I need to excel in my studies.",
		ratings: 1,
	},
]

const itemsPerPage = 3
const currentPage = ref(0)

const maxPage = computed(() => Math.ceil(testimonials.length / itemsPerPage) - 1)

const paginatedTestimonials = computed(() => {
	const start = currentPage.value * itemsPerPage
	const end = start + itemsPerPage
	return testimonials.slice(start, end)
})

const pages = computed(() => Array.from({ length: maxPage.value + 1 }, (_, i) => i))

const goToPage = (page) => {
	currentPage.value = page
}
</script>
