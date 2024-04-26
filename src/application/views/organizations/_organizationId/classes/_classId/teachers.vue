<template>
	<ClassLayout title="Teachers">
		<template #default="{ classInst, extras }">
			<ClassesMembersList v-model:searchQuery="extras.searchQuery" :classInst="classInst" type="teachers" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import ClassesMembersList from '@app/components/organizations/classes/ClassesMembersList.vue'
</script>
