import { Logic } from 'sofa-logic'
import { ComputedRef, Ref, computed, reactive, watch } from 'vue'
import { useErrorHandler, useLoadingHandler } from './states'

type UseAsyncFnOptions = {
	skipLoading?: boolean
	skipError?: boolean
}
export const useAsyncFn = <T extends (...args: any[]) => Promise<any>>(fn: T, opts: Partial<UseAsyncFnOptions> = {}) => {
	const { setError, error } = useErrorHandler()
	const { setLoading, loading } = useLoadingHandler()
	const asyncFn = async (...args: Parameters<T>) => {
		let result: ReturnType<T> | null = null
		if (loading.value) return result
		try {
			await setError('', opts.skipError)
			await setLoading(true, opts.skipLoading)
			result = await fn(...args)
		} catch (e) {
			await setError(e, opts.skipError)
		}
		await setLoading(false, opts.skipLoading)
		return result
	}
	return { asyncFn, error, setError, loading, setLoading }
}

const store: Record<
	string,
	{
		items: { id: string }[]
	} & ReturnType<typeof useAsyncFn<() => Promise<void>>>
> = {}

export type Refable<T> = Ref<T> | ComputedRef<T>

export const useItemsInList = <T extends { id: string }>(
	key: string,
	ids: Refable<string[]>,
	items: Refable<T[]>,
	fetchItems: (ids: string[]) => Promise<T[]>,
) => {
	store[key] ??= {
		items: reactive([]),
		...useAsyncFn(async () => {
			const notFetched = [...new Set(unfetched.value)]
			if (!notFetched.length) return
			const items = await fetchItems(notFetched)
			items.forEach((item) => addToList(item))
		}),
	}

	const allItems = computed(() => [...items.value, ...store[key].items])

	const filteredItems = computed(() => ids.value.map((id) => allItems.value.find((q) => q.id === id)).filter(Boolean) as T[])

	const unfetched = computed(() => ids.value.filter((id) => !filteredItems.value.find((q) => q.id === id)))

	watch(ids, store[key].asyncFn, { immediate: true })

	const addToList = (...items: T[]) => {
		items.forEach((item) => {
			Logic.addToArray(
				store[key].items,
				item,
				(e) => e.id,
				(e) => e.id,
			)
		})
	}

	return { items: filteredItems, addToList }
}
