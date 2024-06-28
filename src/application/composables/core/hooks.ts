import { addToArray, getRandomValue } from 'valleyed'
import { ComputedRef, Ref, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useListener } from './listener'
import { useErrorHandler, useLoadingHandler } from './states'
import { Listeners, QueryResults } from '@modules/core'

const asyncStore: Record<string, { called: Ref<boolean> } & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>> = {}

type UseAsyncFnOptions<T extends (...args: any[]) => any> = {
	hideLoading?: boolean
	hideError?: boolean
	force?: boolean
	pre?: (...args: Parameters<T>) => boolean | Promise<boolean>
	key?: string
}
export const useAsyncFn = <T extends (...args: any[]) => any>(fn: T, opts: Partial<UseAsyncFnOptions<T>> = {}) => {
	const key = opts.key ?? getRandomValue()
	asyncStore[key] ??= { ...useErrorHandler(), ...useLoadingHandler(), called: ref(false) }
	const { setError, error, setLoading, loading, called } = asyncStore[key]
	const asyncFn = async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
		let result: Awaited<ReturnType<T>> | undefined
		if (loading.value && !opts.force) return result
		if (opts.pre && !(await opts.pre(...args))) return result
		try {
			await setError('', opts.hideError)
			await setLoading(true, opts.hideLoading)
			result = await fn(...args)
		} catch (e) {
			await setError(e, opts.hideError)
		}
		await setLoading(false, opts.hideLoading)
		called.value = true
		return result
	}
	return { asyncFn, error, loading, called }
}

const listItemsStore: Record<
	string,
	{
		items: { id: string }[]
	}
> = {}

export type Refable<T> = Ref<T> | ComputedRef<T>

export const useItemsInList = <T extends { id: string }>(
	key: string,
	ids: Refable<string[]>,
	items: Refable<T[]>,
	fetchItems: (ids: string[]) => Promise<T[]>,
	listener?: ReturnType<typeof useListener>,
) => {
	listItemsStore[key] ??= {
		items: reactive([]),
	}

	const { asyncFn } = useAsyncFn(
		async () => {
			const notFetched = [...new Set(unfetched.value)]
			if (!notFetched.length) return
			const items = await fetchItems(notFetched)
			items.forEach((item) => addToList(item))
		},
		{
			force: true,
		},
	)

	const { asyncFn: searchForItem } = useAsyncFn(
		async (id: string) => {
			const item = allItems.value.find((q) => q.id === id)
			if (item) return item
			const items = await fetchItems([id])
			return items.at(0)
		},
		{
			force: true,
		},
	)

	const allItems = computed(() => [...items.value, ...listItemsStore[key].items] as T[])

	const filteredItems = computed(() => ids.value.map((id) => allItems.value.find((q) => q.id === id)).filter(Boolean) as T[])

	const unfetched = computed(() => ids.value.filter((id) => !filteredItems.value.find((q) => q.id === id)))

	watch(ids, asyncFn, { immediate: true })

	const addToList = (...items: T[]) => {
		items.forEach((item) => {
			addToArray(
				listItemsStore[key].items,
				item,
				(e) => e.id,
				(e) => e.id,
			)
		})
	}

	if (listener) {
		onMounted(() => listener.start())
		onUnmounted(() => listener.close())
	}

	return { items: filteredItems, searchForItem, addToList }
}

const paginatedTableStore: Record<
	string,
	{
		items: Ref<{ id: string }[]>
		hasMore: Ref<boolean>
		total: Ref<number>
		currentViewingIndex: Ref<number>
		listener: ReturnType<typeof useListener>
	}
> = {}

export const usePaginatedTable = <T extends { id: string }, C = T>({
	key,
	useCase,
	listenerFn,
	computedFn = (item: T) => item as unknown as C,
	comparer,
	asc = false,
}: {
	key: string
	useCase: (lastItem?: T) => Promise<QueryResults<T>>
	listenerFn: (handlers: Listeners<T>, lastItem?: T) => Promise<() => void>
	comparer: (item: T) => number | string
	computedFn?: (raw: T) => C | null
	asc?: boolean
}) => {
	paginatedTableStore[key] ??= {
		items: ref([]),
		hasMore: ref(false),
		total: ref(0),
		currentViewingIndex: ref(0),
		listener: useListener(async () =>
			listenerFn(
				{
					created: async (entity) => {
						addToArray(
							store.items.value,
							entity,
							(e) => e.id,
							(e) => comparer(e as T),
							asc,
						)
					},
					updated: async (entity) => {
						addToArray(
							store.items.value,
							entity,
							(e) => e.id,
							(e) => comparer(e as T),
							asc,
						)
					},
					deleted: async (entity) => {
						store.items.value = store.items.value.filter((m) => m.id !== entity.id)
					},
				},
				store.items.value.at(-1) as T,
			),
		),
	}

	const store = paginatedTableStore[key]

	const {
		asyncFn: fetchItems,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const data = await useCase(store.items.value.at(-1) as T)
			if (!called.value) store.total.value = data.docs.total
			store.hasMore.value = !!data.pages.next
			data.results.forEach((r) =>
				addToArray(
					store.items.value,
					r,
					(e) => e.id,
					(e) => comparer(e as T),
					asc,
				),
			)
		},
		{ key },
	)

	const limit = 10
	const mapped = computed(() => store.items.value.map((r) => computedFn(r as T)).filter(Boolean))
	const currentlyViewing = computed(() =>
		mapped.value.slice(store.currentViewingIndex.value * limit, (store.currentViewingIndex.value + 1) * limit),
	)
	const isOnLastPage = computed(() => currentlyViewing.value.at(-1) === mapped.value.at(-1))
	const canNext = computed(() => !isOnLastPage.value || store.hasMore.value)
	const canPrev = computed(() => store.currentViewingIndex.value > 0)
	const limitText = computed(() => {
		const start = store.currentViewingIndex.value * limit + 1
		const end = (store.currentViewingIndex.value + 1) * limit
		return `${start} - ${end > store.total.value ? store.total.value : end} of ${store.total.value}`
	})

	const previous = async () => {
		if (!canPrev.value) return
		store.currentViewingIndex.value -= 1
	}

	const next = async () => {
		if (!canNext.value) return
		if (isOnLastPage.value && store.hasMore.value) {
			await fetchItems()
			await store.listener.restart()
		}
		store.currentViewingIndex.value += 1
	}

	onMounted(async () => {
		if (!called.value) await fetchItems()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return {
		...store,
		items: store.items as Ref<T[]>,
		loading,
		error,
		currentlyViewing,
		isOnLastPage,
		mapped,
		limit,
		limitText,
		canPrev,
		canNext,
		previous,
		next,
	}
}
