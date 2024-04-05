<template>
	<div
		class="w-full h-full rounded-custom flex items-center justify-center text-white"
		:class="schedule.canStart(classInst, id) || schedule.canJoin(classInst, id) ? 'bg-primaryRed' : 'bg-primaryPurple'">
		<div class="flex flex-col items-center gap-3">
			<SofaHeaderText color="text-inherit">Live Session</SofaHeaderText>
			<div class="flex items-center gap-2">
				<SofaIcon class="h-[16px] fill-current" name="tutor" />
				<SofaNormalText color="text-white">{{ schedule.user.bio.publicName }}</SofaNormalText>
			</div>
			<div class="flex items-center gap-2">
				<SofaIcon name="calendar" class="h-[17px] fill-current" />
				<SofaNormalText :content="schedule.timeRange" color="text-inherit" />
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<SofaButton
					v-for="buttonProps in buttons"
					:key="buttonProps.label"
					class="self-start"
					:bgColor="buttonProps.bgColor ?? 'bg-white'"
					:textColor="
						schedule.canStart(classInst, id) || schedule.canJoin(classInst, id) ? 'text-primaryRed' : 'text-primaryPurple'
					"
					padding="py-3 px-5"
					@click="buttonProps.handler">
					{{ buttonProps.label }}
				</SofaButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useStartSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const { copyKey, join, rewatch, start, end } = useStartSchedule(props.classInst, props.schedule)

const { id } = useAuth()
const lesson = computed(() => props.classInst.getLesson(props.schedule.lessonId))
const buttons = computed(() => {
	const b: { label: string; bgColor?: string; handler: () => void }[] = []
	if (props.schedule.canStart(props.classInst, id.value)) b.push({ label: 'Start', handler: () => start() })
	if (props.schedule.canJoin(props.classInst, id.value)) b.push({ label: 'Enter', handler: () => join() })
	if (lesson.value?.users.teachers.includes(id.value) && props.schedule.canJoin(props.classInst, id.value))
		b.push({ label: 'Copy stream key', handler: () => copyKey() })
	if (props.schedule.canEnd(props.classInst, id.value)) b.push({ label: 'End', bgColor: 'bg-primaryRed', handler: () => end() })
	if (props.schedule.canWatch()) b.push({ label: 'Rewatch', handler: () => rewatch() })
	return b
})
</script>
