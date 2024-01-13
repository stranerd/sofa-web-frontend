import { addToArray, getRandomValue } from 'valleyed'
import { ComputedRef, Ref, computed, reactive, watch } from 'vue'
import { useErrorHandler, useLoadingHandler } from './states'

const asyncStore: Record<string, ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>> = {}

type UseAsyncFnOptions<T extends (...args: any[]) => any> = {
	hideLoading?: boolean
	hideError?: boolean
	pre?: (...args: Parameters<T>) => boolean | Promise<boolean>
	key?: string
}
export const useAsyncFn = <T extends (...args: any[]) => any>(fn: T, opts: Partial<UseAsyncFnOptions<T>> = {}) => {
	const key = opts.key ?? getRandomValue()
	asyncStore[key] ??= { ...useErrorHandler(), ...useLoadingHandler() }
	const { setError, error, setLoading, loading } = asyncStore[key]
	const asyncFn = async (...args: Parameters<T>) => {
		let result: Awaited<ReturnType<T> | undefined>
		if (loading.value) return result
		if (opts.pre && !(await opts.pre(...args))) return result
		try {
			await setError('', opts.hideError)
			await setLoading(true, opts.hideLoading)
			result = await fn(...args)
		} catch (e) {
			await setError(e, opts.hideError)
		}
		await setLoading(false, opts.hideLoading)
		return result
	}
	return { asyncFn, error, loading }
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
			addToArray(
				store[key].items,
				item,
				(e) => e.id,
				(e) => e.id,
			)
		})
	}

	return { items: filteredItems, addToList }
}
