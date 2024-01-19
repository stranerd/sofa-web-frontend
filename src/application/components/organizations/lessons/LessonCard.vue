<template>
	<div class="bg-lightGray px-5 py-4 rounded-custom cursor-pointer flex items-center justify-between">
		<div>
			<SofaHeaderText>{{ lesson.title }}</SofaHeaderText>
			<div class="flex items-center gap-1">
				<SofaNormalText color="text-grayColor">
					{{ lesson.teachers.length }} {{ lesson.teachers.length > 1 ? 'teachers' : 'teacher' }}</SofaNormalText
				>
				<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor"></div>
				<SofaNormalText v-if="!isStudent" color="text-grayColor">
					{{ lesson.users.students.length }} {{ lesson.users.students.length > 1 ? 'students' : 'student' }}
				</SofaNormalText>
				<SofaNormalText v-else color="text-grayColor">
					{{ '1 resources' }}
				</SofaNormalText>
			</div>
		</div>
		<div v-if="isStudent" @click.stop>
			<SofaCheckbox v-model="lesson.selected" />
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	lesson: {
		type: Object as any,
		required: true,
	},
	isStudent: {
		type: Boolean,
		required: true,
		default: false,
	},
})
</script>
