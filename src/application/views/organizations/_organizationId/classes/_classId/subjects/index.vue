<template>
	<ClassLayout v-model="classInst" title="Subjects" :primary="showPrimary ? { label: 'Add subject', action: handlePrimary } : undefined">
		<template #default="{ classInst, extras }">
			<ClassesLessonsList v-model:searchQuery="extras.searchQuery" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import ClassesLessonsList from '@app/components/organizations/classes/ClassesLessonsList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'

const classInst = ref<ClassEntity | null>(null)

const { user } = useAuth()

const showPrimary = computed(() => {
	if (!classInst.value || !user.value) return false
	return classInst.value.isStudent(user.value) || classInst.value.isAdmin(user.value)
})

const handlePrimary = () => {
	if (!classInst.value || !user.value) return
	if (classInst.value.isAdmin(user.value)) return useModals().organizations.createLesson.open({ classInst: classInst.value })
	if (classInst.value.isStudent(user.value)) return useModals().organizations.selectLesson.open({ classInst: classInst.value })
}
</script>
