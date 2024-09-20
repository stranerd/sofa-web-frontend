<template>
	<div class="grid grid-cols-7 gap-2 font-size-sub text-center select-none">
		<div class="col-span-full flex items-center gap-2">
			<span
				class="mr-auto"
				:class="{
					[classes.title ?? '']: true,
				}">
				{{ getMonthYear(from) }}
			</span>
			<SofaIcon class="h-[24px] rotate-90 fill-current" name="chevron-double-down" @click="goToPrevYear" />
			<SofaIcon class="h-[7px] rotate-90 fill-current" name="chevron-down" @click="goToPrevMonth" />
			<SofaIcon class="h-[7px] rotate-[270deg] fill-current" name="chevron-down" @click="goToNextMonth" />
			<SofaIcon class="h-[24px] rotate-[270deg] fill-current" name="chevron-double-down" @click="goToNextYear" />
		</div>
		<span
			v-for="day in days"
			:key="day"
			class="capitalize col-span-1 rounded-full aspect-square p-1 flex items-center justify-center"
			:class="{
				[classes.weekday ?? '']: true,
				[classes.weekend ?? '']: ['sat', 'sun'].some((d) => day.toLowerCase() === d),
			}">
			{{ day }}
		</span>
		<span
			v-for="(date, i) in dates"
			:key="i"
			class="col-span-1 rounded-full aspect-square p-1 flex items-center justify-center cursor-pointer"
			:class="{
				[classes.day ?? '']: true,
				[classes.extraDay ?? '']: date < from || date > to,
				[classes.today ?? '']: date.getTime() === today.getTime(),
				[classes.weekend ?? '']: [0, 6].includes(date.getDay()),
				[classes.selected ?? '']: date.getTime() === selectedDate?.getTime(),
				[classes.highlight ?? '']: highlight.some(
					(h) => getStartOfDay(h.getFullYear(), h.getMonth(), h.getDate()).getTime() === date.getTime(),
				),
			}"
			@click="toggleSelectedDate(date)">
			{{ date.getDate() }}
		</span>
	</div>
</template>

<script lang="ts">
import { computed, watch } from 'vue'
import { getEndOfMonth, getMonthYear, getStartOfDay, getStartOfMonth, weekDays } from '@utils/dates'

const now = new Date()
const today = getStartOfDay(now.getFullYear(), now.getMonth(), now.getDate())
</script>

<script lang="ts" setup>
type Classes = Partial<{
	title: string
	weekday: string
	weekend: string
	day: string
	extraDay: string
	today: string
	selected: string
	highlight: string
}>

const props = withDefaults(
	defineProps<{
		startOfWeek?: number
		classes?: Classes
		showExtras?: boolean
	}>(),
	{
		startOfWeek: 1,
		classes: () => ({}),
		showExtras: true,
	},
)

const days = $utils.rotate(weekDays, props.startOfWeek)

const selectedDate = defineModel<Date | null>('selected', { default: null })
const from = defineModel<Date>('from', { default: getStartOfMonth(now.getFullYear(), now.getMonth()) })
const to = defineModel<Date>('to', { default: getEndOfMonth(now.getFullYear(), now.getMonth()) })
const highlight = defineModel<Date[]>('highlight', { default: [] })

const dates = computed(() => {
	const dates: Date[] = []
	for (let day = from.value; day <= to.value; day = getStartOfDay(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
		dates.push(day)
	}
	if (props.showExtras) {
		const addToStart = (from.value.getDay() - props.startOfWeek + days.length) % days.length
		for (let i = 1; i <= addToStart; i++)
			dates.unshift(getStartOfDay(from.value.getFullYear(), from.value.getMonth(), from.value.getDate() - i))
		const addToEnd = dates.length % 7 === 0 ? 0 : 7 - (dates.length % 7)
		for (let i = 1; i <= addToEnd; i++) dates.push(getStartOfDay(to.value.getFullYear(), to.value.getMonth(), to.value.getDate() + i))
	}
	return dates
})

const goToPrevMonth = () => (from.value = getStartOfMonth(from.value.getFullYear(), from.value.getMonth() - 1))
const goToPrevYear = () => (from.value = getStartOfMonth(from.value.getFullYear() - 1, from.value.getMonth()))
const goToNextMonth = () => (from.value = getStartOfMonth(from.value.getFullYear(), from.value.getMonth() + 1))
const goToNextYear = () => (from.value = getStartOfMonth(from.value.getFullYear() + 1, from.value.getMonth()))
const toggleSelectedDate = (date: Date) => (selectedDate.value = selectedDate.value?.getTime() === date.getTime() ? null : date)

watch(
	from,
	() => {
		to.value = getEndOfMonth(from.value.getFullYear(), from.value.getMonth())
	},
	{ immediate: true },
)
</script>
