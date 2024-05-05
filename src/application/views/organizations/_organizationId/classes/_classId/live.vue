<template>
	<ClassLayout
		v-model="classInst"
		title="Live"
		rounded
		:primary="user && (classInst?.isAdmin(user) || classInst?.isTeacher(user)) ? { label: 'Add live', action: addLive } : undefined">
		<template #default="{ classInst: cls, extras }">
			<ClassesLive v-model:searchQuery="extras.searchQuery" :classInst="cls" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import ClassesLive from '@app/components/organizations/classes/ClassesLive.vue'
import { ClassEntity } from '@modules/organizations'

const { user } = useAuth()
const classInst = ref<ClassEntity | null>(null)

const addLive = () => {
	if (!classInst.value) return
	useModals().organizations.createSchedule.open({ classInst: classInst.value })
}
</script>
