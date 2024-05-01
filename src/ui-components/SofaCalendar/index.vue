<template>
	<div class="grid grid-cols-7 gap-x-2 gap-y-4 text-sub text-center">
		<div class="col-span-full flex items-center gap-2">
			<span class="mr-auto">{{ getMonthYear(from) }}</span>
		</div>
		<span v-for="day in days" :key="day" class="capitalize col-span-1">{{ day }}</span>

		<!-- <template v-for="(d, index) in dates" :key="d">
			<template v-if="index == 0">
				<div v-for="i in d.day" :key="i"></div>
			</template>

			<button
				class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
				@click="() => selected(d.date)"
				:class="{
					'bg-gray-800 text-gray-100':
						d.date == dayjs().date() &&
						dateProps.selectedValues.month == dayjs().month() &&
						dateProps.selectedValues.year == dayjs().year(),
					'bg-emerald-500 text-gray-50 ring ring-green-700': d.date == date,
					'bg-gray-300': d.date != date,
				}">
				<span>
					{{ d.date }}
				</span>
			</button>
		</template> -->
	</div>
	<div>
		<div class="flex flex-wrap gap-6 mb-6 items-center">
			<button @click="goToPrevYear">Prev Year</button>
			<button @click="goToPrevMonth">Prev Month</button>
			<span class="w-full">{{ from.toLocaleDateString() }} - {{ to.toLocaleDateString() }}</span>
			<button @click="goToNextMonth">Next Month</button>
			<button @click="goToNextYear">Next Year</button>
		</div>
		<div>
			<div v-for="(day, i) in daysInRange" :key="i">{{ day?.toLocaleDateString() }} - {{ i }}</div>
		</div>
	</div>
</template>

<script lang="ts">
const now = new Date()
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { getMonthYear, weekDays } from '@utils/dates'

const startOfWeek = 1
const days = $utils.rotate(weekDays, startOfWeek)

const from = defineModel('from', { default: new Date(now.getFullYear(), now.getMonth(), 1) })
const to = defineModel('to', { default: new Date(now.getFullYear(), now.getMonth() + 1, 0) })

const goToPrevMonth = () => {
	from.value = new Date(from.value.getFullYear(), from.value.getMonth() - 1, 1)
	to.value = new Date(to.value.getFullYear(), to.value.getMonth(), 0)
}

const goToPrevYear = () => {
	from.value = new Date(from.value.getFullYear() - 1, from.value.getMonth(), 1)
	to.value = new Date(to.value.getFullYear() - 1, to.value.getMonth() + 1, 0)
}

const goToNextMonth = () => {
	from.value = new Date(from.value.getFullYear(), from.value.getMonth() + 1, 1)
	to.value = new Date(to.value.getFullYear(), to.value.getMonth() + 2, 0)
}

const goToNextYear = () => {
	from.value = new Date(from.value.getFullYear() + 1, from.value.getMonth(), 1)
	to.value = new Date(to.value.getFullYear() + 1, to.value.getMonth() + 1, 0)
}

const daysInRange = computed(() => {
	const dates: Date[] = []
	const day = new Date(from.value)
	while (day <= to.value) {
		dates.push(new Date(day))
		day.setDate(day.getDate() + 1)
	}
	const empty = ((dates[0]?.getDay() ?? startOfWeek) - startOfWeek + days.length) % days.length
	return new Array(empty).fill(null).concat(dates)
})
</script>
