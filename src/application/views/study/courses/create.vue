<template>
	<FullLayout :hide="{ left: true, right: true }">
		<template #middle-session>
			<SofaModal>
				<div class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6">
					<SofaHeading size="title">Create Course</SofaHeading>
					<CourseForm :factory="factory" :submit="createCourse" :cancel="() => $router.replace('/library')" />
				</div>
			</SofaModal>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateCourse } from '@app/composables/study/courses'

export default defineComponent({
	name: 'StudyCoursesCreatePage',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { factory, createCourse } = useCreateCourse()
		return { factory, createCourse }
	},
})
</script>
