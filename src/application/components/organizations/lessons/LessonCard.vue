<template>
	<div class="bg-lightGray px-5 py-4 rounded-custom cursor-pointer">
		<SofaHeaderText>{{ lesson.title }}</SofaHeaderText>
		<div class="flex items-center gap-1">
			<SofaNormalText color="text-grayColor">{{ lesson.teachers.length }}</SofaNormalText>
			<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor"></div>
			<SofaNormalText color="text-grayColor">{{ lesson.students.length }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	lesson: {
		type: Object as any,
		required: true,
	},
})
</script>
