<template>
	<div class="w-full">
		<div v-if="showFilter" class="flex flex-wrap items-center gap-3 mt-6">
			<SofaButton
				v-for="filter in lessonsFilters"
				:key="filter.id"
				:customClass="
					selectedFilter.id === filter.id
						? 'bg-primaryPurple !text-white !shadow-none'
						: 'bg-white border border-darkLightGray !text-deepGray !shadow-none'
				"
				padding="py-3 px-4"
				@click="selectedFilter = filter">
				{{ filter.title }}
			</SofaButton>
		</div>
		<div v-if="filteredSchedules.length" class="flex flex-col gap-4 mt-4 mdlg:gap-0 mdlg:mt-2">
			<ScheduleCard v-for="schedule in filteredSchedules" :key="schedule.hash" :schedule="schedule" :classInst="classInst" />
		</div>
		<div v-else class="w-full pt-4">
			<div class="w-full flex flex-col gap-2 items-center justify-center bg-lightGray p-4">
				<SofaImageLoader customClass="w-[64px] rounded-custom" photoUrl="/images/empty-schedules.png"> </SofaImageLoader>
				<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
				<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ClassEntity, ScheduleEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	showFilter: boolean
	schedules: ScheduleEntity[]
}>()

const lessonsFilters = [{ id: 'all', title: 'All' }, ...props.classInst.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title }))]
const selectedFilter = ref(lessonsFilters[0])
const filteredSchedules = computed(() => {
	if (selectedFilter.value.id === 'all') return props.schedules
	return props.schedules.filter((schedule) => schedule.lessonId === selectedFilter.value.id)
})
</script>
