import { computed, ref } from 'vue'

export const useListener = (startFn: () => Promise<() => void>) => {
	let listener = null as null | (() => void)
	const watchers = ref(0)
	const isRunning = computed(() => watchers.value > 0)

	const close = async () => {
		if (watchers.value === 1) listener?.()
		watchers.value--
	}

	const start = async () => {
		if (!isRunning.value) listener = await startFn()
		watchers.value++
	}

	const reset = async (reset: () => Promise<() => void>) => {
		startFn = reset
		await restart()
	}

	const restart = async () => {
		if (isRunning.value) listener = await startFn()
		else await start()
	}

	return { start, close, reset, restart, isRunning }
}
