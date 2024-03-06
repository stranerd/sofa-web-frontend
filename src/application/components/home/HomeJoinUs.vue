<template>
	<div
		class="rounded-[30px] min-h-[400px] md:h-[400px] flex items-center py-8 justify-center text-white max-w-[1800px]"
		:class="isContactPage ? 'bg-purple' : 'bg-[#FCA311]'">
		<div class="w-[75%] mx-auto flex flex-col items-center justify-center gap-4 text-center">
			<h3 class="text-[20px] md:text-[36px] font-bold">Join Us in Transforming Education</h3>
			<p class="text-[16px]">
				Whether you're a learning center looking to enhance your teaching capabilities or an educator passionate about making a
				difference, we invite you to join us on our journey to transform education. Together, we can shape the future of learning
				and unlock the potential of every learner.
			</p>
			<RouterLink to="/auth/signup" class="py-[10px] px-[30px] h-[44px] rounded-[22px] bg-white text-black">Sign Up Today</RouterLink>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	isContactPage: {
		type: Boolean,
		default: false,
	},
})
</script>
