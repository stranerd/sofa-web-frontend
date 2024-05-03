<template>
	<LessonForm title="Create a subject" :classInst="classInst" :factory="factory" :cancel="close" :submit="submit" />
</template>

<script setup lang="ts">
import { ClassEntity } from '@modules/organizations'
import { useCreateLesson } from '@app/composables/organizations/lessons'

const props = defineProps<{
	classInst: ClassEntity
	close: () => void
}>()

const { factory, createLesson } = useCreateLesson(props.classInst.organizationId, props.classInst.id)

const submit = async () => {
	const lesson = await createLesson()
	if (lesson) props.close()
}
</script>
