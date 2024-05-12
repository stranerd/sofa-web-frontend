<template>
	<ClassLessonLayout
		v-model="lesson"
		v-model:classInst="classInst"
		title="Teachers"
		:primary="user && classInst?.isAdmin(user) ? { label: 'Add teacher', action: editLesson } : undefined">
		<template #default="{ classInst: cls, lesson: ls, extras }">
			<LessonsMembersList v-model:searchQuery="extras.searchQuery" :classInst="cls" :lesson="ls" type="teachers" />
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import LessonsMembersList from '@app/components/organizations/lessons/LessonsMembersList.vue'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const classInst = ref<ClassEntity | null>(null)
const lesson = ref<ClassLesson | null>(null)

const { user } = useAuth()

const editLesson = () => {
	if (!classInst.value || !lesson.value) return
	useModals().organizations.editLesson.open({ classInst: classInst.value, lesson: lesson.value, initialStage: 2 })
}
</script>
