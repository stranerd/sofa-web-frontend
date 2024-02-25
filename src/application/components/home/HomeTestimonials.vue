<template>
	<div class="w-[90%] md:w-[80%] flex flex-col gap-4 mdlg:gap-16 mx-auto">
		<h4 class="text-purple font-bold text-[20px] md:text-[36px] leading-[54px] text-center capitalize">
			Don’t just take our word for it
		</h4>
		<div class="w-full flex items-center overflow-x-hidden gap-8 p-2 md:p-8">
			<div
				v-for="(testimonial, index) in testimonials"
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
					<SofaIcon v-for="i in testimonial.ratings" :key="i" name="star-full" class="h-[10px]" />
					<SofaIcon v-for="i in 5 - testimonial.ratings" :key="i" name="star" class="h-[10px]" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
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
</script>
