import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { getTimeFormatted, months, TIMES } from '@utils/dates'

const startInterval = (dif: number, caller: (time: number) => void) => {
	if (dif <= TIMES.minute) return window.setInterval(() => caller(1), 1000)
	else if (dif <= TIMES.hour) return window.setInterval(() => caller(TIMES.minute), 1000 * TIMES.minute)
	else if (dif <= TIMES.day) return window.setInterval(() => caller(TIMES.hour), 1000 * TIMES.hour)
	else return undefined
}

export const useTimeDifference = (timeInMs: number) => {
	const date = new Date(timeInMs)
	const diffInSec = ref(Math.floor((Date.now() - date.getTime()) / 1000))
	let interval = undefined as number | undefined
	watch(diffInSec, () => {
		if ([TIMES.minute, TIMES.hour, TIMES.day, TIMES.month, TIMES.year].includes(diffInSec.value)) {
			clearInterval(interval)
			interval = startInterval(diffInSec.value, (time: number) => {
				diffInSec.value += time
			})
		}
	})
	const time = computed({
		get: () => {
			if (diffInSec.value < TIMES.year) return getTimeFormatted(diffInSec.value) + ' ago'
			else {
				const year = date.getFullYear()
				const month = months[date.getMonth()]
				return `${month} ${year}`
			}
		},
		set: () => {},
	})
	onMounted(() => {
		interval = startInterval(diffInSec.value, (time: number) => {
			diffInSec.value += time
		})
	})
	onUnmounted(() => clearInterval(interval))
	return { time, diffInSec }
}
