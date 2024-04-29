<template>
	<a class="bg-lightGray rounded-xl p-4 flex items-center gap-2" @click="handler">
		<span
			class="aspect-square h-[48px] rounded-lg flex items-center justify-center p-2.5 shrink-0"
			:class="schedule.live ? 'bg-primaryRed' : 'bg-primaryOrange'">
			<SofaIcon name="live" class="fill-white h-[20px]" />
		</span>
		<span class="grow flex flex-col">
			<span class="flex items-center gap-1">
				<SofaHeading :content="schedule.title" class="leading-none" />
				<SofaBadge v-if="schedule.live" color="red" class="!py-[2.5px] !px-[5px]">LIVE</SofaBadge>
			</span>
			<SofaText size="sub" :content="schedule.timeRange" :class="schedule.live ? 'text-primaryRed' : 'text-grayColor'" />
		</span>
	</a>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useStartSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const { join } = useStartSchedule(props.classInst, props.schedule)

const { id } = useAuth()

const handler = () => {
	if (props.schedule.canJoin(props.classInst, id.value)) join()
}
</script>
