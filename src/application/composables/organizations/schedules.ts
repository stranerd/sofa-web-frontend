import { ScheduleEntity, SchedulesUseCases } from '@modules/organizations'
import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref, computed } from 'vue'
import { Refable, useAsyncFn, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'

const store = {} as Record<
	string,
	{
		schedules: Ref<ScheduleEntity[]>
		hasMore: Ref<boolean>
		listener: ReturnType<typeof useListener>
	}
>

export const useClassSchedules = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	if (store[key] === undefined) {
		const listener = useListener(() =>
			SchedulesUseCases.listen(
				organizationId,
				classId,
				{
					created: async (entity) => {
						addToArray(
							store[key].schedules.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[key].schedules.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						store[key].schedules.value = store[key].schedules.value.filter((m) => m.id !== entity.id)
					},
				},
				store[key].schedules.value.at(-1)?.createdAt,
			),
		)
		store[key] = {
			schedules: ref([]),
			hasMore: ref(false),
			listener,
		}
	}

	const {
		asyncFn: fetchSchedules,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const schedules = await SchedulesUseCases.get(organizationId, classId, store[key].schedules.value.at(-1)?.createdAt)
			store[key].hasMore.value = !!schedules.pages.next
			schedules.results.map((announcement) =>
				addToArray(
					store[key].schedules.value,
					announcement,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${key}/schedules` },
	)

	const fetchOlderSchedules = async () => {
		fetchSchedules()
		await store[key].listener.start()
	}

	onMounted(async () => {
		if (!called.value) await fetchSchedules()
		await store[key].listener.restart()
	})

	onUnmounted(async () => {
		await store[key].listener.close()
	})

	return {
		...store[key],
		loading,
		error,
		fetchOlderSchedules,
		fetchSchedules,
	}
}

export const useSchedulesInList = (organizationId: string, classId: string, ids: Refable<string[]>, listen = false) => {
	const key = `${organizationId}-${classId}`
	const allSchedules = computed(() => [...store[key].schedules.value])
	const { items: schedules, addToList } = useItemsInList('schedules', ids, allSchedules, (ids) =>
		SchedulesUseCases.getInList(organizationId, classId, ids),
	)
	const listener = useListener(
		async () =>
			await SchedulesUseCases.listenToInList(organizationId, classId, () => ids.value, {
				created: addToList,
				updated: addToList,
				deleted: () => {
					/* */
				},
			}),
	)

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { schedules }
}
