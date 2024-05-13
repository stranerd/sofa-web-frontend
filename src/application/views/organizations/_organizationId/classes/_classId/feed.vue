<template>
	<ClassLayout title="Feed" rounded>
		<template #default="{ classInst, extras }">
			<ClassesFeed v-model:searchQuery="extras.searchQuery" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import ClassesFeed from '@app/components/organizations/classes/ClassesFeed.vue'
</script>
