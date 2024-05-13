<template>
	<ClassLayout title="Live" rounded>
		<template #default="{ classInst, extras }">
			<ClassesLive v-model:searchQuery="extras.searchQuery" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import ClassesLive from '@app/components/organizations/classes/ClassesLive.vue'
</script>
