import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { useErrorHandler, useLoadingHandler } from './states'

const store: Record<string, {
	items: Ref<{ id: string }[]>,
} & ReturnType<typeof useLoadingHandler> & ReturnType<typeof useErrorHandler>> = {}

export type Refable<T> = Ref<T> | ComputedRef<T>

export const useItemsInList = <T extends { id: string }> (
	key: string, ids: Refable<string[]>, items: Refable<T[]>, fetchItems: (ids: string[]) => Promise<T[]>
) => {
	store[key] ??= {
		items: ref([]),
		...useLoadingHandler(),
		...useErrorHandler(),
	}

	const allItems = computed(() => [...items.value, ...store[key].items.value])

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
			items.forEach((item) => store[key].items.value.push(item))
		} catch (e) {
			await store[key].setError(e)
		}
		await store[key].setLoading(false)
	}, { immediate: true })

	return { items: filteredItems }
}