<template>
	<ClassLessonLayout v-model="lesson">
		<template #default="{}">
			<div>Haahh</div>
			<div>{{ lesson }}</div>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ClassLesson } from '@modules/organizations'

const lesson = ref<ClassLesson | null>(null)
</script>
