import { onUnmounted, ref } from 'vue'

export const useCountdown = (skipClearOnUnmounted = false) => {
	const time = ref(0)
	let interval: ReturnType<typeof setTimeout> = null

	const countdown = (data: Partial<{ fn: () => Promise<void>; time: number; interval: number }>) =>
		new Promise<void>((res, rej) => {
			try {
				clearInterval(interval)
				time.value = data?.time ?? 0
				if (time.value <= 0) return
				interval = setInterval(async () => {
					const newValue = time.value - 1
					if (newValue <= 0) {
						clearInterval(interval)
						res()
					} else {
						time.value--
						await data?.fn?.()
					}
				}, data?.interval ?? 1000)
			} catch (e) {
				rej(e.message)
			}
		})

	onUnmounted(() => {
		if (!skipClearOnUnmounted) clearInterval(interval)
	})

	return { time, countdown }
}
