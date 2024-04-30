<template>
	<ClassLayout title="Live" rounded>
		<template #default="{ classInst, extras }">
			<div class="pt-4 px-4 mdlg:px-0 flex flex-col mdlg:grid grid-cols-4 gap-4 h-full overflow-y-auto">
				<div class="col-span-3 flex flex-col gap-2 mdlg:gap-0 h-full overflow-y-auto">
					<div class="flex items-center w-full mdlg:bg-white mdlg:p-4 mdlg:rounded-t-2xl shrink-0">
						<SofaText
							v-for="(tab, i) in tabs"
							:key="tab.value"
							as="a"
							size="sub"
							:content="tab.label"
							class="px-4 py-2.5 font-semibold text-grayColor border border-current"
							:class="{
								'!text-primaryPurple': currentTab === tab.value,
								'rounded-l-lg': i === 0,
								'rounded-r-lg': i === tabs.length - 1,
							}"
							@click="currentTab = tab.value" />

						<SofaSelect
							v-model="currentLesson"
							placeholder="Subject"
							:options="[
								{ key: null, value: 'All' },
								...classInst.lessons.map((lesson) => ({ value: lesson.title, key: lesson.id })),
							]"
							class="!w-[160px] ml-auto bg-white mdlg:bg-lightGray" />
					</div>
					<div class="h-[1px] bg-lightGray shrink-0" />
					<div class="flex flex-col gap-4 h-full overflow-y-auto mdlg:bg-white mdlg:p-4 mdlg:rounded-b-2xl">
						<EmptyState
							v-if="!filteredSchedules.length"
							image="live"
							title="There’s nothing here"
							class="bg-white"
							sub="There are no live sessions scheduled" />
						<ScheduleCard
							v-for="schedule in filteredSchedules.filter((schedule) => schedule.search(extras.searchQuery))"
							:key="schedule.hash"
							:classInst="classInst"
							:schedule="schedule" />
					</div>
				</div>
				<div v-if="$screen.desktop" class="col-span-1 h-full overflow-y-auto">
					<div class="bg-white text-deepGray flex flex-col gap-4 rounded-2xl p-4">Calendar</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClassSchedules } from '@app/composables/organizations/schedules'

const route = useRoute()
const organizationId = route.params.organizationId as string
const classId = route.params.classId as string
const { upcoming, previous } = useClassSchedules(organizationId, classId)

const tabs = [
	{ label: 'Upcoming', value: 'upcoming' },
	{ label: 'Previous', value: 'previous' },
] as const
const currentTab = ref<(typeof tabs)[number]['value']>(tabs[0].value)
const currentLesson = ref<string | null>(null)

const filteredSchedules = computed(() => {
	const s = currentTab.value === 'upcoming' ? upcoming.value : previous.value
	const lesson = currentLesson.value
	if (!lesson) return s
	return s.filter((schedule) => schedule.lessonId === lesson)
})
</script>
