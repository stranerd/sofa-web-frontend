<template>
	<PlayRun
		:playId="testId"
		:type="PlayTypes.tests"
		:access="{ organizationId: classInst.organizationId, classId: classInst.id, lessonId: lesson.id }" />
</template>

<script setup lang="ts">
import { ClassEntity, ClassLesson } from '@modules/organizations'
import { PlayTypes } from '@modules/plays'

defineProps<{
	quizId: string
	testId: string
	classInst: ClassEntity
	lesson: ClassLesson
}>()
</script>
