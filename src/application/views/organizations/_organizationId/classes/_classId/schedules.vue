<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<div v-if="schedules.length === 0" class="w-full bg-white rounded-2xl shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />

				<div class="w-full p-4">
					<div class="w-full flex flex-col gap-2 items-center justify-center bg-lightGray p-8">
						<SofaImageLoader
							customClass="w-[64px] h-[64px] flex items-center justify-center rounded-custom !object-contain"
							photoUrl="/images/calendar.png">
						</SofaImageLoader>
						<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
						<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
					</div>
				</div>
			</div>
			<div v-else class="w-full mdlg:bg-white rounded-2xl mdlg:shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />
				<ScheduleList :classObj="classObj" :showFilter="true" :schedules="schedules" class="px-4 pb-4" />
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { defineComponent } from 'vue'
import { useMySchedules } from '@app/composables/organizations/schedules'

import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdSchedules',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const route = useRoute()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const { schedules } = useMySchedules(organizationId, classId)
		return {
			schedules,
		}
	},
})
</script>
