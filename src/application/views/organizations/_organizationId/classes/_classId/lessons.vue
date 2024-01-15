<template>
	<ClassLayout>
		<template #default> </template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdLessons',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
})
</script>
