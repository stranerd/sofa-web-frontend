<template>
	<div class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6">
		<SofaHeading size="title" class="hidden mdlg:flex">Update Course</SofaHeading>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden">
			<SofaHeading>Update Course</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<CourseForm
			v-if="course"
			:course="course"
			:factory="factory"
			:cancel="close"
			:submit="updateCourse"
			:publish="!course.isPublished ? publishCourse : undefined" />
	</div>
</template>

<script lang="ts" setup>
import { useEditCourse } from '@app/composables/study/courses'
import { CourseEntity } from '@modules/study'

const props = defineProps<{
	close: () => void
	course: CourseEntity
}>()

const { course, factory, updateCourse, publishCourse } = useEditCourse(props.course.id)
</script>
