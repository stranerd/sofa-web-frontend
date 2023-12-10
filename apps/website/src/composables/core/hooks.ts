import { ComputedRef, Ref, computed, reactive, watch } from 'vue'
import { useErrorHandler, useLoadingHandler } from './states'

const store: Record<string, {
	items: { id: string }[],
} & ReturnType<typeof useLoadingHandler> & ReturnType<typeof useErrorHandler>> = {}

export type Refable<T> = Ref<T> | ComputedRef<T>

export const useItemsInList = <T extends { id: string }> (
	key: string, ids: Refable<string[]>, items: Refable<T[]>, fetchItems: (ids: string[]) => Promise<T[]>
) => {
	store[key] ??= {
		items: reactive([]),
		...useLoadingHandler(),
		...useErrorHandler(),
	}

	const allItems = computed(() => [...items.value, ...store[key].items])

	const filteredItems = computed(() => ids.value
		.map((id) => allItems.value.find((q) => q.id === id))
		.filter(Boolean) as T[])

	const unfetched = computed(() => ids.value.filter((id) => !filteredItems.value.find((q) => q.id === id)))

	watch(ids, async () => {
		const notFetched = [...new Set(unfetched.value)]
		if (!notFetched.length) return
		try {
			await store[key].setError('')
			await store[key].setLoading(true)
			const items = await fetchItems(notFetched)
			items.forEach((item) => store[key].items.push(item))
		} catch (e) {
			await store[key].setError(e)
		}
		await store[key].setLoading(false)
	}, { immediate: true })

	const addToList = (...items: T[]) => {
		store[key].items.push(...items)
	}

	return { items: filteredItems, addToList }
}