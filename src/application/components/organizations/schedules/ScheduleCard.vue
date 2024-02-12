<template>
	<div
		class="bg-white text-deepGray shadow-custom rounded-custom px-4 flex flex-col gap-2 py-6 mdlg:bg-transparent mdlg:shadow-none mdlg:rounded-none mdlg:px-0 mdlg:border-b border-lightGray">
		<SofaNormalText :content="lesson?.title" color="text-grayColor" />
		<SofaHeaderText :content="schedule.title" />
		<div class="flex items-center gap-1">
			<SofaAvatar :photoUrl="schedule.user.bio.photo?.link" class="!w-[24px] !h-[24px]" />
			<SofaNormalText :content="schedule.user.bio.name.full" color="text-deepGray" />
		</div>
		<div class="flex items-center gap-2" :class="schedule.canStudentJoin ? 'text-primaryRed' : 'text-inherit'">
			<SofaIcon name="calendar" class="h-[17px] fill-current" />
			<SofaNormalText :content="schedule.timeRange" color="text-inherit" />
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<SofaButton
				v-for="buttonProps in buttons"
				:key="buttonProps.label"
				class="self-start"
				:bgColor="buttonProps.bgColor ?? 'bg-primaryBlue'"
				textColor="text-white"
				padding="py-3 px-5"
				@click="buttonProps.handler">
				{{ buttonProps.label }}
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useStartSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'

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
