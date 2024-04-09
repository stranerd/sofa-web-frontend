<template>
	<div v-if="schedules.length === 0" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
		<SofaHeaderText content="Live Sessions" />
		<div class="h-[1px] w-full bg-lightGray" />
		<div class="w-full flex flex-col gap-2 items-center justify-center">
			<SofaImageLoader class="w-[64px] rounded-custom" photoUrl="/images/empty-schedules.png" />
			<SofaNormalText customClass="font-bold" content="There’s nothing here" />
			<SofaNormalText color="text-grayColor text-center" content="There are no live sessions scheduled" />
		</div>
	</div>
	<div v-else-if="schedules.length" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start">
		<SofaHeaderText content="Live Sessions" />
		<div class="mt-4 h-[1px] w-full bg-lightGray" />
		<ScheduleList
			:classInst="classInst"
			:showFilter="false"
			:schedules="schedules.filter((s) => classInst.publishedSessions.includes(s.id))" />
	</div>
</template>

<script setup lang="ts">
import { useClassSchedules } from '@app/composables/organizations/schedules'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
}>()

const { schedules } = useClassSchedules(props.classInst.organizationId, props.classInst.id)
</script>
