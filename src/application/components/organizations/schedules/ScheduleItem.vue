<template>
	<div
		class="rounded-custom h-[600px] flex items-center justify-center"
		:class="schedule.canStart || schedule.canStudentJoin || schedule.canTeacherJoin ? 'bg-primaryRed' : 'bg-primaryPurple'">
		<div class="flex flex-col items-center gap-3">
			<SofaHeaderText color="text-white">Live Session</SofaHeaderText>
			<div class="flex items-center gap-2">
				<SofaIcon class="h-[16px] fill-white" name="tutor" />
				<SofaNormalText color="text-white">{{ schedule.user.bio.publicName }}</SofaNormalText>
			</div>
			<div class="flex items-center gap-2">
				<SofaIcon name="calendar" class="h-[17px] !fill-white" />
				<SofaNormalText :content="formatTime(schedule.time.start)" color="text-white" />
				<div class="w-[5px] h-[5px] rounded-[50%] bg-white" />
				<SofaNormalText :content="formatTime(schedule.time.end)" color="text-white" />
			</div>
			<SofaButton
				v-for="buttonProps in buttons"
				:key="buttonProps.label"
				bgColor="bg-white"
				textColor="text-primaryRed"
				padding="py-3 px-9"
				@click="buttonProps.handler">
				{{ buttonProps.label }}
			</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useStartSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { formatTime } from '@utils/dates'

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const { join, rewatch, start, end } = useStartSchedule(props.classInst, props.schedule)

const { id } = useAuth()
const lesson = computed(() => props.classInst.getLesson(props.schedule.lessonId))
const buttons = computed(() => {
	const b: { label: string; bgColor?: string; handler: () => void }[] = []
	if (lesson.value?.users.teachers.includes(id.value)) {
		if (props.schedule.canStart) b.push({ label: 'Start', handler: start })
		if (props.schedule.canTeacherJoin)
			b.push(
				{ label: 'Enter', handler: join },
				{
					label: 'Copy stream key',
					handler: () => Logic.Common.copy(props.schedule.stream?.streamKey ?? ''),
				},
			)
		if (props.schedule.canEnd) b.push({ label: 'End', bgColor: 'bg-primaryRed', handler: end })
	} else if (props.schedule.canStudentJoin) b.push({ label: 'Enter', handler: join })
	if (props.schedule.hasEnded) b.push({ label: 'Rewatch', handler: rewatch })
	return b
})
</script>
