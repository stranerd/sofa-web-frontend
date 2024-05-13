<template>
	<div class="pt-4 px-4 mdlg:px-0 flex flex-col mdlg:grid grid-cols-4 gap-4 h-full overflow-y-auto">
		<div class="col-span-3 flex flex-col gap-2 mdlg:gap-0 h-full overflow-y-auto">
			<SofaButton
				v-if="!$screen.desktop && user && (classInst.isAdmin(user) || classInst.isTeacher(user))"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				padding="px-6 py-3"
				@click="addLive">
				Add live
			</SofaButton>
			<div class="flex items-center w-full mdlg:bg-white mdlg:p-4 mdlg:rounded-t-2xl shrink-0">
				<SofaHeading v-if="selectedDate" size="title" :content="$utils.formatDateAsDigits(selectedDate)" />
				<template v-else>
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
				</template>

				<SofaSelect
					v-model="currentLesson"
					placeholder="Course"
					:options="[
						{ key: null, value: 'All' },
						...classInst.lessons.map((lesson) => ({ value: lesson.title, key: lesson.id })),
					]"
					class="!w-[160px] ml-auto bg-white mdlg:bg-lightGray" />
				<SofaButton
					v-if="$screen.desktop && user && (classInst.isAdmin(user) || classInst.isTeacher(user))"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					class="ml-4"
					padding="px-6 py-3"
					@click="addLive">
					Add live
				</SofaButton>
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
					v-for="schedule in filteredSchedules.filter((schedule) => schedule.search(searchQuery))"
					:key="schedule.hash"
					:classInst="classInst"
					:schedule="schedule" />
			</div>
		</div>
		<div v-if="$screen.desktop" class="col-span-1 h-full overflow-y-auto">
			<div class="bg-white text-deepGray flex flex-col gap-4 rounded-2xl p-4">
				<SofaCalendar
					v-model:selected="selectedDate"
					v-model:highlight="liveDates"
					:classes="{
						title: 'text-grayColor',
						day: 'text-grayColor',
						extraDay: 'opacity-30',
						today: 'bg-lightGray text-deepGray',
						selected: 'border-2 border-primaryPurple',
						highlight: 'bg-primaryRed/[0.1] text-primaryRed',
					}" />
				<div class="flex items-center gap-2">
					<span class="rounded size-4 bg-lightGray" />
					<SofaText content="Today" size="sub" class="text-grayColor mr-auto" />
					<span class="rounded size-4 bg-primaryRed/[0.1]" />
					<SofaText content="Live date" size="sub" class="text-grayColor" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useClassSchedules } from '@app/composables/organizations/schedules'
import { ClassEntity } from '@modules/organizations'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'

const props = defineProps<{ classInst: ClassEntity }>()
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { user } = useAuth()
const { upcoming, previous, schedules } = useClassSchedules(props.classInst.organizationId, props.classInst.id)

const tabs = [
	{ label: 'Upcoming', value: 'upcoming' },
	{ label: 'Previous', value: 'previous' },
] as const
const currentTab = ref<(typeof tabs)[number]['value']>(tabs[0].value)
const currentLesson = ref<string | null>(null)
const selectedDate = ref<Date | null>(null)

const liveDates = computed(() => schedules.value.map((schedule) => new Date(schedule.time.start)))
const filteredSchedules = computed(() => {
	const s = selectedDate.value
		? schedules.value.filter((s) => s.isInDateRange(selectedDate.value!))
		: currentTab.value === 'upcoming'
			? upcoming.value
			: currentTab.value === 'previous'
				? previous.value
				: []
	const lesson = currentLesson.value
	if (!lesson) return s
	return s.filter((schedule) => schedule.lessonId === lesson)
})

const addLive = () => {
	useModals().organizations.createSchedule.open({ classInst: props.classInst })
}
</script>
