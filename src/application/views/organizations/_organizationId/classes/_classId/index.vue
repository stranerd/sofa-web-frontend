<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdIndex',
	routeConfig: {
		middlewares: ['isAuthenticated', ({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/about`],
	},
})
</script>
