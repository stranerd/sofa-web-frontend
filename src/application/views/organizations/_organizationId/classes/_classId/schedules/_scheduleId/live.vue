<template>
	<ClassLayout full>
		<template #full="{ classInst }">
			<iframe
				v-if="schedule && schedule.canJoin(classInst, id)"
				allow="camera; microphone; fullscreen; display-capture; autoplay"
				:src="schedule.meetingLink"
				class="w-full h-full" />
			<div v-else class="w-full h-full flex flex-col gap-2 justify-center items-center p-6">
				<SofaEmptyState
					title="This class is not live at the moment"
					subTitle="Evaluate your level of knowledge"
					actionLabel="Go Back"
					:action="() => $router.push(classInst.pageLink)"
					titleStyle="mdlg:!text-xl" />
			</div>
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
