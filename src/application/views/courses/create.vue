<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateCourse } from '@app/composables/study/courses'

export default defineComponent({
	name: 'CoursesCreate',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: [
			'isAuthenticated',
			async () => {
				const { createCourse } = useCreateCourse()
				const course = await createCourse()
				if (course) return `/courses/${course.id}/edit`
				return '/library'
			},
		],
	},
})
</script>
