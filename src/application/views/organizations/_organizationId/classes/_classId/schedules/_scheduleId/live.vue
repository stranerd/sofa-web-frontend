<template>
	<ClassLayout full>
		<template #full="{ classInst }">
			<iframe
				v-if="schedule && schedule.canJoin(classInst, id)"
				allow="camera; microphone; fullscreen; display-capture; autoplay"
				:src="schedule.meetingLink"
				class="w-full h-full" />
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useSchedulesInList } from '@app/composables/organizations/schedules'
import { useAuth } from '@app/composables/auth/auth'

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
		const { id } = useAuth()
		const { schedules } = useSchedulesInList(
			organizationId,
			classId,
			computed(() => [scheduleId]),
			true,
		)
		const schedule = computed(() => schedules.value.at(0) ?? null)
		return { schedule, id }
	},
})
</script>
