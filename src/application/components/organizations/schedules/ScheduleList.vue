<template>
	<div class="w-full">
		<div v-if="showFilter" class="flex flex-wrap items-center gap-3 mt-6">
			<SofaButton
				v-for="lesson in lessonsFilter"
				:key="lesson.id"
				:customClass="
					selectedLesson.id === lesson.id
						? 'bg-primaryPurple !text-white !shadow-none'
						: 'bg-white border border-darkLightGray !text-deepGray !shadow-none'
				"
				padding="py-3 px-4"
				@click="selectedLesson = lesson">
				{{ lesson.title }}
			</SofaButton>
		</div>
		<div v-if="filteredSchedules.length" class="flex flex-col gap-4 mt-4 mdlg:gap-0 mdlg:mt-2">
			<ScheduleCard v-for="(schedule, index) in filteredSchedules" :key="index" :schedule="schedule" />
		</div>
		<div v-else class="w-full pt-4">
			<div class="w-full flex flex-col gap-2 items-center justify-center bg-lightGray p-4">
				<SofaImageLoader
					customClass="w-[64px] h-[64px] flex items-center justify-center rounded-custom !object-contain"
					photoUrl="/images/calendar.png">
				</SofaImageLoader>
				<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
				<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'
export default defineComponent({
	props: {
		classObj: {
			type: ClassEntity,
			required: true,
		},
		showFilter: {
			type: Boolean,
			default: false,
		},
		schedules: {
			type: Array as PropType<ScheduleEntity[]>,
			required: true,
		},
	},
	setup(props) {
		const lessons = props.classObj.lessons
		const lessonsFilterType = lessons.map((lesson) => {
			return { id: lesson.id, title: lesson.title }
		})
		lessonsFilterType.unshift({ id: 'all', title: 'All' })
		const lessonsFilter = lessonsFilterType
		const selectedLesson = ref(lessonsFilter[0])
		const schedules = props.schedules.map((schedule) => {
			const lesson = lessons.find((lesson) => lesson.id === schedule.lessonId)
			return lesson ? { ...schedule, lessonTitle: lesson.title } : schedule
		})
		const filteredSchedules = computed(() => {
			if (selectedLesson.value.id !== 'all') {
				return schedules.filter((schedule) => {
					return schedule.lessonId === selectedLesson.value.id
				})
			} else {
				return schedules
			}
		})

		return { lessons, selectedLesson, filteredSchedules, lessonsFilter }
	},
})
</script>
