<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<AnnouncementForAdmin
				v-if="classObj.isAdmin(id) || classObj.isTeacher(id)"
				:classObj="classObj"
				:announcements="announcements" />
			<AnnouncementForNonAdmin v-else :classObj="classObj" :announcements="announcements" />
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useMyAnnouncements } from '@app/composables/organizations/announcements'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAnnouncements',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const route = useRoute()
		const { id } = useAuth()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string

		const { announcements } = useMyAnnouncements(organizationId, classId)
		return { announcements, id }
	},
})
</script>
