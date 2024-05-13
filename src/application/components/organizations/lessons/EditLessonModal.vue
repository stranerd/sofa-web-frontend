<template>
	<LessonForm
		title="Edit course"
		:initialStage="initialStage"
		:classInst="classInst"
		:factory="factory"
		:cancel="close"
		:submit="updateLesson" />
</template>

<script setup lang="ts">
import { ClassEntity, ClassLesson } from '@modules/organizations'
import { useUpdateLesson } from '@app/composables/organizations/lessons'

const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
	initialStage?: 1 | 2
	close: () => void
}>()

const { factory, updateLesson } = useUpdateLesson(props.classInst, props.lesson)
</script>
