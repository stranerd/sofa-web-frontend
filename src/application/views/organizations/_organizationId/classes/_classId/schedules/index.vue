<template>
	<ClassLayout>
		<template #default="{ classInst }">
			<div class="mt-6">
				<div v-if="schedules.length === 0" class="w-full bg-white rounded-2xl shadow-custom">
					<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
					<div class="h-[1px] w-full bg-lightGray" />

					<div class="w-full flex items-center justify-center gap-6 px-4 md:px-6 py-10">
						<SofaEmptyStateNew
							:title="emptySchedulesContent.title"
							:contents="emptySchedulesContent.contents"
							:imageUrl="emptySchedulesContent.imageURL"
							:firstButton="schedulesEmptyStateButtonConfig.firstButton" />
					</div>
				</div>
				<div v-else class="w-full mdlg:bg-white rounded-2xl mdlg:shadow-custom">
					<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
					<div class="h-[1px] w-full bg-lightGray" />
					<ScheduleList :classInst="classInst" :showFilter="true" :schedules="schedules" class="px-4 pb-4" />
					<SofaButton
						v-if="hasMore"
						textColor="text-grayColor"
						bgColor="bg-transparent"
						class="!shadow-none !rounded-none !py-3 !mx-auto"
						@click="fetchOlderSchedules">
						Load More
					</SofaButton>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useClassSchedules } from '@app/composables/organizations/schedules'

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
		const { schedules, fetchOlderSchedules, hasMore } = useClassSchedules(organizationId, classId)

		const emptySchedulesContent = {
			imageURL: '/images/empty-schedules.png',
			title: 'There’s nothing here',
			contents: ['There are no live sessions scheduled'],
		}
		const schedulesEmptyStateButtonConfig = computed(() => ({
			firstButton: {
				label: 'Create Schedule',
				action: () => {},
			},
		}))
		return {
			schedules,
			hasMore,
			fetchOlderSchedules,
			emptySchedulesContent,
			schedulesEmptyStateButtonConfig,
		}
	},
})
</script>
