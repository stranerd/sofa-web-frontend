<template>
	<ClassLayout title="Subjects">
		<template #default="{ classInst, extras }">
			<ClassesLessonsList v-model:searchQuery="extras.searchQuery" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import ClassesLessonsList from '@app/components/organizations/classes/ClassesLessonsList.vue'
</script>
