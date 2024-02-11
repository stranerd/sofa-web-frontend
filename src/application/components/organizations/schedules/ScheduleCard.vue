<template>
	<div
		class="bg-white text-deepGray shadow-custom rounded-custom px-4 flex flex-col gap-2 py-6 mdlg:bg-transparent mdlg:shadow-none mdlg:rounded-none mdlg:px-0 mdlg:border-b border-lightGray">
		<SofaNormalText :content="lesson?.title" color="text-grayColor" />
		<SofaHeaderText :content="schedule.title" />
		<div class="flex items-center gap-1">
			<SofaAvatar :photoUrl="schedule.user.bio.photo?.link" class="!w-[24px] !h-[24px]" />
			<SofaNormalText :content="schedule.user.bio.name.full" color="text-deepGray" />
		</div>
		<div class="flex items-center gap-2" :class="schedule.isOngoing ? 'text-primaryRed' : 'text-inherit'">
			<SofaIcon name="calendar" class="h-[17px] fill-current" />
			<SofaNormalText :content="schedule.timeRange" color="text-inherit" />
		</div>
		<SofaButton
			v-if="!buttonProps.hide"
			bgColor="bg-primaryBlue"
			textColor="text-white"
			padding="py-3 px-5"
			@click="buttonProps.handler">
			{{ buttonProps.label }}
		</SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { useStartSchedule } from '@app/composables/organizations/schedules'

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const { start, end } = useStartSchedule(props.classInst, props.schedule)

const { id } = useAuth()
const lesson = computed(() => props.classInst.getLesson(props.schedule.lessonId))
const buttonProps = computed(() => {
	if (lesson.value?.users.teachers.includes(id.value)) {
		if (props.schedule.canStart)
			return {
				label: 'Start',
				handler: start,
			}
		if (props.schedule.canEnd)
			return {
				label: 'End',
				handler: end,
			}
		if (props.schedule.isOngoing)
			return {
				label: `Copy stream code - '${props.schedule.stream?.streamKey}'`,
				handler: () => Logic.Common.copy(props.schedule.stream?.streamKey ?? ''),
			}
	}
	if (props.schedule.isOngoing)
		return {
			label: 'Enter',
			handler: () => window.open(props.schedule.meetingLink, '_blank'),
		}
	return {
		hide: true,
		label: 'View',
		handler: () => {},
	}
})
</script>
