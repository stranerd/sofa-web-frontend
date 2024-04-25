<template>
	<ClassLayout title="Schedules">
		<template #default="{ classInst }">
			<div v-if="schedules.length !== 0" class="w-full bg-white rounded-2xl shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />

				<div class="w-full p-4">
					<div class="w-full flex flex-col gap-2 items-center justify-center bg-lightGray p-8">
						<SofaImageLoader class="w-[64px]" photoUrl="/images/empty-schedules.png"> </SofaImageLoader>
						<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
						<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
					</div>
				</div>
			</div>
			<div v-else class="w-full mdlg:bg-white rounded-2xl mdlg:shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />
				<ScheduleList
					:classInst="classInst"
					:showFilter="true"
					:schedules="schedules.filter((s) => classInst.publishedSessions.includes(s.id))"
					class="mdlg:px-4 mdlg:pb-4" />
				<SofaButton
					v-if="hasMore"
					textColor="text-grayColor"
					bgColor="bg-transparent"
					class="!shadow-none !rounded-none !py-3 !mx-auto"
					@click="fetchOlderSchedules">
					Load More
				</SofaButton>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useClassSchedules } from '@app/composables/organizations/schedules'

const route = useRoute()
const organizationId = route.params.organizationId as string
const classId = route.params.classId as string
const { schedules, fetchOlderSchedules, hasMore } = useClassSchedules(organizationId, classId)
</script>
