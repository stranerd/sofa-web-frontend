import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { TIMES, getMonthYear, getTimeFormatted } from '@utils/dates'

export const useCountdown = (skipClearOnUnmounted = false) => {
	const time = ref(0)
	let interval: ReturnType<typeof setTimeout> | undefined

	const countdown = (data: Partial<{ fn: () => Promise<void>; time: number; interval: number }>) =>
		new Promise<void>((res, rej) => {
			try {
				clearInterval(interval)
				time.value = data?.time ?? 0
				if (time.value <= 0) return
				interval = setInterval(async () => {
					const newValue = time.value - 1
					if (newValue <= 0) {
						time.value = 0
						clearInterval(interval)
						res()
					} else {
						time.value--
						await data?.fn?.()
					}
				}, data?.interval ?? 1000)
			} catch (e: any) {
				rej(e.message)
			}
		})

	onUnmounted(() => {
		if (!skipClearOnUnmounted) clearInterval(interval)
	})

	return { time, countdown }
}

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
		get: () => (diffInSec.value < TIMES.year ? getTimeFormatted(diffInSec.value) + ' ago' : getMonthYear(date)),
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
