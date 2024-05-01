import { computed, ref } from 'vue'
import { useAsyncFn } from './hooks'

export const useListener = (startFn: () => Promise<() => void>) => {
	let listener = null as null | (() => void)
	const watchers = ref(0)
	const isRunning = computed(() => watchers.value > 0)

	const { asyncFn } = useAsyncFn(async () => {
		listener = await startFn()
	})

	const close = async () => {
		if (watchers.value === 1) listener?.()
		watchers.value--
	}

	const start = async () => {
		if (!isRunning.value) await asyncFn()
		watchers.value++
	}

	const reset = async (reset: () => Promise<() => void>) => {
		startFn = reset
		await restart()
	}

	const restart = async () => {
		if (isRunning.value) await asyncFn()
		else await start()
	}

	return { start, close, reset, restart, isRunning }
}
