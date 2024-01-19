<template>
	<HomeLayout title="Classes">
		<ClassesForAdmin v-if="userType.isOrg" :classes="classes" />
		<ClassesForTeachers v-else :classes="classes" />
	</HomeLayout>
</template>

<script lang="ts">
import HomeLayout from '@app/components/home/HomeLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useMyClasses } from '@app/composables/organizations/classes'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { HomeLayout },
	routeConfig: { goBackRoute: '/', middlewares: ['isOrgOrTeacher'] },
	setup() {
		const { id: organizationId, userType } = useAuth()
		const { classes } = useMyClasses()

		return {
			classes,
			organizationId,
			userType,
		}
	},
})
</script>
