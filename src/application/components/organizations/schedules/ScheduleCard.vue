<template>
	<div
		class="bg-white text-deepGray rounded-2xl p-4 flex flex-col gap-2 border border-l-2 border-lightGray"
		:class="schedule.live ? 'border-l-primaryRed' : 'border-l-primaryOrange'">
		<SofaText :content="schedule.timeRange" />
		<span class="flex items-center gap-1">
			<SofaHeading :content="schedule.title" size="mid" class="leading-none" />
			<SofaBadge v-if="schedule.live" color="red" class="!py-[2.5px] !px-[5px]">LIVE</SofaBadge>
		</span>
		<SofaText v-if="lesson" :content="lesson.title" class="text-grayColor" size="sub" />
		<div v-if="actions.length" class="flex flex-wrap items-center gap-2">
			<template v-for="action in actions" :key="action.label">
				<a v-if="'icon' in action" class="flex items-center gap-1" :class="action.color" @click="action.handler">
					<SofaIcon :name="action.icon" class="h-[16px] fill-current" />
					<span>{{ action.label }}</span>
				</a>
				<SofaButton v-else :color="action.color" padding="py-3 px-5" @click="action.handler">
					{{ action.label }}
				</SofaButton>
			</template>
		</div>
		<div class="flex items-center gap-2">
			<SofaAvatar :photoUrl="schedule.user.bio.photo?.link" :size="36" />
			<div class="flex flex-col">
				<SofaHeading :content="id === schedule.user.id ? 'You' : schedule.user.bio.publicName" class="leading-none" />
				<SofaText class="text-grayColor" size="sub" :content="time" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useTimeDifference } from '@app/composables/core/time'
import { useStartSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'
import { SofaButton } from 'sofa-ui-components'

type Action = {
	label: string
	handler: () => void
} & ({ color: Required<InstanceType<typeof SofaButton>['$props']['color']> } | { icon: IconName; color: string })

const props = defineProps<{
	classInst: ClassEntity
	schedule: ScheduleEntity
}>()

const { id } = useAuth()
const { time } = useTimeDifference(props.schedule.createdAt)
const { copyKey, join, rewatch, start, end } = useStartSchedule(props.classInst, props.schedule)

const lesson = computed(() => props.classInst.getLesson(props.schedule.lessonId))
const actions = computed(() => {
	const b: Action[] = []
	if (props.schedule.canStart(props.classInst, id.value)) b.push({ label: 'Start', color: 'blue', handler: () => start() })
	if (props.schedule.canJoin(props.classInst, id.value)) b.push({ label: 'Enter', color: 'blue', handler: () => join() })
	if (lesson.value?.users.teachers.includes(id.value) && props.schedule.canJoin(props.classInst, id.value))
		b.push({ label: 'Copy stream key', icon: 'copy', color: 'text-primaryBlue', handler: () => copyKey() })
	if (props.schedule.canEnd(props.classInst, id.value))
		b.push({ label: 'End', icon: 'forbidden', color: 'text-primaryRed', handler: () => end() })
	if (props.schedule.canWatch()) b.push({ label: 'Rewatch', icon: 'file-video', color: 'text-primaryBlue', handler: () => rewatch() })
	return b
})
</script>
