<template>
	<ClassLessonLayout>
		<template #default="{ classInst, lesson, extras }">
			<LessonsMembersList v-model:searchQuery="extras.searchQuery" :classInst="classInst" :lesson="lesson" type="students" />
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import LessonsMembersList from '@app/components/organizations/lessons/LessonsMembersList.vue'
</script>
