<template>
	<div
		class="bg-white shadow-custom rounded-custom px-4 flex flex-col gap-2 py-6 mdlg:bg-transparent mdlg:shadow-none mdlg:rounded-none mdlg:px-0 mdlg:border-b border-lightGray">
		<SofaNormalText :content="lesson?.title" color="text-grayColor" />
		<SofaHeaderText :content="schedule.title" />
		<div class="flex items-center gap-1">
			<SofaAvatar :photoUrl="schedule.user?.bio.photo?.link" class="!w-[24px] !h-[24px]" />
			<SofaNormalText :content="schedule.user.bio.name.full" color="text-deepGray" />
		</div>
		<div class="flex items-center gap-2">
			<SofaIcon name="calendar" class="h-[17px]" :class="schedule.status === 'started' ? 'fill-primaryRed' : 'fill-current'" />
			<SofaNormalText
				:content="schedule.time.start.toString()"
				:color="schedule.status === 'started' ? 'text-primaryRed' : 'text-deepGray'" />
			<div class="w-[5px] h-[5px] rounded-[50%]" :class="schedule.status === 'started' ? 'bg-primaryRed' : 'bg-deepGray'" />
			<SofaNormalText
				:content="schedule.time.end.toString()"
				:color="schedule.status === 'started' ? 'text-primaryRed' : 'text-deepGray'" />
		</div>
		<SofaButton v-if="schedule.isOngoing" bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-5"> Enter </SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { ClassEntity, ScheduleEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const lesson = props.classInst.getLesson(props.schedule.lessonId)
</script>
