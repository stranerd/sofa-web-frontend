<template>
	<ClassLayout full>
		<template #full="{}">
			<div>{{ schedule }}</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useSchedulesInList } from '@app/composables/organizations/schedules'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdSchedulesScheduleIdLive',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const route = useRoute()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const scheduleId = route.params.scheduleId as string
		const { schedules } = useSchedulesInList(
			organizationId,
			classId,
			computed(() => [scheduleId]),
			true,
		)
		const schedule = computed(() => schedules.value.at(0) ?? null)
		return { schedule }
	},
})
</script>
